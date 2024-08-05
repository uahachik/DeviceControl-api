[{
  tags: ['device'],
  description: 'Register Device',
  method: 'post',
  path: '/api/device/register',
  guarded: true,
  controller: 'registerDevice',
  body: {
    type: 'object',
    properties: {
      dsn: { type: 'string' },
      type: { type: 'string' },
      capacity: { type: 'string' },
    },
    required: ['dsn', 'type', 'capacity'],
  },
  response: {
    201: { $ref: 'deviceResponseSchema#' },
    400: { $ref: 'exceptionResponseSchema#' },
    409: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
},
{
  tags: ['device'],
  description: 'Update Device by ID',
  method: 'put',
  path: '/api/device/:deviceId',
  guarded: true,
  controller: 'updateDevice',
  response: {
    500: { $ref: 'exceptionResponseSchema#' },
  }
},
{
  tags: ['device'],
  description: 'Get All Devices with User ID',
  method: 'get',
  path: '/api/devices',
  guarded: true,
  controller: 'getDevices',
  response: {
    500: { $ref: 'exceptionResponseSchema#' },
  }
}];