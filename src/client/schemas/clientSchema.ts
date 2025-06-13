import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import {
  getBase64SupportedFormatsSchema,
  getDateSchema,
  getNumberIdSchema,
  getSortBySchema,
} from '../../schemas';
import { ERROR_MESSAGES } from '../../utils/message';

extendZodWithOpenApi(z);

const clientCreationRequestSchema = z
  .object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .min(1, { message: 'String cannot be empty' })
      .max(255, { message: 'Must be 255 or fewer characters long' }),

    description: z
      .string({
        invalid_type_error: 'Description must be a string',
      })
      .max(255, { message: 'Must be 255 or fewer characters long' })
      .optional()
      .nullable(),

    logo: getBase64SupportedFormatsSchema(),

    clientAddress: z
      .object({
        street1: z
          .string({
            required_error: 'Street1 is required',
            invalid_type_error: 'Street1 must be a string',
          })
          .min(1, { message: 'String cannot be empty' })
          .max(255, { message: 'Must be 255 or fewer characters long' }),
        city: z
          .string({
            required_error: 'City is required',
            invalid_type_error: 'City must be a string',
          })
          .min(1, { message: 'String cannot be empty' })
          .max(40, { message: 'Must be 40 or fewer characters long' }),
        state: z
          .string({
            required_error: 'State is required',
            invalid_type_error: 'State must be a string',
          })
          .min(1, { message: 'String cannot be empty' })
          .max(30, { message: 'Must be 30 or fewer characters long' }),

        countryId: z.number({
          required_error: 'CountryID is required',
          invalid_type_error: 'CountryID must be a number',
        }),
        zipCode: z
          .string({
            required_error: 'ZipCode is required',
            invalid_type_error: 'ZipCode must be a string',
          })
          .min(1, { message: 'String cannot be empty' })
          .max(8, { message: 'Must be 8 or fewer characters long' }),
      })
      .strict(),
    therapeuticAreaId: z
      .array(z.number())
      .optional()
      .openapi({ example: [1, 2] }),
    startDate: getDateSchema().optional().nullable(),
    endDate: getDateSchema().optional(),
  })
  .strict();

export const ChildClientsCreationRequestSchema = z.object({
  body: z
    .object({
      clients: z.array(clientCreationRequestSchema),
      parentClientId: z.number({
        required_error: 'ParentClientId is required',
        invalid_type_error: 'ParentClientId must be a number',
      }),
    })
    .strict(),
});

export const CreateClientRequestSchema = z.object({
  body: clientCreationRequestSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const CreateClientResponseSchema = z.object({
  client: z.object({
    id: z.number(),
    logo: z.string(),
  }),
});

export const ClientListRequestSchema = z.object({
  body: z
    .object({
      sortBy: getSortBySchema([
        'name',
        'id',
        'description',
        'startDate',
        'endDate',
        'clientStatusId',
        'city',
        'state',
        'zipCode',
        'country',
        'fieldDate',
      ]).optional(),
      startDate: z
        .string()
        .datetime({ offset: true })
        .openapi({ example: '2024-07-23T00:00:00.000Z' }),
      endDate: z
        .string()
        .datetime({ offset: true })
        .openapi({ example: '2024-08-23T00:00:00.000Z' }),
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
          name: z
            .array(z.string().optional().openapi({ example: '' }))
            .optional()
            .openapi({ example: [] }),
          status: z.array(z.number().nullable()).optional(),
          isArchived: z.boolean().optional().openapi({ example: false }),
        })
        .optional(),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const ClientListResponseSchema = z.object({
  clientList: z.object({
    clients: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        createdAt: getDateSchema(),
        updatedAt: getDateSchema(),
        createdByProfile: z.object({
          firstName: z.string(),
          lastName: z.string(),
        }),
        updatedByProfile: z.object({
          firstName: z.string(),
          lastName: z.string(),
        }),
        clientStatus: z.object({
          id: z.number(),
          name: z.string(),
        }),
        clientAddress: z.object({
          street1: z.string(),
          city: z.string(),
          state: z.string(),
          zipCode: z.string(),
          country: z.object({
            id: z.number(),
            name: z.string(),
            code: z.string(),
          }),
        }),
        startDate: z.string().nullable(),
        fieldDate: z.string().nullable(),
        endDate: z.string(),
      }),
    ),
    totalAmount: z.number(),
  }),
});

const clientDetailedDataSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  logo: z.string(),
  languageId: z.string(),
  createdAt: getDateSchema(),
  updatedAt: getDateSchema(),
  startDate: getDateSchema().nullable(),
  endDate: getDateSchema(),
  fieldDate: getDateSchema().nullable(),
  createdByProfile: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  updatedByProfile: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  clientStatus: z.object({
    id: z.number(),
    name: z.string(),
  }),
  clientAddress: z.object({
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    street1: z.string(),
    country: z.object({
      id: z.number(),
      name: z.string(),
      code: z.string(),
    }),
  }),
  parentClient: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
});

export const ClientByIdRequestSchema = z.object({
  params: z
    .object({
      id: getNumberIdSchema(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const ClientByIdResponseSchema = z.object({
  client: clientDetailedDataSchema,
});

export const ClientStatusSchema = z.object({
  statuses: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: 'Active' }),
    }),
  ),
});

const clientEditingBodyRequestSchema = z
  .object({
    name: z.string().min(1, { message: 'String cannot be empty' }).max(255),
    description: z.string().max(255).optional().nullable(),
    logo: getBase64SupportedFormatsSchema().optional(),
    clientStatusId: z.number().int(),
    clientAddress: z
      .object({
        street1: z
          .string()
          .min(1, { message: 'String cannot be empty' })
          .max(255),
        city: z.string().min(1, { message: 'String cannot be empty' }).max(40),
        state: z.string().min(1, { message: 'String cannot be empty' }).max(30),
        countryId: z.number().int(),
        zipCode: z
          .string()
          .min(1, { message: 'String cannot be empty' })
          .max(8),
      })
      .strict(),
    therapeuticAreaId: z
      .array(z.number())
      .optional()
      .openapi({ example: [1, 2] }),
    startDate: getDateSchema().optional().nullable(),
    endDate: getDateSchema().default('2050-12-31T23:59:59.000Z').optional(),
    fieldDate: getDateSchema().optional().nullable(),
  })
  .strict();

export const EditClientRequestSchema = z.object({
  body: clientEditingBodyRequestSchema,
  params: z
    .object({
      id: getNumberIdSchema(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const EditChildClientRequestSchema = z.object({
  body: clientEditingBodyRequestSchema.extend({
    clientId: z.number().int(),
    startDate: getDateSchema().optional().nullable(),
    endDate: getDateSchema().optional(),
  }),
  params: z
    .object({
      id: getNumberIdSchema(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const ParentClientListRequestSchema = z.object({
  body: z
    .object({
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
});

export const ParentClientListResponseSchema = z.object({
  parentClients: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: 'client' }),
    }),
  ),
});

export const DeleteClientsRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    ids: z.string(),
  }),
});

export const ClientShortListRequestSchema = z.object({
  body: z
    .object({
      searchText: z
        .string()
        .optional()
        .nullable()
        .or(z.literal(''))
        .openapi({ example: '' }),
      filter: z
        .object({
          status: z.array(z.string(), {
            required_error: ERROR_MESSAGES.STATUS_REQUIRED,
          }),
        })
        .optional(),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const ClientShortListResponseSchema = z.object({
  clients: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
});
