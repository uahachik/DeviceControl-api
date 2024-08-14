import { PrismaClient } from '@prisma/client';
import fastify, { FastifyInstance, FastifyPlugin, FastifyPluginAsync, FastifyReplyContext, FastifyTypeProvider } from 'fastify';
import { FastifyJwt, JWT } from '@fastify/jwt';
import * as fastifyCookie from '@fastify/cookie';
import { User } from '@prisma/client';
import { UppercaseString } from '../plugins/exception.plugin';
import { ReplyErrorDetails, ReplyWarnDetails } from '../libs/logger/dev-friendly-logger';

type Exception = (message?: UppercaseString | { cause: string; }, cause?: { cause: string; }) => void;

interface Exceptions {
  badRequest: Exception;
  unauthorized: Exception;
  forbidden: Exception;
  notFound: Exception;
  conflict: Exception;
  internalServerError: (error: ErrorReplyLogger, statusCode?: string | number, cause?: string) => void;
}

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
    guarded: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    logError: (msg: string, error: ApplicationErrorDetails, opts?: unknown) => void;
  }

  interface FastifyRequest {
    prisma: PrismaClient;
    currentUserId: number;
  }

  interface FastifyReply {
    logInfo: (msg: string, data: unknown, opts?: unknown) => void;
    logWarn: (msg: string, warn: ReplyWarnDetails, opts?: unknown) => void;
    logError: (msg: string, error: ReplyErrorDetails, opts?: unknown) => void;
    exceptions: Exceptions;
  }

  interface FastifySchema {
    description?: string;
  }

  interface FastifyRouteOptions {
    schema?: FastifySchema;
  }
  interface FastifyContextConfig {
    granted?: string;
  }
}

