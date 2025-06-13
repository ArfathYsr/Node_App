import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  ArchiveSchema,
  StatustListResponseSchema,
  FluentLanguageSchema,
  AddressTypeSchema,
  StateSchema,
  CitySchema,
  CountrySchema,
  GetListInternationalPrefixResponseSchema,
  GetPhoneTypeResponseSchema,
  VendorTypeSchema,
  ContactTypeSchema,
  VendorStatusListResponseSchema,
  GetStatusListSchema,
} from './commonSchema';

export const routerArchiveFilterSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/list-archive-filter',
  tags: ['Common'],
  summary: 'Get the list of Archive Filter list',
  responses: {
    200: {
      description: 'List of the Archive Filter list',
      content: {
        'application/json': {
          schema: ArchiveSchema,
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};
export const routerViewStatusListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/common/common_status_list',
  tags: ['Common'],
  summary: 'Get the list of Status',
    request: {
      body: {
        content: {
          'application/json': {
            schema:GetStatusListSchema.shape.body ,
          },
        },
      },
    },
  responses: {
    200: {
      description: 'Status list fetched successfully',
      content: {
        'application/json': {
          schema: StatustListResponseSchema,
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

export const routerFluentLanguageListSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/list-fluent-languages',
  tags: ['Common'],
  summary: 'Get the list of Fluent Languages',
  responses: {
    200: {
      description: 'List of the Fluent Languages',
      content: {
        'application/json': {
          schema: FluentLanguageSchema,
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerAddressTypeListSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/address-types',
  tags: ['Common'],
  summary: 'Get the list of Address Types',
  responses: {
    200: {
      description: 'List of the Address Types',
      content: {
        'application/json': {
          schema: AddressTypeSchema,
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};
export const routerStateListSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/states',
  tags: ['Common'],
  summary: 'Get the list of States',
  responses: {
    200: {
      description: 'List of the States',
      content: {
        'application/json': {
          schema: StateSchema,
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerViewProfileStatusListSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/profile_status_list',
  tags: ['Common'],
  summary: 'View Profile Status list',
  responses: {
    200: {
      description: 'Status list fetched successfully',
      content: {
        'application/json': {
          schema: StatustListResponseSchema,
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

export const routerInternationalPrefixSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/internationalPrefix',
  tags: ['Common'],
  summary: 'List for International Prefix',
  responses: {
    200: {
      description: 'International Prefix retrieved successfully.',
      content: {
        'application/json': {
          schema: GetListInternationalPrefixResponseSchema,
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

export const routerPhoneTypeSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/phoneType',
  tags: ['Common'],
  summary: 'List for phone Type',
  responses: {
    200: {
      description: 'phone Type retrieved successfully.',
      content: {
        'application/json': {
          schema: GetPhoneTypeResponseSchema,
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

export const routerCityListSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/city',
  tags: ['Common'],
  summary: 'Get the list of City',
  responses: {
    200: {
      description: 'List of the City',
      content: {
        'application/json': {
          schema: CitySchema,
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerCountryListSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/country',
  tags: ['Common'],
  summary: 'Get the list of Country',
  responses: {
    200: {
      description: 'List of the Country',
      content: {
        'application/json': {
          schema: CountrySchema,
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerVendorTypeListSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/vendor_type',
  tags: ['Common'],
  summary: 'Get the list of VendorTypes',
  responses: {
    200: {
      description: 'List of the VendorTypes',
      content: {
        'application/json': {
          schema: VendorTypeSchema,
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerContactTypeListSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/contact_type',
  tags: ['Common'],
  summary: 'Get the list of ContactTypes',
  responses: {
    200: {
      description: 'List of the ContactTypes',
      content: {
        'application/json': {
          schema: ContactTypeSchema,
        },
      },
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};

export const routerViewvendorStatusListSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/common/vendor_status_list',
  tags: ['Common'],
  summary: 'View Venodor Status list',
  responses: {
    200: {
      description: 'Status list fetched successfully',
      content: {
        'application/json': {
          schema: VendorStatusListResponseSchema,
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
