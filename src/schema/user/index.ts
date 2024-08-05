// // export { signupSchema } from './signup.schema';
// // export { loginSchema } from './login.schema';
// // export { logoutSchema } from './logout.schema';
// // export { updateSchema } from './update.schema';
// // export { usersSchema } from './users.schema';
// // export { deleteSchema } from './delete.schema';

// const schemaList = [
//   "export { signupSchema } from './signup.schema';",
//   "export { loginSchema } from './login.schema';",
//   "export { logoutSchema } from './logout.schema';",
//   "export { updateSchema } from './update.schema';",
//   "export { usersSchema } from './users.schema';",
//   "export { deleteSchema } from './delete.schema';"
// ];

// // import { directoryLoader } from '../../libs/directory-loader';

// import fs from 'fs';
// import path from 'path';

// function directoryLoader() {
//   // const currentDir = path.resolve(__dirname);
//   // const files = fs.readdirSync(currentDir);
//   // console.error('files_LOG:', files);

//   try {
//     schemaList.forEach(schema => {
//       console.log('schema_LOG:', schema);

//       return schema;
//     });

//     // files.forEach(file => {
//     //   if (file.endsWith('schema.js')) {
//     //     const moduleName = path.basename(file, 'schema.js');
//     //     const modulePath = path.join(currentDir, file);
//     //     const moduleExports = require(modulePath);
//     //     console.error('moduleExports:', module.exports[moduleName] = moduleExports);

//     //     // Assuming each module exports a single function or object
//     //     module.exports[moduleName] = moduleExports;
//     //   }
//     // });
//   } catch (err) {
//     console.error('Error reading directory:', err);
//   }
// };

// // directoryLoader();
