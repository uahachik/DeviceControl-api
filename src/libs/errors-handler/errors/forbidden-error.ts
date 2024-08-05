import { FastifyReply } from 'fastify';
import ErrorReplyLogger from '../../logger/reply/error-reply-logger';

const DEFAULT_MESSAGE = 'FORBIDDEN ERROR';
const DEFAULT_CAUSE = 'Access to this resource is restricted';
const DEFAULT_NAME = 'Forbidden';
const DEFAULT_CODE = 'FORBIDDEN';

export default class ForbiddenError extends ErrorReplyLogger {
  static statusCode = 403;
  constructor(reply: FastifyReply, msg: string, message?: string, cause?: string) {
    super(reply, msg, message || DEFAULT_MESSAGE, cause || DEFAULT_CAUSE, DEFAULT_NAME, DEFAULT_CODE);
  }
}