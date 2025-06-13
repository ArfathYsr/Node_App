import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { getNumberIdSchema } from '../../schemas';

extendZodWithOpenApi(z);

export const CreateTherapeuticAreaRequestSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: 'Name is required',
          invalid_type_error: 'Name must be a string',
        })
        .min(1, { message: 'Name cannot be empty' })
        .max(40, { message: 'Must be 40 or fewer characters long' }),
      description: z
        .string({
          invalid_type_error: 'Description must be a string',
        })
        .min(1, { message: 'Description cannot be empty' })
        .max(255, { message: 'Must be 255 or fewer characters long' })
        .optional()
        .nullable(),
      startDate: z.string().datetime({
        offset: true,
        message: 'Start date must be a valid ISO date with offset',
      }),
      endDate: z
        .string()
        .datetime({
          offset: true,
          message: 'End date must be a valid ISO date with offset',
        })
        .optional()
        .nullable(),
      isActive: z.boolean({
        required_error: 'isActive is required',
        invalid_type_error: 'isActive must be a boolean',
      }),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const CreateTherapeuticAreaResponseSchema = z.object({
  therapeuticArea: z.object({
    id: z.number(),
  }),
});

export const listTherapeuticAreaSchema = z.object({
  therapeuticArea: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      isActive: z.boolean(),
      startDate: z.date(),
      endDate: z.date(),
    }),
  ),
});

export const ViewTherapeuticAreaSchemaByIdRequestSchema = z.object({
  params: z
    .object({
      id: getNumberIdSchema(),
    })
    .strict(),
  query: z.object({}).optional(),
});
export const ViewTherapeuticAreaSchemaByIdResponseSchema = z.object({
  therapeuticArea: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      isActive: z.boolean(),
      startDate: z.date(),
      endDate: z.date(),
    }),
  ),
});

export const EditTherapeuticAreaRequestSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, { message: 'Name cannot be empty' })
      .max(255, { message: 'Must be 255 or fewer characters long' })
      .openapi({ example: 'Therapeutic Area Name' }),
    description: z
      .string()
      .min(1)
      .openapi({ example: 'This is a therapeutic area for testing purposes.' }),
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
    isActive: z.boolean().optional().default(true),
    updatedBy: z.number().int().openapi({ example: 1 }), // assuming updatedBy is required
  }),
  params: z.object({
    id: getNumberIdSchema(),
  }),
  query: z.object({}).optional(),
});

export const EditTherapeuticAreaResponseSchema = z.object({
  therapeuticArea: z.object({
    id: z.number(),
  }),
});

export const TherapeuticAreaDeleteRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    ids: z.string(),
  }),
});
export const DeleteTherapeuticAreaRequestSchema = z.object({
  ids: z.string(),
});
