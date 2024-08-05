import fp from 'fastify-plugin';
import devFriendlyLogger from '../libs/logger/dev-friendly-logger';

export default fp(devFriendlyLogger);
