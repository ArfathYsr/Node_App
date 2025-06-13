import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { getNumberIdSchema } from '../../schemas';

extendZodWithOpenApi(z);

export const LookupResponseDatatSchema = z.array(
  z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .strict(),
);

export const LookupRequestDatatSchema = z.object({
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const QuestionListRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z
    .object({
      categoryId: getNumberIdSchema(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const QuestionListResponseSchema = z.object({
  questionList: z.array(
    z.object({
      id: z.number(),
      questionCategoryId: z.number(),
      questionTypeId: z.number(),
      question: z.string(),
      isActive: z.boolean(),
      parentQuestionId: z.number().nullable(),
      displayOrder: z.number(),
      options: z.array(
        z
          .object({
            id: z.number(),
            questionId: z.number(),
            option: z.string(),
            isActive: z.boolean(),
            displayOrder: z.number(),
          })
          .nullable(),
      ),
    }),
  ),
  totalAmount: z.number(),
});

export const ShortQuestionCategoryListRequestSchema = z.object({
  body: z
    .object({
      searchText: z
        .string()
        .optional()
        .or(z.literal(''))
        .openapi({ example: '' }),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const ShortQuestionCategoryListResponseSchema = z.object({
  questionCategoryList: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
});
