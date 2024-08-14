[{
  tags: ['user'],
  description: 'Register user',
  method: 'post',
  path: '/api/user/signup',
  controller: 'signup',
  body: { $ref: 'userSchema' },
  response: {
    201: { $ref: 'userResponseSchema#', },
    409: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
},
{
  tags: ['user'],
  description: 'Login User',
  method: 'post',
  path: '/api/user/login',
  controller: 'login',
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
}, {
  tags: ['user'],
  description: 'Logout User',
  method: 'post',
  path: '/api/user/logout',
  guarded: true,
  controller: 'logout',
  response: {
    204: {},
    401: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
}, {
  tags: ['user'],
  description: 'Get current user',
  method: 'post',
  path: '/api/user/me',
  guarded: true,
  granted: 'user',
  controller: 'currentUser',
  response: {
    201: { $ref: 'userResponseSchema#', },
  }
}, {
  tags: ['user'],
  description: 'Update User by ID',
  method: 'put',
  path: '/api/user/:userId',
  guarded: true,
  granted: 'admin',
  controller: 'updateUser',
  response: {
    201: { $ref: 'userResponseSchema#' },
    401: { $ref: 'exceptionResponseSchema#' },
    404: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
}, {
  tags: ['user'],
  description: 'Get all Users with their devices',
  method: 'get',
  path: '/api/users',
  guarded: true,
  granted: 'root',
  controller: 'getUsers',
  response: {
    // 201: { $ref: 'allUsersResponseSchema#' },
    401: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
},
{
  tags: ['user'],
  description: 'Delete User',
  method: 'delete',
  path: '/api/user/delete',
  guarded: true,
  controller: 'deleteUser',
  response: {
    200: { $ref: 'successResponseSchema#' },
    401: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
}];