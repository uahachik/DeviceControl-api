import { deleteUser, getUsers, login, logout, signup, updateUser } from '../controllers/user.controller';

// POST
export const signupSchema = {
  tags: ['users'],
  description: 'Register user',
  method: 'post',
  path: '/api/user/signup',
  controller: signup,
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
  method: 'post',
  path: '/api/user/login',
  controller: login,
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
  method: 'post',
  path: '/api/user/logout',
  guarded: true,
  controller: logout,
  response: {
    204: {},
    401: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

// PUT
export const updateUserSchema = {
  tags: ['users'],
  description: 'Update User by ID',
  method: 'put',
  path: '/api/user/:userId',
  guarded: true,
  controller: updateUser,
  response: {
    201: { $ref: 'userResponseSchema#' },
    401: { $ref: 'exceptionResponseSchema#' },
    404: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

// GET
export const getUsersSchema = {
  tags: ['users'],
  description: 'Get all Users with their devices',
  method: 'get',
  path: '/api/users',
  guarded: true,
  controller: getUsers,
  response: {
    // 201: { $ref: 'allUsersResponseSchema#' },
    401: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

// POST
export const deleteSchema = {
  tags: ['users'],
  description: 'Delete User',
  method: 'delete',
  path: '/api/user/delete',
  guarded: true,
  controller: deleteUser,
  response: {
    200: {},
    401: { $ref: 'exceptionResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};