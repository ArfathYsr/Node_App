import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  CreatePermissionGroupSchema,
  CreatePermissionGroupResponseSchema,
  UpdatePermissionGroupSchema,
  UpdatePermissionGroupResponseSchema,
  ViewPermissionGroupSchema,
  ViewPermissionGroupResponseSchema,
  ViewPermissionGroupListSchema,
  ViewPermissionGroupListResponseSchema,
  ViewShortPermissionGroupsSchema,
  ViewShortPermissionGroupsResponseSchema,
  DeletePermissionGroupRequestSchema,
  ArchivePermissionGroupRequestSchema,
  ArchivePermissionGroupResponseSchema,
} from './permissionGroupSchema';

export const routerCreatePermissionGroupSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/permissions-groups',
  tags: ['Permission Group'],
  summary: 'Create a new permission group',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreatePermissionGroupSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Permission group successfully created',
      content: {
        'application/json': {
          schema: CreatePermissionGroupResponseSchema,
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

export const routerUpdatePermissionGroupSchema: RouteConfig = {
  method: 'put',
  path: '/api/v1/permissions-groups/{id}',
  tags: ['Permission Group'],
  summary: 'Update permission group',
  request: {
    params: UpdatePermissionGroupSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: UpdatePermissionGroupSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Permission group successfully updated',
      content: {
        'application/json': {
          schema: UpdatePermissionGroupResponseSchema,
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

export const routerViewPermissionGroupSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/permissions-groups/{id}',
  tags: ['Permission Group'],
  summary: 'View permission group details',
  request: {
    params: ViewPermissionGroupSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Permission group details fetched successfully',
      content: {
        'application/json': {
          schema: ViewPermissionGroupResponseSchema,
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

export const routerViewPermissionGroupListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/permissions-groups/list',
  tags: ['Permission Group'],
  summary: 'View permission group list',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ViewPermissionGroupListSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Permission group list fetched successfully',
      content: {
        'application/json': {
          schema: ViewPermissionGroupListResponseSchema,
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
export const routerViewShortPermissionGroupsSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/permissions-groups/list/short',
  tags: ['Permission Group'],
  summary: 'View permission group list',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ViewShortPermissionGroupsSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Permission group list fetched successfully',
      content: {
        'application/json': {
          schema: ViewShortPermissionGroupsResponseSchema,
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

export const routerDeletePermissionGroupsSchema: RouteConfig = {
  method: 'delete',
  path: '/api/v1/permissions-groups',
  tags: ['Permission Group'],
  summary: 'Delete permission group records by IDs',
  request: {
    query: DeletePermissionGroupRequestSchema,
  },
  responses: {
    200: {
      description: 'Permission groups deleted successfully',
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

export const routerArchivePermissionGroupSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/permissions-groups/archive',
  tags: ['Permission Group'],
  summary: 'Route to Archive Permission Group',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ArchivePermissionGroupRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Permission Groups Archived successfully',
      content: {
        'application/json': {
          schema: ArchivePermissionGroupResponseSchema,
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
