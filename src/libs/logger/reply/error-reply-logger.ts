import { FastifyReply } from 'fastify';
import { USE_LOGGER_DEV_FRIENDLY, USE_LOGGER_IN_BUILD } from '../logger-constants';

export default class ErrorReplyLogger extends Error {
  private reply: FastifyReply;
  private msg: string;
  cause: string;
  private code: string;
  private prismaStack: string;
  private originalStack: string;
  status: number = 0;

  constructor(reply: FastifyReply, msg: string, message: string, cause: string, name: string, code: string, prismaStack?: string) {
    super(message);
    this.reply = reply;
    this.msg = msg;
    this.cause = cause;
    this.name = name;
    this.code = code;
    this.prismaStack = prismaStack || '';
    const { stack, originalStack } = this.handleStackTrace();
    this.stack = stack;
    this.originalStack = originalStack;
    this.log();
    // logError(reply, { msg, message, cause, name, code, stack, originalStack });
  }

  private handleStackTrace() {
    const errorStack = new Error().stack!;
    const isUnfocusedStackTrace = errorStack.includes('at hookIterator');
    const stackLines = !isUnfocusedStackTrace ? errorStack.split('\n') : errorStack.split('at hookIterator')[0].split('\n');
    isUnfocusedStackTrace && stackLines.pop();
    const errorMessage = stackLines.shift();
    const isPrismaStack = this.name.slice(0, 6) === 'Prisma';
    const prismaStackLines = this.prismaStack.split('\n');
    const originalStack = !isPrismaStack ? stackLines[stackLines.length - 1] : prismaStackLines[prismaStackLines.length - 1];
    const stack = `Original Stack:${errorMessage}\n${originalStack}\nAppended Stack:${!isPrismaStack ? errorStack : this.prismaStack}`;
    return { stack, originalStack };
  }

  private log() {
    const { msg, message, cause, name, code, stack, originalStack } = this;
    const isError = this.name.slice(-5) === 'Error';
    const logWord = isError ? 'error' : 'warn';
    if (process.env[USE_LOGGER_IN_BUILD]) {
      this.reply.log[logWord](`Message: ${message}, Cause: ${cause}, Name: ${name}, Code: ${code}, Stack: ${stack}`);
    }
    if (process.env[USE_LOGGER_DEV_FRIENDLY]) {
      const logLevel = isError ? 'logError' : 'logWarn';
      this.reply[logLevel](
        msg || 'Reply Error Log',
        { message, cause, name, stack: originalStack.trim() },
        { tag: `the custom ${logWord} log is automated with a logger plugin` },
      );
    }
  }
}