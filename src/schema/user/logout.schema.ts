// POST
const logoutSchema = {
  tags: ['users'],
  description: 'Logout User',
  response: {
    201: { $ref: 'allUsersResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

export default logoutSchema;