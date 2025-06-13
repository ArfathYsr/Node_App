import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  AddVendorRequestSchema,
  AddVendorResponseSchema,
  GetVendorMeetingRoomsRequestSchema,
  GetVendorRequestSchema,
  GetVendorResponseSchema,
  GetVendorRoomDetailsResponseSchema,
  VendorListRequestSchema,
  VendorListResponseSchema,
  VendorMatchListRequestSchema,
  VendorMatchListResponseSchema,
} from './vendorSchema';
import {} from '../../utils/message';
import { APIEndPoint, EntityTags, Methods } from '../../utils/constants';
import { VENDOR_MESSAGES } from '../../utils/Messages/vendorMessage';
import { getDefaultDocsResponses } from '../../utils/docsDefaultResponses';
import { VendorMeetingRoomConfig } from '../../utils/common';

export const routerAddVendorSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/vendor',
  tags: ['Vendor'],
  summary: 'Create a new vendor',
  request: {
    body: {
      content: {
        'application/json': {
          schema: AddVendorRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Vendor Created successfully',
      content: {
        'application/json': {
          schema: AddVendorResponseSchema,
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

export const routerViewVendorSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/vendor/{id}',
  tags: ['Vendor'],
  summary: 'Get vendor Details for particular Id',
  request: {
    params: GetVendorRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Vendor Details Data',
      content: {
        'application/json': {
          schema: GetVendorResponseSchema,
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

export const routerViewVendorListSchema: RouteConfig = {
  method: Methods.POST,
  path: APIEndPoint.VENDOR_LIST_API,
  tags: [EntityTags.VENDOR],
  summary: VENDOR_MESSAGES.LIST_SUMMARY,
  request: {
    body: {
      content: {
        'application/json': {
          schema: VendorListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: VENDOR_MESSAGES.LIST_RESPONSE_DESCRIPTION,
      content: {
        'application/json': {
          schema: VendorListResponseSchema,
        },
      },
    },
    ...getDefaultDocsResponses([401, 500]),
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerVendorMatchListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/vendor/potential-match-list',
  tags: ['Vendor'],
  summary: 'Route to view vendor potential match list ',
  request: {
    body: {
      content: {
        'application/json': {
          schema: VendorMatchListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Vendor list fetched successfully',
      content: {
        'application/json': {
          schema: VendorMatchListResponseSchema,
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
export const routerVendorMeetingRoomListSchema: RouteConfig = {
  method: VendorMeetingRoomConfig.API_METHOD,
  path: VendorMeetingRoomConfig.API_PATHS.VENDOR_MEETING_ROOM_DATA_PATH,
  tags: [VendorMeetingRoomConfig.API_TAG],
  summary: VendorMeetingRoomConfig.API_SUMMARY.VENDOR_MEETING_ROOM_SUMMARY,
  request: {
    body: {
      content: {
        [VendorMeetingRoomConfig.API_RESPONSE_BODY]: {
          schema: GetVendorMeetingRoomsRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description:
        VendorMeetingRoomConfig.API_RESPONSE_SUCCESS_DESCRIPTION
          .VENDOR_MEETING_ROOM_DESCRIPTION,
      content: {
        [VendorMeetingRoomConfig.API_RESPONSE_BODY]: {
          schema: GetVendorRoomDetailsResponseSchema,
        },
      },
    },
    500: {
      description:
        VendorMeetingRoomConfig.API_RESPONSE_VALIDATION_ERROR_DESCRIPTION,
    },
    401: {
      description:
        VendorMeetingRoomConfig.API_RESPONSE_UNAUTHORIZED_DESCRIPTION,
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};
