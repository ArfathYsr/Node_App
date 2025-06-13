import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { MESSAGES } from '../../utils/message';

extendZodWithOpenApi(z);

export const ArchiveSchema = z.object({
  archiveList: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: 'None' }),
    }),
  ),
});
export const listStatusSchema = z
  .object({
    statusIds: z.array(z.number().int()),
  })
  .openapi({
    title: MESSAGES.COMMON_LIST_STATUS_TITLE,
    description: MESSAGES.COMMON_LIST_STATUS_DESC,
  });

export const StatustListResponseSchema = z.array(
  z.array(
    z.object({
      id: z.number(),
      statusName: z.string(),
    }),
  ),
);

export const FluentLanguageSchema = z.object({
  archiveList: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: 'English' }),
    }),
  ),
});

export const AddressTypeSchema = z.object({
  archiveList: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: 'Home' }),
    }),
  ),
});
export const StateSchema = z.object({
  states: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: 'None' }),
    }),
  ),
});

export const CitySchema = z.object({
  Citys: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: 'None' }),
    }),
  ),
});

export const CountrySchema = z.object({
  Countrys: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: 'None' }),
    }),
  ),
});
export const GetListInternationalPrefixResponseSchema = z.object({
  getInternationalPrefix: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      createdBy: z.number(),
      createdAt: z.date(),
    }),
  ),
});

export const GetPhoneTypeResponseSchema = z.object({
  getPhoneType: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      isActive: z.boolean(),
    }),
  ),
});

export const VendorTypeSchema = z.object({
  vendorTypes: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: 'None' }),
    }),
  ),
});

export const ContactTypeSchema = z.object({
  contactTypes: z.array(
    z.object({
      id: z.number().openapi({ example: 1 }),
      name: z.string().openapi({ example: 'None' }),
    }),
  ),
});

export const VendorStatusListResponseSchema = z.array(
  z.array(
    z.object({
      id: z.number(),
      Name: z.string(),
    }),
  ),
);
export const GetStatusListSchema = z.object({
  body: z.object({
    type: z
      .string()
      .openapi({example : 'withOutDraft'})
  }),
});