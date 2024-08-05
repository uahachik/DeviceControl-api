import { FastifyReply } from 'fastify';
import { USE_LOGGER_DEV_FRIENDLY, USE_LOGGER_IN_BUILD } from '../logger-constants';
import { InternalServerError } from '../../errors-handler/errors';

export default async function successReplyLogger(reply: FastifyReply, payload: string, msg: string) {
  if (payload) {
    const data = JSON.parse(payload);
    const { message, cause } = data;
    const lostProperty = !message && !cause ? 'message, cause' : !message ? 'message' : !cause && 'cause';
    const routeNotFound = message && message.startsWith('Route') && message.endsWith('not found');
    if (reply.statusCode >= 400 && reply.statusCode < 600 && !!lostProperty && !routeNotFound) {
      new InternalServerError(reply, '', 'Response validation error', `Lost '${lostProperty}' in the response`);
    }
    if (process.env[USE_LOGGER_IN_BUILD]) {
      reply.log.info(JSON.stringify({
        tag: 'server response to a client',
        statusCode: reply.raw.statusCode,
        body: data,
      }));
    }
    if (process.env[USE_LOGGER_DEV_FRIENDLY]) {
      reply.logInfo(msg, data, { tag: 'the log of a response to a client is automated with a logger plugin' });
    }
  } else if (reply.statusCode === 204) {
    if (process.env[USE_LOGGER_IN_BUILD]) {
      reply.log.info(JSON.stringify({
        tag: 'server response to a client',
        statusCode: reply.raw.statusCode,
      }));
    }
    if (process.env[USE_LOGGER_DEV_FRIENDLY]) {
      reply.logInfo(msg, '', { tag: 'the log of a response to a client is automated with a logger plugin' });
    }
  } else {
    const error = new Error('MISSED PAYLOAD');
    error.cause = 'Response lost a payload. Hint:have you forgotten "return" reply?';
    throw error;
  }
}