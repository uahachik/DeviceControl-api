import { FastifyReply } from 'fastify';

const REFRESH_COOKIE_EXPIRATION_IN_MILLISECONDS = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

export default function generateCookie(reply: FastifyReply, token: string) {
  return reply
    .setCookie('session_token', token, {
      path: '/',
      expires: REFRESH_COOKIE_EXPIRATION_IN_MILLISECONDS,
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      signed: true,
    });
};