import { FastifyError, FastifyInstance, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { Prisma } from '@prisma/client';
import getLoggerMsg from '../libs/logger/logger-msg';
import { BadRequestError, ConflictError, ForbiddenError, InternalServerError, NotFoundError, UnauthorizedError } from '../libs/errors-handler/errors';
import prismaClientErrorHandler from '../libs/errors-handler/prisma-client-error-handler';
import ErrorReplyLogger from '../libs/logger/reply/error-reply-logger';

interface ExceptionClass {
  new(reply: FastifyReply, msg: string, message?: string, cause?: string): ExceptionInstance;
  statusCode: number;
}

interface ExceptionInstance {
  message: string;
  cause: string;
}

export type UppercaseString = string | { __type: "UppercaseString"; };

function exceptionAdapter<T extends ExceptionClass>(ExceptionClass: T, reply: FastifyReply, msg: string,) {
  return (errMessage?: UppercaseString | { cause: string; }, errCause?: { cause: string; }) => {
    let message = '';
    let cause;
    if (errMessage || errCause) {
      if (typeof errMessage === 'string') {
        message = errMessage.toLocaleUpperCase();
        cause = errCause ? errCause.cause : '';
      } else {
        message = '';
        cause = (errMessage as { cause: string; })?.cause;
      }
    }
    const { message: clientMessage, cause: clientCause } = new ExceptionClass(reply, msg, message, cause);
    return reply.status(ExceptionClass.statusCode).send({ message: clientMessage, cause: clientCause });
  };
}

function internalServerError(reply: FastifyReply, msg: string) {
  return (...args: [error: ErrorReplyLogger, statusCode?: string | number, cause?: string]) => {
    const prismaErrors = [
      Prisma.PrismaClientKnownRequestError,
      Prisma.PrismaClientUnknownRequestError,
      Prisma.PrismaClientRustPanicError,
      Prisma.PrismaClientInitializationError,
      Prisma.PrismaClientValidationError
    ];

    const error = args[0];
    const derivedStatusCode = args.length > 1 && typeof args[1] === 'number' ? args[1] : args[2] || 500;
    const statusCode = error.status ? error.status : derivedStatusCode;
    const errorCause = args.length === 2 && typeof args[1] === 'string' ? args[1] as string : args[2] as string || '';

    if (typeof error !== 'object' || error === null) {
      const { message, cause } = new InternalServerError(reply, msg);
      return reply.status(500).send({ message, cause });
    }

    const errorIsPrismaError = prismaErrors.some(prismaError => error instanceof prismaError);
    if (errorIsPrismaError) {
      return prismaClientErrorHandler(error as unknown as FastifyError, reply, msg);
    }

    const { message, cause } = new InternalServerError(reply, msg, error.message, error.cause || errorCause);
    return reply.status(statusCode as number).send({ message, cause });
  };
}

async function exceptionsPlugin(fastify: FastifyInstance) {
  fastify.decorateReply('exceptions', null);

  fastify.addHook('onRequest', async (request, reply) => {
    const msg = getLoggerMsg(request);

    reply.exceptions = {
      badRequest: exceptionAdapter(BadRequestError, reply, msg).bind(null),
      unauthorized: exceptionAdapter(UnauthorizedError, reply, msg).bind(null),
      forbidden: exceptionAdapter(ForbiddenError, reply, msg).bind(null),
      notFound: exceptionAdapter(NotFoundError, reply, msg).bind(null),
      conflict: exceptionAdapter(ConflictError, reply, msg).bind(null),
      internalServerError: internalServerError(reply, msg),
    };
  });
}

export default fp(exceptionsPlugin);;