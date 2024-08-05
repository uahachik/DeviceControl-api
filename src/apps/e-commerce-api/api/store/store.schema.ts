[
  {
    tags: ['store'],
    description: 'Create Store',
    method: 'post',
    path: '/api/store/create',
    guarded: true,
    controller: 'createStore',
    response: {
      200: { $ref: 'successResponseSchema#' },
    }
  }, {
    tags: ['store'],
    description: 'Delete Store',
    method: 'delete',
    path: '/api/store/delete',
    guarded: true,
    controller: 'deleteStore',
    response: {
      200: { $ref: 'successResponseSchema#' },
    }
  }
];