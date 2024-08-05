// export const userProperties = {
//   email: { type: 'string', format: 'email' },
//   password: { type: 'string', minLength: 8, pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&~#^?])[A-Za-z\\d@$!%*?&~#^?]{8,}$' },
//   firstName: { type: 'string', minLength: 1 },
//   lastName: { type: 'string', minLength: 1 }
// };

// import { Prisma } from '@prisma/client';

export const userSchema = {
  $id: 'userSchema',
  type: 'object',
  required: ['email', 'password', 'firstName', 'lastName'],
  properties: {
    id: { type: 'integer' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 8, pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&~#^?])[A-Za-z\\d@$!%*?&~#^?]{8,}$' },
    firstName: { type: 'string', minLength: 1 },
    lastName: { type: 'string', minLength: 1 },
    profile: { type: 'string', nullable: true },
    createdAt: { type: 'string', format: 'date-time' },
    lastActive: { type: 'string', format: 'date-time', nullable: true },
    // device: { type: 'array', items: { $ref: 'userSchema#' } },
  },
};

// type Prisma.UserCreateInput = {
//     email: string;
//     password: string;
//     firstName: string;
//     lastName: string;
//     profile?: string | null | undefined;
//     createdAt?: string | Date | undefined;
//     lastActive?: string | Date | null | undefined;
//     devices?: Prisma.UsersToDevicesCreateNestedManyWithoutUserInput | undefined;
//     Device?: Prisma.DeviceCreateNestedManyWithoutFirstUserInput | undefined;
// }

export const userResponseSchema = {
  $id: 'userResponseSchema',
  type: 'object',
  required: ['user'],
  properties: {
    token: { type: 'string' },
    user: {
      ...userSchema.properties,
      //   firstName: { type: 'number' },
    },
  },
};

export const allUsersResponseSchema = {
  $id: 'allUsersResponseSchema',
  properties: {
    users: {
      ...userSchema.properties,
      //   firstName: { type: 'number' },
    },
  },
};

export const deviceResponseSchema = {
  $id: 'deviceResponseSchema',
  type: 'object',
  required: ['dsn', 'type', 'capacity'],
  properties: {
    id: { type: 'string' },
    dsn: { type: 'string' },
    type: { type: 'string' },
    capacity: { type: 'string' },
    content: { type: ['string', 'null'] },
    battery: { type: ['number', 'null'] },
    firstUser: { type: 'string' },
    firstUserId: { type: 'number' },
    commissionedAt: { type: 'string', format: 'date-time' },
    lastActive: { type: 'string', format: 'date-time' },
    users: { type: 'array', items: { $ref: 'deviceResponseSchema#' } }
  }
};