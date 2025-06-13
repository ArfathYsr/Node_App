import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import { CLIENT_ORG_HIERARCHY_MESSAGES, ORG_HIERARCHY_MESSAGES } from '../../utils/Messages/orgHierarchyMessages';
import { AddHierarchyJsonResponseSchema, AddOrgHierarchyReqSchema, ListOrgHierarchySchema } from './orgHierarchySchema';
import { getDefaultDocsResponses } from '../../utils/docsDefaultResponses';

export const routerClientOrgHierarchyListSchema : RouteConfig = {
    method: 'post',
    path: '/api/v1/org-hierarchy/list',
    tags: ['Client Org Hierarchy'],
    summary: ORG_HIERARCHY_MESSAGES.CLIENT_ORG_HIERARCHY_LIST_SUMMARY,
    description : ORG_HIERARCHY_MESSAGES.SORTING_ORG_DESC,
    request : {
      body : {
        content : {
          'application/json' : {
            schema : ListOrgHierarchySchema.shape.body,
          }
        }
      }
    },
    responses: {
      200: {
        description: ORG_HIERARCHY_MESSAGES.CLIENT_ORG_HIERARCHY_LIST_SUCCESSFULLY,
      },
      ...getDefaultDocsResponses([401, 500]),
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  }

  export const routerCloneClientOrgHierarchySchema : RouteConfig = {
    method: 'post',
    path: '/api/v1/org-hierarchy/clone',
    tags: ['Client Org Hierarchy'],
    summary: CLIENT_ORG_HIERARCHY_MESSAGES.CLIENT_ORG_HIERARCHY_SUMMARY,
    description : '',
    request : {
      body : {
        content : {
          'application/json' : {
            schema : AddOrgHierarchyReqSchema.shape.body,
          }
        }
      }
    },
    responses: {
      200: {
        description: CLIENT_ORG_HIERARCHY_MESSAGES.CLIENT_ORG_HIERARCHY_CREATED_SUCCESSFULLY,
        content: {
          'application/json': {
            schema: AddHierarchyJsonResponseSchema,
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
  }