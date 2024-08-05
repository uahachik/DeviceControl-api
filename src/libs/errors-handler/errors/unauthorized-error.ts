import { FastifyReply } from 'fastify';
import ErrorReplyLogger from '../../logger/reply/error-reply-logger';

const DEFAULT_MESSAGE = 'AUTHENTICATION REQUIRED';
const DEFAULT_CAUSE = 'Authentication failed';
const DEFAULT_NAME = 'Unauthorized';
const DEFAULT_CODE = 'UNAUTHORIZED';

export default class UnauthorizedError extends ErrorReplyLogger {
  static statusCode = 401;
  constructor(reply: FastifyReply, msg: string, message?: string, cause?: string) {
    super(reply, msg, message || DEFAULT_MESSAGE, cause || DEFAULT_CAUSE, DEFAULT_NAME, DEFAULT_CODE);
  }
}