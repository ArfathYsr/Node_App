import {
  OpenApiGeneratorV3,
  OpenAPIRegistry,
} from '@asteasolutions/zod-to-openapi';
import config from 'config';
import {
  routerClientsSchema,
  routerCreateClientSchema,
  routerCreateChildClientSchema,
  routerGetClientStatusesSchema,
  routerEditClientSchema,
  routerEditChildClientSchema,
  routerGetClientByIdSchema,
  routerParentClientsSchema,
  routeClientsDeleteSchema,
  routerClientShortListSchema,
} from './client/schemas/routerClientsSchema';
import {
  getAuth,
  getAuthCallback,
  getAuthHome,
  getAuthLogout,
} from './auth/schemas/routerSchema';
import {
  infoSchemaGetCountries,
  routerGetAuditHistoryListSchema,
  infotimeZoneList,
  infoLocaleList,
} from './info/schemas/routerInfoSchema';
import {
  routerCreatePermissionGroupSchema,
  routerUpdatePermissionGroupSchema,
  routerViewPermissionGroupSchema,
  routerViewPermissionGroupListSchema,
  routerViewShortPermissionGroupsSchema,
  routerDeletePermissionGroupsSchema,
  routerArchivePermissionGroupSchema,
} from './permissionGroup/schemas/routerPermissionGroupSchema';
import {
  routerAddPermissionSchema,
  routerViewPermissionSchema,
  routerEditPermissionSchema,
  routerListPermissionSchema,
  routerDeletePermissionsSchema,
  routerViewShortPermissionsSchema,
  routerGetMenuList,
  routerArchivePermissionSchema,
} from './permission/schemas/routerPermissionSchema';
import {
  routerCreateProfileSchema,
  routerGetProfileByIdSchema,
  routerGetProfilesListSchema,
  routerUpdateProfileSchema,
  routerGetDelegateManagerProfileListSchema,
  routerCreateChildProfileSchema,
  routerUpdateChildProfileSchema,
  routerlistbrandcolor,
  routerListTheme,
  routerBulkProfileEditSchema,
  loginHistorySchema,
  routerViewMyProfileSchema,
  ImportUserProfileSchema,
  routerCreateHcpProfileSchema,
  routerEditRolePermissionsSchema,
  routerAddRolePermissionsSchema,
  routerEditHcpProfileSchema,
  routerAddAddressEmailSchema,
  routerAddHcpCredentialsSchema,
  routerAddCommunicationPreferenceSchema,
  routerUpdateHcpCredentialsSchema,
  routerEditAndAddAddressEmailSchema,
  routerUpdateCommunicationPreferenceSchema,
  routerArchiveProfileSchema,
} from './profile/schemas/routerProfileSchema';
import {
  routerFunctionalAreaListSchema,
  routerGetFunctionalAreaSchema,
  routerCreateFunctionalAreasSchema,
  routerEditFunctionalAreaSchema,
  routerDeleteFunctionalAreasSchema,
  routerFunctionalAreaRoleListSchema,
  routerFunctionalAreaArchiveSchema,
  routerViewShortFunctionalAreasSchema,
} from './functionalArea/schemas/routerFunctionalAreasSchema';
import {
  routerCreateRoleSchema,
  routerViewRolesListSchema,
  routerEditRoleSchema,
  routerViewRoleSchema,
  routerDeleteRolesSchema,
  routerRolePermissionGroupListSchema,
  routerRolePermissionGroupListUnalignedSchema,
  routerRoleArchiveSchema,
  routerViewRoleShortListSchema,
  routergetRolesPermissionSchema,
  routerViewRolesByPermissionGroupSchema,
  routerAlignRolePermissionGroupsSchema,
  routergetRolesAdditionalDataSchema,
  routerRolecategorySchema,
  routerRoleCategoryCriteriaAlignmentSchema,
  routerEditRoleCategoryCriteriaAlignmentSchema,
} from './roles/schemas/routerRoleSchema';
import {
  routerCreateTherapeuticAreaSchema,
  routerDeleteTherapeuticAreaSchema,
  routerlistTherapeuticAreaSchema,
  routerTherapeuticAreaEditSchema,
  routerTherapeuticAreaSchemaByID,
} from './therapeuticArea/schemas/routertherapeuticAreaSchema';
import {
  routerArchiveFilterSchema,
  routerViewStatusListSchema,
  routerFluentLanguageListSchema,
  routerAddressTypeListSchema,
  routerViewProfileStatusListSchema,
  routerStateListSchema,
  routerCityListSchema,
  routerCountryListSchema,
  routerInternationalPrefixSchema,
  routerPhoneTypeSchema,
  routerVendorTypeListSchema,
  routerContactTypeListSchema,
  routerViewvendorStatusListSchema,
} from './common/schemas/routerCommonSchema';
import {
  routerGetDegreeSchema,
  routerGetAffiliationTypeSchema,
  routerGetMedicalLicenseJurisdictionsSchema,
  routerGetMedicalLicenseStateSchema,
  routerGetMedicalLicenseStatusSchema,
  routerGetMedicalLicenseTypeSchema,
  routerGetSegmentationSchema,
  routerGetSpecialtySchema,
  routerQuestionListSchema,
  routerShortQuestionCategoryListSchema,
  routerGetWorkItemsSchema,
} from './lookupData/schemas/routerLookupDataSchema';
import {
  routerAddVendorSchema,
  routerVendorMatchListSchema,
  routerVendorMeetingRoomListSchema,
  routerViewVendorListSchema,
  routerViewVendorSchema,
} from './vendor/schemas/routerVendorSchema';
import { routerAddVendorVenueCheckListSchema, routerGetVendorVenuCheckListSchema } from './vendorVenueChecklist/schemas/routerVendorVenueChecklistSchema';
import {
  routerAddVendorRoomInfoSchema,
  routerGetVendorRoomListSchema,
  routerGetRoomDetailsByIdSchema,
} from './vendorRooms/schemas/routerVendorRoomSchema';
import {
  routerCreateServiceOfferingSchema,
  routerListWorkItemSchema,
  routerServiceTypeWorkItemSchema,
  routerViewServiceOfferingListSchema,
  routerEditServiceOfferingSchema,
  routerBulkEditServiceOfferingSchema,
  routerServiceOfferingArchiveSchema,
  routerServiceOfferingUnArchiveSchema,
  routerViewServiceOfferingSchema
} from './serviceOffering/schemas/routerServiceOfferingSchema';
import {
  routerServiceTypeListShortSchema,
  routerCreateServiceTypeSchema,
  routerEditServiceTypeSchema, routerServiceTypeListSchema, 
  routerViewServiceTypeSchema,
  routerArchiveServiceTypeSchema,
  routerUnArchiveServiceTypeSchema
 } from './serviceType/schemas/routerServiceTypeSchema';
import { routerClientOrgHierarchyListSchema, routerCloneClientOrgHierarchySchema } from './orgHierarchy/schemas/routerOrgHierarchySchema';



type OpenApiConfig = {
  openapi: string;
  info: {
    swagger: string;
    version: string;
    title: string;
    description: string;
  };
  servers: {
    url: string;
  }[];
};
export function generateOpenAPIDocument() {
  const openApiConfig = config.get<OpenApiConfig>('openApi');

  const registry = new OpenAPIRegistry();

  registry.registerPath(getAuth);
  registry.registerPath(getAuthCallback);
  registry.registerPath(getAuthHome);
  registry.registerPath(getAuthLogout);
  registry.registerPath(routerClientsSchema);
  registry.registerPath(routerGetClientByIdSchema);
  registry.registerPath(routerCreateClientSchema);
  registry.registerPath(routerCreateChildClientSchema);
  registry.registerPath(infoSchemaGetCountries);
  registry.registerPath(routerGetClientStatusesSchema);
  registry.registerPath(routerCreatePermissionGroupSchema);
  registry.registerPath(routerUpdatePermissionGroupSchema);
  registry.registerPath(routerViewPermissionGroupSchema);
  registry.registerPath(routerViewPermissionGroupListSchema);
  registry.registerPath(routerViewShortPermissionGroupsSchema);
  registry.registerPath(routerEditClientSchema);
  registry.registerPath(routerEditChildClientSchema);
  registry.registerPath(routerGetFunctionalAreaSchema);
  registry.registerPath(routerCreateFunctionalAreasSchema);
  registry.registerPath(routerEditPermissionSchema);
  registry.registerPath(routerAddPermissionSchema);
  registry.registerPath(routerViewPermissionSchema);
  registry.registerPath(routerAddRolePermissionsSchema);
  registry.registerPath(routerCreateHcpProfileSchema);
  registry.registerPath(routerCreateProfileSchema);
  registry.registerPath(routerAddHcpCredentialsSchema);
  registry.registerPath(routerUpdateHcpCredentialsSchema);
  registry.registerPath(routerAddAddressEmailSchema);
  registry.registerPath(routerGetProfilesListSchema);
  registry.registerPath(routerUpdateProfileSchema);
  registry.registerPath(routerGetProfileByIdSchema);
  registry.registerPath(routerListPermissionSchema);
  registry.registerPath(routerFunctionalAreaListSchema);
  registry.registerPath(routerCreateRoleSchema);
  registry.registerPath(routerViewRolesListSchema);
  registry.registerPath(routerViewRoleSchema);
  registry.registerPath(routerEditRoleSchema);
  registry.registerPath(routerEditFunctionalAreaSchema);
  registry.registerPath(routerDeleteFunctionalAreasSchema);
  registry.registerPath(routerParentClientsSchema);
  registry.registerPath(routeClientsDeleteSchema);
  registry.registerPath(routerClientShortListSchema);
  registry.registerPath(routerDeletePermissionsSchema);
  registry.registerPath(routerDeletePermissionGroupsSchema);
  registry.registerPath(routerViewShortPermissionsSchema);
  registry.registerPath(routerViewRolesByPermissionGroupSchema);
  registry.registerPath(routerDeleteRolesSchema);
  registry.registerPath(routerFunctionalAreaRoleListSchema);
  registry.registerPath(routerRolePermissionGroupListSchema);
  registry.registerPath(routerRolePermissionGroupListUnalignedSchema);
  registry.registerPath(routerRoleArchiveSchema);
  registry.registerPath(routerViewRoleShortListSchema);
  registry.registerPath(routerGetDelegateManagerProfileListSchema);
  registry.registerPath(routerCreateChildProfileSchema);
  registry.registerPath(routerUpdateChildProfileSchema);
  registry.registerPath(routergetRolesPermissionSchema);
  registry.registerPath(routerlistbrandcolor);
  registry.registerPath(routerListTheme);
  registry.registerPath(routerGetAuditHistoryListSchema);
  registry.registerPath(routerBulkProfileEditSchema);
  registry.registerPath(infotimeZoneList);
  registry.registerPath(infoLocaleList);
  registry.registerPath(loginHistorySchema);
  registry.registerPath(routerViewMyProfileSchema);
  registry.registerPath(routerViewMyProfileSchema);
  registry.registerPath(routerFunctionalAreaArchiveSchema);
  registry.registerPath(routerCreateTherapeuticAreaSchema);
  registry.registerPath(routerlistTherapeuticAreaSchema);
  registry.registerPath(routerTherapeuticAreaSchemaByID);
  registry.registerPath(routerTherapeuticAreaEditSchema);
  registry.registerPath(routerDeleteTherapeuticAreaSchema);
  registry.registerPath(routerAlignRolePermissionGroupsSchema);
  registry.registerPath(routerGetMenuList);
  registry.registerPath(ImportUserProfileSchema);
  registry.registerPath(routerAddCommunicationPreferenceSchema);
  registry.registerPath(routerUpdateCommunicationPreferenceSchema);
  registry.registerPath(routergetRolesAdditionalDataSchema);
  registry.registerPath(routerRolecategorySchema);
  registry.registerPath(routerRoleCategoryCriteriaAlignmentSchema);
  registry.registerPath(routerViewShortFunctionalAreasSchema);
  registry.registerPath(routerEditRoleCategoryCriteriaAlignmentSchema);
  registry.registerPath(routerArchivePermissionSchema);
  registry.registerPath(routerArchivePermissionGroupSchema);
  registry.registerPath(routerArchiveFilterSchema);
  registry.registerPath(routerViewStatusListSchema);
  registry.registerPath(routerFluentLanguageListSchema);
  registry.registerPath(routerEditHcpProfileSchema);
  registry.registerPath(routerEditRolePermissionsSchema);
  registry.registerPath(routerAddressTypeListSchema);
  registry.registerPath(routerViewProfileStatusListSchema);
  registry.registerPath(routerStateListSchema);
  registry.registerPath(routerEditAndAddAddressEmailSchema);
  registry.registerPath(routerCityListSchema);
  registry.registerPath(routerCountryListSchema);
  registry.registerPath(routerAddVendorSchema);
  registry.registerPath(routerInternationalPrefixSchema);
  registry.registerPath(routerPhoneTypeSchema);
  registry.registerPath(routerVendorTypeListSchema);
  registry.registerPath(routerContactTypeListSchema);
  registry.registerPath(routerViewvendorStatusListSchema);
  registry.registerPath(routerAddVendorVenueCheckListSchema);
  registry.registerPath(routerGetDegreeSchema);
  registry.registerPath(routerGetMedicalLicenseJurisdictionsSchema);
  registry.registerPath(routerGetMedicalLicenseStateSchema);
  registry.registerPath(routerGetMedicalLicenseStatusSchema);
  registry.registerPath(routerGetAffiliationTypeSchema);
  registry.registerPath(routerGetMedicalLicenseTypeSchema);
  registry.registerPath(routerQuestionListSchema);
  registry.registerPath(routerShortQuestionCategoryListSchema);
  registry.registerPath(routerGetSegmentationSchema);
  registry.registerPath(routerGetSpecialtySchema);
  registry.registerPath(routerViewVendorSchema);
  registry.registerPath(routerViewVendorListSchema);
  registry.registerPath(routerVendorMatchListSchema);
  registry.registerPath(routerVendorMeetingRoomListSchema);
  registry.registerPath(routerVendorMeetingRoomListSchema)
  registry.registerPath(routerAddVendorRoomInfoSchema);
  registry.registerPath(routerGetVendorRoomListSchema);
  registry.registerPath(routerGetRoomDetailsByIdSchema);
  registry.registerPath(routerArchiveProfileSchema);
  registry.registerPath(routerGetVendorVenuCheckListSchema);
  registry.registerPath(routerCreateServiceOfferingSchema);
  registry.registerPath(routerEditServiceOfferingSchema);
  registry.registerPath(routerBulkEditServiceOfferingSchema);
  registry.registerPath(routerViewServiceOfferingListSchema);
  registry.registerPath(routerServiceOfferingArchiveSchema)
  registry.registerPath(routerServiceOfferingUnArchiveSchema)
  registry.registerPath(routerGetVendorVenuCheckListSchema);
  registry.registerPath(routerServiceTypeListSchema);
  registry.registerPath(routerServiceTypeListShortSchema);
  registry.registerPath(routerGetWorkItemsSchema)

  registry.registerPath(routerGetVendorVenuCheckListSchema)
  registry.registerPath(routerServiceTypeListSchema)
  registry.registerPath(routerCreateServiceTypeSchema);
  registry.registerPath(routerListWorkItemSchema);
  registry.registerPath(routerServiceTypeWorkItemSchema);
  registry.registerPath(routerEditServiceTypeSchema);
  registry.registerPath(routerViewServiceOfferingSchema);
  
  registry.registerPath(routerArchiveServiceTypeSchema);
  registry.registerPath(routerViewServiceTypeSchema);
  registry.registerPath(routerClientOrgHierarchyListSchema)
  registry.registerPath(routerUnArchiveServiceTypeSchema);
  registry.registerPath(routerCloneClientOrgHierarchySchema)


  const generator = new OpenApiGeneratorV3(registry.definitions);

  const generateDocument = generator.generateDocument(openApiConfig);
  generateDocument.components = {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  };
  return generateDocument;
}
