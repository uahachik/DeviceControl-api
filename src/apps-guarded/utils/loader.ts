// import path from 'path';

// interface Schemas {
//   [key: string]: any;
// }

// const schemaFilePath = path.resolve(__dirname, '../../../../../../dist/src/apps/device-control-api/src/user/user.schema.js');

// export const loadSchemasSync = (): Schemas => {
//   const schemas: Schemas = {};

//   const schemaModule = require(schemaFilePath);

//   for (const [key, value] of Object.entries(schemaModule)) {
//     schemas[key] = value;
//   }

//   return schemas;
// };