import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { MESSAGES } from '../../utils/message';
import { EXAMPLE_DATE, OFFSET } from '../../utils/constants';
import {
  getDateSchema,
  getNumberIdSchema,
  getPaginationSchemaParams,
  getSortBySchema,
  getBase64SupportedFormatsSchema,
  validateMobilePhone,
  validateBusinessPhone,
  validFaxNo,
  validPhoneNo,
  
} from '../../schemas';

extendZodWithOpenApi(z);

const baseProfileSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: 'String cannot be empty' })
      .max(255),
    lastName: z.string().min(1, { message: 'String cannot be empty' }).max(255),
    middleName: z.string().max(255).optional(),
    preferredName: z.string().max(255).optional(),
    userName: z.string().max(255).optional(),
    email: z.string().min(1, { message: 'String cannot be empty' }).max(255),
    title: z.string().max(255).optional(),
    profileStatusId: z.number(),
    isExternal: z.boolean(),
    clientId: z.number().optional().openapi({
      description:
        'In case the Child profile is creating (Client Level profile), the field is required',
    }),
    clientIds: z.array(z.number().int()).optional().openapi({
      description: 'Array of client IDs associated with the profile',
    }),
    managerId: z.number().nullable().optional(),
    delegateId: z.number().nullable().optional(),
    sapVendorId: z.string().max(30).optional(),
    federationId: z.string().max(30).optional().nullable(),
    employeeId: z.string().max(255).optional().openapi({
      description:
        'The field is required in case the profile is creating for internal user',
    }),
    startDate: getDateSchema().optional().nullable(),
    endDate: getDateSchema().optional().nullable(),
    roleIds: z.array(z.number().int()),
    interfaceThemeId: z.number().int().optional().openapi({
      description: 'ID for the interface theme to be applied to the profile',
    }),
    brandColorCodeId: z.number().optional().openapi({
      description: 'Id for the brand color code',
    }),
  })
  .strict()


const profileCreationRequestSchema = baseProfileSchema.extend({
    email: z.string().min(1, { message: 'String cannot be empty' }).max(255),
  }).refine(
    (data) => {
      // The field is required in case the profile is creating for internal user
      if (!data.isExternal && !data.employeeId) return false;
      return true;
    },
    {
      message:
        'The field is required in case the profile is creating for internal user',
    },
  );
  
  const profileUpdationRequestSchema = baseProfileSchema.extend({
    email: z.string().max(255).optional(),
  }).refine(
    (data) => {
      // The field is required in case the profile is creating for internal user
      if (!data.isExternal && !data.employeeId) return false;
      return true;
    },
    {
      message:
        'The field is required in case the profile is creating for internal user',
    },
  );

export const CreateProfileRequestSchema = z.object({
  body: profileCreationRequestSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const CreateProfileResponseSchema = z.object({
  profile: z.object({
    id: z.number(),
    createdAt: z.date(),
    createdBy: z.number(),
    updatedAt: z.date(),
    updatedBy: z.number(),
    profileStatusId: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().nullable(),
    preferredName: z.string().nullable(),
    title: z.string().nullable(),
    sapIntegration: z.boolean(),
    isExternal: z.boolean(),
    internalMasterId: z.number().nullable(),
    externalMasterId: z.string().nullable(),
    sapVendorId: z.string().nullable(),
    federationId: z.string().nullable(),
    clientId: z.number().nullable(),
    managerId: z.number().nullable(),
    delegateId: z.number().nullable(),
    identityId: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string(),
  }),
  email: z.array(
    z.object({
      id: z.number(),
      createdAt: z.date(),
      createdBy: z.number(),
      updatedAt: z.date(),
      updatedBy: z.number(),
      isActive: z.boolean(),
      profileId: z.number(),
      emailAddress: z.string(),
      emailAddressTypeId: z.number(),
      correspondance: z.boolean(),
    }),
  ),
  phone: z.array(
    z.object({
      id: z.number(),
      createdAt: z.date(),
      createdBy: z.number(),
      updatedAt: z.date(),
      updatedBy: z.number(),
      isActive: z.boolean(),
      profileId: z.number(),
      countryCode: z.string(),
      phoneNumber: z.string(),
      phoneTypeId: z.number(),
      correspondance: z.boolean(),
    }),
  ),
  role: z.array(
    z.object({
      id: z.number(),
      statusId: z.number(),
      name: z.string(),
      description: z.string().nullable(),
      isExternal: z.boolean(),
    }),
  ),
  profileTheme: z
    .object({
      id: z.number(),
      profileId: z.number(),
      interfaceThemeId: z.number(),
      brandColorCodeId: z.string(),
      createdBy: z.number(),
      updatedBy: z.number(),
    })
    .nullable(),
});

export const UpdateProfileRequestSchema = z.object({
  body: profileUpdationRequestSchema,
  params: z
    .object({
      id: getNumberIdSchema(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const GetProfilesListRequestSchema = z
  .object({
    searchText: z
      .string()
      .or(z.literal(''))
      .nullable()
      .optional()
      .openapi({ example: '' }),
    ...getPaginationSchemaParams(),
    filter: z
      .object({
        functionalAreas: z.array(z.number().optional().nullable()).optional(),
        roles: z.array(z.number().optional().nullable()).optional(),
        statusId: z.array(z.number().optional().nullable()).optional(),
        state: z.array(z.number().optional().nullable()).optional(),
        city: z.array(z.number().optional().nullable()).optional(),
        isArchived: z.number().optional().nullable(),
        startDate: getDateSchema().optional().nullable(),
        endDate: getDateSchema().optional().nullable(),
        isExternal: z.boolean().optional(),
      })
      .optional(),
    sortBy: getSortBySchema([
      'id',
      'createdAt',
      'updatedAt',
      'createdBy',
      'updatedBy',
      'startDate',
      'endDate',
      'profileStatusId',
      'firstName',
      'lastName',
      'middleName',
      'preferredName',
      'title',
      'sapIntegration',
      'isExternal',
      'internalMasterId',
      'externalMasterId',
      'sapVendorId',
      'clientId',
      'managerId',
      'delegateId',
      'identityId',
      'role',
      'defaultEmail',
      'defaultPhone',
      'permissionGroups',
      'updatedByProfile',
      'address',
      'city',
      'state',
      'functionalArea',
      'permissionCount',
    ]).optional(),
  })
  .optional();

export const ProfileListRequestSchema = z.object({
  body: GetProfilesListRequestSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const GetProfileListResponseSchema = z.object({
  profiles: z.array(
    z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
      middleName: z.string().nullable(),
      preferredName: z.string().nullable(),
      title: z.string().nullable(),
      profileStatusId: z.number(),
      profileStatusName: z.string(),
      isExternal: z.boolean(),
      clientId: z.number().nullable(),
      internalMasterId: z.number().nullable(),
      externalMasterId: z.number().nullable(),
      managerId: z.number().nullable(),
      delegateId: z.number().nullable(),
      sapVendorId: z.string().nullable(),
      sapIntegration: z.boolean(),
      identityId: z.string().nullable(),
      startDate: getDateSchema().nullable(),
      endDate: getDateSchema(),
      photo: z.string().nullable(),
      archivedAt: getDateSchema().nullable(),
      permissionGroupsCount: z.number(),
      address: z.object({
        address: z.string(),
        state: z.string(),
        city: z.string(),
        zipcode: z.string(),
      }),
      createdByProfile: z.object({
        firstName: z.string(),
        lastName: z.string(),
      }),
      updatedByProfile: z.object({
        firstName: z.string(),
        lastName: z.string(),
      }),
      email: z.array(z.object({
        id: z.number(),
        isActive: z.boolean(),
        emailAddress: z.string(),
        emailAddressTypeId: z.number(),
        correspondance: z.boolean(),
      })),
      phone: z
        .object({
          id: z.number(),
          isActive: z.boolean(),
          countryCode: z.string(),
          phoneNumber: z.string(),
          phoneTypeId: z.number(),
          correspondance: z.boolean(),
        })
        .nullable(),
      role: z
        .object({
          id: z.number(),
          statusId: z.number(),
          name: z.string(),
          description: z.string().nullable(),
          isExternal: z.boolean(),
        })
        .nullable(),
      profileThemes: z
        .object({
          id: z.number(),
          brandColorCodeId: z.string(),
          interfaceTheme: z.object({
            id: z.number(),
            themeName: z.string(),
            themeImageUrl: z.string(),
          }),
        })
        .nullable(),
      functionalAreaName: z.string().nullable(),
    }),
  ),
  totalAmount: z.number(),
});

export const GetProfileRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({
    id: getNumberIdSchema(),
  }),
  query: z.object({}).optional(),
});

export const GetProfileResponseSchema = z.object({
  profile: z.object({
    id: z.number(),
    createdAt: z.date(),
    createdBy: z.number(),
    updatedAt: z.date(),
    updatedBy: z.number(),
    profileStatusId: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().nullable(),
    preferredName: z.string().nullable(),
    title: z.string().nullable(),
    sapIntegration: z.boolean(),
    isExternal: z.boolean(),
    internalMasterId: z.number().nullable(),
    externalMasterId: z.string().nullable(),
    sapVendorId: z.string().nullable(),
    clientId: z.number().nullable(),
    managerId: z.number().nullable(),
    delegateId: z.number().nullable(),
    identityId: z.string().nullable(),
    startDate: getDateSchema().nullable(),
    endDate: getDateSchema(),
  }),
  email: z.object({
    id: z.number(),
    isActive: z.boolean(),
    profileId: z.number(),
    emailAddress: z.string(),
    emailAddressTypeId: z.number(),
    correspondance: z.boolean(),
  }),
  phone: z.object({
    id: z.number(),
    isActive: z.boolean(),
    profileId: z.number(),
    countryCode: z.string(),
    phoneNumber: z.string(),
    phoneTypeId: z.number(),
    correspondance: z.boolean(),
  }),
  permissionGroups: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    startDate: getDateSchema(),
    endDate: getDateSchema(),
  }),
  functionalAreas: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    startDate: getDateSchema(),
    endDate: getDateSchema(),
  }),
  profileThemes: z
    .object({
      id: z.number(),
      brandColorCodeId: z.string(),
      interfaceTheme: z.object({
        id: z.number(),
        themeName: z.string(),
        themeImageUrl: z.string(),
      }),
    })
    .nullable(),
});

export const DelegateManagerProfileListRequestSchema = z.object({
  body: z
    .object({
      searchText: z
        .string()
        .optional()
        .nullable()
        .or(z.literal(''))
        .openapi({ example: 'name' }),
      offset: z.number().openapi({ example: 0 }),
      limit: z
        .number()
        .max(100, { message: 'limit must be 100 or less' })
        .openapi({ example: 20 }),
    })
    .strict(),
});

export const DelegateManagerProfileListResponseSchema = z.object({
  profiles: z.array(
    z.object({
      id: z.number(),
      firstName: z.string(),
      lastName: z.string(),
    }),
  ),
  totalAmount: z.number(),
});

export const CreateChildProfileRequestSchema = z.object({
  body: z.object({
    internalMasterId: z.number(),
    clients: z.array(
      z.object({
        clientId: z.number(),
        startDate: getDateSchema().optional(),
        endDate: getDateSchema().optional(),
      }),
    ),
  }),
});

export const CreateChildProfileResponseSchema = z.object({
  profile: CreateProfileResponseSchema,
  childProfiles: z.array(
    z.object({
      profileId: z.number(),
      clientId: z.number(),
      startDate: getDateSchema(),
      endDate: getDateSchema(),
      createdAt: z.date(),
      createdBy: z.number(),
      updatedAt: z.date(),
      updatedBy: z.number(),
    }),
  ),
});

export const UpdateMyProfileRequestSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    middleName: z.string().optional(),
    lastName: z.string().min(1).optional(),
    preferredName: z.string().optional(),
    title: z.string().optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const UpdateMyProfileResponseSchema = z.object({
  id: z.number().int(),
  createdAt: z.date(),
  createdBy: z.number().int(),
  updatedAt: z.date(),
  updatedBy: z.number().int(),
  profileStatusId: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().nullable(),
  preferredName: z.string().nullable(),
  title: z.string().nullable(),
  sapIntegration: z.boolean(),
  isExternal: z.boolean(),
  internalMasterId: z.number().int().nullable().optional(),
  externalMasterId: z.string().nullable().optional(),
  sapVendorId: z.string().nullable().optional(),
  clientId: z.number().int().nullable().optional(),
  managerId: z.number().int().nullable().optional(),
  delegateId: z.number().int().nullable().optional(),
  identityId: z.string().nullable().optional(),
  federationId: z.string().nullable().optional(),
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
});

export const BrandColorResponseSchema = z.object({
  brandcolors: z.array(
    z.object({
      id: z.number(),
      colorCode: z.string(), // Hexa
    }),
  ),
});

export const InterfaceThemeSchema = z.object({
  themes: z.array(
    z.object({
      id: z.number(),
      themeImageUrl: z.string(),
      themeName: z.string(),
    }),
  ),
});
export const BulkProfileEditRequestSchema = z.object({
  body: z.object({
    profileId: z.array(z.number()),
    functionalAreaId: z.number().optional(),
    roleId: z.number().optional(),
    permissionsId: z.number().optional(),
    permissionGroupsId: z.number().optional(),
    timezoneId: z.number().optional(),
    localeId: z.number().optional(),
    type: z.boolean().optional(),
    startDate: z
      .string()
      .refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format for StartDate',
      })
      .optional(),
    endDate: z
      .string()
      .refine((date) => !Number.isNaN(Date.parse(date)), {
        message: 'Invalid date format for EndDate',
      })
      .optional(),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const BulkProfileEditResponseSchema = z.object({
  message: z.string().optional(),
});
export const LoginHistorySchema = z.object({
  loginDetails: z.object({
    id: z.number(),
    profileId: z.number(),
    applicationName: z.string(),
    browserName: z.string(),
    device: z.string(),
    loggedinAt: z.date(),
    isLoginSuccess: z.boolean(),
    sourceIp: z.string(),
  }),
});

export const LoginRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    id: getNumberIdSchema(),
    type: z.string().optional().openapi({ example: 'export' }),
  }),
});
export const ViewMyProfileRequestSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const ViewMyProfileResponseSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string().nullable(),
  preferredName: z.string().nullable(),
  title: z.string().nullable(),
  roleDetails: z.array(
    z.object({
      role: z.string(),
      permissions: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
        }),
      ),
      permissionGroups: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
        }),
      ),
    }),
  ),
});

export const ImportUserProfileRequestSchema = z.object({
  body: z
    .object({
      relayChangesField: z.string().optional(),
    })
    .optional(),
});
export const ProfileRolePermissionAlignmentRequestSchema = z.object({
  body: z
    .object({
      profileId: z.number().int().positive().openapi({ example: 1 }),
      roleId: z.number().int().positive().openapi({ example: 1 }),
      functionalAreaIds: z
        .array(
          z
            .number({
              required_error: 'Each functionalArea ID must be a number',
              invalid_type_error: 'functionalArea ID must be a number',
            })
            .int({ message: 'functionalArea ID must be an integer' })
            .positive()
            .optional()
            .openapi({ example: 1 }),
        )
        .optional(),
      permissionIds: z
        .array(
          z
            .number({
              required_error: 'Each permission ID must be a number',
              invalid_type_error: 'Permission ID must be a number',
            })
            .int({ message: 'Permission ID must be an integer' })
            .positive()
            .optional()
            .openapi({ example: 1 }),
        )
        .optional(),
      permissionGroupIds: z
        .array(
          z
            .number({
              required_error: 'Each permission group ID must be a number',
              invalid_type_error: 'Permission group ID must be a number',
            })
            .int({ message: 'Permission Group ID must be an integer' })
            .positive()
            .optional()
            .openapi({ example: 1 }),
        )
        .optional(),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const hcpProfileCreationRequestSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: MESSAGES.REQUIRED_FIELD('firstName') })
      .max(255),
    lastName: z
      .string()
      .min(1, { message: MESSAGES.REQUIRED_FIELD('lastName') })
      .max(255),
    middleName: z.string().max(255).optional(),
    preferredName: z.string().max(255).optional(),
    photo: getBase64SupportedFormatsSchema().optional(),
    clientId: z
      .number({
        required_error: MESSAGES.REQUIRED_FIELD('Client Id'),
      })
      .openapi({ example: 0 }),
    masterProfileId: z
      .string({
        required_error: MESSAGES.REQUIRED_FIELD('Master Profile Id'),
      })
      .min(1, { message: MESSAGES.NON_EMPTY_FIELD('Master Profile Id') }),
    email: z
      .string()
      .email()
      .min(1, { message: MESSAGES.REQUIRED_FIELD('Email') })
      .max(255),
    title: z.string().max(255).optional(),
    profileStatusId: z.number(),
    isExternal: z.boolean(),
    delegateId: z.number().optional(),
    sapVendorId: z
      .string({
        required_error: MESSAGES.REQUIRED_FIELD('SAP Vendor Id'),
      })
      .min(1, { message: MESSAGES.NON_EMPTY_FIELD('SAP Vendor Id') })
      .max(30),
    employeeId: z.string().max(255).optional().openapi({
      description: MESSAGES.PROFILE_DESCRIPTION,
    }),
    startDate: z
      .string()
      .datetime({ offset: true })
      .openapi({ example: '2024-07-23T00:00:00.000Z' })
      .optional(),
    endDate: z
      .string()
      .datetime({ offset: true })
      .openapi({ example: '2050-08-23T00:00:00.000Z' })
      .optional(),
    oneKeyId: z.string().optional(),
    veevaId: z.string().optional(),
    ocePersonalId: z.string().optional(),
    centrisId: z.string().optional(),
    isSpeaker: z.boolean(),
    salutation: z.string().optional().nullable(),
    suffix: z.string().optional().nullable(),
    assistantName: z.string().optional().nullable(),
    assistantEmail: z.string().email().optional().nullable(),
    businessPhone: validateBusinessPhone(),
    mobilePhone: validateMobilePhone().optional(),
    assistantPhone: validateMobilePhone().optional(),
    oceDigitialId: z.string().optional(),
    phone: z
      .array(
        z.object({
          countryCode: z
            .string({
              required_error: MESSAGES.REQUIRED_FIELD('Country code'),
              invalid_type_error: MESSAGES.INVALID_TYPE_ERROR(
                'Country code',
                'string',
              ),
            })
            .min(1, { message: MESSAGES.CONTRY_CODE_REQUIRED })
            .max(6),
          phoneNumber: z
            .string({
              required_error: MESSAGES.REQUIRED_FIELD('Phone number'),
            })
            .min(10)
            .max(40)
            .openapi({ example: MESSAGES.VALID_PHONE_NO }),
          phoneTypeId: z
            .number({
              required_error: MESSAGES.REQUIRED_FIELD('Phone Type'),
              invalid_type_error: MESSAGES.INVALID_TYPE_ERROR(
                'Phone Type Id',
                'number',
              ),
            })
            .openapi({ example: 1 }),
          correspondance: z.boolean().openapi({ example: false }),
        }),
      )
      .optional(),
    clientIds: z.array(z.number()).min(1).optional(),
    timezoneId: z.number().optional(),
    localeId: z.number().optional(),
    languageIds: z.array(z.number()).optional(),
    type: z.string().optional().openapi({ example: 'clone' }),
    cloneId: z.number().int().positive().optional().openapi({ example: 1 }),
  })
  .strict()
  .refine(
    (data) => {
      // The field is required in case the profile is creating for internal user
      if (!data.isExternal && !data.employeeId) return false;
      return true;
    },
    {
      message: MESSAGES.PROFILE_DESCRIPTION,
    },
  );

export const CreateHcpProfileRequestSchema = z.object({
  body: hcpProfileCreationRequestSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const CreateHcpProfileResponseSchema = z.object({
  profile: z.object({
    id: z.number(),
    createdAt: z.date(),
    createdBy: z.number(),
    updatedAt: z.date(),
    updatedBy: z.number(),
    profileStatusId: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().nullable(),
    preferredName: z.string().nullable(),
    photo: z.string().nullable(),
    title: z.string().nullable(),
    sapIntegration: z.boolean(),
    isExternal: z.boolean(),
    internalMasterId: z.number().nullable(),
    externalMasterId: z.string().nullable(),
    sapVendorId: z.string().nullable(),
    delegateId: z.number().nullable(),
    identityId: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string(),
    oneKeyId: z.string(),
    veevaId: z.string(),
    ocePersonalId: z.string(),
    centrisId: z.string(),
    isSpeaker: z.boolean(),
    salutation: z.string().nullable(),
    suffix: z.string().nullable(),
    assistantName: z.string().nullable(),
    assistantEmail: z.string().nullable(),
  }),
  email: z.array(
    z.object({
      id: z.number(),
      createdAt: z.date(),
      createdBy: z.number(),
      updatedAt: z.date(),
      updatedBy: z.number(),
      isActive: z.boolean(),
      profileId: z.number(),
      emailAddress: z.string(),
      emailAddressTypeId: z.number(),
      correspondance: z.boolean(),
    }),
  ),
  phone: z.array(
    z.object({
      id: z.number(),
      createdAt: z.date(),
      createdBy: z.number(),
      updatedAt: z.date(),
      updatedBy: z.number(),
      isActive: z.boolean(),
      profileId: z.number(),
      countryCode: z.string(),
      phoneNumber: z.string(),
      phoneTypeId: z.number(),
      correspondance: z.boolean(),
    }),
  ),
  businessPhone: z.string(),
  mobilePhone: z.string(),
  assistantPhone: z.string(),
  oceDigitialId: z.string(),
  clients: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        startDate: getDateSchema().nullable(),
        endDate: getDateSchema(),
        status: z.string(),
      }),
    )
    .nullable(),
  languageIds: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      startDate: getDateSchema().nullable(),
      endDate: getDateSchema(),
      status: z.string(),
    }),
  ),
});

export const EditProfileRolePermissionAlignmentRequestSchema = z.object({
  body: z
    .object({
      profileId: z.number().int().positive().openapi({ example: 1 }),
      roleIds: z.array(
        z
          .number({
            required_error: MESSAGES.ROLE_ID_MUST_BE_A_NUMBER,
            invalid_type_error: MESSAGES.ROLE_ID_MUST_BE_A_NUMBER,
          })
          .int({ message: MESSAGES.ROLE_ID_MUST_BE_A_INTEGER })
          .positive()
          .openapi({ example: 1 }),
      ),
      functionalAreaIds: z
        .array(
          z
            .number({
              required_error: MESSAGES.FUNCTIONALAREA_ID_MUST_BE_A_NUMBER,
              invalid_type_error: MESSAGES.FUNCTIONALAREA_ID_MUST_BE_A_NUMBER,
            })
            .int({ message: MESSAGES.FUNCTIONALAREA_ID_MUST_BE_A_INTEGER })
            .positive()
            .optional()
            .openapi({ example: 1 }),
        )
        .optional(),
      permissionIds: z
        .array(
          z
            .number({
              required_error: MESSAGES.PERMISSION_ID_MUST_BE_A_NUMBER,
              invalid_type_error: MESSAGES.PERMISSION_ID_MUST_BE_A_NUMBER,
            })
            .int({ message: MESSAGES.PERMISSION_ID_MUST_BE_A_INTEGER })
            .positive()
            .optional()
            .openapi({ example: 1 }),
        )
        .optional(),
      permissionGroupIds: z
        .array(
          z
            .number({
              required_error: MESSAGES.PERMISSIONGROUP_ID_MUST_BE_A_NUMBER,
              invalid_type_error: MESSAGES.PERMISSIONGROUP_ID_MUST_BE_A_NUMBER,
            })
            .int({ message: MESSAGES.PERMISSIONGROUP_ID_MUST_BE_A_INTEGER })
            .positive()
            .optional()
            .openapi({ example: 1 }),
        )
        .optional(),
    })
    .strict(),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const rofileRolePermissionAlignmentResponseSchema = z.object({
  message: z.string(),
});

export const emailSchema = z.object({
  emailAddress: z
    .string()
    .email({ message: 'Invalid email address format' })
    .max(255),
  isPrimary: z.boolean(),
});

export const addressSchema = z.object({
  addressTypeId: z.number().min(1, { message: 'Address Type is required' }),
  address: z.string().max(255).nonempty({ message: 'Address is required' }),
  cityId: z.number().min(1, { message: 'City is required' }),
  stateId: z.number().min(1, { message: 'State is required' }),
  zipcode: z.string().max(5).regex(/^\d+$/, 'Zip code must be numeric'),
  poBox: z
    .string()
    .regex(/^\d{2,5}$/, { message: 'PO Box must be 2-5 digits' })
    .optional(),
  emailAddress: z
    .string()
    .email({ message: 'Invalid email address format' })
    .max(255)
    .optional(),
  isActive: z.boolean(),
  isPrimary: z.boolean(),
});

export const AddProfileAddressAndEmailRequestSchema = z.object({
  body: z.object({
    profileId: z
      .number()
      .min(1, { message: 'Please enter a valid profile ID.' })
      .openapi({ example: 1 }),
    addresses: z.array(addressSchema)
  }),
  params: z.object({}),
  query: z.object({}).optional(),
});

export const AddProfileAddressAndEmailReponseSchema = z.object({
  body: z.object({
    profileId: z.number(),
    addresses: z.array(addressSchema),
  }),
  params: z.object({}),
  query: z.object({}).optional(),
});
export const HcpAddressSchema = z.object({
  addressTypeId: z.number().min(1, { message: 'Address Type is required' }),
  address: z.string().max(255).nonempty({ message: 'Address is required' }),
  cityId: z.number().min(1, { message: 'City is required' }),
  stateId: z.number().min(1, { message: 'State is required' }),
  zipcode: z.string().max(40),
  isActive: z.boolean(),
  isPrimary: z.boolean(),
});

const baseHcpBioProfessionRequestSchema = z
  .object({
    roleId: z.number().optional().nullable().openapi({ example: 1 }),
    primaryDegreeId: z.number().openapi({ example: 1 }),
    secondaryDegreeId: z.number().optional().openapi({ example: 1 }),
    medicalLicenseJurisdictionsId: z.number().openapi({ example: 1 }),
    medicalLicenseNumber: z
      .string()
      .max(15)
      .regex(/^[a-zA-Z0-9]*$/, 'Must be alphanumeric')
      .nonempty({ message: 'MedicalLicenseNumber is required' })
      .openapi({ example: 'ME1000' }),
    medicalLicenseEffectiveDate: z
      .string()
      .datetime({ offset: OFFSET })
      .openapi({ example: EXAMPLE_DATE }),
    medicalLicenseExpiryDate: z
      .string()
      .datetime({ offset: OFFSET })
      .openapi({ example: EXAMPLE_DATE }),
    medicalLicenseTypeId: z.number().openapi({ example: 1 }),
    medicalLicenseStatusId: z.number().openapi({ example: 1 }),
    medicalLicenseStateId: z.number().openapi({ example: 1 }).optional(),
    segmentationId: z.number().optional().openapi({ example: 1 }),
    affiliationTypeId: z.number().optional().openapi({ example: 1 }),
    affiliationName: z
      .string()
      .optional()
      .openapi({ example: 'Group Practices' }),
    primarySpecialtyId: z.number().openapi({ example: 1 }),
    secondarySpecialtyId: z.number().optional().openapi({ example: 1 }),
    npi: z
      .string()
      .regex(/^\d{10}$/, 'Must be a 10-digit numeric value')
      .openapi({ example: '0123456789' })
      .optional(),
    academicInstitutionTitle: z
      .string()
      .optional()
      .openapi({ example: 'Institute of Medical Science' }),
    isVAorDoD: z.boolean().optional(),
    isGovernmentEmployee: z.boolean().optional(),
    isHcpPrescriber: z.boolean(),
    isMedicalSpeaker: z.boolean().optional(),
    isMedicalFellow: z.boolean().optional(),
    stateLicenseNumber: z.string().optional(),
    stateLicenseExpiry: z.string().datetime({ offset: OFFSET }).optional(),
  })
  .strict();

const hcpBioProfessionRequestSchema = z.object({
    profileId: z.number().openapi({ example: 1 }),
  }).merge(baseHcpBioProfessionRequestSchema);

export const CreateHcpBioProfessionRequestSchema = z.object({
  body: hcpBioProfessionRequestSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const HcpCredentialsResponseSchema = z.object({
  id: z.number().openapi({ example: 1 }),
  profileId: z.number(),
  roleId: z.number(),
  primaryDegreeId: z.number(),
  secondaryDegreeId: z.number(),
  medicalLicenseJurisdictionsId: z.number(),
  medicalLicenseNumber: z.string(),
  medicalLicenseEffectiveDate: z.string().datetime({ offset: OFFSET }),
  medicalLicenseExpiryDate: z.string().datetime({ offset: OFFSET }),
  medicalLicenseTypeId: z.number(),
  medicalLicenseStatusId: z.number(),
  medicalLicenseStateId: z.number().optional(),
  segmentationId: z.number(),
  affiliationTypeId: z.number(),
  affiliationName: z.string(),
  primarySpecialtyId: z.number(),
  secondarySpecialtyId: z.number(),
  npi: z.string(),
  academicInstitutionTitle: z.string(),
  isVAorDoD: z.boolean().optional(),
  isGovernmentEmployee: z.boolean(),
  isHcpPrescriber: z.boolean(),
  isMedicalSpeaker: z.boolean(),
  isMedicalFellow: z.boolean(),
  stateOfLicense: z.string(),
  stateLicenseNumber: z.string(),
  stateLicenseExpiry: z.string().datetime({ offset: OFFSET }),
  createdBy: z.number(),
  updatedBy: z.number(),
  createdAt: z.string().datetime({ offset: OFFSET }),
  updatedAt: z.string().datetime({ offset: OFFSET }),
  profileSegmentation: z.object({
    id: z.number(),
    profileId: z.number(),
    segmentationId: z.number(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
    createdBy: z.number(),
    updatedBy: z.number(),
  }),
});

export const HcpCredentialsRequestSchema = z.object({
  body: hcpBioProfessionRequestSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

const EdithcpProfileRequestSchema = z.object({
  profileId: z.number(),
  firstName: z.string().min(1, { message: 'String cannot be empty' }).max(255),
  lastName: z.string().min(1, { message: 'String cannot be empty' }).max(255),
  middleName: z.string().max(255).optional(),
  preferredName: z.string().max(255).optional(),
  photo: getBase64SupportedFormatsSchema().optional(),
  masterProfileId: z
    .string({
      required_error: MESSAGES.REQUIRED_FIELD('Master Profile Id'),
    })
    .min(1, { message: MESSAGES.NON_EMPTY_FIELD('Master Profile Id') }),
  email: z
    .string()
    .email()
    .min(1, { message: 'Email cannot be empty' })
    .max(255),
  isExternal: z.boolean(),
  sapVendorId: z
    .string({
      required_error: MESSAGES.REQUIRED_FIELD('SAP Vendor Id'),
    })
    .min(1, { message: MESSAGES.NON_EMPTY_FIELD('SAP Vendor Id') })
    .max(30),
 
  startDate: z
    .string()
    .datetime({ offset: true })
    .openapi({ example: '2024-07-23T00:00:00.000Z' })
    .optional(),
  endDate: z
    .string()
    .datetime({ offset: true })
    .openapi({ example: '2050-08-23T00:00:00.000Z' })
    .optional(),
  oneKeyId: z.string().optional(),
  veevaId: z.string().optional(),
  ocePersonalId: z.string().optional(),
  centrisId: z.string().optional(),
  salutation: z.string().optional().nullable(),
  suffix: z.string().optional().nullable(),
  assistantName: z.string().optional().nullable(),
  assistantEmail: z.string().optional().nullable(),
  businessPhone: validateBusinessPhone(),
  mobilePhone: validateMobilePhone().optional(),
  assistantPhone: validateMobilePhone().optional(),
  oceDigitialId: z.string().optional(),
  profileStatusId: z.number(),
  clientIds: z.array(z.number()).optional(),
});

export const EditHcpProfileRequestSchema = z.object({
  body: EdithcpProfileRequestSchema,
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const EdithcpProfileResponseSchema = z.object({
  message: z.string(),
  hcpProfile: z.object({
    id: z.number(),
    photo: z.string(),
  }),
});
export const UpdateCommunicationPreferencesRequestSchema = z.object({
  body: z.object({
    phoneTypeId: z
      .number()
      .min(1, { message: 'Please select at least one Phone Type.' }),
    internationalPrefix: z
      .number()
      .min(1, { message: 'Please enter the region name' }),
    phoneNumber: validPhoneNo().openapi({example:"555-555-5555"}),
    phoneNumberExtension: z
      .string()
      .optional()
      .openapi({ example: '3345' })
      .optional(),
    faxNumber: z.union([validFaxNo(),z.literal('')]).optional().openapi({example:"555-555-5555"}),
    }),
  params: z.object({
    id: getNumberIdSchema(),
  }),
  query: z.object({}).optional(),
});
export const AddCommunicationPreferenceRequestSchema = z.object({
  body: z.object({
    profileId: z
      .number()
      .min(1, { message: 'Please enter a valid profile ID.' })
      .openapi({ example: 1 }),
    phoneTypeId: z.number(),
    internationalPrefixId: z.number(),
    phoneNumber: validPhoneNo(),
    phoneNumberExtension: z.string().optional().openapi({ example: '3345' }),
    faxNumber: z
      .union([validFaxNo(), z.literal('')])
      .optional()
      .openapi({ example: '555-555-5555' }),
  }),
  params: z.object({}),
  query: z.object({}).optional(),
});

export const CommunicationPreferencesResponseSchema = z.object({
  id: z.number(),
  profileId: z.number(),
  phoneTypeId: z.number(),
  internationalPrefix: z.number(),
  phoneNumber: z.string(),
  phoneNumberExtension: z.string(),
  faxNumber: z.string().optional(),
});

export const CommunicationPreferencesRequestSchema = z.object({
  body: z.object({
    profileId: z
      .number()
      .min(1, { message: 'Please enter a valid profile ID.' })
      .openapi({ example: 1 }),
    phoneTypeId: z
      .number()
      .min(1, { message: 'Please select at least one Phone Type.' }),
    internationalPrefix: z
      .number()
      .min(1, { message: 'Please enter the region name' }),
    phoneNumber: validPhoneNo().openapi({example:"555-555-5555"}),
    phoneNumberExtension: z.string().optional().openapi({ example: '3345' }),
    faxNumber: validFaxNo().optional().openapi({ example: '555-555-5555' }),
  }),
  params: z.object({}),
  query: z.object({}).optional(),
});

const baseEditHcpBioProfessionRequestSchema = baseHcpBioProfessionRequestSchema;

export const EditHcpCredentialsRequestSchema = z.object({
  body: baseEditHcpBioProfessionRequestSchema,
  params: z.object({
    id: getNumberIdSchema(),
  }),
  query: z.object({}).optional(),
});

export const EditHcpCredentialsReponseSchema = z.object({
  message: z.string(),
  hcpCredential: z.object({
    id: z.number(),
    photo: z.string(),
  }),
});
export const GetProfileDetailsResponseSchema = z.object({
  profile: z.object({
    id: z.number(),
    createdAt: z.date(),
    createdBy: z.number(),
    updatedAt: z.date(),
    updatedBy: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    middleName: z.string().nullable(),
    preferredName: z.string().nullable(),
    photo: z.string().nullable(),
    title: z.string().nullable(),
    sapIntegration: z.boolean(),
    isExternal: z.boolean(),
    internalMasterId: z.number().nullable(),
    externalMasterId: z.string().nullable(),
    sapVendorId: z.string().nullable(),
    delegateId: z.number().nullable(),
    identityId: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string(),
    oneKeyId: z.string(),
    veevaId: z.string(),
    ocePersonalId: z.string(),
    centrisId: z.string(),
    isSpeaker: z.boolean(),
    salutation: z.string().nullable(),
    suffix: z.string().nullable(),
    assistantName: z.string().nullable(),
    assistantEmail: z.string().nullable(),
  }),
  clients: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        startDate: getDateSchema().nullable(),
        endDate: getDateSchema(),
        clientStatus: z.object({
          name : z.string()
       }),
      }),
    )
    .nullable(),
  createdByProfile: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  updatedByProfile: z.object({
    firstName: z.string(),
    lastName: z.string(),
  }),
  profileStatus: z.object({
    id: z.number(),
    statusName: z.string(),
  }),
  email: z.object({
    id: z.number(),
    emailAddress: z.string(),
    isPrimary: z.boolean(),
  }),
  phone: z.object({
    id: z.number(),
    phoneTypeId: z.number(),
    internationalPrefixId: z.number(),
    phoneNumber: z.number(),
    phoneNumberExtension: z.number(),
    faxNumber: z.number(),
  }),
  profileAddressDetails: z.array (z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipcode: z.number(),
    poBox: z.number(),
    emailAddress: z.string(),
    addressTypeId: z.number(),
    isActive: z.boolean(),
  })),
  timeZone: z.object({
    id: z.number(),
    statusName: z.string(),
  }),
  locale: z.object({
    id: z.number(),
    statusName: z.string(),
  }),
  profileFluentLanguages: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    }),
  ),
  functionalAreas: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    startDate: getDateSchema(),
    endDate: getDateSchema(),
  }),
  profileRole: z.object({
    id: z.number(),
    name: z.string(),
    description: z.string(),
    startDate: getDateSchema(),
    endDate: getDateSchema(),
  }),
  profilePermission: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      startDate: getDateSchema(),
      endDate: getDateSchema(),
    }),
  ),
  permissionGroups: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      startDate: getDateSchema(),
      endDate: getDateSchema(),
    }),
  ),
  profileBioProfessionalCredentials: z.object({
    stateLicence: z.string().max(255),
    stateLicenceNumber: z.string().max(25),
    stateLicenceExpiryDate: getDateSchema().optional().nullable(),
    npi: z.string().max(100).optional(),
    decile: z.string().max(25).optional(),
    institutionalReference: z.string().max(250).optional(),
    npiTaxonomy: z.string().max(250).optional(),
    addresses: z.array(
      z.object({
        addressType: z.number(),
        address: z.string(),
        city: z.string(),
        state: z.string(),
        zipcode: z.number(),
        poBox: z.number(),
        emailAddress: z.string(),
        addressTypeId: z.number(),
        isActive: z.boolean(),
      }),
    ),
  }),
  loginDetails: z.object({
    id: z.number(),
    applicationName: z.string(),
    browserName: z.string(),
    device: z.string(),
    loggedinAt: z.date(),
    isLoginSuccess: z.boolean(),
    sourceIp: z.string(),
  }),
});

export const EditAndAddAddressSchema = z.object({
  addressTypeId: z.number().min(1, { message: 'Address Type is required' }),
  address: z.string().max(255).nonempty({ message: 'Address is required' }),
  cityId: z.number().min(1, { message: 'City is required' }),
  stateId: z.number().min(1, { message: 'State is required' }),
  zipcode: z.string().max(40),
  poBox: z
    .string()
    .regex(/^\d{2,5}$/, { message: 'PO Box must be 2-5 digits' })
    .optional(),
  emailAddress: z
    .string()
    .email({ message: 'Invalid email address format' })
    .max(255)
    .optional(),
  isActive: z.boolean(),
  isPrimary: z.boolean(),
});

export const EditAndAddEmailSchema = z.object({
  emailAddressId: z.number().optional().openapi({ example: 1 }),
  emailAddress: z
    .string()
    .email({ message: 'Invalid email address format' })
    .max(255)
    .openapi({ example: 'user@gmail.com' }),
  isPrimary: z.boolean(),
});

export const EditAndAddProfileAddressAndEmailRequestSchema = z.object({
  body: z.object({
    addresses: z.array(EditAndAddAddressSchema)
  }),
  params: z
    .object({
      profileId: getNumberIdSchema(),
    })
    .strict(),
  query: z.object({}).optional(),
});

export const EditAndAddAddressAndEmailresponseSchema = z.object({
  message: z
    .string()
    .openapi({ example: 'Address and Email updated successfully' }),
});

export const ArchiveProfileRequestSchema = z.object({
  body: z.object({
    profileIds: z.array(z.number()).min(1),
  }),
});

export const ArchiveProfileResponseSchema = z.object({
  message: z
    .string()
    .openapi({ example: 'Profile has been archived successfully.' }),
});
