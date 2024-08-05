import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from '@fastify/jwt';
import fcookie from '@fastify/cookie';
import fp from 'fastify-plugin';
import { deleteUserUrl, loginUrl, logoutUrl, signupUrl } from "../router/url-schema";

const DEFAULT_TIME_TO_LIVE_IN_MILLISECONDS = 12 * 60 * 60 * 1000;

function cacheUserId(ttl: number = DEFAULT_TIME_TO_LIVE_IN_MILLISECONDS) {
  const cache = new Map<number, number>();
  return ({
    add(id: number) {
      // console.log('cache added');
      const expiry = Date.now() + ttl;
      cache.set(id, expiry);
      this.cleanup();
    },
    isNotCached(id: number) {
      const expiry = cache.get(id);
      // console.log('is not cached:', !(!!expiry) || expiry! < Date.now());
      return !(!!expiry) || expiry! < Date.now();
    },
    remove(id: number) {
      // console.log('cache removed');
      cache.delete(id);
    },
    cleanup() {
      // console.log('cache cleaned up');
      for (const entry of cache) {
        if (entry[1] < Date.now()) {
          cache.delete(entry[0]);
        }
      }
    },
    sweepout() {
      cache.clear();
    },
  });
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
};

const authPlugin = async (fastify: FastifyInstance) => {
  const cachedId = cacheUserId();

  const APP_JWT_SECRET = process.env.APP_JWT_SECRET;
  if (!APP_JWT_SECRET) {
    throw new Error("APP_JWT_SECRET environment variable is not defined");
  }

  fastify.register(fastifyJwt, {
    secret: APP_JWT_SECRET,
    cookie: {
      cookieName: 'session_token',
      signed: true
    },
  });

  fastify.register(fcookie, {
    // to rotate secret's keys: secret.shift().push('random-string') then redeploy the server
    // do this no more often than a cookie is valid
    // https://github.com/fastify/fastify-cookie#rotating-signing-secret
    secret: ['sign-key', 'rotated-key'],
    hook: 'preHandler',
  });

  /**
   * Setting a cookie with a token in the signup/login request
   */
  fastify.addHook('onSend', async (request, reply, payload: string) => {
    try {
      const { url } = request.routeOptions;
      if ((url === signupUrl || url === loginUrl)) {
        const { user } = await JSON.parse(payload);
        if (user) {
          const token = fastify.jwt.sign({ id: user.id });
          generateCookie(reply, token);
          cachedId.add(user.id);
        }
      }
    } catch (error) {
      fastify.log.error(`Set Cookie With Token Hook ${error}`);
    }
  });

  /**
   * A cookie and a token managing for protected routes
   */
  fastify.decorate('guarded', async (request: FastifyRequest, reply: FastifyReply) => {
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

      if (cachedId.isNotCached(id)) {
        const user = await request.prisma.user.findUnique({ where: { id } });
        if (!user) {
          // if a user is not found at this point, then it is either a malicious person/attacker
          // or most probably an account deleted
          return reply.exceptions.badRequest({ cause: 'Server cannot process the request' });
        }
        cachedId.add(id);
      }
      request.currentUserId = id;

      if (cookieUnsignResult.renew) {
        // if "renew" set the same cookie again, this time plugin will sign it with a new key
        generateCookie(reply, cookieUnsignResult.value);
      }
    } catch (error) {
      return reply.exceptions.internalServerError(error, 500, 'An authentication plugin error occurred');
    }
  });

  /**
   * Cleaning a cookie with a token on logout or user deletion
   */
  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.routeOptions.url === logoutUrl || request.routeOptions.url === deleteUserUrl) {
      reply.clearCookie('session_token');
      cachedId.remove(request.currentUserId);
    }
  });
};

export default fp(authPlugin);