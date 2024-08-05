import { FastifyInstance } from 'fastify';
import { serverLevelErrorLogger } from '../logger/server-level-error-logger';

// // this graceful shutdown is executed only by running
// // a Fastify instance outside the Docker container
// if (process.env.NODE_ENV === 'production') {
//   fastify.addHook("onClose", (instance, done) => {
//     instance.log.info("Server is shutting down...");
//     // Perform any necessary cleanup tasks here
//     done();
//   });
//   process.on("SIGINT", () => {
//     fastify.close(() => {
//       fastify.log.info("Server has been shut down");
//       process.exit(0);
//     });
//   });
// }

// Handling uncaught exceptions and unhandled promise rejections
// https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/

/**
 * Handler for exit
 */
const exitHandler = (fastify: FastifyInstance, exitCode: number) => {
  fastify.close(() => {
    fastify.log.info('Server closed');
    process.exit(exitCode);
  });
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
    process.abort(); // exit immediately and generate a core dump file
  }, 1000).unref();
  exitHandler(fastify, 1);
};

export { serverErrorHandler, gracefullyShutdown };;