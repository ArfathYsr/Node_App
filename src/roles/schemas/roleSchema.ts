import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  getDateSchema,
  getNumberIdSchema,
  getSortBySchema,
} from '../../schemas';
import { ROLE_MESSAGES } from '../../utils/Messages/roleMessages';

extendZodWithOpenApi(z);

export const CreateRoleRequestSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: 'Name is required',
          invalid_type_error: 'Name must be a string',
        })
        .min(1, { message: 'Name cannot be empty' })
        .regex(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, {
          message:
            ROLE_MESSAGES.NAME_VALIDATION,
        })
        .max(255, { message: 'Must be 255 or fewer characters long' }),
      description: z
        .string({
          invalid_type_error: 'Description must be a string',
        })
        .min(1, { message: 'Description cannot be empty' })
        .max(255, { message: 'Must be 255 or fewer characters long' })
        .optional()
        .nullable(),
      functionalAreaId: z.number().int().positive().openapi({ example: 1 }),
      permissionIds: z
        .array(
          z
            .number({
              required_error: 'Each permission ID must be a number',
              invalid_type_error: 'Permission ID must be a number',
            })
            .int({ message: 'Permission ID must be an integer' })
            .positive()
            .optional()
            .openapi({ example: 1 }),
        )
        .optional(),
      permissionGroupIds: z
        .array(
          z
            .number({
              required_error: 'Each permission group ID must be a number',
              invalid_type_error: 'Permission group ID must be a number',
            })
            .int({ message: 'Permission Group ID must be an integer' })
            .positive()
            .optional()
            .openapi({ example: 1 }),
        )
        .optional(),
      clientIds: z
        .array(
          z
            .number({
              required_error: 'Each client ID must be a number',
              invalid_type_error: 'Client ID must be a number',
            })
            .int({ message: 'Client ID must be an integer' }),
        )
        .nonempty({ message: 'Client IDs cannot be empty' })
        .optional(),
      startDate: z.string().datetime({ offset: true }).optional().nullable(),
      endDate: z.string().datetime({ offset: true }).optional(),
      isExternal: z.boolean().optional().default(false),
      type: z.string().optional(),
      cloneId: z.number().int().positive().optional().openapi({ example: 1 }),
      statusId: z.number().optional(),
      roleCategoryIds: z
        .array(z.number().int({ message: 'RoleCategoryId must be an integer' }))
        .nonempty({ message: 'RoleCategoryIds cannot be empty' })
        .optional(),
      roleCriteriaDatas: z
        .array(
          z.object({
            roleCriteriaId: z.number(),
            roleCriteriaResponse: z.string(),
          }),
        )
        .nonempty({ message: 'RoleCriteriaIds cannot be empty' })
        .optional(),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const CreateRoleResponseSchema = z.object({
  role: z.object({
    id: z.number(),
  }),
});

export const RoleListRequestSchema = z.object({
  body: z
    .object({
      filter: z
        .object({
          roles: z
            .array(z.number().positive().optional().nullable())
            .optional(),
          functionalAreas: z
            .array(z.number().positive().optional().nullable())
            .optional(),
          roleTypes: z.array(z.enum(['external', 'internal'])).optional(),
          statusIds: z
            .array(z.union([z.literal(1), z.literal(2), z.literal(3)]))
            .optional(),
          isArchived: z.number().optional(),
        })
        .optional(),
      sortBy: getSortBySchema([
        'id',
        'name',
        'description',
        'createdAt',
        'updatedAt',
        'startDate',
        'endDate',
        'isExternal',
        'userAmount',
        'updatedBy',
        'functionalAreaName',
        'updatedByProfile',
        'statusId',
      ]).optional(),
      startDate: z
        .string()
        .datetime({ offset: true })
        .openapi({ example: '2024-07-23T00:00:00.000Z' })
        .optional(),
      endDate: z
        .string()
        .datetime({ offset: true })
        .openapi({ example: '2050-08-23T00:00:00.000Z' })
        .optional(),
      offset: z.number().openapi({ example: 0 }),
      limit: z.number().max(100).openapi({ example: 20 }),
      searchText: z
        .string()
        .optional()
        .nullable()
        .or(z.literal(''))
        .openapi({ example: '' }),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const RoleListResponseSchema = z.object({
  roleList: z.object({
    roles: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        functionalAreaName: z.string(),
        isExternal: z.boolean(),
        startDate: getDateSchema(),
        endDate: getDateSchema(),
        createdAt: getDateSchema(),
        createdBy: z.number(),
        updatedAt: getDateSchema(),
        updatedBy: z.number(),
        isActive: z.boolean(),
        userAmount: z.number(),
        createdByProfile: z.object({
          firstName: z.string(),
          lastName: z.string(),
        }),
        updatedByProfile: z.object({
          firstName: z.string(),
          lastName: z.string(),
        }),
        permissionGroups: z.object({
          isActive: z.boolean(),
          startDate: z.date(),
          endDate: z.date(),
          description: z.string(),
        }),
      }),
    ),
    totalAmount: z.number(),
  }),
});

export const ViewRoleByIdRequestSchema = z.object({
  params: z
    .object({
      id: getNumberIdSchema(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const EditRoleRequestSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Name cannot be empty' })
      .max(255, { message: 'Must be 255 or fewer characters long' })
      .openapi({ example: 'Meeting Planner' }),
    description: z
      .string()
      .min(1, { message: 'Description cannot be empty' })
      .openapi({ example: 'This is a dummy role for testing purposes.' }),
    functionalAreaId: z.number().int().positive().openapi({ example: 1 }),
    permissionGroupIds: z
      .array(z.number().int().positive().openapi({ example: 1 }).optional())
      .nonempty('At least one permissionGroupId is required')
      .optional(),
    permissionIds: z
      .array(z.number().int().positive().openapi({ example: 1 }).optional())
      .nonempty('At least one permissionGroupId is required')
      .optional(),
    clientIds: z
      .array(z.number().int().openapi({ example: 1 }).optional())
      .optional(),
    startDate: z
      .string()
      .datetime({ offset: true })
      .openapi({ example: '2024-07-23T00:00:00.000Z' })
      .nullable()
      .optional(),
    endDate: z
      .string()
      .datetime({ offset: true })
      .openapi({ example: '2050-08-23T00:00:00.000Z' })
      .optional(),
    isExternal: z.boolean().optional().default(false),
    statusId: z.number().optional(),
    roleCategoryIds: z
      .array(z.number().int({ message: 'RoleCategoryId must be an integer' }))
      .nonempty({ message: 'RoleCategoryIds cannot be empty' })
      .optional(),
    roleCriteriaDatas: z
      .array(
        z.object({
          roleCriteriaId: z.number(),
          roleCriteriaResponse: z.string(),
        }),
      )
      .nonempty({ message: 'RoleCriteriaIds cannot be empty' })
      .optional(),
  }),
  params: z.object({
    id: getNumberIdSchema(),
  }),
  query: z.object({}).optional(),
});

export const EditRoleResponseSchema = z.object({
  role: z.object({
    id: z.number(),
  }),
});

export const RoleDeleteRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    ids: z.string(),
  }),
});

export const DeleteRoleRequestSchema = z.object({
  ids: z.string(),
});

export const RolePermissionGroupListRequestSchema = z.object({
  body: z.object({
    roleId: z.number(),
    offset: z.number().openapi({ example: 0 }),
    limit: z.number().max(100).openapi({ example: 20 }),
    searchText: z
      .string()
      .optional()
      .or(z.literal(''))
      .openapi({ example: '' }),
  }),
});

export const RolePermissionGroupListResponseSchema = z.object({
  totalAmount: z.number(),
  permissionGroups: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      startDate: getDateSchema(),
      endDate: getDateSchema(),
    }),
  ),
});

export const RoleArchiveSchema = z.object({
  body: z.object({
    roleIds: z.array(z.number()).min(1),
    unArchive: z.boolean().default(false),
  }),
});

export const RoleArchiveResponseSchema = z.object({
  message: z
    .string()
    .openapi({ example: 'Role has been archived successfully.' }),
});

export const RoleShortListRequestSchema = z.object({
  body: z.object({
    searchText: z
      .string()
      .optional()
      .or(z.literal(''))
      .openapi({ example: '' }),
  }),
});

export const RoleShortListResponseSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    startDate: getDateSchema(),
    endDate: getDateSchema(),
    description: z.string(),
  }),
);

export const GetRolePermissionSchema = z.object({
  params: z.object({
    id: getNumberIdSchema(),
  }),
});

export const GetRolePermissionResponseSchema = z.object({
  permission: z.array(
    z.object({
      permission: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        startDate: getDateSchema(),
        endDate: getDateSchema(),
      }),
    }),
  ),
});

export const ViewPermissionGroupSchema = z.object({
  params: z.object({
    id: getNumberIdSchema(),
  }),
});

export const ViewPermissionGroupRolesResponseSchema = z.object({
  roles: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      isActive: z.boolean(),
      isExternal: z.boolean(),
      startDate: getDateSchema(),
      endDate: getDateSchema(),
    }),
  ),
});

export const AlignRolePermissionGroupsSchema = z.object({
  body: z.object({
    roleId: z
      .number({ required_error: 'roleId is required' })
      .openapi({ example: 0 }),
    permissionGroupIds: z.array(z.number()).openapi({ example: [1, 2] }),
  }),
});

export const GetRoleAdditionalDataResponseSchema = z.object({
  rolepermission: z.array(
    z.object({
      permission: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        startDate: getDateSchema(),
        endDate: getDateSchema(),
      }),
    }),
  ),
  rolePermissionGroup: z.array(
    z.object({
      permissionGroup: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        startDate: getDateSchema(),
        endDate: getDateSchema(),
      }),
    }),
  ),
  roleClient: z.array(
    z.object({
      role: z.object({
        id: z.number(),
        name: z.string(),
        startDate: getDateSchema(),
        endDate: getDateSchema(),
        status: z.string(),
      }),
    }),
  ),
});
export const roleCategoryAlignmentSchema = z.object({
  roleId: z.number(),
  roleCategoryId: z.number(),
  roleCategory: z.array(
    z.object({
      id: z.number(),
      roleCategoryName: z.string(),
    }),
  ),
  type: z.string().optional().openapi({ example: 'clone' }),

  cloneId: z.number().int().positive().optional().openapi({ example: 1 }),
});

export const roleCriteriaAlignmentSchema = z.object({
  roleId: z.number(),
  roleCriteriaId: z.number(),
  roleCriteria: z.array(
    z.object({
      id: z.number(),
      roleCriteriaName: z.string(),
    }),
  ),
  roleCriteriaResponse: z.enum(['yes', 'no']),
  type: z.string().optional().openapi({ example: 'clone' }),
  cloneId: z.number().int().positive().optional().openapi({ example: 1 }),
});

export type RoleCategoryAlignmentSchema = z.infer<
  typeof roleCategoryAlignmentSchema
>;
export type RoleCriteriaAlignmentSchema = z.infer<
  typeof roleCriteriaAlignmentSchema
>;

export const RoleCategoryCriteriaRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  type: z.string().optional().openapi({ example: 'clone' }),
  cloneId: z.number().int().positive().optional().openapi({ example: 1 }),
});

export const RoleCategoryCriteriaResponseSchema = z.object({
  roleCategory: z.array(
    z.object({
      id: z.number(),
      roleCategoryName: z.string(),
    }),
  ),
  roleCriteria: z.array(
    z.object({
      id: z.number(),
      roleCriteriaName: z.string(),
    }),
  ),
});

export const CreateRoleCriterriaAlignmnetSchema = z.object({
  roleCriteriaId: z.number().optional(),
  roleCriteriaResponse: z.enum(['yes', 'no']).optional(),
});

export const CombinedAlignmentRequestSchema = z.object({
  roleId: z.number(),
  roleCategoryIds: z.array(z.number()),
  roleCriteriaIds: z.array(roleCriteriaAlignmentSchema).optional(),
  type: z.string().optional().openapi({ example: 'clone' }),
  cloneId: z.number().int().positive().optional().openapi({ example: 1 }),
});

export const CombinedAlignmentResponseSchema = z.object({
  role: z.object({
    id: z.number(),
  }),
});

export const EditRoleCriterriaAlignmnetSchema = z.object({
  roleCriteriaId: z.number().optional(),
  roleCriteriaResponse: z.enum(['yes', 'no']).optional(),
});

export const EditCombinedAlignmentRequestSchema = z.object({
  roleId: z.number(),
  roleCategory: z.array(z.number()),
  roleCriteria: z.array(EditRoleCriterriaAlignmnetSchema).optional(),
});

const ViewRoleDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  functionalAreaId: z.number(),
  isExternal: z.boolean(),
  startDate: getDateSchema(),
  endDate: getDateSchema(),
  updatedAt: getDateSchema(),
  updatedBy: z.number(),
  createdAt: getDateSchema(),
  createdBy: z.number(),
  isActive: z.boolean(),
  createdByProfile: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  updatedByProfile: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  permissionGroups: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    startDate: getDateSchema(),
    endDate: getDateSchema(),
  }),
  permission: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive: z.boolean(),
    startDate: getDateSchema(),
    endDate: getDateSchema(),
  }),
  client: z.object({
    id: z.number(),
    name: z.string(),
    startDate: getDateSchema(),
    endDate: getDateSchema(),
    status: z.string(),
  }),
  roleCategory: z.array(roleCategoryAlignmentSchema),
  roleCriteria: z.array(roleCriteriaAlignmentSchema),
});

export const ViewRoleByIdResponseSchema = z.object({
  role: ViewRoleDataSchema,
});
