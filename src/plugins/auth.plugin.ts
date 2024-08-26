import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fastifyJwt from '@fastify/jwt';
import fcookie from '@fastify/cookie';
import fp from 'fastify-plugin';
import { deleteUserUrl, loginUrl, logoutUrl, signupUrl } from "../router/url-schema";
import { SECRET_KEYS } from '../libs/iam/identity/constants';
import generateCookie from '../libs/iam/identity/generate-cookie';
import { handledCookie } from '../libs/iam/identity/handle-cookie';
import cacheUserId from '../libs/iam/identity/cache-user';

const SESSION_TOKEN_SECRET = process.env.SESSION_TOKEN_SECRET;

const authPlugin = async (fastify: FastifyInstance) => {
  const cachedId = cacheUserId();

  if (!SESSION_TOKEN_SECRET) {
    throw new Error("SESSION_TOKEN_SECRET environment variable is not defined");
  }

  fastify.register(fastifyJwt, {
    secret: SESSION_TOKEN_SECRET,
    sign: {
      expiresIn: '7d',
      // expiresIn: '20s',
    },
    cookie: {
      cookieName: 'session_token',
      // JWT stored in the cookie will be signed with the value of the property "secret" of these options
      signed: true,
    },
  });

  fastify.register(fcookie, {
    // "secret: ['sign-key', 'rotated-key']" is used to sign the cookie when "signed: true" is specified in reply.setCookie
    // to rotate secret's keys: SECRET_KEYS.shift().push('random-string') then redeploy the server
    // https://github.com/fastify/fastify-cookie#rotating-signing-secret
    secret: SECRET_KEYS,
    hook: 'preHandler',
  });

  /**
   * Setting a cookie with a token in the signup/login request
   */
  fastify.addHook('onSend', async (request, reply, payload: string) => {
    try {
      const { url } = request.routeOptions;
      if (url === signupUrl || url === loginUrl) {
        const { user } = await JSON.parse(payload);
        if (user) {
          const token = fastify.jwt.sign({ id: user.id });
          // const token = JSON.stringify({ id: user.id });
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
        return reply.exceptions.unauthorized({ cause: 'You are not authenticated' });
      }

      const cookieUnsignResult = request.unsignCookie(cookie);
      if (!cookieUnsignResult.value || !cookieUnsignResult.valid) {
        return reply.exceptions.unauthorized({ cause: 'Malformed cookie' });
      }
      const { id } = fastify.jwt.verify<{ id: number, iat: number; }>(cookieUnsignResult.value);

      if (cookieUnsignResult.renew) {
        handledCookie.cookieSignatureHandler(id, cookie);
        if (handledCookie.maliciousCookieUsage) {
          reply.exceptions.unauthorized(
            'Unauthorized access attempt detected',
            { cause: `Possible stolen cookie usage detected. IP: ${request.ip}, User ID: ${id}` }
          );
        }
      }

      const { granted } = request.routeOptions.config;

      if ((!granted || granted === 'user') && cachedId.isNotCached(id)) {
        const user = await request.prisma.user.findUnique({ where: { id } });
        if (!user) {
          // if a user is not found at this point, then it is either a malicious person/attacker
          // or most probably an account deleted
          return reply.exceptions.badRequest({ cause: 'Server cannot process the request' });
        }
        cachedId.add(id);
      }

      //                                        ########### USER ACCESS MANAGEMENT ###########
      if (granted && granted !== 'user') {
        console.log(`detected permission ${granted} for ID ${id}`);
        const user = await request.prisma.user.findUnique({ where: { id } });
        //@ts-ignore
        user.granted = ['user', 'admin', 'root', 'owner'];
        //@ts-ignore
        if (user && granted !== user.granted[2]) {
          return reply.exceptions.forbidden();
        }
      }
      //                                                     #################

      request.currentUserId = id;

      if (cookieUnsignResult.renew && !handledCookie.maliciousCookieUsage) {
        // if true set for “renew”, the plugin will sign the same cookie again with a new key
        generateCookie(reply, cookieUnsignResult.value);
      }
    } catch (error) {
      return reply.exceptions.internalServerError(error, 500, 'An authentication plugin error occurred');
    }
  });

  /**
   * Cleaning a cookie and a token on user logout or user deletion
   */
  fastify.addHook('onSend', async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.routeOptions.url === logoutUrl || request.routeOptions.url === deleteUserUrl) {
      reply.clearCookie('session_token');
      cachedId.remove(request.currentUserId);
    }
  });
};

export default fp(authPlugin);