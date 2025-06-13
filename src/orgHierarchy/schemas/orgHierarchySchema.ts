import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { getSortBySchema } from '../../schemas';
import { CLIENT_ORG_HIERARCHY_MESSAGES } from '../../utils/Messages/orgHierarchyMessages';
import config from 'config';

extendZodWithOpenApi(z);
const defaultEndDate: Date = new Date(
  config.get<string>('defaultEntity.defaultEndDate')
);
export const ListOrgHierarchySchema = z.object({
  body: z.object({
    sortBy: getSortBySchema([
      'clientName',
      'name',
      'numberOfLevels',
      'statusName',
      'effectiveDate',
      'endDate',
      'fieldReleaseDate'
    ]).optional(),
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
        clientName: z.array(z.string().optional())
          .optional()
          .openapi({ example: [] }),
        status: z.array(z.number().nullable()).optional(),
      })
      .optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const ListOrgHierarchyResponseSchema  = z.object({

})

const HierarchyLevelSchema = z.object({
  name: z.string(),
  allowMultipleLevelValue: z.boolean(),
  isActive: z.boolean(),
  levelOrder: z.number(),
  parentHierarchyLevelId: z.number().nullable()
});

export const AddOrgHierarchyReqSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: CLIENT_ORG_HIERARCHY_MESSAGES.NAME_REQUIRED,
        })
        .min(1, { message: CLIENT_ORG_HIERARCHY_MESSAGES.NAME_NOT_EMPTY }),

      description: z
        .string({
          invalid_type_error:
            CLIENT_ORG_HIERARCHY_MESSAGES.DESCRIPTION_VALIDATION,
        })
        .min(1, {
          message: CLIENT_ORG_HIERARCHY_MESSAGES.DESCRIPTION_NOT_EMPTY,
        })
        .optional(),

      numberOfLevels: z
        .number({
          invalid_type_error:
            CLIENT_ORG_HIERARCHY_MESSAGES.NO_OF_LEVELS_VALIDATION,
        })
        .int()
        .positive({
          message: CLIENT_ORG_HIERARCHY_MESSAGES.NO_OF_LEVELS_POSITIVE,
        })
        .min(1, {
          message: CLIENT_ORG_HIERARCHY_MESSAGES.NO_OF_LEVELS_NOT_EMPTY,
        }),

      statusId: z
        .number({
          invalid_type_error: CLIENT_ORG_HIERARCHY_MESSAGES.STATUS_VALIDATION,
        })
        .int()
        .positive({ message: CLIENT_ORG_HIERARCHY_MESSAGES.STATUS_POSITIVE })
        .min(1, { message: CLIENT_ORG_HIERARCHY_MESSAGES.STATUS_NOT_EMPTY }),

      effectiveDate: z.string().datetime({ offset: true }),
      endDate: z.string().datetime({ offset: true }).nullable().optional(),
      hierarchyLevels: z.array(HierarchyLevelSchema).optional(),
      fieldReleaseDate: z
        .string()
        .datetime({ offset: true })
        .nullable()
        .optional(),
      cloneId : z.number().optional() ,
      type : z.string().openapi({example : 'clone'}),
      clientId : z.number() ,
    })
    .refine(
      (data) => {
        const endDate = data.endDate || defaultEndDate;
        return new Date(data.effectiveDate) <= new Date(endDate);
      },
      { message: CLIENT_ORG_HIERARCHY_MESSAGES.EFFECTIVE_END_DATE_VALIDATION }
    )
    .refine(
      (data) => {
        const endDate = data.endDate || defaultEndDate;
        if (data.fieldReleaseDate) {
          return new Date(data.fieldReleaseDate) <= new Date(endDate);
        }
        return true;
      },
      {
        message:
          CLIENT_ORG_HIERARCHY_MESSAGES.FIELD_RELEASE_END_DATE_VALIDATION,
      }
    )
    .refine(
      (data) => {
        if (data.fieldReleaseDate) {
          return new Date(data.fieldReleaseDate) >= new Date(data.effectiveDate);
        }
        return true;
      },
      {
        message:
          CLIENT_ORG_HIERARCHY_MESSAGES.EFFECTIVE_FIELD_RELEASE_DATE_VALIDATION,
      }
    ),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const AddHierarchyJsonResponseSchema = z.object({
  id: z.number(),
  clientOrgHierarchyName: z.string(),
});