import { HTTPMethods } from 'fastify';
import { promises as fs } from 'fs';
import path from 'path';
import { Performer } from '../performer';

type Response = { [status: string]: object | { '$ref': string; }; };
type ControllerFunction = <T>(...args: T[]) => Promise<T>;
type ControllerModule = Record<string, ControllerFunction>;
interface Schema {
  tags: string[];
  description: string;
  method: HTTPMethods;
  path: string;
  guarded: boolean;
  controller: ControllerFunction;
  body?: unknown;
  response: Response;
}

function hasRefProperty(value: object): value is { '$ref': string; } {
  return '$ref' in value && typeof (value as { '$ref': string; }).$ref === 'string';
}

function isValidResponse(response: Response): boolean {
  const responseValues = Object.values(response);
  return (
    typeof response === 'object' &&
    response !== null &&
    responseValues.length > 0 &&
    responseValues.every(
      value => value !== null && typeof value === 'object' && (!hasRefProperty(value) || typeof value.$ref === 'string')
    )
  );
}

function isValidSchema(schema: Schema): schema is Schema {
  return (
    Array.isArray(schema.tags) &&
    schema.tags.every((tag: string) => typeof tag === 'string') &&
    typeof schema.description === 'string' &&
    typeof schema.method === 'string' &&
    typeof schema.path === 'string' &&
    typeof schema.controller === 'function' &&
    typeof schema.response === 'object' &&
    isValidResponse(schema.response)
  );
}

export default async function contentLoader(schemaFilePath: string, performer: Performer) {
  const filePath = path.resolve(schemaFilePath);
  const schemas: Schema[] = [];
  const controllerModule: ControllerModule = require(filePath.replace('schema', 'controller'));
  const schemaListContent = await fs.readFile(filePath, 'utf8');

  const contentLines = schemaListContent.split('\n').filter(line => {
    return !line.includes('use strict') && !line.includes('Object.defineProperty');
  });
  const cleanedContent = contentLines.join('\n').trim();

  const counted = performer(cleanedContent);

  // Deriving schema list in Node.js sandbox
  /*
  const wrappedContent = `
    (function() {
      return ${cleanedContent};
    })();
  `;
  const context = vm.createContext({});
  const script = new vm.Script(wrappedContent);
  const entitySchemas = script.runInContext(context);
  */

  const sanitizedContent = cleanedContent.replace(/\/\/# sourceMappingURL=.*$/gm, '');
  const entitySchemas = eval(sanitizedContent);

  for (let idx = 0; idx < entitySchemas.length; idx++) {
    const schema: Schema = entitySchemas[idx];
    const controllerName = schema.controller;
    schema.controller = controllerModule[controllerName as keyof ControllerFunction];
    if (isValidSchema(schema)) {
      schemas.push(schema);
    } else {
      throw new Error(`INVALID SCHEMA: ${JSON.stringify(schema)}`);
    }
  }

  return { schemas, counted };
};
