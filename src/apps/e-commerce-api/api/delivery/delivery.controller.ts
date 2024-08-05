import { FastifyReply, FastifyRequest } from 'fastify';

export const createDelivery = async (_: FastifyRequest, reply: FastifyReply) => {
  try {
    return reply.send({ message: 'Hello, Delivery' });
  } catch (error) {
    return reply.exceptions.internalServerError(error);
  }
};


export const deleteDelivery = async (_: FastifyRequest, reply: FastifyReply) => {
  try {
    return reply.send({ message: 'Delivery deleted' });
  } catch (error) {
    return reply.exceptions.internalServerError(error);
  }
};