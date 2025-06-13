import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { number, z } from 'zod';
import {
  getDateSchema,
  getNumberIdSchema,
  getSortBySchema,
} from '../../schemas';
import { PERMISSION_MESSAGES } from '../../utils/Messages/permissionMessage';

extendZodWithOpenApi(z);

export const EditPermissionSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: PERMISSION_MESSAGES.NAME_NOT_EMPTY })
      .openapi({ example: 'Meeting Create Permission' })
      .regex(/^[A-Za-z][A-Za-z\s-]*$/, {
        message: PERMISSION_MESSAGES.NAME_VALIDATION,
      })
      .optional(),
    description: z
      .string()
      .min(1, { message: PERMISSION_MESSAGES.DESCRIPTION_NOT_EMPTY })
      .optional()
      .openapi({ example: 'This is a dummy permission for testing purposes.' }),
    permissionGroupIds: z
      .array(z.number())
      .openapi({ example: [1, 3] })
      .optional(),
    roleIds: z
      .array(z.number().int())
      .openapi({ example: [1, 2] })
      .optional(),
    clientIds: z
      .array(
        z
          .number({
            invalid_type_error: PERMISSION_MESSAGES.CLIENT_ID_VALIDATION,
          })
          .int({ message: PERMISSION_MESSAGES.CLIENT_ID_INTEGER }),
      )
      .nonempty({ message: PERMISSION_MESSAGES.CLIENT_ID_NOT_EMPTY })
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
      .openapi({ example: '2024-08-23T00:00:00.000Z' })
      .nullable()
      .optional(),
    statusId: z.number().openapi({ example: 1 }).optional(),
    menuIds: z
      .array(
        z.number({
          required_error: PERMISSION_MESSAGES.MENU_IDS_VALIDATION,
          invalid_type_error: PERMISSION_MESSAGES.MENU_ID_TYPE_VALIDATION,
        }),
      )
      .nonempty({ message: PERMISSION_MESSAGES.MENU_ID_REQUIRED })
      .optional(),
    subMenuIds: z
      .array(
        z.number({
          required_error: PERMISSION_MESSAGES.SUB_MENU_IDS_VALIDATION,
          invalid_type_error: PERMISSION_MESSAGES.SUB_MENU_ID_TYPE_VALIDATION,
        }),
      )
      .optional(),
  }),
  params: z.object({
    id: getNumberIdSchema(),
  }),
  query: z.object({}).optional(),
});

export const PermissionResponseSchema = z.object({
  id: z.number().int(),
});
export const ViewPermissionSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: getNumberIdSchema(),
  }),
  query: z.object({}).optional(),
});
export const ViewPermissionResponseSchema = z.object({
  permission: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    createdAt: z.date(),
    createdBy: z.number(),
    updatedAt: z.date(),
    updatedBy: z.number(),
    isActive: z.boolean(),
    startDate: z.date(),
    endDate: z.date(),
    createdByProfile: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    updatedByProfile: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    permissionGroups: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    ),
    clients: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    ),
    roles: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    ),
    menus: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        parentMenuId: z.number(),
      }),
    ),
    subMenus: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        parentMenuId: z.number(),
      }),
    ),
  }),
});
export const ListPermissionSchema = z.object({
  body: z.object({
    filter: z
      .object({
        isArchived: z.number().optional().nullable().openapi({ example: 1 }),
        status: z
          .array(z.number().positive().optional().openapi({ example: 1 }))
          .optional(),
      })
      .optional(),
    sortBy: getSortBySchema([
      'name',
      'id',
      'description',
      'startDate',
      'endDate',
      'createdAt',
      'updatedAt',
      'createdByProfile',
      'updatedByProfile',
      'status',
    ]).optional(),
    offset: z.number().openapi({ example: 0 }),
    limit: z.number().max(100).openapi({ example: 20 }),
    startDate: z
      .string()
      .datetime({ offset: true })
      .openapi({ example: '2024-07-23T00:00:00.000Z' })
      .optional(),
    endDate: z
      .string()
      .datetime({ offset: true })
      .openapi({ example: '2050-12-31T00:00:00.000Z' })
      .optional(),
    searchText: z
      .string()
      .optional()
      .nullable()
      .or(z.literal(''))
      .openapi({ example: '' }),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const AddPermissionRequestSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: PERMISSION_MESSAGES.NAME_REQUIRED,
      })
      .min(1, { message: PERMISSION_MESSAGES.NAME_NOT_EMPTY })
      .regex(/^[A-Za-z0-9][A-Za-z0-9\s-]*$/, {
        message: PERMISSION_MESSAGES.NAME_VALIDATION,
      }),
    description: z
      .string({
        required_error: PERMISSION_MESSAGES.DESCRIPTION_REQUIRED,
        invalid_type_error: PERMISSION_MESSAGES.DESCRIPTION_VALIDATION,
      })
      .min(1, { message: PERMISSION_MESSAGES.DESCRIPTION_NOT_EMPTY }),
    permissionGroupIds: z.array(z.number().int()).optional(),
    roleIds: z.array(z.number().int()).optional(),
    clientIds: z
      .array(
        z
          .number({
            invalid_type_error: PERMISSION_MESSAGES.CLIENT_ID_VALIDATION,
          })
          .int({ message: PERMISSION_MESSAGES.CLIENT_ID_INTEGER }),
      )
      .nonempty({ message: PERMISSION_MESSAGES.CLIENT_ID_NOT_EMPTY })
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
      .openapi({ example: '2024-08-23T00:00:00.000Z' })
      .nullable()
      .optional(),
    menuIds: z
      .array(
        z.number({
          required_error: PERMISSION_MESSAGES.MENU_IDS_VALIDATION,
          invalid_type_error: PERMISSION_MESSAGES.MENU_ID_TYPE_VALIDATION,
        }),
      )
      .nonempty({ message: 'At least one Menu ID is required' }),
    subMenuIds: z
      .array(
        z.number({
          required_error: PERMISSION_MESSAGES.SUB_MENU_IDS_VALIDATION,
          invalid_type_error: PERMISSION_MESSAGES.SUB_MENU_ID_TYPE_VALIDATION,
        }),
      )
      .optional(), // Optional if no submenus are provided
    type: z.string().optional().openapi({ example: 'clone' }),
    cloneId: z.number().int().positive().optional().openapi({ example: 1 }),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const ListPermissionResponseSchema = z.object({
  permissions: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    createdAt: z.date(),
    createdBy: z.number(),
    updatedAt: z.date(),
    updatedBy: z.number(),
    isActive: z.boolean(),
    archivedAt: z.date(),
    startDate: z.date(),
    endDate: z.date(),
    createdByProfile: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    updatedByProfile: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
  }),
  totalAmount: z.number(),
});

export const PermissionDeleteRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    ids: z.string(),
  }),
});

export const DeletePermissionRequestSchema = z.object({
  ids: z.string(),
});

export const ViewShortPermissionsSchema = z.object({
  body: z.object({
    searchText: z
      .string()
      .optional()
      .nullable()
      .or(z.literal(''))
      .openapi({ example: '' }),
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
  }),
});

export const ViewShortPermissionsResponseSchema = z.object({
  totalAmount: z.number(),
  permissions: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      startDate: getDateSchema(),
      endDate: getDateSchema(),
      status: z.object({
        id: z.number(),
        statusName: z.string(),
      }),
    }),
  ),
});

export const MenuSchema = z.object({
  menu: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      subMenus: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
        }),
      ),
    }),
  ),
});

export const ArchivePermissionRequestSchema = z.object({
  body: z.object({
    permissionIds: z.array(z.number()).min(1),
  }),
});

export const ArchivePermissionResponseSchema = z.object({
  message: z
    .string()
    .openapi({ example: 'Permission has been archived successfully.' }),
});
