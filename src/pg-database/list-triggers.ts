import { PrismaClient } from '@prisma/client';

export default async function listTriggers(prisma: PrismaClient) {
  try {
    const triggers = await prisma.$queryRaw`
      SELECT 
          tgname AS trigger_name,
          relname AS table_name,
          nspname AS schema_name
      FROM 
          pg_trigger 
      JOIN
          pg_class ON pg_trigger.tgrelid = pg_class.oid
      JOIN
          pg_namespace ON pg_class.relnamespace = pg_namespace.oid
      WHERE 
          NOT tgisinternal;
    `;
    return triggers;
  } catch (error) {
    throw error;
  }
}
