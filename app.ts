import fastify from 'fastify';
import AutoLoad from "@fastify/autoload";
import path from 'path';
import { userSchema, userResponseSchema, allUsersResponseSchema, deviceResponseSchema } from './src/schema/models.schema';
import { exceptionResponseSchema, successResponseSchema } from './src/schema/common.schema';
import { gracefullyShutdown } from './src/libs/errors-handler/exit-handler-interceptors';
import logger from './src/libs/logger/pino-logger';
import { serverLevelErrorLogger } from './src/libs/logger/server-level-error-logger';
import utilsRouter from './src/router/utils.router';

const API_PORT = process.env.API_PORT || 5000;
const API_HOST = process.env.API_HOST;

(async () => {
  const app = fastify({
    logger,
    ajv: {
      customOptions: {
        allErrors: true,
        removeAdditional: true
      }
    },
  });

  /**
   * AutoLoad Plugins
   */
  app.register(AutoLoad, {
    dir: path.join(__dirname, 'src', 'plugins'),
    options: Object.assign({}),
  });
  // TODO: plugins
  // await app.register(fastifyCors, _);
  // await app.register(fastifyCompress, _);
  // await app.register(fastifyHelmet, _);

  /**
   * Adding Schemas in the Child Context
   */
  app.addSchema(successResponseSchema);
  app.addSchema(exceptionResponseSchema);
  app.addSchema(userSchema);
  app.addSchema(userResponseSchema);
  app.addSchema(allUsersResponseSchema);
  app.addSchema(deviceResponseSchema);

  // TODO: Swagger

  /**
   * API initialization
   */
  app.register(utilsRouter);
  // initAPI(app);
  // await app.register(userRouter);

  /**
   * App's exit-handler Interceptors
   */
  process.on('uncaughtException', (err) => serverLevelErrorLogger(err as Error, app));
  process.on('unhandledRejection', (err) => serverLevelErrorLogger(err as Error, app));
  process.on('SIGTERM', () => gracefullyShutdown(app));
  process.on('SIGINT', () => gracefullyShutdown(app));

  app.listen({ port: Number(API_PORT), host: API_HOST }, async (err, /*address*/) => {
    if (err) {
      serverLevelErrorLogger(err as Error, app);
      process.exit(1);
    }
  });
})();