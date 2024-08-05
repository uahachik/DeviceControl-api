import { FastifyInstance } from 'fastify';
import { PrismaClient } from '@prisma/client';
import fp from 'fastify-plugin';
import createTriggers from '../../prisma/triggers/create-triggers';
import { serverErrorHandler } from '../libs/errors-handler/exit-handler-interceptors';

const prismaPlugin = async (fastify: FastifyInstance) => {
  const prisma = new PrismaClient();

  /*
   **  Create database triggers during the application initialization phase
   */
  try {
    await createTriggers(prisma);
  } catch (error) {
    serverErrorHandler(error as Error, fastify);
  }

  /*
   ** Attaching Prisma client to requests
   */
  fastify.addHook('onRequest', (request, _, done) => {
    request.prisma = prisma;
    done();
  });

  /*
   ** Graceful Prisma disconnection
   */
  fastify.addHook('onClose', async (instance) => {
    await instance.prisma.$disconnect();
    fastify.log.info("Prisma has been disconnected");
  });
};

export default fp(prismaPlugin);
