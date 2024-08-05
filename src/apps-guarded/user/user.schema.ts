// POST
export const signupSchema = {
  tags: ['users'],
  description: 'Register user',
  body: { $ref: 'userSchema' },
  response: {
    201: { $ref: 'userResponseSchema#', },
    409: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

// POST
export const loginSchema = {
  tags: ['users'],
  description: 'Login User',
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string' },
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

// POST
export const logoutSchema = {
  tags: ['users'],
  description: 'Logout User',
  response: {
    204: {},
    401: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

// PUT
export const updateSchema = {
  tags: ['users'],
  description: 'Update User by ID',
  response: {
    201: { $ref: 'userResponseSchema#' },
    401: { $ref: 'exceptionResponseSchema#' },
    404: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

// GET
export const usersSchema = {
  tags: ['users'],
  description: 'Get all Users with their devices',
  response: {
    401: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

// POST
export const deleteSchema = {
  tags: ['users'],
  description: 'Delete User',
  response: {
    200: {},
    401: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};