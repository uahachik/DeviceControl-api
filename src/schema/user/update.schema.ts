// PUT
const updateSchema = {
  tags: ['users'],
  description: 'Update User by ID',
  response: {
    201: { $ref: 'allUsersResponseSchema#' },
    500: { $ref: 'exceptionResponseSchema#' },
  }
};

export default updateSchema;