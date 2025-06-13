import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  CreateTherapeuticAreaRequestSchema,
  CreateTherapeuticAreaResponseSchema,
  DeleteTherapeuticAreaRequestSchema,
  EditTherapeuticAreaRequestSchema,
  EditTherapeuticAreaResponseSchema,
  listTherapeuticAreaSchema,
  ViewTherapeuticAreaSchemaByIdRequestSchema,
  ViewTherapeuticAreaSchemaByIdResponseSchema,
} from './therapeuticAreaSchema';

export const routerCreateTherapeuticAreaSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/therapeutic-area',
  tags: ['TherapeuticArea'],
  summary: 'Create a new therapeutic area',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateTherapeuticAreaRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Therapeutic area successfully created',
      content: {
        'application/json': {
          schema: CreateTherapeuticAreaResponseSchema, // Ensure this schema is defined
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

export const routerlistTherapeuticAreaSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/therapeutic-area/list-therapeutic-area',
  tags: ['TherapeuticArea'],
  summary: 'Get the list of TherapeuticArea',
  responses: {
    200: {
      description: 'List of the TherapeuticArea',
      content: {
        'application/json': {
          schema: listTherapeuticAreaSchema,
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerTherapeuticAreaSchemaByID: RouteConfig = {
  method: 'get',
  path: '/api/v1/therapeutic-area/{id}',
  tags: ['TherapeuticArea'],
  summary: 'Get therapeutic area By ID',
  request: {
    params: ViewTherapeuticAreaSchemaByIdRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Successful response with TherapeuticArea details.',
      content: {
        'application/json': {
          schema: ViewTherapeuticAreaSchemaByIdResponseSchema, // Ensure this schema is defined
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

export const routerTherapeuticAreaEditSchema: RouteConfig = {
  method: 'put',
  path: '/api/v1/therapeutic-area/{id}',
  tags: ['TherapeuticArea'],
  summary: 'Edit an existing TherapeuticArea',
  request: {
    params: EditTherapeuticAreaRequestSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: EditTherapeuticAreaRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'TherapeuticArea successfully edited',
      content: {
        'application/json': {
          schema: EditTherapeuticAreaResponseSchema,
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

export const routerDeleteTherapeuticAreaSchema: RouteConfig = {
  method: 'delete',
  path: '/api/v1/therapeutic-area',
  tags: ['TherapeuticArea'],
  summary: 'Delete TherapeuticArea records by IDs',
  request: {
    query: DeleteTherapeuticAreaRequestSchema,
  },
  responses: {
    200: {
      description: 'TherapeuticArea deleted successfully',
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
