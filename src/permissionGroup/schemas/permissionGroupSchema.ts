import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { number, z } from 'zod';
import {
  getDateSchema,
  getNumberIdSchema,
  getSortBySchema,
} from '../../schemas';

extendZodWithOpenApi(z);

export const CreatePermissionGroupSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(1, { message: 'Name cannot be empty' })
      .max(40, { message: 'Must be 40 or fewer characters long' })
      .regex(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, {
        message:
          'Name must start with a letter or a number and contain only letters, numbers, spaces, and dashes',
      }),
    description: z
      .string({
        invalid_type_error: 'description must be a string',
      })
      .min(1, { message: 'Description cannot be empty' })
      .max(255, { message: 'Must be 255 or fewer characters long' }),

    startDate: getDateSchema().optional().nullable(),
    endDate: getDateSchema().optional().nullable(),
    permissionIds: z
      .array(z.number().positive().optional().openapi({ example: 1 }))
      .optional(),
    roleIds: z
      .array(z.number().positive().optional().openapi({ example: 1 }))
      .optional(),
    type: z.string().optional().openapi({ example: 'clone' }),
    cloneId: z.number().int().positive().optional().openapi({ example: 1 }),
  }),
});

export const CreatePermissionGroupResponseSchema = z.object({
  permissionGroup: z.object({
    id: number(),
  }),
});

export const UpdatePermissionGroupSchema = z.object({
  params: z.object({
    id: getNumberIdSchema(),
  }),
  body: z.object({
    name: z
      .string({
        invalid_type_error: 'Name must be a string',
      })
      .min(1, { message: 'Name cannot be empty' })
      .max(40, { message: 'Name must be 40 or fewer characters long' })
      .regex(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, {
        message:
          'Name must start with a letter or a number and contain only letters, numbers, spaces, and dashes',
      })
      .optional(),

    description: z
      .string({
        invalid_type_error: 'Description must be a string',
      })
      .min(1, { message: 'Description cannot be empty' })
      .max(255, {
        message: 'Description must be 255 or fewer characters long',
      })
      .optional(),
    startDate: getDateSchema().optional().nullable(),
    endDate: getDateSchema().optional().nullable(),
    permissionIds: z
      .array(
        z
          .number({ invalid_type_error: 'PermissionId must be a number' })
          .positive()
          .optional()
          .openapi({ example: 1 }),
      )
      .optional(),
    roleIds: z
      .array(
        z
          .number({ invalid_type_error: 'RoleId must be a number' })
          .positive()
          .optional()
          .openapi({ example: 1 }),
      )
      .optional(),
  }),
});

export const UpdatePermissionGroupResponseSchema = z.object({
  permissionGroup: z.object({
    id: z.number(),
  }),
});

export const ViewPermissionGroupSchema = z.object({
  params: z.object({
    id: getNumberIdSchema(),
  }),
});

export const ViewPermissionGroupResponseSchema = z.object({
  permissionGroup: z.object({
    id: z.number().positive().openapi({ example: 1 }),
    createdAt: getDateSchema(),
    createdBy: z.number(),
    updatedAt: getDateSchema(),
    updatedBy: z.number(),
    name: z.string(),
    description: z.string(),
    startDate: getDateSchema(),
    endDate: getDateSchema(),
    createdByProfile: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    updatedByProfile: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    permissions: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        startDate: getDateSchema(),
        endDate: getDateSchema(),
      }),
    ),
    roles: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        isExternal: z.boolean(),
        isActive: z.boolean(),
        startDate: getDateSchema(),
        endDate: getDateSchema(),
      }),
    ),
  }),
});

export const ViewPermissionGroupListSchema = z.object({
  body: z.object({
    sortBy: getSortBySchema([
      'name',
      'id',
      'description',
      'startDate',
      'endDate',
      'updatedBy',
      'createdAt',
      'updatedAt',
      'updatedByProfile',
      'createdBy',
      'createdByProfile',
      'statusId',
    ]).optional(),
    limit: number({ invalid_type_error: 'limit must be a number' })
      .lte(100)
      .openapi({
        example: 20,
      }),
    offset: number({ invalid_type_error: 'offset must be a number' }).openapi({
      example: 0,
    }),
    startDate: getDateSchema().optional(),
    endDate: getDateSchema().optional(),
    searchText: z
      .string()
      .optional()
      .nullable()
      .or(z.literal(''))
      .openapi({ example: '' }),
    filter: z
      .object({
        isArchived: z.number().optional().nullable().openapi({ example: 1 }),
        status: z
          .array(z.number().positive().optional().openapi({ example: 1 }))
          .optional(),
      })
      .optional(),
  }),
});
export const ViewPermissionGroupListResponseSchema = z.object({
  totalAmount: z.number(),
  permissionGroups: z.array(
    z.object({
      id: z.number(),
      createdAt: getDateSchema(),
      createdBy: z.number(),
      updatedAt: getDateSchema(),
      updatedBy: z.number(),
      name: z.string(),
      description: z.string(),
      startDate: getDateSchema(),
      endDate: getDateSchema(),
      isActive: z.boolean(),
      createdByProfile: z.object({
        firstName: z.string(),
        lastName: z.string(),
      }),
      updatedByProfile: z.object({
        firstName: z.string(),
        lastName: z.string(),
      }),
    }),
  ),
});

export const ViewShortPermissionGroupsSchema = z.object({
  body: z.object({
    roleId: z.number().positive().optional().openapi({ example: 1 }),
    offset: number()
      .openapi({
        example: 0,
      })
      .optional(),
    limit: number()
      .lte(100)
      .openapi({
        example: 100,
      })
      .optional(),
    searchText: z
      .string()
      .optional()
      .nullable()
      .or(z.literal(''))
      .openapi({ example: '' }),
  }),
});

export const ViewShortPermissionGroupsResponseSchema = z.object({
  totalAmount: z.number(),
  permissionGroups: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      startDate: getDateSchema(),
      endDate: getDateSchema(),
      isActive: z.boolean(),
    }),
  ),
});

export const PermissionGroupDeleteRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    ids: z.string(),
  }),
});

export const DeletePermissionGroupRequestSchema = z.object({
  ids: z.string(),
});

export const ArchivePermissionGroupRequestSchema = z.object({
  body: z.object({
    permissionGroupIds: z.array(z.number()).min(1),
  }),
});

export const ArchivePermissionGroupResponseSchema = z.object({
  message: z
    .string()
    .openapi({ example: 'Permission group has been archived successfully.' }),
});
