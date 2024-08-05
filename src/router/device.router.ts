// import { FastifyInstance } from "fastify";
// import { getDevicesUrl, registerDeviceUrl, updateDeviceUrl } from "./url-schema";
// import { getDevicesSchema, registerDeviceSchema, updateDeviceSchema } from "../schema/devices.schema";
// import { getDevices, registerDevice, updateDevice } from "../controllers/device.controller";

// import path from 'path';
// import generateRouter, { loadSchemas } from '../libs/loader';

// const schemaFilePath = path.resolve(__dirname, '../../../dist/src/schema/devices.schema.js');

// export default async function deviceRouter(fastify: FastifyInstance) {
// generateRouter(fastify, schemaFilePath);

// const schemas = loadSchemas(schemaFilePath);
// for (let idx = 0; idx < schemas.length; idx++) {
//   const schema = schemas[idx];
//   const { method, path, guarded, controller } = schema;
//   const preHandler = guarded ? [fastify.guarded] : [];

//   fastify[method as keyof typeof fastify](path, { preHandler, schema: schema }, controller)s;
// }
// fastify.put(updateDeviceUrl, { preHandler: [fastify.guarded], schema: updateDeviceSchema }, updateDevice);
// fastify.get(getDevicesUrl, { preHandler: [fastify.guarded], schema: getDevicesSchema }, getDevices);
// }
// console.log('router_LOG', fastify.post(registerDeviceUrl, { preHandler: [fastify.guarded], schema: registerDeviceSchema }, registerDevice));