import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  ClientListRequestSchema,
  ClientListResponseSchema,
  CreateClientResponseSchema,
  CreateClientRequestSchema,
  ClientStatusSchema,
  EditClientRequestSchema,
  EditChildClientRequestSchema,
  ClientByIdResponseSchema,
  ChildClientsCreationRequestSchema,
  ParentClientListRequestSchema,
  ParentClientListResponseSchema,
  DeleteClientsRequestSchema,
  ClientShortListRequestSchema,
  ClientShortListResponseSchema,
  ClientByIdRequestSchema,
} from './clientSchema';

export const routerClientsSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/clients/list',
  tags: ['Clients'],
  summary: 'Route to get clients list ',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ClientListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Clients list fetched successfully',
      content: {
        'application/json': {
          schema: ClientListResponseSchema,
        },
      },
    },
    500: {
      description: 'Validation Error',
    },
    401: {
      description: 'Unauthorized',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};
export const routerCreateChildClientSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/clients/child-clients',
  tags: ['Clients'],
  summary: 'Create a new child client with address',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ChildClientsCreationRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Child Client Created Successfully',
      content: {
        'application/json': {
          schema: CreateClientResponseSchema,
        },
      },
    },
    400: {
      description: 'Bad request, invalid input data',
    },
    401: {
      description: 'Unauthorized, invalid or missing credentials',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};
export const routerCreateClientSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/clients',
  tags: ['Clients'],
  summary: 'Create a new client with address',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateClientRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Client successfully created',
      content: {
        'application/json': {
          schema: CreateClientResponseSchema,
        },
      },
    },
    500: {
      description: 'Validation Error',
    },
    401: {
      description: 'Unauthorized',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerGetClientByIdSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/clients/{id}',
  tags: ['Clients'],
  summary: 'Get the client detailed info by id',
  request: {
    params: ClientByIdRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Client detailed data',
      content: {
        'application/json': {
          schema: ClientByIdResponseSchema,
        },
      },
    },
    500: {
      description: 'Server Error',
    },
    404: {
      description: 'NotFound Error',
    },
    401: {
      description: 'Unauthorized',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerGetClientStatusesSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/clients/statuses',
  tags: ['Clients'],
  summary: 'Get the list of client statuses',
  responses: {
    200: {
      description: 'List of the client statuses',
      content: {
        'application/json': {
          schema: ClientStatusSchema,
        },
      },
    },
    500: {
      description: 'Validation Error',
    },
    401: {
      description: 'Unauthorized',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerEditClientSchema: RouteConfig = {
  method: 'put',
  path: '/api/v1/clients/{id}',
  tags: ['Clients'],
  summary: 'Edit an existing client with address',
  request: {
    params: EditClientRequestSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: EditClientRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Client successfully updated',
      content: {
        'application/json': {
          schema: CreateClientResponseSchema,
        },
      },
    },
    500: {
      description: 'Validation Error',
    },
    401: {
      description: 'Unauthorized',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerEditChildClientSchema: RouteConfig = {
  method: 'put',
  path: '/api/v1/clients/child-clients/{id}',
  tags: ['Clients'],
  summary: 'Edit an existing child client with address',
  request: {
    params: EditChildClientRequestSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: EditChildClientRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Client successfully updated',
      content: {
        'application/json': {
          schema: CreateClientResponseSchema,
        },
      },
    },
    500: {
      description: 'Validation Error',
    },
    401: {
      description: 'Unauthorized',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerParentClientsSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/clients/parents/list',
  tags: ['Clients'],
  summary: 'Route to get parent clients list ',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ParentClientListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Parent Clients list fetched successfully',
      content: {
        'application/json': {
          schema: ParentClientListResponseSchema,
        },
      },
    },
    500: {
      description: 'Validation Error',
    },
    401: {
      description: 'Unauthorized',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routeClientsDeleteSchema: RouteConfig = {
  method: 'delete',
  path: '/api/v1/clients',
  tags: ['Clients'],
  summary: 'Route to delete clients ',
  request: {
    query: DeleteClientsRequestSchema.shape.query,
  },
  responses: {
    200: {
      description: 'Clients deleted successfully',
    },
    500: {
      description: 'Validation Error',
    },
    401: {
      description: 'Unauthorized',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerClientShortListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/clients/list/short',
  tags: ['Clients'],
  summary: 'Route to get clients list for dropdown ',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ClientShortListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Clients list fetched successfully',
      content: {
        'application/json': {
          schema: ClientShortListResponseSchema,
        },
      },
    },
    500: {
      description: 'Validation Error',
    },
    401: {
      description: 'Unauthorized',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export default {
  routerGetClientsSchema: routerClientsSchema,
  routerCreateChildClientSchema,
  routerCreateClientSchema,
  routerGetClientStatusesSchema,
  routerEditClientSchema,
  routerEditChildClientSchema,
  routerParentClientsSchema,
};
