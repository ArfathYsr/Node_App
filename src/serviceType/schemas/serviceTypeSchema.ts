import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { getNumberIdSchema, getSortBySchema } from '../../schemas';
import { z } from 'zod';
import { SERVICE_TYPES_MESSAGES } from '../../utils/Messages/serviceType';

extendZodWithOpenApi(z);
export const ServiceTypeListSchema = z.object({
  body: z
    .object({
      sortBy: getSortBySchema([
        'id',
        'name',
        'description',
        'isActive',
      ]).optional(),
      startDate: z
        .string()
        .datetime({ offset: true })
        .openapi({ example: '2024-07-23T00:00:00.000Z' })
        .optional(),
      endDate: z
        .string()
        .datetime({ offset: true })
        .openapi({ example: '2025-03-23T00:00:00.000Z' })
        .optional(),
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
          isActive : z.boolean().openapi({example : false}).optional() , 
          isArchived: z.number().optional(),
          serviceOfferingIds: z.array(
            z
              .number({
                required_error: 'Each ID must be a number',
                invalid_type_error: 'ID must be a number',
              })
              .int({ message: 'ID must be an integer' })
              .positive()   
              .optional()           
              .openapi({ example: 1 }),
          ).optional(),
        })
        .optional(),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});  

  export const ServiceTypeListShortSchema = z.object({
  body: z
    .object({
       searchText: z
        .string()
        .optional()
        .nullable()
        .or(z.literal(''))
        .openapi({ example: '' })
  }),
});

 export const ServiceTypeListShortResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
    description: z.string()
  });

export const ServiceTypeListResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  status: z.boolean(),
  createdBy: z.number(),
  createdAt: z.date(),
  updatedBy: z.number(),
  updatedAt: z.date(),
  serviceTypeOffering: z.array(
    z.object({
      serviceOffering: z.object({
        name: z.string(),
      }),
    })
  ),
});

export const AddServiceTypesRequestSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1, { message: 'String cannot be empty' }).max(50),
      description: z
        .string()
        .trim()
        .min(1)
        .max(255, 'Description must not exceed 255 characters.')
        .openapi({ example: 'string' }),
      isActive: z.boolean(),
      serviceOfferingIds: z.array(z.number()).min(1),
      workItemIds: z.array(z.number()).optional(),
      type: z.string().optional().openapi({ example: 'clone' }),
      cloneId: z.number().int().positive().optional().openapi({ example: 1 }),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
  });

  export const EditServiceTypesRequestSchema = z.object({
    body: z
      .object({
        name: z.string().trim().min(1, { message: 'Name string cannot be empty' }).max(50),
        description: z
          .string()
          .trim()
          .min(1,{ message: 'Description string cannot be empty' })
          .max(255, 'Description must not exceed 255 characters.')
          .openapi({ example: 'string' }),
        isActive: z.boolean(),
        serviceOfferingIds: z.array(z.number()).min(1),
        workItemIds: z.array(z.number()).optional(),
      })
      .strict(),
    params: z.object({
      id: getNumberIdSchema(),
    }),
    query: z.object({}).optional(),
  });
  
  export const AddServiceTypesresponseSchema = z.object({
    body: z.object({
      message: z
        .string()
        .openapi({ example: SERVICE_TYPES_MESSAGES.SERVICE_TYPES_CREATED }),
      data: z.object({
        serviceTypeInfo: z.object({
          id: z.number(),
          name: z.string(),
          description: z.string(),
          isActive: z.boolean().optional(),
          createdBy: z.number(),
          createdAt: z.date(),
          updatedBy: z.number(),
          updatedAt: z.date(),
        }),
        serviceOfferingIds: z.array(z.number()).min(1),
        workItemIds: z.array(z.number()).optional(),
      }),
    }),
  });
  
  export const EditServiceTypesResponseSchema = z.object({
    body: z.object({
      message: z
        .string()
        .openapi({ example: SERVICE_TYPES_MESSAGES.SERVICE_TYPES_UPDATED }),
      data: z.object({
        serviceTypeInfo: z.object({
          id: z.number(),
          name: z.string(),
          description: z.string(),
          isActive: z.boolean().optional(),
          createdBy: z.number(),
          createdAt: z.date(),
          updatedBy: z.number(),
          updatedAt: z.date(),
          createdByProfile: z.object({
            firstName: z.string(),
            lastName: z.string(),
          }),
          updatedByProfile: z.object({
            firstName: z.string(),
            lastName: z.string(),
          }),
        }),
        serviceOfferingIds: z.array(z.number()).min(1),
      }),
    }),
  });

  export const ViewServiceTypesRequestSchema = z.object({
    body: z.object({}).optional(),
    params: z.object({
      id: getNumberIdSchema(),
    }).strict(),
    query: z.object({}).optional(),
    });

    export const ViewServiceTypeResponseSchema = z.object({
      body: z.object({
        message: z.string().openapi({ example: "Service type retrieved successfully!" }),
        serviceTypeInfo: z.object({
          id: z.number(),
          name: z.string(),
          description: z.string(),
          isActive: z.boolean(),
          createdBy: z.number(),
          createdAt: z.string().openapi({ format: "date-time" }),
          updatedBy: z.number(),
          updatedAt: z.string().openapi({ format: "date-time" }),
          serviceOfferings: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              description: z.string(),
              status: z.boolean(),
            })
          ),
          workItems: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              actionType: z.string(),
              status: z.string(),
            })
          ),
        }),
      }),
    });


  export const ArchiveServiceTypeRequestSchema = z.object({
    body: z.object({}).optional(),
    params: z.object({
      id: getNumberIdSchema(),
    }),
    query: z.object({}).optional(),
  });

  export const ArchiveServiceTypeResponseSchema =z.object({
    message: z.string().openapi({example: "ServiceType has been archived / UnArchived successfully."})
  })