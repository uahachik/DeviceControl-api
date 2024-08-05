
    prisma.user.create({
      data: {
            email: string,
    password: string,
    firstName: string,
    lastName: string,
    profile?: string | null,
    createdAt?: Date | string,
    lastActive?: Date | string | null,
    devices?: UsersToDevicesCreateNestedManyWithoutUserInput,
    Device?: DeviceCreateNestedManyWithoutFirstUserInput
      }
    });
  