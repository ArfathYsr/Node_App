import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  ListPermissionResponseSchema,
  ListPermissionSchema,
  EditPermissionSchema,
  AddPermissionRequestSchema,
  PermissionResponseSchema,
  ViewPermissionResponseSchema,
  ViewPermissionSchema,
  DeletePermissionRequestSchema,
  ViewShortPermissionsSchema,
  ViewShortPermissionsResponseSchema,
  MenuSchema,
  ArchivePermissionRequestSchema,
  ArchivePermissionResponseSchema,
} from './permissionSchema';
import { MESSAGES } from '../../utils/message';

export const routerEditPermissionSchema: RouteConfig = {
  method: 'put',
  tags: ['Permissions'],
  path: '/api/v1/permissions/{id}',
  summary: 'Update a permission',
  request: {
    params: EditPermissionSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: EditPermissionSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Permission successfully updated',
      content: {
        'application/json': {
          schema: PermissionResponseSchema,
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

export const routerViewPermissionSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/permissions/{id}',
  tags: ['Permissions'],
  summary: 'Get Permission by ID',
  request: {
    params: ViewPermissionSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Successful response with permission details.',
      content: {
        'application/json': {
          schema: ViewPermissionResponseSchema,
        },
      },
    },
    404: {
      description: 'Permission not found.',
    },
    500: {
      description: 'Internal server error.',
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

export const routerListPermissionSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/permissions/list',
  tags: ['Permissions'],
  summary: MESSAGES.PERMISSION_LIST_SUMMARY,
  request: {
    body: {
      content: {
        'application/json': {
          schema: ListPermissionSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: MESSAGES.PERMISSION_LIST_RESPONSE,
      content: {
        'application/json': {
          schema: ListPermissionResponseSchema,
        },
      },
    },
    404: {
      description: MESSAGES.PERMISSION_GROUP_NOT_FOUND,
    },
    500: {
      description: 'Internal server error.',
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

export const routerAddPermissionSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/permissions',
  tags: ['Permissions'],
  summary: 'Create a new permission',
  request: {
    body: {
      content: {
        'application/json': {
          schema: AddPermissionRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Permission Created successfully',
      content: {
        'application/json': {
          schema: PermissionResponseSchema,
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

export const routerDeletePermissionsSchema: RouteConfig = {
  method: 'delete',
  path: '/api/v1/permissions',
  tags: ['Permissions'],
  summary: 'Delete permission records by IDs',
  request: {
    query: DeletePermissionRequestSchema,
  },
  responses: {
    200: {
      description: 'Permissions deleted successfully',
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

export const routerViewShortPermissionsSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/permissions/list/short',
  tags: ['Permissions'],
  summary: 'View permissions',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ViewShortPermissionsSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Permissions fetched successfully',
      content: {
        'application/json': {
          schema: ViewShortPermissionsResponseSchema,
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

export const routerGetMenuList: RouteConfig = {
  method: 'get',
  path: '/api/v1/permissions/list/menu',
  tags: ['Permissions'],
  summary: 'Get list of Menus',
  responses: {
    200: {
      description: 'List of Menu fetched successfully',
      content: {
        'application/json': {
          schema: MenuSchema,
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

export const routerArchivePermissionSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/permissions/archive',
  tags: ['Permissions'],
  summary: 'Route to Archive Permission',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ArchivePermissionRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Permissions Archived  successfully',
      content: {
        'application/json': {
          schema: ArchivePermissionResponseSchema,
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
