
// import { FastifyInstance } from 'fastify';
// import path from 'path';
// import { loadSchemas } from '../libs/loader';

// const schemaFilePath = path.resolve(__dirname, '../../../dist/src/schema/users.schema.js');

// export default async function userRouter(fastify: FastifyInstance) {
//   const schemas = loadSchemas(schemaFilePath);
//   for (let idx = 0; idx < schemas.length; idx++) {
//     const schema = schemas[idx];
//     const { method, path, guarded, controller } = schema;
//     const preHandler = guarded ? [fastify.guarded] : [];

//     fastify[method as keyof typeof fastify](path, { preHandler, schema: schema }, controller);
//   }

// fastify.post(signupUrl, { schema: signupSchema }, signup);
// fastify.post(loginUrl, { schema: loginSchema }, login);
// fastify.post(logoutUrl, { preHandler: [fastify.guarded], schema: logoutSchema }, logout);
// fastify.put(updateUserUrl, { preHandler: [fastify.guarded], schema: updateSchema }, updateUser);
// fastify.get(getUsersUrl, { preHandler: [fastify.guarded], schema: usersSchema }, getUsers);
// fastify.delete(deleteUserUrl, { preHandler: [fastify.guarded], schema: deleteSchema }, deleteUser);
// }