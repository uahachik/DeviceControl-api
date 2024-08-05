import { PrismaClient } from '@prisma/client';
import { createPreventDeviceDsnUpdateTrigger } from './prevent-device-dsn-update';

export default async function createTriggers(prisma: PrismaClient): Promise<void> {
  try {
    await createPreventDeviceDsnUpdateTrigger(prisma);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
  }
}