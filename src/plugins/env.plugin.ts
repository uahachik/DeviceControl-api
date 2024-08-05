import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import env from '@fastify/env';

const envPlugin = async (fastify: FastifyInstance) => {
  const schema = {
    type: 'object',
  };

  const options = {
    schema,
    dotenv: true,
  };

  fastify.register(env, options).ready((error) => {
    if (error) fastify.log.error(error);
  });
};

export default fp(envPlugin);