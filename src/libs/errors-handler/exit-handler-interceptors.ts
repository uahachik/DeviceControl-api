import { FastifyInstance } from 'fastify';
import { serverLevelErrorLogger } from '../logger/server-level-error-logger';

// Handling uncaught exceptions and unhandled promise rejections
// https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/

/**
 * Handler for exit
 */
const exitHandler = async (fastify: FastifyInstance, exitCode: number) => {
  try {
    await fastify.close();
    fastify.log.info('Server closed');
    process.exit(exitCode);
  } catch (err) {
    fastify.log.error('Error during server closure:', err);
    process.exit(1);
  }
};

/**
 * Error Handling
 */
const serverErrorHandler = (error: Error, fastify: FastifyInstance) => {
  serverLevelErrorLogger(error, fastify);
  exitHandler(fastify, 1);
};

/**
 * Application shutdown
 */
const gracefullyShutdown = (fastify: FastifyInstance) => {
  fastify.log.info('Attempting to gracefully shutdown the server...');
  exitHandler(fastify, 0);

  // If a graceful shutdown is not achieved after 1 second, shut down the process completely
  setTimeout(() => {
    process.abort();
  }, 1000).unref();
  exitHandler(fastify, 1);
};

export { serverErrorHandler, gracefullyShutdown };;