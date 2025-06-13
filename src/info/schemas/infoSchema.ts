import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const CountrySchema = z.object({
  countries: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }), // ID как число
      name: z.string().openapi({ example: 'USA' }),
      code: z.string().openapi({ example: 'US' }),
    }),
  ),
});

export const AuditHistoryBodySchema = z.object({
  referenceType: z.string().min(1, { message: 'Reference type is required' }),
  searchText: z.string().optional().openapi({ example: '' }),
  offset: z
    .number()
    .int()
    .nonnegative({ message: 'Offset must be a non-negative integer' }),
  limit: z
    .number()
    .int()
    .max(100)
    .positive({ message: 'Limit must be a positive integer' }),
  type: z.string().optional().openapi({ example: 'export' }),
  filter: z
    .object({
      startDate: z
        .string()
        .datetime({ offset: true })
        .optional()
        .openapi({ example: '2024-07-23T00:00:00.000Z' }),
      endDate: z
        .string()
        .datetime({ offset: true })
        .optional()
        .openapi({ example: '2024-08-23T00:00:00.000Z' }),
      changedBy: z.number().int().positive().optional().openapi({ example: 1 }),
      field: z.string().optional(),
    })
    .optional(),
});
export const AuditHistoryResponseSchema = z.object({
  auditHistory: z.array(
    z.array(
      z.object({
        fieldName: z.string(),
        previousValue: z.string().nullable(),
        newValue: z.string().nullable(),
        modifiedBy: z.string(),
        modifiedDateTime: z.date(),
      }),
    ),
  ),
  exportPath: z.string().optional(),
});

export const AuditHistoryRequestSchema = z.object({
  body: AuditHistoryBodySchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const TimezoneSchema = z.object({
  countries: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }), // ID как число
      name: z.string().openapi({ example: 'EST' }),
    }),
  ),
});

export const LocaleSchema = z.object({
  countries: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }), // ID как число
      name: z.string().openapi({ example: 'En' }),
    }),
  ),
});
