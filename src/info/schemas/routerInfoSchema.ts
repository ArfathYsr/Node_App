import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  AuditHistoryResponseSchema,
  CountrySchema,
  TimezoneSchema,
  LocaleSchema,
  AuditHistoryRequestSchema,
} from './infoSchema';
import { getDefaultDocsResponses } from '../../utils/docsDefaultResponses';

export const infoSchemaGetCountries: RouteConfig = {
  method: 'get',
  path: '/api/v1/info/countries',
  tags: ['Info'],
  summary: 'Get the list of countries',
  responses: {
    200: {
      description: 'List of the countries',
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

export const routerGetAuditHistoryListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/info/audit-history',
  tags: ['Info'],
  summary: 'Get the Audit Field Level list',
  request: {
    body: {
      content: {
        'application/json': {
          schema: AuditHistoryRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Field History list',
      content: {
        'application/json': {
          schema: AuditHistoryResponseSchema,
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
export const infotimeZoneList: RouteConfig = {
  method: 'get',
  path: '/api/v1/info/timeZone',
  tags: ['Info'],
  summary: 'Get the list of timeZone',
  responses: {
    200: {
      description: 'List of the timeZone',
      content: {
        'application/json': {
          schema: TimezoneSchema,
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
export const infoLocaleList: RouteConfig = {
  method: 'get',
  path: '/api/v1/info/locale',
  tags: ['Info'],
  summary: 'Get the list of locale',
  responses: {
    200: {
      description: 'List of the locale',
      content: {
        'application/json': {
          schema: LocaleSchema,
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
