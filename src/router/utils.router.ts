import { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { listFunctions, listTriggers } from "../pg-database";

export default async function utilsRouter(fastify: FastifyInstance) {
  const prisma = new PrismaClient();
  const { guarded } = fastify;

  fastify.get('/health-check', (_, reply) => {
    return reply.send({ message: 'Success' });
  });

  fastify.get('/db-triggers', { preHandler: [guarded] }, async (_, reply) => {
    try {
      const triggers = await listTriggers(prisma);
      return reply.send(triggers);
    } catch (error) {
      return reply.exceptions.internalServerError(error, 'Server error occurred listing database triggers');
    }
  });

  fastify.get('/db-functions', { preHandler: [guarded] }, async (_, reply) => {
    try {
      const triggers = await listFunctions(prisma);
      return reply.send(triggers);
    } catch (error) {
      return reply.exceptions.internalServerError(error, 'Server error occurred listing database functions');
    }
  });

  fastify.get('/not-implemented', async (_, reply) => {
    try {
      /*
       * Example of throwing the error
       */
      // throw new Error();
      const error = new Error('NOT IMPLEMENTED ERROR');
      // (error as ErrorReplyLogger).status = 500;
      // const error = new Error('NOT IMPLEMENTED ROUTER ERROR', { cause: 'Error cause is a test' });
      throw error;
    } catch (error) {
      // (error as ErrorReplyLogger).status = 500;
      // (error as ErrorReplyLogger).message = 'NOT IMPLEMENTED';
      return reply.exceptions.internalServerError(error, 501, 'This endpoint is not implemented');
    }
  });
}
