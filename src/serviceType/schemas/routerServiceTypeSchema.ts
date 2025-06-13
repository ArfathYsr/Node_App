import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  ServiceTypeListShortSchema,
  ServiceTypeListShortResponseSchema,
  AddServiceTypesRequestSchema,
  AddServiceTypesresponseSchema, 
  ServiceTypeListSchema,
  EditServiceTypesRequestSchema, EditServiceTypesResponseSchema, ServiceTypeListResponseSchema,
  ViewServiceTypesRequestSchema,
  ViewServiceTypeResponseSchema,
  ArchiveServiceTypeRequestSchema,
  ArchiveServiceTypeResponseSchema,
  } from './serviceTypeSchema';

export const routerServiceTypeListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/service-type/list',
  tags: ['ServiceType'],
  summary: 'Get Service Type list',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ServiceTypeListSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Service Type listed successfully',
      content: {
        'application/json': {
          schema: ServiceTypeListResponseSchema,
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

export const routerServiceTypeListShortSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/service-type/list/short',
  tags: ['ServiceType'],
  summary: 'Get Service Type list short',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ServiceTypeListShortSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Service Type short listed successfully',
      content: {
        'application/json': {
          schema: ServiceTypeListShortResponseSchema,
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

export const routerCreateServiceTypeSchema: RouteConfig = {
  method: 'post',
  tags: ['ServiceType'],
  path: '/api/v1/service-type',
  summary: 'Create a Service Type',
  description: 'Route to create Servive type and work item',
  request: {
    body: {
      content: {
        'application/json': {
          schema: AddServiceTypesRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Service type created successfully',
      content: {
        'application/json': {
          schema: AddServiceTypesresponseSchema,
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

export const routerEditServiceTypeSchema: RouteConfig = {
  method: 'put',
  tags: ['ServiceType'],
  path: '/api/v1/service-type/{id}',
  summary: 'Edit Service Type',
  description: 'Route to edit Servive type and work item',
  request: {
    params: EditServiceTypesRequestSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: EditServiceTypesRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Service type created successfully',
      content: {
        'application/json': {
          schema: EditServiceTypesResponseSchema,
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

export const routerViewServiceTypeSchema: RouteConfig = {
  method: 'get',
  tags: ['ServiceType'],
  path: '/api/v1/service-type/{id}',
  summary: 'View Service Type',
  description: 'Route to view Servive type and work item',
  request: {
    params: ViewServiceTypesRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Service type fetched successfully',
      content: {
        'application/json': {
          schema: ViewServiceTypeResponseSchema,
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
export const routerArchiveServiceTypeSchema: RouteConfig = {
  method: 'post',
  tags: ['ServiceType'],
  path: '/api/v1/service-type/archive/{id}',
  summary: 'Archive Service Type',
  description: 'Route to Archive Servive type and work item',
  request: {
    params: ArchiveServiceTypeRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Service type Archived successfully',
      content: {
        'application/json': {
          schema: ArchiveServiceTypeResponseSchema,
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

export const routerUnArchiveServiceTypeSchema: RouteConfig = {
  method: 'post',
  tags: ['ServiceType'],
  path: '/api/v1/service-type/unarchive/{id}',
  summary: 'UnArchive Service Type',
  description: 'Route to UnArchive Servive type and work item',
  request: {
    params: ArchiveServiceTypeRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Service type has been UnArchived successfully',
      content: {
        'application/json': {
          schema: ArchiveServiceTypeResponseSchema,
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