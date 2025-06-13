import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  AddVendorResponseSchema,
  AddVendorRoomRequestSchema,
  VendorRoomListResponseSchema,
  GetRoomDetailsRequestSchema,
  GetRoomDetailsResponseSchema,
} from './vendorRoomSchema';
import { getDefaultDocsResponses } from '../../utils/docsDefaultResponses';
import { APIEndPoint, EntityTags, Methods } from '../../utils/constants';

export const routerGetVendorRoomListSchema: RouteConfig = {
  method: Methods.GET,
  path: '/api/v1/vendor-rooms/list',
  tags: [EntityTags.VENDOR_ROOM],
  summary: 'Get list of Vendor Rooms',
  responses: {
    200: {
      description: 'List of Vendor Room fetched successfully',
      content: {
        'application/json': {
          schema: VendorRoomListResponseSchema,
        },
      },
    },
    404: {
      description: 'Vendor Rooms not found.',
    },
    500: {
      description: 'Internal server error.',
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

export const routerAddVendorRoomInfoSchema: RouteConfig = {
  method: Methods.POST,
  path: APIEndPoint.ADD_ROOM_API_PATH,
  tags: [EntityTags.VENDOR_ROOM],
  summary: 'Create a new Room',
  request: {
    body: {
      content: {
        'application/json': {
          schema: AddVendorRoomRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "",
      content: {
        'application/json': {
          schema: AddVendorResponseSchema,
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

export const routerGetRoomDetailsByIdSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/vendor-rooms/{id}',
  tags: ['VendorRooms'],
  summary: 'Get the Vendor Room info by id',
  request: {
    params: GetRoomDetailsRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Vendor Room info data',
      content: {
        'application/json': {
          schema: GetRoomDetailsResponseSchema,
        },
      },
    },
    ...getDefaultDocsResponses([401, 404, 500]),

    404: {
      description: 'NotFound Error',
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};


