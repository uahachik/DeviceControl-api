
import { Prisma } from '@prisma/client';

export interface IUser {
  Params: {
    userId: string;
  };
  Body: Prisma.UserCreateInput;
}

export interface IDevice {
  Params: {
    deviceId: string;
  };
  Body: Prisma.DeviceUncheckedCreateWithoutUsersInput;
}

// type Prisma.DeviceCreateManyFirstUserInput = {
//     id?: number | undefined;
//     dsn: string;
//     type: string;
//     capacity: string;
//     content?: string | null | undefined;
//     battery?: number | null | undefined;
//     commissionedAt?: string | Date | undefined;
//     lastActive?: string | ... 1 more ... | undefined;
// }

// type Prisma.UserCreateWithoutDeviceInput = {
//     email: string;
//     password: string;
//     firstName: string;
//     lastName: string;
//     profile?: string | null | undefined;
//     createdAt?: string | Date | undefined;
//     updatedAt?: string | Date | null | undefined;
//     devices?: Prisma.UsersToDevicesCreateNestedManyWithoutUserInput | undefined;
// }
// type Prisma.UserCreateInput = {
//     email: string;
//     password: string;
//     firstName: string;
//     lastName: string;
//     profile?: string | null | undefined;
//     createdAt?: string | Date | undefined;
//     updatedAt?: string | Date | null | undefined;
//     devices?: Prisma.UsersToDevicesCreateNestedManyWithoutUserInput | undefined;
//     Device?: Prisma.DeviceCreateNestedManyWithoutFirstUserInput | undefined;
// }



// type Prisma.DeviceCreateManyInput = {
//     id?: number | undefined;
//     dsn: string;
//     type: string;
//     capacity: string;
//     content?: string | null | undefined;
//     battery?: number | null | undefined;
//     firstUserId: number;
//     commissionedAt?: string | Date | undefined;
//     lastActive?: string | ... 1 more ... | undefined;
// }

// type Prisma.DeviceCreateInput = {
//     dsn: string;
//     type: string;
//     capacity: string;
//     content?: string | null | undefined;
//     battery?: number | null | undefined;
//     commissionedAt?: string | Date | undefined;
//     lastActive?: string | Date | undefined;
//     firstUser: Prisma.UserCreateNestedOneWithoutDeviceInput;
//     users?: Prisma.UsersToDevicesCreateNestedManyWithoutDeviceInput | undefined;
// }

// type Prisma.DeviceUncheckedCreateInput = {
//     id?: number | undefined;
//     dsn: string;
//     type: string;
//     capacity: string;
//     content?: string | null | undefined;
//     battery?: number | null | undefined;
//     firstUserId: number;
//     commissionedAt?: string | Date | undefined;
//     lastActive?: string | ... 1 more ... | undefined;
//     users?: Prisma.UsersToDevicesUncheckedCreateNestedManyWithoutDeviceInput | undefined;
// }

// type Prisma.DeviceUncheckedCreateWithoutUsersInput = {
//     id?: number | undefined;
//     dsn: string;
//     type: string;
//     capacity: string;
//     content?: string | null | undefined;
//     battery?: number | null | undefined;
//     firstUserId: number;
//     commissionedAt?: string | Date | undefined;
//     lastActive?: string | ... 1 more ... | undefined;
// }