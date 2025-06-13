import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { getDefaultDocsResponses } from '../../utils/docsDefaultResponses';
import {
  createServiceOfferingRequestSchema,
  createServiceOfferingReponseSchema,
  ListWorkItemResponseSchema,
  ServiceTypeWorkItemRequestSchema,
  ServiceTypeWorkItemResponseSchema,
  ServiceOfferingListRequestSchema,
  ServiceOfferingListResponseSchema,
  EditServiceOfferingRequestSchema,
  EditServiceOfferingResponseSchema,
  ArchiveOrUnarchiveServiceOfferingSchema,
  BulkEditServiceOfferingResponseSchema,
  BulkEditServiceOfferingRequestSchema,
  ListWorkItemRequest,
  ViewServiceOfferingRequestSchema,
  ViewServiceOfferingResponseSchema,
} from './serviceofferingSchema';
import { ERROR_MESSAGES } from '../../utils/message';

export const routerCreateServiceOfferingSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/serviceOffering',
  tags: ['Service Offering'],
  summary: 'Create a new Service offering',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createServiceOfferingRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Service offering Created successfully',
      content: {
        'application/json': {
          schema: createServiceOfferingReponseSchema,
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

export const routerListWorkItemSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/serviceOffering/workItem/list',
  tags: ['Service Offering'],
  summary: 'Get work item list',
  description: 'Fetches a list of work items. If `serviceTypeId` is provided, it returns work items aligned to that service type. Otherwise, it retrieves all work items.',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ListWorkItemRequest.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Work item listed successfully',
      content: {
        'application/json': {
          schema: ListWorkItemResponseSchema,
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

export const routerServiceTypeWorkItemSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/serviceOffering/serviceTypeWorkItem',
  tags: ['Service Offering'],
  summary: 'Map service type with work item',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ServiceTypeWorkItemRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Service rype Work Item relation created successfully',
      content: {
        'application/json': {
          schema: ServiceTypeWorkItemResponseSchema,
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

export const routerEditServiceOfferingSchema: RouteConfig = {
  method: 'put',
  tags: ['Service Offering'],
  path: '/api/v1/serviceOffering/{id}',
  summary: 'Edit Service Offering',
  description: 'Route to edit Servive Offering and work item',
  request: {
    params: EditServiceOfferingRequestSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: EditServiceOfferingRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Service Offering Updated successfully',
      content: {
        'application/json': {
          schema: EditServiceOfferingResponseSchema,
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

export const routerViewServiceOfferingListSchema: RouteConfig = {
  method: "post",
  path: "/api/v1/serviceOffering/list",
  tags: ['Service Offering'],
  summary: 'Service offering List',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ServiceOfferingListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Service offering Listed successfully",
      content: {
        'application/json': {
          schema: ServiceOfferingListResponseSchema,
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

export const routerServiceOfferingArchiveSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/serviceOffering/archive',
  tags: ['Service Offering'],
  summary: 'Route to Archive Service Offering',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ArchiveOrUnarchiveServiceOfferingSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Service Offering Archived successfully',
      content: {
        'application/json': {
          schema: ArchiveOrUnarchiveServiceOfferingSchema,
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

export const routerServiceOfferingUnArchiveSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/serviceOffering/unarchive',
  tags: ['Service Offering'],
  summary: 'Route to UnArchive Service Offering',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ArchiveOrUnarchiveServiceOfferingSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Service Offering UnArchived successfully',
      content: {
        'application/json': {
          schema: ArchiveOrUnarchiveServiceOfferingSchema,
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

export const routerBulkEditServiceOfferingSchema: RouteConfig = {
  method: 'post',
  tags: ['Service Offering'],
  path: '/api/v1/serviceOffering/bulk-edit',
  summary: 'Edit Service Offering',
  description: 'Route to bulk edit service Offering and work item',
  request: {
    body: {
      content: {
        'application/json': {
          schema: BulkEditServiceOfferingRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Service Offering Updated successfully',
      content: {
        'application/json': {
          schema: BulkEditServiceOfferingResponseSchema,
        },
      },
    },
    500: {
      description: ERROR_MESSAGES.VALIDATION_ERROR,
    },
    401: {
      description: ERROR_MESSAGES.UNAUTHORIZED_ERR,
    },
  },
  security: [
    {
      BearerAuth: [],
    },
  ],
};



export const routerViewServiceOfferingSchema: RouteConfig = {
  method: 'get',
  tags: ['Service Offering'],
  path: '/api/v1/serviceOffering/{id}',
  summary: 'Get Service Offering',
  description: 'Route to get Servive Offering Details',
  request: {
    params: ViewServiceOfferingRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Service Offering details fetched successfully',
      content: {
        'application/json': {
          schema: ViewServiceOfferingResponseSchema,
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