// import path from 'path';

// interface Controllers {
//   [key: string]: any;
// }

// const controllerFilePath = path.resolve(__dirname, '../../../../../../dist/src/apps/device-control-api/src/device/device.controller.js');

// export const loadControllersSync = (): Controllers => {
//   const controller: Controllers = {};

//   const controllerModule = require(controllerFilePath);

//   for (const [key, value] of Object.entries(controllerModule)) {
//     controller[key] = value;
//   }

//   return controller;
// };