
import { FastifyReply, FastifyRequest } from 'fastify';
import { Prisma } from '@prisma/client';
import { hashPassword } from './crypto';

export interface IUser {
  Params: {
    userId: string;
  };
  Body: Prisma.UserCreateInput;
}

// type User = {
//   Params: {
//       userId: string;
//   };
//   Body: { 
//   email: string
//   password: string
//   firstName: string
//   lastName: string
//   profile?: string | null
//   createdAt?: Date | string
//   lastActive?: Date | string | null
//   devices?: UsersToDevicesCreateNestedManyWithoutUserInput
//   Device?: DeviceCreateNestedManyWithoutFirstUserInput
//  };
// }

export const signup = async (request: FastifyRequest<IUser>, reply: FastifyReply) => {
  try {
    const { email, password, firstName, lastName, profile } = request.body;

    const existingUser = await request.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return reply.exceptions.conflict('SIGNUP USER ERROR', { cause: 'User already exists' });
    }

    const hashPass = await hashPassword(password);

    const user = await request.prisma.user.create({
      data: {
        email,
        password: String(hashPass),
        firstName,
        lastName,
        profile,
        // createdAt,
        // lastActive
      }
    });

    Reflect.deleteProperty(user, 'password');

    return reply.status(201).send({ user });
  } catch (error) {
    return reply.exceptions.internalServerError(error, 'Server error occurred when registering a user');
  };
};
