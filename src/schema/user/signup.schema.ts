// POST
const signupSchema = {
  tags: ['users'],
  description: 'Register User',
  // body: { $ref: 'userSchema' },
  body: {
    type: 'object',
    required: ['email', 'password', 'firstName', 'lastName'],
    properties: {
      id: { type: 'integer' },
      email: { type: 'string', format: 'email' },
      password: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      profile: { type: 'string', nullable: true },
      createdAt: { type: 'string', format: 'date-time', nullable: true },
      lastActive: { type: 'string', format: 'date-time', nullable: true },
      // device: { type: 'array', items: { $ref: 'userSchema#' } },
    },
  },
  response: {
    201: { $ref: 'userResponseSchema#', },
    409: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

export default signupSchema;