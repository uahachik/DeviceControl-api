import { FastifyReply } from 'fastify';
import ErrorReplyLogger from '../../logger/reply/error-reply-logger';

const DEFAULT_MESSAGE = 'RESOURCE NOT FOUND';
const DEFAULT_CAUSE = 'Item not found';
const DEFAULT_NAME = 'NotFound';
const DEFAULT_CODE = 'NOT_FOUND';

export default class NotFoundError extends ErrorReplyLogger {
  static statusCode = 404;
  constructor(reply: FastifyReply, msg: string, message?: string, cause?: string) {
    super(reply, msg, message || DEFAULT_MESSAGE, cause || DEFAULT_CAUSE, DEFAULT_NAME, DEFAULT_CODE);
  }
}