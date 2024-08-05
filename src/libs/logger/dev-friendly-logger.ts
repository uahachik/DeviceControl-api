import { FastifyInstance } from 'fastify';
import * as fs from 'fs';
import path from 'path';
import pino, { Logger } from 'pino';
import getLoggerMsg from './logger-msg';
import pinoLogger from './pino-logger';
import successReplyLogger from './reply/success-reply-logger';
import loggerConfig from './config/logger.config';

export type LoggerConfigSchema = {
  "$schema": string,
  "logger": {
    "useLogger": string,
    "testObj": {
      "childTestFirst": string,
      "childTestSecond": string,
    };
  },
};

export type ReplyWarnDetails = { message: string, cause: string, name: string, stack: string; };
export type ReplyErrorDetails = ReplyWarnDetails;

const loggerConfigSchema: LoggerConfigSchema = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config', 'logger.config.json'), 'utf-8')).logger;

class DevFriendlyLogger {
  private logger: Logger;
  constructor() {
    this.logger = pino(pinoLogger);
  }

  log(msg: string, data: unknown, opts?: unknown): void {
    if (typeof msg !== 'string') {
      throw new Error(
        'Logger message is required',
        {
          cause: 'The first argument of logInfo function must be a msg',
          stack: new Error().stack!
        } as ErrorOptions,
      );
    }
    this.logger.info({ msg, data, opts });
  }

  warn(msg: string, warn: ReplyWarnDetails, opts?: unknown): void {
    this.logger.warn({ msg, warn, opts });
  };

  error(msg: string, error: ReplyErrorDetails, opts?: unknown): void {
    this.logger.error({ msg, error, opts });
  }
}

async function devFriendlyLogger(fastify: FastifyInstance) {
  loggerConfig(fastify, loggerConfigSchema);

  const devFriendlyLogger = new DevFriendlyLogger();

  fastify.addHook('onSend', async (request, reply, payload: string) => {
    const msg = getLoggerMsg(request);
    successReplyLogger(reply, payload, msg);
  });

  fastify.decorateReply('logInfo', function (msg: string, data: unknown, opts?: unknown) {
    devFriendlyLogger.log(msg, data, opts);
  });

  fastify.decorateReply('logWarn', function (msg: string, warn: ReplyWarnDetails, opts?: unknown) {
    devFriendlyLogger.warn(msg, warn, opts);
  });

  fastify.decorateReply('logError', function (msg: string, error: ReplyErrorDetails, opts?: unknown) {
    devFriendlyLogger.error(msg, error, opts);
  });

  fastify.decorate('logError', function (msg: string, error: ReplyErrorDetails, opts?: unknown) {
    devFriendlyLogger.error(msg, error, opts);
  });
}

export default devFriendlyLogger;
