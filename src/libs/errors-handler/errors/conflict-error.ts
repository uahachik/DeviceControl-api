import { FastifyReply } from 'fastify';
import ErrorReplyLogger from '../../logger/reply/error-reply-logger';

const DEFAULT_MESSAGE = 'CONFLICT WITH THE CURRENT STATE OCCURRED';
const DEFAULT_CAUSE = 'Conflict with the current state of the target resource';
const DEFAULT_NAME = 'Conflict';
const DEFAULT_CODE = 'CONFLICT';

export default class ConflictError extends ErrorReplyLogger {
  static statusCode = 409;
  constructor(reply: FastifyReply, msg: string, message?: string, cause?: string) {
    super(reply, msg, message || DEFAULT_MESSAGE, cause || DEFAULT_CAUSE, DEFAULT_NAME, DEFAULT_CODE);
  }
}