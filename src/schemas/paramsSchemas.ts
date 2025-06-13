import { z } from 'zod';

export const getSortBySchema = <SortFieldT extends string[]>(
  availableFields: SortFieldT,
) =>
  z.object({
    field: z.enum([availableFields[0], ...availableFields.slice(1)]),
    order: z.enum(['asc', 'desc']),
  });

/**
 * @returns JS object with offset and limit pagination fields
 */
export const getPaginationSchemaParams = () => ({
  offset: z
    .number()
    .int()
    .refine((value) => value >= 0, {
      message: 'Value must be positive or 0',
    })
    .optional(),
  limit: z.number().max(100).int().positive().default(10).optional(),
});
