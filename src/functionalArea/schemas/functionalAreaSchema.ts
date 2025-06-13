import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { number, z } from 'zod';
import {
  getDateSchema,
  getNumberIdSchema,
  getSortBySchema,
} from '../../schemas';

extendZodWithOpenApi(z);

const functionalAreaCreationRequestSchema = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(1, { message: 'Name cannot be empty' })
      .max(255, { message: 'Name must be 40 or fewer characters long' }),

    description: z
      .string({
        required_error: 'Description is required',
        invalid_type_error: 'Description must be a string',
      })
      .min(1, { message: 'Description cannot be empty' })
      .max(255, {
        message: 'Description must be 255 or fewer characters long',
      }),
    isExternal: z.boolean().optional().default(false),
    startDate: z.string().datetime({ offset: true }).nullable().optional(),
    endDate: z.string().datetime({ offset: true }).optional(),
    clientIds: z.array(z.number()).min(1).optional(),
  })
  .strict();

export const CreateFunctionalAreaRequestSchema = z.object({
  body: functionalAreaCreationRequestSchema.extend({
    type: z.string().optional().openapi({ example: 'clone' }),
    cloneId: z.number().int().positive().optional().openapi({ example: 1 }),
  }),
});
extendZodWithOpenApi(z);

export const GetFunctionalAreaRequestSchema = z.object({
  params: z
    .object({
      id: getNumberIdSchema(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const GetFunctionalAreaResponseSchema = z.object({
  functionalArea: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string().nullable(),
    isExternal: z.boolean(),
    startDate: getDateSchema(),
    endDate: getDateSchema(),
    createdBy: z.number(),
    createdAt: getDateSchema(),
    updatedBy: z.number(),
    updatedAt: getDateSchema(),
    status: z.object({
      id: z.number(),
      statusName: z.string(),
    }),
    createdByProfile: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    updatedByProfile: z.object({
      firstName: z.string(),
      lastName: z.string(),
    }),
    clients: z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
          startDate: getDateSchema().nullable(),
          endDate: getDateSchema(),
          status: z.string(),
        }),
      )
      .nullable(),
  }),
});

export const FunctionalAreaListRequestSchema = z.object({
  body: z.object({
    sortBy: getSortBySchema([
      'id',
      'createdAt',
      'updatedAt',
      'createdBy',
      'updatedBy',
      'statusId',
      'name',
      'description',
      'isExternal',
      'startDate',
      'endDate',
      'updatedByProfile',
      'archivedAt',
    ]).optional(),
    startDate: z
      .string()
      .datetime({ offset: true })
      .openapi({ example: '2024-07-23T00:00:00.000Z' })
      .optional(),
    endDate: z
      .string()
      .datetime({ offset: true })
      .openapi({ example: '2024-08-23T00:00:00.000Z' })
      .optional(),
    offset: z.number().openapi({ example: 0 }),
    limit: z.number().max(100).openapi({ example: 20 }),
    searchText: z
      .string()
      .optional()
      .nullable()
      .or(z.literal(''))
      .openapi({ example: '' }),
    filter: z
      .object({
        roleType: z.array(z.enum(['external', 'internal'])).optional(),
        statusId: z.array(z.number().optional().nullable()).optional(),
        isArchived: z.number().optional(),
      })
      .optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const CreateFunctionalAreaResponseSchema = z.object({
  functionalArea: z.object({
    id: z.number(),
  }),
});
export const FunctionalAreaListResponseSchema = z.object({
  functionalAreaList: z.object({
    functionalAreas: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        isExternal: z.boolean(),
        startDate: getDateSchema(),
        endDate: getDateSchema(),
        updatedAt: getDateSchema(),
        updatedBy: z.number(),
        createdAt: getDateSchema(),
        createdBy: z.number(),
        status: z.object({
          id: z.number(),
          statusName: z.string(),
        }),
        isArchived: z.number(),
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
    totalAmount: z.number(),
  }),
});

export const EditFunctionalAreaRequestSchema = z.object({
  body: functionalAreaCreationRequestSchema,
  params: z
    .object({
      id: getNumberIdSchema(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const FunctionalAreaDeleteRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    ids: z.string(),
  }),
});

export const DeleteFunctionalAreaRequestSchema = z.object({
  ids: z.string(),
});

export const FunctionalAreaRoleListRequestSchema = z.object({
  body: z.object({
    functionalAreaId: z.number(),
    offset: z.number().openapi({ example: 0 }),
    limit: z.number().max(100).openapi({ example: 20 }),
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

export const FunctionalAreaRoleListResponseSchema = z.object({
  roleList: z.object({
    roles: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        functionalAreaId: z.number(),
        functionalAreaName: z.string(),
        isExternal: z.boolean(),
        startDate: getDateSchema(),
        endDate: getDateSchema(),
        status: z.object({
          id: z.number(),
          statusName: z.string(),
        }),
      }),
    ),
    totalAmount: z.number(),
  }),
});

export const FunctionlAreaArchiveSchema = z.object({
  body: z.object({
    functionalAreaIds: z.array(z.number()).min(1),
  }),
});

export const ViewShortFunctionalAreasSchema = z.object({
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

export const ViewShortFunctionalAreasResponseSchema = z.object({
  functionalAreas: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      startDate: getDateSchema(),
      endDate: getDateSchema(),
      isExternal: z.boolean(),
      status: z.object({
        id: z.number(),
        statusName: z.string(),
      }),
    }),
  ),
  totalAmount: z.number(),
});
