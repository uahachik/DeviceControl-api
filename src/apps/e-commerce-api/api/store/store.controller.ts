import { FastifyReply, FastifyRequest } from 'fastify';

export const createStore = async (_req: FastifyRequest, reply: FastifyReply) => {
  return reply.send({ message: 'Hello, Store' });
};

export const deleteStore = async (_req: FastifyRequest, reply: FastifyReply) => {
  return reply.send({ message: 'Store deleted' });
};