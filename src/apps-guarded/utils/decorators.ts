import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export function Guarded(fastify: FastifyInstance) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: [FastifyRequest, FastifyReply]) {
      const [request, reply] = args;

      try {
        const cookie = request.cookies.session_token;
        if (!cookie) {
          return reply.exceptions.unauthorized({ cause: 'Missing token in cookies' });
        }

        const cookieUnsignResult = request.unsignCookie(cookie);
        if (!cookieUnsignResult.value || !cookieUnsignResult.valid) {
          return reply.exceptions.unauthorized({ cause: 'Malformed cookie' });
        }

        const { id } = fastify.jwt.verify<{ id: number, iat: number; }>(cookieUnsignResult.value);
        const user = await request.prisma.user.findUnique({ where: { id } });
        if (!user) {
          // if a user is not found at this point, then it is either a malicious person/attacker
          // or a person who accidentally received someone else's token
          return reply.exceptions.unauthorized({ cause: 'Unauthorized Access' });
        }
        request.currentUserId = id;

        if (cookieUnsignResult.renew) {
          // if "renew" set the same cookie again, this time plugin will sign it with a new key
          generateCookie(reply, cookieUnsignResult.value);
        }

        return originalMethod.apply(this, args);
      } catch (error) {
        return reply.exceptions.internalServerError(error, 500, 'An authentication decorator error occurred');
      }
    };

    return descriptor;
  };
}

function generateCookie(reply: FastifyReply, token: string) {
  return reply
    .setCookie('session_token', token, {
      path: '/',
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      signed: true,
    });
}
