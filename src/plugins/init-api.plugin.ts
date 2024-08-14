import { FastifyBaseLogger, FastifyInstance, FastifyTypeProviderDefault, RawServerDefault } from "fastify";
import { IncomingMessage, ServerResponse } from 'http';
import fp from 'fastify-plugin';
import schemasPathsLoader from '../libs/loader/schemas-paths-loader';
import contentLoader from '../libs/loader/content-loader';
import { serverLevelErrorLogger } from '../libs/logger/server-level-error-logger';
import performer, { Performer } from '../libs/performer';

type ExtendedHTTPMethods = 'delete' | 'get' | 'head' | 'patch' | 'post' | 'put' | 'options' | 'propfind' | 'proppatch' | 'mkcol' | 'copy' | 'move' | 'lock' | 'unlock' | 'trace' | 'search' | 'report' | 'mkcalendar';
type ExtendedFastifyInstance = FastifyInstance<RawServerDefault, IncomingMessage, ServerResponse<IncomingMessage>, FastifyBaseLogger, FastifyTypeProviderDefault> & Record<ExtendedHTTPMethods, Function>;

function isExtendedHTTPMethod(method: string): method is ExtendedHTTPMethods {
  return [
    'delete', 'get', 'head', 'patch', 'post', 'put', 'options',
    'propfind', 'proppatch', 'mkcol', 'copy', 'move', 'lock',
    'unlock', 'trace', 'search', 'report', 'mkcalendar'
  ].includes(method);
}

async function generateRouter(
  fastify: FastifyInstance,
  schemaFilePath: string,
  performer: Performer) {
  try {
    const { schemas, counted } = await contentLoader(schemaFilePath, performer);
    for (let idx = 0; idx < schemas.length; idx++) {
      const schema = schemas[idx];
      const { method, path, guarded, granted, controller } = schema;
      const preHandler = guarded ? [fastify.guarded] : undefined;
      const config = granted ? { granted } : undefined;
      if (isExtendedHTTPMethod(method)) {
        (fastify as ExtendedFastifyInstance)[method](path, { preHandler, config, schema }, controller);
      }
    }
    return counted;
  } catch (error) {
    serverLevelErrorLogger(error as Error, fastify);
  }
}

const initApi = async (fastify: FastifyInstance) => {
  const schemasPaths = schemasPathsLoader();
  for (let idx = 0; idx < schemasPaths.length; idx++) {
    const schema = schemasPaths[idx];
    const performanceMeasurments = await generateRouter(fastify, schema, performer);
    if (idx === schemasPaths.length - 1) {
      fastify.log.info(`Performance Measurments: ${JSON.stringify(performanceMeasurments)}`);
    }
  }
};

export default fp(initApi);