import { FastifyReply, FastifyRequest } from "fastify";
import { IDevice } from "../../../../../types";

export const registerDevice = async (request: FastifyRequest<IDevice>, reply: FastifyReply) => {
  try {
    const data = request.body;
    const existingDevice = await request.prisma.device.findUnique({
      where: { dsn: request.body.dsn }
    });
    if (existingDevice) {
      return reply.exceptions.conflict('REGISTER DEVICE ERROR', { cause: 'Device already exists' });
    }

    const userId = request.currentUserId;

    const device = await request.prisma.device.create({
      data: {
        ...data,
        firstUserId: userId
      },
    });

    await request.prisma.usersToDevices.create({
      data: {
        userId,
        deviceId: device.id,
      }
    });

    return reply.status(201).send(device);
  } catch (error) {
    return reply.exceptions.internalServerError(error, 'Server error occurred when registering a device');
  };
};

export const updateDevice = async (request: FastifyRequest<IDevice>, reply: FastifyReply) => {
  try {
    const { deviceId } = request.params;
    const data = request.body;

    const existingDevice = await request.prisma.device.findUnique({
      where: { id: Number(deviceId) },
    });

    if (!existingDevice) {
      return reply.exceptions.notFound('UPDATE DEVICE NOT FOUND ERROR', { cause: 'Device not found' });
    }

    if (existingDevice.dsn !== data.dsn) {
      return reply.exceptions.forbidden('UPDATE DEVICE FORBIDDEN ERROR', { cause: 'Modification of the DSN is not allowed' });
    }

    const updatedDevice = await request.prisma.device.update({
      where: { id: Number(deviceId) },
      data: {
        ...data,
      },
    });

    return reply.status(201).send(updatedDevice);
  } catch (error) {
    return reply.exceptions.internalServerError(error, 'Server error occurred updating a device');
  }
};

export const getDevices = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const devicesWithUserIds = await request.prisma.device.findMany({
      include: {
        users: {
          select: {
            userId: true,
          }
        }
      }
    });

    return reply.status(201).send(devicesWithUserIds);
  } catch (error) {
    return reply.exceptions.internalServerError(error, 'Server error occurred when getting devices with the ID of the users');
  }
};

// // to get devices commissioned by a specific user
// const devices = await prisma.device.findMany({
//   where: {
//     firstPersonId: user1.id,
//   },
//   include: {
//     users: true,
//   }
// });

// // to get users associated with a specific device
// const users = await prisma.user.findMany({
//   where: {
//     devices: {
//       some: {
//         id: device.id,
//       }
//     }
//   }
// });