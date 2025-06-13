import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { getNumberIdSchema } from '../../schemas';
import { z } from 'zod';

extendZodWithOpenApi(z);
export const CreateAddVenueChecklistRequestSchema = z.object({
  body: z
    .object({
      vendorId: z.number(),
      venueName: z.string(),
      contactName: z.string(),
      phoneNumber: z.string(),
      email: z.string().max(40),
      questions: z.array(
        z.object({
          questionId: z.number(),
          questionOptionId: z
            .array(z.number().positive().optional().openapi({ example: 1 }))
            .optional(),
          customValue: z.string().optional(),
        }),
      ),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const GetVendorVenueCheckListDetailsRequestSchema = z.object({
  body: z.object({}),
  params: z.object({
    vendorId: getNumberIdSchema()
  }),
});

export const GetVendorVenueCheckListDetailsResponseSchema = z.object({
  id: z.number(),
  vendorId: z.number(),
  name: z.string().datetime({ offset: true }),
  phone: z.string().datetime({ offset: true }),
  email: z.string(),
  questions: z.array(
    z.object({
    id: z.number(),
    name: z.string(),
    questionOptions: z.array(z.object({
      id: z.number(),
      name: z.string(),
    })),
})
)})