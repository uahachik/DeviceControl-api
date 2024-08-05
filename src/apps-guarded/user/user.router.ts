
import { FastifyInstance } from 'fastify';
import { signupUrl, loginUrl, logoutUrl, updateUserUrl, getUsersUrl, deleteUserUrl } from '../../router/url-schema';
import { signupSchema, loginSchema, logoutSchema, updateSchema, deleteSchema, usersSchema } from './user.schema';
import { createUserController } from './user.controller';


export default async function userRouter(fastify: FastifyInstance) {
  const userController = createUserController(fastify);

  fastify.post(signupUrl, { schema: signupSchema }, userController.signup.bind(userController));
  fastify.post(loginUrl, { schema: loginSchema }, userController.login.bind(userController));
  // @Guarded
  fastify.post(logoutUrl, { schema: logoutSchema }, userController.logout.bind(userController));
  // @Guarded
  fastify.put(updateUserUrl, { schema: updateSchema }, userController.updateUser.bind(userController));
  // @Guarded
  fastify.get(getUsersUrl, { schema: usersSchema }, userController.getUsers.bind(userController));
  // @Guarded
  fastify.delete(deleteUserUrl, { schema: deleteSchema }, userController.deleteUser.bind(userController));
}