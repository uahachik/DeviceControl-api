// POST
const deleteSchema = {
  tags: ['users'],
  description: 'Delete User',
  response: {
    201: { $ref: 'allUsersResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

export default deleteSchema;