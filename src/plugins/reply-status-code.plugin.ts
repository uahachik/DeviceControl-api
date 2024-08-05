// import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
// import { InternalServerError } from '../libs/errors-handler/errors';

// async function replyStatusCode(fastify: FastifyInstance) {
//   fastify.addHook('onSend', async (_: FastifyRequest, reply: FastifyReply, payload: string) => {
//     try {
//       if (payload) {
//         const deserialized = JSON.parse(payload);
//         console.log('deserialized_LOG', payload);
//         if (reply.statusCode >= 400 && reply.statusCode < 600 && (!deserialized.message || typeof deserialized.message !== 'string' && !deserialized.cause || typeof deserialized.cause !== 'string')) {
//           // If message or cause are missing or not of expected type, handle it accordingly
//           // return reply.exceptions.internalServerError(error, 'Server error occurred when registering a device');
//           new InternalServerError(reply, '', 'Response validation error', 'Lost property in the response');
//           // return reply.status(500).send({ message, cause });
//           // return reply.status(500).send('Invalid error response format');
//         }
//         // if (deserialized.message) {
//         //   return JSON.stringify({ statusCode: reply.raw.statusCode, ...deserialized });
//         // }
//       }
//     } catch (error) {
//       fastify.log.error(`replyStatusCode plugin ${error}`);
//     }
//   });
// }

// export default fp(replyStatusCode);