import { FastifyRequest } from 'fastify';

export default function getLoggerMsg(request: FastifyRequest) {
  return request.routeOptions.schema?.description || `${request.method} ${request.url}`;
}