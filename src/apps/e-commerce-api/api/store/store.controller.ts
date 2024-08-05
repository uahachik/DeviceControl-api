import { FastifyReply, FastifyRequest } from 'fastify';

export const createStore = async (_: FastifyRequest, reply: FastifyReply) => {
  return reply.send({ message: 'Hello, Store' });
};

export const deleteStore = async (_: FastifyRequest, reply: FastifyReply) => {
  return reply.send({ message: 'Store deleted' });
};