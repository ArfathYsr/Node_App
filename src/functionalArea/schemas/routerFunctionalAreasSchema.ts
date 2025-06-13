import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  CreateFunctionalAreaRequestSchema,
  CreateFunctionalAreaResponseSchema,
  FunctionalAreaListRequestSchema,
  FunctionalAreaListResponseSchema,
  GetFunctionalAreaRequestSchema,
  GetFunctionalAreaResponseSchema,
  EditFunctionalAreaRequestSchema,
  DeleteFunctionalAreaRequestSchema,
  FunctionalAreaRoleListRequestSchema,
  FunctionalAreaRoleListResponseSchema,
  FunctionlAreaArchiveSchema,
  ViewShortFunctionalAreasSchema,
  ViewShortFunctionalAreasResponseSchema,
} from './functionalAreaSchema';

export const routerCreateFunctionalAreasSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/functional-areas',
  tags: ['Functional Area'],
  summary: 'Create a new functional area',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateFunctionalAreaRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Functional Area successfully created',
      content: {
        'application/json': {
          schema: CreateFunctionalAreaResponseSchema,
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

export const routerGetFunctionalAreaSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/functional-areas/{id}',
  tags: ['Functional Area'],
  summary: 'Get Functional area by ID',
  request: {
    params: GetFunctionalAreaRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Successful response with Functional area details.',
      content: {
        'application/json': {
          schema: GetFunctionalAreaResponseSchema,
        },
      },
    },
    404: {
      description: 'Functional area not found.',
    },
    500: {
      description: 'Internal server error.',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerFunctionalAreaListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/functional-areas/list',
  tags: ['Functional Area'],
  summary: 'Route to get functionalAreas list ',
  request: {
    body: {
      content: {
        'application/json': {
          schema: FunctionalAreaListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'FunctionalArea list fetched successfully',
      content: {
        'application/json': {
          schema: FunctionalAreaListResponseSchema,
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

export const routerEditFunctionalAreaSchema: RouteConfig = {
  method: 'put',
  path: '/api/v1/functional-areas/{id}',
  tags: ['Functional Area'],
  summary: 'Edit an existing functional area',
  request: {
    params: EditFunctionalAreaRequestSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: EditFunctionalAreaRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Functional Area successfully updated',
      content: {
        'application/json': {
          schema: CreateFunctionalAreaResponseSchema,
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

export const routerDeleteFunctionalAreasSchema: RouteConfig = {
  method: 'delete',
  path: '/api/v1/functional-areas',
  tags: ['Functional Area'],
  summary: 'Delete functional area records by IDs',
  request: {
    query: DeleteFunctionalAreaRequestSchema,
  },
  responses: {
    200: {
      description: 'Functional areas deleted successfully',
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

export const routerFunctionalAreaRoleListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/functional-areas/rolesList',
  tags: ['Functional Area'],
  summary: 'Route to get Roles list for the functionalArea',
  request: {
    body: {
      content: {
        'application/json': {
          schema: FunctionalAreaRoleListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Roles list for the functionalArea fetched successfully',
      content: {
        'application/json': {
          schema: FunctionalAreaRoleListResponseSchema,
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
export const routerFunctionalAreaArchiveSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/functional-areas/archive',
  tags: ['Functional Area'],
  summary: 'Route to Archive Functional Area',
  request: {
    body: {
      content: {
        'application/json': {
          schema: FunctionlAreaArchiveSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'FunctionalAreas Archived  successfully',
      content: {
        'application/json': {
          schema: FunctionlAreaArchiveSchema,
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

export const routerViewShortFunctionalAreasSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/functional-areas/list/short',
  tags: ['Functional Area'],
  summary: 'View Functional Area list',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ViewShortFunctionalAreasSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Functional Area list fetched successfully',
      content: {
        'application/json': {
          schema: ViewShortFunctionalAreasResponseSchema,
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
