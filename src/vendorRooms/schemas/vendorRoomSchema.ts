import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { VENDOR_ROOM_MESSAGES } from '../../utils/Messages/vendorRoomMessage';
import {
  getNumberIdSchema,
  getSortBySchema,
} from '../../schemas';
extendZodWithOpenApi(z);

export const GetRoomDetailsRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: getNumberIdSchema(),
  }),
  query: z.object({}).optional(),
});

export const GetRoomDetailsResponseSchema = z.object({
  id: z.number(),
  roomName: z.string(),
  maxCapacity: z.number(),
  rentalFee: z.number(),

  vendorQuestionResponse: z.array(
    z.object({
       questionId: z.object({
        id: z.number(),
        question: z.string(),
       
      }),
      questionOption: z
        .object({
          id: z.number(),
          option: z.string(),
        })
        .optional(),
      fileURL:z.string().optional(),
      customeValue: z.string().optional()
    })
  ),
});

export const VendorRoomListResponseSchema = z.object({
  vendorRoomList: z.object({
    id: z.number().optional(),
    roomName: z.string().optional(),
    rentalFee: z.number().optional(),
    maxCapacity: z.number().optional(),
    createdAt: z.date().optional(),
    createdBy: z.number().optional(),
    updatedAt: z.date().optional(),
    updatedBy: z.number().optional(),
  }),
});

export const VendorRoomRequestSchema = z.object({
body: z
  .object({
    sortBy: getSortBySchema([
      'roomName',
      'rentalFee',
      'maxCapacity',
    ]).optional(),
    startDate: z
      .string()
      .datetime({ offset: true })
      .openapi({ example: '2024-07-23T00:00:00.000Z' }).optional(),
    endDate: z
      .string()
      .datetime({ offset: true })
      .openapi({ example: '2024-08-23T00:00:00.000Z' }).optional(),
    offset: z.number().openapi({ example: 0 }),
    limit: z.number().max(100).openapi({ example: 20 }),
    searchText: z
      .string()
      .optional()
      .nullable()
      .or(z.literal(''))
      .openapi({ example: '' })
  })
  .strict(),
params: z.object({}).optional(),
query: z.object({}).optional(),
});

export const AddVendorRoomRequestSchema = z.object({
  body: z
    .object({
      vendorId: z.number().int(),
      roomName: z
        .string({
          required_error: VENDOR_ROOM_MESSAGES.NAME_REQUIRED,
        })
        .min(1, { message: VENDOR_ROOM_MESSAGES.NAME_NOT_EMPTY }),
      rentalFee: z.number().int().optional(),
      maxCapacity: z.number().int().optional(),
      questions: z.array(
        z.object({
          questionId: z.number(),
          questionOptionId: z
            .array(z.number().positive().optional().openapi({ example: 1 }))
            .optional(),
          customValue: z.string().optional(),
        })
      ),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const AddVendorResponseSchema = z.object({
  message: z.string(),
  roomDetailList: z.object({
    id: z.number(),
    vendorid: z.number(),
    roomName: z.string(),
    rentalFee: z.number().int(),
    maxCapacity: z.number().int(),
  }),
  questionsInserted: z.object({
    count: z.number(),
  }),
});



