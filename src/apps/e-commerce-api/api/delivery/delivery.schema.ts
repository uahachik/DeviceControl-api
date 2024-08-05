[
  {
    tags: ['delivery'],
    description: 'Create Delivery',
    method: 'post',
    path: '/api/delivery/create',
    guarded: true,
    controller: 'createDelivery',
    body: {},
    response: {
      200: { $ref: 'successResponseSchema#' },
    }
  },
  {
    tags: ['delivery'],
    description: 'Delete Delivery',
    method: 'delete',
    path: '/api/delivery/delete',
    guarded: true,
    controller: 'deleteDelivery',
    response: {
      200: { $ref: 'successResponseSchema#' },
    }
  }
];