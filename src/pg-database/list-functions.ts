import { PrismaClient } from '@prisma/client';

export default async function listFunctions(prisma: PrismaClient) {
  try {
    const functions = await prisma.$queryRaw`
      SELECT 
          n.nspname AS schema_name,
          p.proname AS function_name,
          pg_catalog.pg_get_function_result(p.oid) AS result_data_type,
          pg_catalog.pg_get_function_arguments(p.oid) AS argument_data_types,
          CASE
              WHEN p.prokind = 'a' THEN 'agg'
              WHEN p.prokind = 'w' THEN 'window'
              WHEN p.prorettype = 'pg_catalog.trigger'::pg_catalog.regtype THEN 'trigger'
              ELSE 'normal'
          END AS function_type,
          l.lanname AS language
      FROM 
          pg_catalog.pg_proc p
      LEFT JOIN 
          pg_catalog.pg_namespace n ON n.oid = p.pronamespace
      LEFT JOIN
          pg_catalog.pg_language l ON l.oid = p.prolang
      WHERE 
          n.nspname NOT IN ('pg_catalog', 'information_schema') AND
          pg_catalog.pg_function_is_visible(p.oid)
      ORDER BY 
          schema_name,
          function_name;
    `;
    return functions;
  } catch (error) {
    throw error;
  }
}