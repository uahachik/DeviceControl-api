import { FastifyReply } from 'fastify';
import ErrorReplyLogger from '../../logger/reply/error-reply-logger';

const DEFAULT_MESSAGE = 'BAD REQUEST';
const DEFAULT_CAUSE = 'Invalid request';
const DEFAULT_NAME = 'BadRequest';
const DEFAULT_CODE = 'BAD_REQUEST';

export default class BadRequestError extends ErrorReplyLogger {
  static statusCode = 400;
  constructor(reply: FastifyReply, msg: string, message?: string, cause?: string) {
    super(reply, msg, message || DEFAULT_MESSAGE, cause || DEFAULT_CAUSE, DEFAULT_NAME, DEFAULT_CODE);
  }
}