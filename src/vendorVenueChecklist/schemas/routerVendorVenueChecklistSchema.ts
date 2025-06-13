import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { CreateAddVenueChecklistRequestSchema, GetVendorVenueCheckListDetailsRequestSchema, GetVendorVenueCheckListDetailsResponseSchema } from './vendorVenueChecklistSchema';

export const routerAddVendorVenueCheckListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/vendor-venue-checklist',
  tags: ['Vendor Venue Chceklist'],
  summary: 'Create a new venue checklist',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateAddVenueChecklistRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Vendor Created successfully',
      content: {
        'application/json': {
          schema: CreateAddVenueChecklistRequestSchema,
        },
      },
    },
    500: {
      description: 'Validation Error',
    },
    401: {
      description: 'Unauthorized',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};
export const routerGetVendorVenuCheckListSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/vendor-venue-checklist/{vendorId}',
  tags: ['Vendor Venue Checklist'],
  summary: 'Api to get vendor venue checklist details',
    request: {
      params: GetVendorVenueCheckListDetailsRequestSchema.shape.params,
    },
  responses: {
    201: {
      description: 'Vendor venue checklist details retrived successfully',
      content: {
        'application/json': {
          schema: GetVendorVenueCheckListDetailsResponseSchema,
        },
      },
    },
    500: {
      description: 'Validation Error',
    },
    401: {
      description: 'Unauthorized',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};