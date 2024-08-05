import { FastifyInstance } from 'fastify';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import * as fs from 'fs';
import * as path from 'path';
import { USE_LOGGER_DEV_FRIENDLY, USE_LOGGER_IN_BUILD } from '../logger-constants';
import { LoggerConfigSchema } from '../dev-friendly-logger';

const ajv = new Ajv();
addFormats(ajv);

const schema = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'logger.config.schema.json'), 'utf-8'));
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'logger.config.json'), 'utf-8'));

const validate = ajv.compile(schema);
const isValidConfig = validate(config);

function camelToSnakeUpper(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

const loggerConfig = (fastify: FastifyInstance, configSchema: LoggerConfigSchema, parentKey: string = ''): void => {
  if (!isValidConfig) {
    fastify.log.error(`Logger config validation error, ${JSON.stringify(validate.errors)}`);
  }

  if (!Object.keys(configSchema).length) {
    process.env.NODE_ENV === 'development' ? process.env[`USE_LOGGER_DEV_FRIENDLY`] = 'true' : process.env[`USE_LOGGER_IN_BUILD`] = 'true';
  }
  for (const key in configSchema) {
    const snakeKey = camelToSnakeUpper(parentKey ? `${parentKey}_${key}` : key);
    const value = configSchema[key as keyof LoggerConfigSchema];

    if (typeof value === 'object' && value !== null) {
      loggerConfig(fastify, value as unknown as LoggerConfigSchema, snakeKey);
    } else {
      const inBuild =
        value === 'in-build' ||
        value === 'both' ||
        (process.env.NODE_ENV === 'production' && value === 'only-in-build-for-prod-dev-friendly-for-dev');

      if (inBuild) {
        process.env[USE_LOGGER_IN_BUILD] = 'true';
      }
      const devFriendly =
        value === 'dev-friendly' ||
        value === 'both' ||
        (process.env.NODE_ENV !== 'production' && value === 'only-in-build-for-prod-dev-friendly-for-dev');
      if (devFriendly) {
        process.env[USE_LOGGER_DEV_FRIENDLY] = 'true';
      }
    }
  }
};

export default loggerConfig;