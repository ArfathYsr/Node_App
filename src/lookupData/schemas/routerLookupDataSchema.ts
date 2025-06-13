import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  LookupResponseDatatSchema,
  QuestionListRequestSchema,
  QuestionListResponseSchema,
  ShortQuestionCategoryListRequestSchema,
  ShortQuestionCategoryListResponseSchema,
} from './lookupDataSchema';
import { getDefaultDocsResponses } from '../../utils/docsDefaultResponses';

export const routerGetDegreeSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/lookup-data/degree',
  tags: ['Lookup-Data'],
  summary: 'Get degree list',
  description: 'Route to get degree list',
  responses: {
    200: {
      description: 'Degree list fetched successfully created',
      content: {
        'application/json': {
          schema: LookupResponseDatatSchema,
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

export const routerGetSpecialtySchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/lookup-data/specialty',
  tags: ['Lookup-Data'],
  summary: 'Get specialty list',
  description: 'Route to get specialty list',
  responses: {
    200: {
      description: 'Specialty list fetched successfully',
      content: {
        'application/json': {
          schema: LookupResponseDatatSchema,
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

export const routerGetMedicalLicenseStateSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/lookup-data/medical-license-state',
  tags: ['Lookup-Data'],
  summary: 'Get medical license state list',
  description: 'Route to get medical license state list',
  responses: {
    200: {
      description: 'Medical license state list fetched successfully',
      content: {
        'application/json': {
          schema: LookupResponseDatatSchema,
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

export const routerGetMedicalLicenseTypeSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/lookup-data/medical-license-type',
  tags: ['Lookup-Data'],
  summary: 'Get medical license type list',
  description: 'Route to get medical license type list',
  responses: {
    200: {
      description: 'Medical license type list fetched successfully',
      content: {
        'application/json': {
          schema: LookupResponseDatatSchema,
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

export const routerGetMedicalLicenseJurisdictionsSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/lookup-data/medical-license-jurisdictions',
  tags: ['Lookup-Data'],
  summary: 'Get medical license jurisdictions list',
  description: 'Route to get medical license jurisdictions list',
  responses: {
    200: {
      description: 'Medical license jurisdictions list fetched successfully',
      content: {
        'application/json': {
          schema: LookupResponseDatatSchema,
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

export const routerGetSegmentationSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/lookup-data/segmentation',
  tags: ['Lookup-Data'],
  summary: 'Get segmentation list',
  description: 'Route to get segmentation list',
  responses: {
    200: {
      description: 'Segmentation list fetched successfully',
      content: {
        'application/json': {
          schema: LookupResponseDatatSchema,
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

export const routerGetAffiliationTypeSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/lookup-data/affiliation-type',
  tags: ['Lookup-Data'],
  summary: 'Get affiliation type list',
  description: 'Route to get affiliation type list',
  responses: {
    200: {
      description: 'Affiliation type list fetched successfully',
      content: {
        'application/json': {
          schema: LookupResponseDatatSchema,
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

export const routerGetMedicalLicenseStatusSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/lookup-data/medical-license-status',
  tags: ['Lookup-Data'],
  summary: 'Get medical license status list',
  description: 'Route to get medical license status list',
  responses: {
    200: {
      description: 'Medical license status list fetched successfully',
      content: {
        'application/json': {
          schema: LookupResponseDatatSchema,
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

export const routerQuestionListSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/lookup-data/questions/{categoryId}',
  tags: ['Lookup-Data'],
  summary: 'Route to get questions list',
  request: {
    params: QuestionListRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Questions list fetched successfully',
      content: {
        'application/json': {
          schema: QuestionListResponseSchema,
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

export const routerShortQuestionCategoryListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/lookup-data/questioncategory/list/short',
  tags: ['Lookup-Data'],
  summary: 'Route to get question category list',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ShortQuestionCategoryListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'question category list fetched successfully',
      content: {
        'application/json': {
          schema: ShortQuestionCategoryListResponseSchema,
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

export const routerGetWorkItemsSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/lookup-data/work-items',
  tags: ['Lookup-Data'],
  summary: 'Get Work Items list',
  description: 'Route to get Work Items list',
  responses: {
    200: {
      description: 'Work Items list fetched successfully',
      content: {
        'application/json': {
          schema: LookupResponseDatatSchema,
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
