import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { MESSAGES } from '../../utils/message';
import { ROLE_MESSAGES } from '../../utils/Messages/roleMessages';
import {
  CreateRoleRequestSchema,
  CreateRoleResponseSchema,
  RoleListRequestSchema,
  RoleListResponseSchema,
  ViewRoleByIdRequestSchema,
  ViewRoleByIdResponseSchema,
  EditRoleRequestSchema,
  EditRoleResponseSchema,
  DeleteRoleRequestSchema,
  RolePermissionGroupListRequestSchema,
  RolePermissionGroupListResponseSchema,
  RoleArchiveSchema,
  RoleShortListRequestSchema,
  RoleShortListResponseSchema,
  GetRolePermissionSchema,
  GetRolePermissionResponseSchema,
  ViewPermissionGroupSchema,
  ViewPermissionGroupRolesResponseSchema,
  AlignRolePermissionGroupsSchema,
  RoleArchiveResponseSchema,
  GetRoleAdditionalDataResponseSchema,
  RoleCategoryCriteriaResponseSchema,
  CombinedAlignmentRequestSchema,
  CombinedAlignmentResponseSchema,
  EditCombinedAlignmentRequestSchema,
} from './roleSchema';

export const routerCreateRoleSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/role',
  tags: ['Role'],
  summary: 'Create a new role',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateRoleRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Role successfully created',
      content: {
        'application/json': {
          schema: CreateRoleResponseSchema,
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

export const routerViewRolesListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/role/list',
  tags: ['Role'],
  summary: 'Route to get roles list ',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RoleListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Roles list fetched successfully',
      content: {
        'application/json': {
          schema: RoleListResponseSchema,
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

export const routerViewRoleSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/role/{id}',
  tags: ['Role'],
  summary: 'Get Role by ID',
  request: {
    params: ViewRoleByIdRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Successful response with Role details.',
      content: {
        'application/json': {
          schema: ViewRoleByIdResponseSchema,
        },
      },
    },
    404: {
      description: 'Role not found.',
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

export const routerEditRoleSchema: RouteConfig = {
  method: 'put',
  path: '/api/v1/role/{id}',
  tags: ['Role'],
  summary: 'Edit an existing role',
  request: {
    params: EditRoleRequestSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: EditRoleRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Role successfully edited',
      content: {
        'application/json': {
          schema: EditRoleResponseSchema,
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

export const routerDeleteRolesSchema: RouteConfig = {
  method: 'delete',
  path: '/api/v1/role',
  tags: ['Role'],
  summary: 'Delete role records by IDs',
  request: {
    query: DeleteRoleRequestSchema,
  },
  responses: {
    200: {
      description: 'Roles deleted successfully',
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

export const routerRolePermissionGroupListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/role/permission-groups',
  tags: ['Role'],
  summary: 'List active Permission Groups for a role',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RolePermissionGroupListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Permission Groups list fetched successfully',
      content: {
        'application/json': {
          schema: RolePermissionGroupListResponseSchema,
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

export const routerRolePermissionGroupListUnalignedSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/role/permission-groups/unaligned',
  tags: ['Role'],
  summary: 'List active Permission Groups unaligned for a role',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RolePermissionGroupListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Permission Groups list fetched successfully',
      content: {
        'application/json': {
          schema: RolePermissionGroupListResponseSchema,
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

export const routerRoleArchiveSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/role/archive',
  tags: ['Role'],
  summary: 'Route to Archive Role',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RoleArchiveSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Roles Archived  successfully',
      content: {
        'application/json': {
          schema: RoleArchiveResponseSchema,
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
export const routerViewRoleShortListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/role/list/short',
  tags: ['Role'],
  summary: 'Route to get roles list for dropdown',
  request: {
    body: {
      content: {
        'application/json': {
          schema: RoleShortListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Roles list fetched successfully',
      content: {
        'application/json': {
          schema: RoleShortListResponseSchema,
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

export const routergetRolesPermissionSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/role/{id}/roles-permission',
  tags: ['Role'],
  summary: 'View permission by role',
  request: {
    params: GetRolePermissionSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Roles for a Permission fetched successfully',
      content: {
        'application/json': {
          schema: GetRolePermissionResponseSchema,
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

export const routerViewRolesByPermissionGroupSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/role/{id}/roles-permission-group',
  tags: ['Role'],
  summary: 'View roles by permission group',
  request: {
    params: ViewPermissionGroupSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Roles for a Permission group fetched successfully',
      content: {
        'application/json': {
          schema: ViewPermissionGroupRolesResponseSchema,
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

export const routerAlignRolePermissionGroupsSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/role/align-permission-group',
  tags: ['Role'],
  summary: 'Align permission groups to a role',

  request: {
    body: {
      content: {
        'application/json': {
          schema: AlignRolePermissionGroupsSchema.shape.body,
        },
      },
    },
  },

  responses: {
    200: {
      description: 'Role and Permission groups aligned successfully',
      content: {
        'application/json': {
          schema: EditRoleResponseSchema,
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

export const routergetRolesAdditionalDataSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/role/{id}/role-additional-data',
  tags: ['Role'],
  summary: ' Role Additional Data by role Id',
  request: {
    params: GetRolePermissionSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Role Additional Data fetched successfully',
      content: {
        'application/json': {
          schema: GetRoleAdditionalDataResponseSchema,
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
export const routerRolecategorySchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/role/role_category_criteria',
  tags: ['Role'],
  summary: 'View role category and criteria',
  responses: {
    200: {
      description: 'Role Category and Criteria  fetched successfully',
      content: {
        'application/json': {
          schema: RoleCategoryCriteriaResponseSchema,
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
export const routerRoleCategoryCriteriaAlignmentSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/role/role_category_criteria_alignment',
  tags: ['Role'],
  summary: 'Create  Role Category & Criteria api',

  request: {
    body: {
      content: {
        'application/json': {
          schema: CombinedAlignmentRequestSchema,
        },
      },
    },
  },

  responses: {
    200: {
      description: 'Role Category & Criteria added successfully',
      content: {
        'application/json': {
          schema: CombinedAlignmentResponseSchema,
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

export const routerEditRoleCategoryCriteriaAlignmentSchema: RouteConfig = {
  method: 'put',
  path: ROLE_MESSAGES.PATH_ROLE_CATEGORY_CRITERIA_ALIGNMENT,
  tags: [ROLE_MESSAGES.TAGS],
  summary: ROLE_MESSAGES.EDIT_EXISTING_ROLE_CATEGORY_CRITERIA,
  request: {
    params: EditCombinedAlignmentRequestSchema,
    body: {
      content: {
        'application/json': {
          schema: EditCombinedAlignmentRequestSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: ROLE_MESSAGES.ROLE_CATEGORY_CRITERIA_EDITED,
      content: {
        'application/json': {
          schema: EditRoleResponseSchema,
        },
      },
    },
    500: {
      description: MESSAGES.VALIDATTION_ERROR,
    },
    401: {
      description: MESSAGES.UNAUTHORIZED,
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};
