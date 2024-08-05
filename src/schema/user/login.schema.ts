// POST
const loginSchema = {
  tags: ['users'],
  description: 'Login User',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
    }
  },
  response: {
    201: { $ref: 'userResponseSchema#' },
    401: { $ref: 'exceptionResponseSchema#' },
    404: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

export default loginSchema;