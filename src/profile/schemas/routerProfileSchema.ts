import { RouteConfig } from '@asteasolutions/zod-to-openapi';
import {
  CreateProfileRequestSchema,
  CreateProfileResponseSchema,
  GetProfileListResponseSchema,
  UpdateProfileRequestSchema,
  GetProfileRequestSchema,
  GetProfileDetailsResponseSchema,
  ProfileListRequestSchema,
  DelegateManagerProfileListRequestSchema,
  DelegateManagerProfileListResponseSchema,
  CreateChildProfileRequestSchema,
  CreateChildProfileResponseSchema,
  UpdateMyProfileRequestSchema,
  UpdateMyProfileResponseSchema,
  InterfaceThemeSchema,
  BrandColorResponseSchema,
  BulkProfileEditRequestSchema,
  BulkProfileEditResponseSchema,
  LoginRequestSchema,
  LoginHistorySchema,
  ViewMyProfileResponseSchema,
  ImportUserProfileRequestSchema,
  CreateHcpProfileRequestSchema,
  CreateHcpProfileResponseSchema,
  EditProfileRolePermissionAlignmentRequestSchema,
  rofileRolePermissionAlignmentResponseSchema,
  ProfileRolePermissionAlignmentRequestSchema,
  EditHcpProfileRequestSchema,
  EdithcpProfileResponseSchema,
  AddProfileAddressAndEmailRequestSchema,
  AddProfileAddressAndEmailReponseSchema,
  HcpCredentialsRequestSchema,
  HcpCredentialsResponseSchema,
  EditHcpCredentialsReponseSchema,
  EditHcpCredentialsRequestSchema,
  EditAndAddProfileAddressAndEmailRequestSchema,
  EditAndAddAddressAndEmailresponseSchema,
  UpdateCommunicationPreferencesRequestSchema,
  CommunicationPreferencesResponseSchema,
  CommunicationPreferencesRequestSchema,
  ArchiveProfileRequestSchema,
  ArchiveProfileResponseSchema,
  CreateHcpBioProfessionRequestSchema,
} from './profileSchema';
import { getDefaultDocsResponses } from '../../utils/docsDefaultResponses';
import { Methods } from '../../utils/constants';
import { PROFILE_MESSAGES } from '../../utils/Messages/profileMessage';

export const routerCreateProfileSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles',
  tags: ['Profiles'],
  summary: 'Create a new profile',
  description:
    'In case of creating the internal profile, the employeeId field is required',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateProfileRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Profile successfully created',
      content: {
        'application/json': {
          schema: CreateProfileResponseSchema,
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

export const routerUpdateProfileSchema: RouteConfig = {
  method: 'put',
  path: '/api/v1/profiles/{id}',
  tags: ['Profiles'],
  summary: 'Update a profile',
  description: 'Update internal Profile',
  request: {
    params: UpdateProfileRequestSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: UpdateProfileRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Profile successfully updated',
      content: {
        'application/json': {
          schema: CreateProfileResponseSchema,
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

export const routerGetProfilesListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/list',
  tags: ['Profiles'],
  summary: 'Get the profiles list',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ProfileListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Profiles list',
      content: {
        'application/json': {
          schema: GetProfileListResponseSchema,
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

export const routerGetProfileByIdSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/profiles/{id}',
  tags: ['Profiles'],
  summary: 'Get the profile info by id',
  request: {
    params: GetProfileRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Profile detailed data',
      content: {
        'application/json': {
          schema: GetProfileDetailsResponseSchema,
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

export const routerGetDelegateManagerProfileListSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/delegate-managers',
  tags: ['Profiles'],
  summary: 'Get the Delegate Managers profiles list',
  request: {
    body: {
      content: {
        'application/json': {
          schema: DelegateManagerProfileListRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Delegate Managers Profiles list',
      content: {
        'application/json': {
          schema: DelegateManagerProfileListResponseSchema,
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

export const routerCreateChildProfileSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/add_child_profile',
  tags: ['Profiles'],
  summary: 'Create a child profiles',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateChildProfileRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'My Profile successfully updated',
      content: {
        'application/json': {
          schema: CreateChildProfileResponseSchema,
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
export const routerUpdateChildProfileSchema: RouteConfig = {
  method: 'put',
  path: '/api/v1/profiles/my-profile',
  tags: ['Profiles'],
  summary: 'Update my master and child profiles',
  description: 'Update internal Profile',
  request: {
    body: {
      content: {
        'application/json': {
          schema: UpdateMyProfileRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'My Profile successfully updated',
      content: {
        'application/json': {
          schema: UpdateMyProfileResponseSchema,
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
  ...getDefaultDocsResponses([401, 500]),
};

export const loginHistorySchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/profiles/login-details',
  tags: ['Profiles'],
  summary: 'Get the Login Details',
  request: {
    query: LoginRequestSchema.shape.query,
  },
  responses: {
    200: {
      description: 'List of the Login Details',
      content: {
        'application/json': {
          schema: LoginHistorySchema,
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

export const routerBulkProfileEditSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/profile-bulk-edit',
  tags: ['Profiles'],
  summary: 'Bulk profile Edit',
  request: {
    body: {
      content: {
        'application/json': {
          schema: BulkProfileEditRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Updated successfully',
      content: {
        'application/json': {
          schema: BulkProfileEditResponseSchema,
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

export const routerlistbrandcolor: RouteConfig = {
  method: 'get',
  path: '/api/v1/profiles/list-brandcolor',
  tags: ['Profiles'],
  summary: 'Get the list of brandcolors',
  responses: {
    200: {
      description: 'List of the brandcolors',
      content: {
        'application/json': {
          schema: BrandColorResponseSchema,
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

export const routerListTheme: RouteConfig = {
  method: 'get',
  path: '/api/v1/profiles/list-theme',
  tags: ['Profiles'],
  summary: 'Get the list of themes',
  responses: {
    200: {
      description: 'List of the themes',
      content: {
        'application/json': {
          schema: InterfaceThemeSchema,
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
export const routerViewMyProfileSchema: RouteConfig = {
  method: 'get',
  path: '/api/v1/profiles/my-profile',
  tags: ['Profiles'],
  summary: 'View My profile',
  description: 'View My Profile',
  responses: {
    200: {
      description: 'My Profile successfully retrieved',
      content: {
        'application/json': {
          schema: ViewMyProfileResponseSchema,
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
  ...getDefaultDocsResponses([401, 500]),
};

export const ImportUserProfileSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/import-user-profile',
  tags: ['Profiles'],
  summary: 'Import user profiles from a file',
  request: {
    body: {
      description: 'File to upload (CSV or Excel format)',
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary', // Indicates a file upload
                description: 'The file to upload (CSV or Excel format)',
              },
              relayChangesField: {
                type: 'string',
                description: 'Field to track changes for relay processing',
              },
            },
            required: ['file'], // Explicitly mark `file` as required
          },
        },
        'application/json': {
          schema: ImportUserProfileRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'File processed successfully, and user profiles imported.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  description: 'Imported user profile',
                  properties: {
                    FirstName: { type: 'string' },
                    LastName: { type: 'string' },
                    Email: { type: 'string', format: 'email' },
                    // Add additional fields as needed
                  },
                },
              },
            },
          },
        },
      },
    },
    400: {
      description: 'Bad request. Validation errors occurred.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              error: { type: 'string' },
              details: {
                type: 'array',
                items: { type: 'string' },
              },
            },
          },
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

export const routerCreateHcpProfileSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/add_name_contact',
  tags: ['Profiles'],
  summary: 'Create a new Hcp profile',
  description:
    'In case of creating the internal profile, the employeeId field is required',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateHcpProfileRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Hcp Profile successfully created',
      content: {
        'application/json': {
          schema: CreateHcpProfileResponseSchema,
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

export const routerAddRolePermissionsSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/add_role_permissions',
  tags: ['Profiles'],
  summary: 'Align functional area,permission and permission group',
  description:
    'In case of creating the internal profile, the employeeId field is required',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ProfileRolePermissionAlignmentRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Profile successfully aligned',
      content: {
        'application/json': {
          schema: rofileRolePermissionAlignmentResponseSchema,
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

export const routerEditRolePermissionsSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/edit_role_permissions',
  tags: ['Profiles'],
  summary: 'Align functional area,permission and permission group',
  description:
    'In case of creating the internal profile, the employeeId field is required',
  request: {
    body: {
      content: {
        'application/json': {
          schema: EditProfileRolePermissionAlignmentRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Profile successfully aligned',
      content: {
        'application/json': {
          schema: rofileRolePermissionAlignmentResponseSchema,
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

export const routerAddAddressEmailSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/add_addresses',
  tags: ['Profiles'],
  summary: 'Add address and email',
  description:
    'In case of creating the internal profile, the employeeId field is required',
  request: {
    body: {
      content: {
        'application/json': {
          schema: AddProfileAddressAndEmailRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Address and Email added successfully',
      content: {
        'application/json': {
          schema: AddProfileAddressAndEmailReponseSchema,
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
export const routerAddHcpCredentialsSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/add_hcp_credentials',
  tags: ['Profiles'],
  summary:
    'Add Hcp licence, licenceNumber,npi address i.e Hcp credential details',
  description:
    'In case of creating the internal profile, the employeeId field is required',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CreateHcpBioProfessionRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Hcp credentials added succefully',
      content: {
        'application/json': {
           schema: HcpCredentialsResponseSchema,
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

export const routerAddCommunicationPreferenceSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/communication_preferences',
  tags: ['Profiles'],
  summary: 'Add communication preference',
  description:
    'In case of creating the internal profile, the employeeId field is required',
  request: {
    body: {
      content: {
        'application/json': {
          schema: CommunicationPreferencesRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'communication preference added successfully',
      content: {
        'application/json': {
          schema: CommunicationPreferencesResponseSchema,
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

export const routerUpdateCommunicationPreferenceSchema: RouteConfig = {
  method: 'put',
  path: '/api/v1/profiles/communication-preferences/{id}',
  tags: ['Profiles'],
  summary: 'Update Communication Preferences',
  request: {
    params: UpdateCommunicationPreferencesRequestSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: UpdateCommunicationPreferencesRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Update Communication Preferences',
      content: {
        'application/json': {
          schema: CommunicationPreferencesResponseSchema,
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

export const routerEditHcpProfileSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/edit_name_contact',
  tags: ['Profiles'],
  summary: 'Update a new Hcp profile',

  request: {
    body: {
      content: {
        'application/json': {
          schema: EditHcpProfileRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Hcp Profile successfully created',
      content: {
        'application/json': {
          schema: EdithcpProfileResponseSchema,
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

export const routerUpdateHcpCredentialsSchema: RouteConfig = {
  method: 'put',
  path: '/api/v1/profiles/edit_hcp_credentials/{id}',
  tags: ['Profiles'],
  summary: 'Update a new Hcp Credential',

  request: {
    body: {
      content: {
        'application/json': {
          schema: EditHcpCredentialsRequestSchema.shape.body,
        },
      },
    },
    params: EditHcpCredentialsRequestSchema.shape.params,
  },
  responses: {
    200: {
      description: 'Hcp Credential successfully created',
      content: {
        'application/json': {
          schema: EditHcpCredentialsReponseSchema,
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

export const routerEditAndAddAddressEmailSchema: RouteConfig = {
  method: Methods.PUT,
  path: PROFILE_MESSAGES.ROUTER_SCHEMA_MESSAGES.ROUTER_PATH.EDIT_ADDRESS,
  tags: [PROFILE_MESSAGES.TAG],
  summary: PROFILE_MESSAGES.ROUTER_SCHEMA_MESSAGES.PROFILE_SUMMARY.EDIT_AADRESS,
  description: PROFILE_MESSAGES.ROUTER_SCHEMA_MESSAGES.ROUTER_ENTRY_DESCRIPTION,
  request: {
    params: EditAndAddProfileAddressAndEmailRequestSchema.shape.params,
    body: {
      content: {
        'application/json': {
          schema: EditAndAddProfileAddressAndEmailRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description:
        PROFILE_MESSAGES.ROUTER_SCHEMA_MESSAGES.RESPONSE_DESCRIPTION
          .EDIT_ADDRESS,
      content: {
        'application/json': {
          schema: EditAndAddAddressAndEmailresponseSchema,
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

export const routerArchiveProfileSchema: RouteConfig = {
  method: 'post',
  path: '/api/v1/profiles/archive',
  tags: ['Profiles'],
  summary: 'Route to Archive Profile',
  request: {
    body: {
      content: {
        'application/json': {
          schema: ArchiveProfileRequestSchema.shape.body,
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Profiles Archived  successfully',
      content: {
        'application/json': {
          schema: ArchiveProfileResponseSchema,
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
