import { FastifyReply } from 'fastify';
import ErrorReplyLogger from '../../logger/reply/error-reply-logger';

const DEFAULT_MESSAGE = 'INTERNAL SERVER ERROR';
const DEFAULT_CAUSE = 'An unexpected internal server error occurred';
const DEFAULT_NAME = 'Error';
const INTERNAL_SERVER_ERROR_CODE = 'INTERNAL_SERVER_ERROR';

export default class InternalServerError extends ErrorReplyLogger {
  constructor(reply: FastifyReply, msg: string, message?: string, cause?: string, name?: string, code?: string, prismaStack?: string) {
    super(
      reply,
      msg,
      message || DEFAULT_MESSAGE,
      cause || DEFAULT_CAUSE,
      name || DEFAULT_NAME,
      code || INTERNAL_SERVER_ERROR_CODE,
      prismaStack || ''
    );
  }
}