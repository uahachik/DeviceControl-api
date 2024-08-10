import { FastifyReply, FastifyRequest } from 'fastify';
import { hashPassword, validatePassword } from '../libs/crypto';
import { prismaExclude } from '../libs/prisma-exclude';
import { IUser } from '../types';

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
      }
    });

    Reflect.deleteProperty(user, 'password');

    return reply.status(201).send({ user });
  } catch (error) {
    return reply.exceptions.internalServerError(error, 'Server error occurred when registering a user');
  };
};

export const login = async (request: FastifyRequest<IUser>, reply: FastifyReply) => {
  try {
    const { email, password } = request.body;
    const user = await request.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return reply.exceptions.notFound('USER LOGIN NOT FOUND ERROR', { cause: 'User not found' });
    }

    const checkPass = await validatePassword(password, user.password);
    if (!checkPass) {
      return reply.exceptions.unauthorized('USER LOGIN AUTHENTICATION ERROR', { cause: 'Invalid credentials' });
    }

    Reflect.deleteProperty(user, 'password');

    return reply.status(201).send({ user });
  } catch (error) {
    return reply.exceptions.internalServerError(error, 'Server error occurred on the user login');
  }
};

export const logout = async (_req: FastifyRequest, reply: FastifyReply) => {
  try {
    return reply.status(204).send();
  } catch (error) {
    return reply.exceptions.internalServerError(error);
  }
};

export const updateUser = async (request: FastifyRequest<IUser>, reply: FastifyReply) => {
  try {
    const { userId } = request.params;
    const data = request.body;

    const existingUser = await request.prisma.user.findUnique({
      where: { id: Number(userId) },
    });
    if (!existingUser) {
      return reply.exceptions.notFound({ cause: 'User not found' });
    }

    const userToUpdate = prismaExclude('User', ['password']);
    const user = await request.prisma.user.update({
      where: { id: Number(userId) },
      data: {
        ...data,
      },
      select: {
        ...userToUpdate,
      }
    });

    return reply.status(201).send({ user });
  } catch (error) {
    return reply.exceptions.internalServerError(error, 'Server error occurred when updating a user');
  }
};

export const getUsers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const user = prismaExclude('User', ['password']);
    const device = prismaExclude('Device', ['content', 'battery', 'firstUserId', 'commissionedAt']);
    const usersWithDevices = await request.prisma.user.findMany({

      // // "devices": [
      // //   {
      // //     "device": {
      // //       device with excluded properties
      // //     }
      // //   }
      // // ]
      select: {
        ...user,
        devices: {
          select: {
            device: {
              select: {
                ...device
              }
            },
          }
        }
      }

      // // "devices": [
      // //  {
      // //    "userId": 14,
      // //    "deviceId": 93
      // //  }
      // //]
      // include: {
      //   devices: true,
      // }

      // // "devices": [
      // //   {
      // //     "device": {
      // //       entire device
      // //     }
      // //   }
      // // ]
      // select: {
      //   ...user,
      //   devices: {
      //     select: {
      //       device: true,
      //     }
      //   }
      // }
    });

    return reply.status(201).send(usersWithDevices);
  } catch (error) {
    return reply.exceptions.internalServerError(error, 'Server error occurred when getting users');
  }
};


export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const id = request.currentUserId;
    await request.prisma.user.delete({
      where: { id },
      include: {
        devices: true
      }
    });

    return reply.send({ message: `User with ID '${id}' and associated devices deleted successfully` });
  } catch (error) {
    return reply.exceptions.internalServerError(error, 'Server error occurred when deleting a user');
  }
};