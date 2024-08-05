export const successResponseSchema = {
  $id: 'successResponseSchema',
  type: 'object',
  properties: {
    message: { type: 'string' },
  },
  required: ['message'],
};

export const exceptionResponseSchema = {
  $id: 'exceptionResponseSchema',
  type: 'object',
  properties: {
    message: { type: 'string' },
    cause: { type: 'string' },
  },
  required: ['message', 'cause'],
};