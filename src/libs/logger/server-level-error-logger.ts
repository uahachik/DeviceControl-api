import { FastifyInstance } from 'fastify';
import { USE_LOGGER_IN_BUILD, USE_LOGGER_DEV_FRIENDLY } from './logger-constants';

export function serverLevelErrorLogger(error: Error, fastify: FastifyInstance) {
  const msg = 'SERVER LEVEL ERROR LOG';
  const message = `Message: ${error.message ? error.message : 'Server Error'}, `;
  const cause = `Cause: ${error.cause ? error.cause : 'Uncaught exception or unhandled rejection occurred'}, `;
  const name = error.name && `Name: ${error.name}, `;
  const stack = error.stack ? `Stack:${error.stack}` : '';
  const originalStack = error.stack ? error.stack.split('\n')[1] : '';

  if (process.env[USE_LOGGER_IN_BUILD]) {
    fastify.log.error(`${message}${cause}${name}${stack}`);
  }
  if (process.env[USE_LOGGER_DEV_FRIENDLY]) {
    fastify.logError(
      msg,
      {
        message: error.message || 'Server Error',
        cause: error.cause || 'Uncaught exception or unhandled rejection occurred',
        name: error.name,
        stack: originalStack.trim()
      },
      { tag: 'server level error' },
    );
  }
  if (!process.env[USE_LOGGER_IN_BUILD] && !process.env[USE_LOGGER_DEV_FRIENDLY]) {
    fastify.log.error(`ApplicationStartingError, ${error}`);
  }
}