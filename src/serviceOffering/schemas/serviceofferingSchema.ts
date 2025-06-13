import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { number, z } from 'zod';
import { ExampleServiceStrings, ExampleValues, ServiceOfferingSortSchemaEntities } from '../../utils/constants';
import {
  getDateSchema, getNumberIdSchema, getSortBySchema,
} from '../../schemas';
import { SERVICE_OFFERING_MESSAGES } from '../../utils/Messages/serviceOfferingMessage';
import { MESSAGES } from '../../utils/message';

extendZodWithOpenApi(z);

// Define the schema for AddVendorBodyData
export const createServiceOfferingRequestSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
      })
      .min(1, { message: 'Name must not be empty' })
      .regex(/^[A-Za-z][A-Za-z\s-]*$/, {
        message: 'Name must contain only alphabets and spaces',
      })
      .transform((value) => ({ name: value })),
     description: z
      .string({
        required_error: 'Description is required',
      })
      .min(1, { message: 'Description must not be empty' }),
     isActive : z.boolean().optional().openapi({example : false}) ,  
     serviceOfferingCodeId: z.number() ,
     serviceTypeData:z.array(z.object({
          serviceTypeId: z.number().optional(),
          workItemIds: z.array(z
            .number()
            .positive()
            .min(1)).optional(),
      })).optional(),
      type: z.string().optional().openapi({ example: 'clone' }),
      cloneId: z.number().int().positive().optional().openapi({ example: 1 }),
  }),
});


export const createServiceOfferingReponseSchema = z.object({
  id: z.number(),
  serviceOffering: z
      .string({
        required_error: 'Name is required',
      })
      .min(1, { message: 'Name must not be empty' })
      .regex(/^[A-Za-z][A-Za-z\s-]*$/, {
        message: 'Name must contain only alphabets and spaces',
      }),
  serviceTypeData:z.array(z.object({
          serviceTypeId: z.number().optional(),
          workItemIds: z.array(z
            .number()
            .positive()
            .min(1)).optional(),
      })).optional(),    
   isActive : z.boolean().optional().openapi({example : false}) ,   
   createdAt: getDateSchema(),
  updatedAt: getDateSchema(),
});

export const ListWorkItemRequest = z.object({
  body: z.object({
    serviceTypeId: number().optional().openapi({example: 1}).describe('get workItem list by ServiceTypeId')
  })
});

export const ListWorkItemDetail = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    workItemActionType: z.object({
      name: z.string()
    })
  })
)


export const ListWorkItemResponseSchema = z.object({
  workItemList: ListWorkItemDetail,
});

export const ServiceTypeWorkItemRequestSchema =z.object({
  body: z.object({
    serviceTypeId: z.number(),
    workItemId: z.number().array(),
    isActive : z.boolean().optional().openapi({example : false}) ,   

    createdBy : z.number(),
    createdAt : getDateSchema(),
    updatetBy : z.number(),
    updatedAt : getDateSchema()
  })
})

export const ArchiveOrUnarchiveServiceOfferingSchema = z.object({
  body: z.object({
    serviceOfferingIds: z.array(z.number()).min(1),
  }),
});

export const ServiceTypeWorkItemResponseSchema = z.object({
  serviceTypeWorkItems: z.array(
    z.object({
      id: z.number(),
      serviceTypeId: z.number(),
      workItemId: z.number(),
      status: z.boolean(),
      createdBy: z.number(),
      createdAt: z.date(),
      updatedBy: z.number(),
      updatedAt: z.date(),
    })
  ),
});

export const EditServiceOfferingRequestSchema = z.object({
  body: z
    .object({
      name: z.string().min(1, { message: 'String cannot be empty' }).max(50),
      description: z
        .string()
        .min(1)
        .max(255, 'Description must not exceed 255 characters.')
        .openapi({ example: 'string' }),
      isActive : z.boolean().optional().openapi({example : false}) ,      
      serviceOfferingCodeId: z.number().min(1).optional(),
      serviceTypeData:z.array(z.object({
          serviceTypeId: z.number().optional(),
          workItemIds: z.array(z
            .number()
            .positive()
            .min(1)).optional(),
      })).optional()
    })
    .strict(),
  params: z.object({
    id: getNumberIdSchema(),
  }),
  query: z.object({}).optional(),
});

export const EditServiceOfferingResponseSchema = z.object({
  body: z.object({
    message: z
      .string()
      .openapi({ example: SERVICE_OFFERING_MESSAGES.SERVICE_OFFERING_UPDATED }),
    data: z.object({
      updatedServiceOffering: z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        serviceOfferingCodeId:z.number(),
        isActive : z.boolean().optional().openapi({example : false}) ,  
        createdBy: z.number(),
        createdAt: z.date(),
        updatedBy: z.number(),
        updatedAt: z.date(),
      }),
      updatedServiceTypeWorkItems: z.array(z.object({
        serviceTypeId: z.number(),
        workItemId:z.number(),
        createdBy: z.number(),
        updatedBy: z.number(),
      })).min(1),
      updatedServiceTypeOfferings: z.array(z.object({
        serviceTypeId: z.number(),
        count: z.number(),
      })).min(1)
    }),
  }),
});

export const BulkEditServiceOfferingRequestSchema = z.object({
  body: z
    .object({
      ids: z
        .array(
          z.number().openapi({ example: 1 }).describe('Service offering ID'),
        )
        .describe('Service offering Ids'),
      isActive : z.boolean().optional().openapi({example : false}) ,   
      serviceTypeIds: z
        .array(z.number().optional().describe('ServiceType id'))
        .describe('ServiceType ids'),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});


export const BulkEditServiceOfferingResponseSchema = z.object({
    message: z
      .string()
      .openapi({ example: MESSAGES.UPDATED_SUCCESSFULLY }),
})


export const ServiceOfferingListRequestSchema = z.object({
  body: z.object({
    sortBy: getSortBySchema([
      ServiceOfferingSortSchemaEntities.ID,
      ServiceOfferingSortSchemaEntities.NAME,
      ServiceOfferingSortSchemaEntities.TYPE,
      ServiceOfferingSortSchemaEntities.STATUS,
      ServiceOfferingSortSchemaEntities.CREATEDAT,
      ServiceOfferingSortSchemaEntities.UPDATEDAT,
      ServiceOfferingSortSchemaEntities.UPDATEDBYPROFILE,
    ]),
    offset: z.number().openapi({ example: ExampleValues.ZERO }),
    limit: z.number().max(100).openapi({ example: ExampleValues.TWENTY }),
    searchText: z
      .string()
      .optional()
      .or(z.literal(''))
      .openapi({ example: '' }),
    filter: z
      .object({
        name: z.string().optional().openapi({ example: ExampleServiceStrings.NAME }),
        isActive : z.boolean().optional().openapi({example : false}) ,  
        serviceType: z.array(z
          .number()
          .positive()
          .openapi({ example: ExampleValues.ONE }),
      ).optional(),
        archived: z.number().optional().openapi({ example: ExampleValues.ZERO }),
      })
      .optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const ListServiceOfferingSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    isActive :z.boolean(),
    serviceOfferingId: z.number(),
    serviceTypeOffering:z.object({
      serviceType: z.object({
        id: z.number(),
        name: z.string(),
      })
    })
  })
)

export const ServiceOfferingListResponseSchema = z.object({
  serviceOfferingList: z.array(ListServiceOfferingSchema),
  totalCount: z.number()
});


export const ViewServiceOfferingRequestSchema = z.object({
  params: z.object({
    id: getNumberIdSchema(),
  }),
  query: z.object({}).optional(),
});

export const ViewServiceOfferingResponseSchema = z.object({
  data: z.object({
    id: z.number().openapi({ example: 3 }),
    name: z.string().openapi({ example: "Travel Coordination" }),
    description: z.string().openapi({ example: "Travel booking and logistics support for attendees." }),
    isActive: z.boolean().openapi({ example: true }),
    serviceOfferingCodeId: z.number().openapi({ example: 0 }),
    createdAt: z.date().openapi({ example: "2025-04-15T11:00:30.966Z" }),
    createdByProfile: z.object({
      firstName: z.string().openapi({ example: "Mohammad" }),
      lastName: z.string().openapi({ example: "Eesha" }),
    }),
    updatedAt: z.date().openapi({ example: "2025-04-15T11:00:30.966Z" }),
    updatedByProfile: z.object({
      firstName: z.string().openapi({ example: "Mohammad" }),
      lastName: z.string().openapi({ example: "Eesha" }),
    }),
    serviceTypes: z.array(
      z.object({
        serviceTypeId: z.number().openapi({ example: 1 }),
        name: z.string().openapi({ example: "Budget management" }),
      })
    ),
    workItems: z.array(
      z.object({
        name: z.string().openapi({ example: "Post meeting remainder" }),
        actionTypeName: z.string().openapi({ example: "Email" }),
      })
    ),
  }),
});

