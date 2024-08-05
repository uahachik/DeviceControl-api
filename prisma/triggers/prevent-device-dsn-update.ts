import { PrismaClient } from '@prisma/client';

export async function createPreventDeviceDsnUpdateTrigger(prisma: PrismaClient) {
  try {
    await prisma.$executeRaw`
      DROP TRIGGER IF EXISTS prevent_device_dsn_update_trigger ON "Device";
    `;

    await prisma.$executeRawUnsafe(`
      DROP FUNCTION IF EXISTS prevent_device_dsn_update() CASCADE;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE FUNCTION prevent_device_dsn_update() RETURNS TRIGGER AS $$
      BEGIN
        IF OLD.dsn IS DISTINCT FROM NEW.dsn THEN
          RAISE EXCEPTION 'Cannot update Device dsn field';
        END IF;
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TRIGGER prevent_device_dsn_update_trigger
      BEFORE UPDATE ON "Device"
      FOR EACH ROW
      EXECUTE FUNCTION prevent_device_dsn_update();
    `);
  } catch (error) {
    throw new Error("Failed to create: prevent_device_dsn_update_trigger");
  }
}
