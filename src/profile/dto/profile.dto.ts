import { profile, email, phone } from '@prisma/client';
import {
  FilterOptions,
  PaginationOptions,
  PostBodySortOptions,
} from '../../types/api';

export type CreateProfileDto = {
  profileStatusId: boolean;
  firstName: string;
  lastName: string;
  userName: string;
  middleName?: string;
  preferredName?: string;
  title?: string;
  sapIntegration: boolean;
  isExternal: boolean;
  email: string;
  clientId?: number;
  internalMasterId?: number;
  externalMasterId?: string;
  sapVendorId?: string;
  managerId?: number | null;
  delegateId?: number | null;
  federationId?: string | null;
  employeeId?: number;
  createdBy: number;
  startDate?: string | null;
  endDate?: string | null;
  roleIds: number[];
  interfaceThemeId: number;
  brandColorCodeId: number  
  clientIds: number[];
};

export type CreateProfileToDbDto = {
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  title?: string;
  profileStatusId: boolean;
  sapIntegration: boolean;
  isExternal: boolean;
  email: string;
  clientId?: number;
  internalMasterId?: number;
  externalMasterId?: string;
  sapVendorId?: string;
  managerId?: number | null;
  delegateId?: number | null;
  identityId: string;
  federationId?: string | null;
  emailTypeId: number;
  createdBy: number;
  roleIds: number[];
  startDate?: string | null;
  endDate?: string | null;
  interfaceThemeId: number;
  brandColorCodeId: number 
   clientIds: number[];
  fullName: string;
};

export type CommunicationPreferencesRequestDto = {
  profileId: number;
  phoneTypeId: number;
  internationalPrefix: number;
  phoneNumber: string;
  phoneNumberExtension?: string;
  faxNumber?: string;
  bestCallDay?: number[];
  bestCallTime?: number[];
  bestEmailDay?: number[];
  bestEmailTime?: number[];
  bestSmsDay?: number[];
  bestSmsTime?: number[];
  createdBy: number;
};

export type CommunicationPreferencesResponseDto = {
  id: number;
  profileId: number;
  phoneTypeId: number;
  internationalPrefixId: number;
  phoneNumber: string;
  phoneNumberExtension?: string | null;
  faxNumber?: string | null;
  createdBy: number;
  communicationPreferenceId?: number;
};

export type CreateProfileResponseDto = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  profileStatus: ProfileStatus;
  firstName: string;
  lastName: string;
  userName?: string | null;
  middleName: string | null;
  preferredName: string | null;
  title: string | null;
  sapIntegration: boolean;
  isExternal: boolean;
  internalMasterId: number | null;
  externalMasterId: string | null;
  sapVendorId: string | null;
  federationId?: string | null;
  clientId: number | null;
  managerId: number | null;
  delegateId: number | null;
  identityId: string | null;
};

export type GetProfileListRequestDto = PostBodySortOptions &
  PaginationOptions &
  FilterOptions & {
    startDate?: Date | null;
    endDate?: Date | null;
    searchText?: string;
  };

export type GetProfilesListResponseDto = {
  profiles: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
    preferredName: string | null;
    title: string | null;
    profileStatusId: number;
    profileStatusName: string;
    isExternal: boolean;
    clientId: number | null;
    internalMasterId: number | null;
    externalMasterId: string | null;
    managerId: number | null;
    delegateId: number | null;
    sapVendorId: string | null;
    sapIntegration: boolean;
    identityId: string | null;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date | null;
    endDate: Date | null;
    createdBy: number;
    updatedBy: number;
    archivedAt: Date | null;
    permissionGroupsCount: number;
    createdByProfile: {
      firstName: string;
      lastName: string;
    } | null;
    updatedByProfile: {
      firstName: string;
      lastName: string;
    } | null;
    email: {
      id: number;
      isActive: boolean;
      emailAddress: string;
      emailAddressTypeId: number;
      correspondance: boolean;
    }[] | null;
    phone: {
      id: number;
      isActive: boolean;
      countryCode: string;
      phoneNumber: string;
      phoneTypeId: number;
      correspondance: boolean;
    } | null;
    role: {
      id: number;
      status: number;
      name: string;
      description: string;
      isExternal: boolean;
    };
    profileThemes: {
      id: number;
      brandColorCodeId: number     
      interfaceTheme: {
        id: number;
        themeName: string;
        themeImageUrl: string;
      };
    } | null;
  }[];
  totalAmount: number;
};

export type UpdateProfileDto = Omit<CreateProfileDto, 'createdBy' | 'email'> & {
  id: number;
  updatedBy: number;
  email?: string | undefined;
};

export type UpdateProfileToDbDto = Omit<
  CreateProfileToDbDto,
  'createdBy' | 'emailTypeId' | 'email' | 'identityId'
> & {
  id: number;
  updatedBy: number;
  emailId: number;
  email?: string | undefined;
  identityId?: string | undefined;
  
};

export type UpdateProfileEmailPhoneRoleResponseDto =
  CreateProfileResponseDto & {
    email: {
      id: number;
      createdAt: Date;
      createdBy: number;
      updatedAt: Date;
      updatedBy: number;
      isActive: boolean;
      profileId: number;
      emailAddress: string;
      emailAddressTypeId: number;
      correspondance: boolean;
    }[];
    phone: {
      id: number;
      createdAt: Date;
      createdBy: number;
      updatedAt: Date;
      updatedBy: number;
      isActive: boolean;
      profileId: number;
      countryCode: string;
      phoneNumber: string;
      phoneTypeId: number;
      correspondance: boolean;
    }[];
    role:
      | {
          id: number;
          name: string;
          description: string | null;
          isExternal: boolean;
          startDate: Date | null;
          endDate: Date | null;
          statusId: number;
        }[]
      | null;
  };

export type ProfileByIdResponseDto = CreateProfileResponseDto & {
  email: {
    id: number;
    isActive: boolean;
    profileId: number;
    emailAddress: string;
    emailAddressTypeId: number;
    correspondance: boolean;
  };
  phone: {
    id: number;
    isActive: boolean;
    profileId: number;
    countryCode: string;
    phoneNumber: string;
    phoneTypeId: number;
    correspondance: boolean;
  } | null;
};

export type DelegateManagerListDataToDbDto = {
  offset: number;
  limit: number;
  searchText?: string;
};

export type DelegateManagerListResponseDto = {
  profiles: {
    id: number;
    firstName: string;
    lastName: string;
  }[];
};

export type CreateChildProfileRequestDto = {
  internalMasterId: number;
  clients: Array<{
    clientId: number;
    startDate?: string | null;
    endDate?: string | null;
  }>;
  createdBy: number;
  updatedBy: number;
};

export type CreateChildProfileDto =
  | Array<{
      profileId: number;
      clientId: number;
      startDate?: string | null;
      endDate?: string | null;
      createdBy: number;
      updatedBy: number;
    }>
  | [];

export type CreateChildProfileReponseDto = CreateProfileResponseDto & {
  childProfiles: Array<{
    profileId: number;
    clientId: number;
    startDate?: string | null;
    endDate?: string | null;
    createdBy: number;
    updatedBy: number;
  }>;
};

export type UpdateMyProfileBodyDto = {
  firstName: string;
  lastName: string;
  middleName: string | null;
  preferredName: string | null;
  title: string | null;
  id: number;
  updatedBy: number;
  clientIds: number[];
  startDate?: Date | null;
  endDate?: Date | null;
};
export interface UpdatedProfile {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  profileStatusId: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  preferredName: string | null;
  title: string | null;
  sapIntegration: boolean;
  isExternal: boolean;
  internalMasterId?: number | null;
  externalMasterId?: string | null;
  sapVendorId?: string | null;
  clientId?: number | null;
  managerId?: number | null;
  delegateId?: number | null;
  identityId?: string | null;
  federationId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface EditBulkProfileBodyDto {
  profileId: number[];
  functionalAreaId?: number;
  roleId?: number;
  permissionsId?: number;
  permissionGroupsId?: number;
  timezoneId?: number;
  localeId?: number;
  type?: boolean;
  startDate?: string | null;
  endDate?: string | null;
}
export interface EditBuilkProfileResponseDto {
  count: number;
  message: string;
}
export interface LoginDetails {
  loginDetails: {
    id: number;
    browserName: string | null;
    device: string | null;
    profileId: number;
    applicationName: string | null;
    duration: Date | null;
    loggedinAt: Date;
    isLoginSuccess: boolean;
    loginUrl: string | null;
    sourceIp: string | null;
    country: string | null;
  }[];
  exportPath?: string | null;
}

export type ProfileData = {
  firstName: string;
  lastName: string;
  middleName: string | null;
  preferredName: string | null;
  title: string | null;
  profileRole: ProfileRole[];
} | null;

export type ProfileRole = {
  role: Role;
};

export type Role = {
  name: string;
  rolePermissionGroup: RolePermissionGroup[];
  rolePermission: RolePermission[];
};

export type RolePermissionGroup = {
  permissionGroup: PermissionGroup;
};

export type RolePermission = {
  permission: Permission;
};

export type PermissionGroup = {
  id: number | string;
  name: string;
};

export type Permission = {
  id: number | string;
  name: string;
};
export type FormattedProfileData = {
  firstName: string;
  middleName: string | null;
  lastName: string;
  preferredName: string | null;
  title: string | null;
  roleDetails: RoleDetail[];
  clientDetails: ClientsDto[];
} | null;

export type RoleDetail = {
  role: string;
  permissions: Permission[];
  permissionGroups: PermissionGroup[];
};
export type ProfileTheme = {
  id: number;
  profileId: number;
  interfaceThemeId: number | null;
  brandColorCodeId: number | null;
  createdBy: number;
  updatedBy: number;
};

export interface ProfileResponseDto {
  profile: ProfileDto;
  email: EmailDto[];
  phone: PhoneDto[];
  role: RoleDto[];
  theme: ProfileTheme;
  clients: ClientsDto[];
}
export interface ProfileClient {
  id: number;
  profileId: number;
  clientId: number;
  startDate: Date | null;
  endDate: Date | null;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientsDto {
  id: number;
  profileId: number;
  clientId: number;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
}

export interface ProfileDto {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  profileStatusId?: number | ProfileStatus;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  preferredName?: string | null;
  title?: string | null;
  sapIntegration?: boolean;
  isExternal?: boolean;
  internalMasterId?: number | null;
  externalMasterId?: string | null;
  sapVendorId?: string | null;
  federationId?: string | null;
  clientId?: number | null;
  managerId?: number | null;
  delegateId?: number | null;
  identityId?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
}

export interface EmailDto {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  isActive: boolean;
  profileId: number;
  emailAddress: string;
  emailAddressTypeId: number;
  correspondance: boolean;
}

export interface PhoneDto {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  isActive: boolean;
  profileId: number;
  countryCode: string;
  phoneNumber: string;
  phoneTypeId: number;
  correspondance: boolean;
}

export interface RoleDto {
  id: number;
  statusId: number;
  name: string;
  description: string;
  isExternal: boolean;
}

export interface ImportUserProfileDto {
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  phoneNumber?: string;
  userName?: string;
  delegateUser?: string;
  delegateId?: number;
  functionalArea?: string;
  functionalAreaIds?: number[];
  role?: string;
  roleIds?: number[];
  permission?: string;
  permissionIds?: number[];
  permissionGroup?: string;
  permissionGroupIds?: number[];
  timeZone?: string;
  timezoneId?: number;
  locale?: string;
  localeId?: number;
  isSuccess: boolean;
  updatedBy: number;
  importProfileFileNameId: number;
  emailId?: number;
  id: number;
  phoneId?: number;
  relayChangesField?: string;
  identityId?: string | null;
}

export interface ImportUserProfileResponseDto {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  status?: string;
}

export interface ImportUserProfileResponseData{
data:{
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  status?: string;
}[]
  totalCreatedRecords: number,
  totalUpdatedRecords: number,
}

export interface UserInfoResponseDto {
  id?: number;
  role?: string;
  functionalArea?: string;
  permission?: string;
  permissionGroup?: string;
}

export interface ImportChildUserProfileDto {
  firstName: string;
  lastName: string;
  preferredName?: string;
  email?: string;
  phoneNumber?: string;
  delegateUser?: string;
  functionalArea?: string;
  role?: string;
  permission?: string;
  permissionGroup?: string;
  timeZone?: string;
  locale?: string;
  updatedBy: number;
  emailId?: number;
  phoneId?: number;
  identityId?: string | null;
  fileName: string;
}

export interface LocaleDto {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
}

export type ListBrandColorResponse = Array<{
  id: number;
  colorCode: string;
}>;

export type ListThemeResponse = Array<{
  id: number;
  themeImageUrl: string;
  themeName: string;
}>;

export type InterfaceThemeDTO = {
  id: number;
  themeName: string;
  themeImageUrl: string;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;
};

export type BrandColorDTO = {
  id: number;
  colorCode: string;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;
};

export type LoginDetailsDto = {
  id: number;
  profileId: number;
  applicationName?: string;
  browserName?: string;
  device?: string;
  duration?: Date;
  loggedinAt: Date;
  isLoginSuccess: boolean;
  loginUrl?: string;
  sourceIp?: string;
  country?: string;
};

export type DefaultEmailType = { id: number } | null;

export type CreateHcpProfileReturnType = profile & {
  email: email[];
  phone: phone[];
};

export type CreateHcpProfileDto = {
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  title?: string;
  photo?: string | '';
  sapIntegration: boolean;
  isExternal: boolean;
  email: string;
  masterProfileId?: string | null;
  clientId: number | null;
  clientIds?: number[] | null;
  internalMasterId?: number;
  externalMasterId?: string;
  sapVendorId?: string;
  managerId?: number;
  delegateId?: number;
  employeeId?: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  startDate?: string | null;
  endDate?: string | null;
  roleIds: number[];
  oneKeyId: string;
  veevaId: string;
  ocePersonalId: string;
  centrisId: string;
  isSpeaker: boolean;
  salutation?: string | null;
  suffix?: string | null;
  assistantName?: string | null;
  assistantEmail?: string | null;
  phone: PhoneDto[] | null;
  timezoneId?: number | null;
  localeId?: number | null;
  languageIds?: number[] | null;
  type?: string;
  cloneId?: number;
};

export type CreateHcpProfileToDbDto = {
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  title?: string;
  sapIntegration: boolean;
  isExternal: boolean;
  email: string;
  masterProfileId?: string | null;
  clientId: number | null;
  clientIds?: number[] | null;
  internalMasterId?: number;
  externalMasterId?: string;
  sapVendorId?: string;
  managerId?: number;
  delegateId?: number;
  identityId: string;
  emailTypeId: number;
  createdBy: number;
  roleIds: number[];
  startDate?: string | null;
  endDate?: string | null;
  oneKeyId: string;
  veevaId: string;
  ocePersonalId: string;
  centrisId: string;
  isSpeaker: boolean;
  salutation?: string | null;
  suffix?: string | null;
  assistantName?: string | null;
  assistantEmail?: string | null;
  phone: PhoneDto[] | null;
  timezoneId?: number | null;
  localeId?: number | null;
  languageIds?: number[] | null;
  createdAt: Date;
  updatedAt: Date;
};

export interface HcpProfileResponse {
  hcpProfile: {
    id: number;
    photo: string;
  };
}
export type CheckExistingIdsDto = {
  id: number;
} | null;
export interface CreateProfileRolePermissionAlignmentDto {
  profileId: number;
  roleId?: number;
  functionalAreaIds?: number[];
  permissionIds?: number[];
  permissionGroupIds?: number[];
  createdBy: number;
  updatedBy: number;
}

export type EditHcpProfileDto = {
  profileId: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  preferredName?: string;
  title?: string;
  photo?: string | '';
  sapIntegration: boolean;
  isExternal: boolean;
  email: string;
  masterProfileId?: string | null;
  clientIds?: number[] | null;
  internalMasterId?: number;
  externalMasterId?: string;
  sapVendorId?: string;
  managerId?: number;
  delegateId?: number;
  employeeId?: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  startDate?: string | null;
  endDate?: string | null;
  roleIds: number[];
  oneKeyId: string;
  veevaId: string;
  ocePersonalId: string;
  centrisId: string;
  salutation?: string | null;
  suffix?: string | null;
  assistantName?: string | null;
  assistantEmail?: string | null;
  phone: PhoneDto[] | null;
  timezoneId?: number | null;
  localeId?: number | null;
  languageIds: number[] | null;
  emailTypeId: number;
  profileStatusId: number;
  clientProfileId?: number;
};

export interface EditHcpProfileResponse {
  hcpProfile: {
    id: number;
    photo: string;
  };
}
export interface EditProfileRolePermissionAlignmentDto {
  profileId: number;
  roleIds?: number[];
  functionalAreaIds?: number[];
  permissionIds?: number[];
  permissionGroupIds?: number[];
  createdBy: number;
  updatedBy: number;
}
export type AddAddressAndEmailRequestDto = {
  createdBy: number;
  updatedBy: number;
  profileId: number;
  addresses: {
    addressTypeId: number;
    address: string;
    emailAddress: string;
    cityId: number;
    stateId: number;
    zipcode: string;
    poBox: string;
    isActive: boolean;
    isPrimary: boolean;
    timeZoneId: number;
    localeId: number;
  }[];
  emails?: {
    profileId: number;
    emailAddress: string;
    isPrimary: boolean;
  }[];
};

export type ProfileEmail = {
  emailAddress: string;
  isPrimary: boolean;
};

export type ProfileEmailAddress = {
  id: number;
  profileId: number;
  emailAddress: string;
  isPrimary: boolean;
  updatedBy: number;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProfileAddressDetails = {
  profileId: number;
  addressTypeId: number;
  address: string;
  cityId: number;
  stateId: number;
  zipcode: string;
  isPrimary: boolean;
  isActive: boolean;
  poBox: string | null;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
};

export type ProfileStatus = {
  id: number;
  statusName: string;
};
export interface HcpCredentialsAddressDto {
  addressTypeId: number;
  address: string;
  cityId: number;
  stateId: number;
  zipcode: string;
  isActive: boolean;
  isPrimary: boolean;
}

export interface BioProfessionalCredentials {
  id: number;
  profileId: number;
  stateLicence: string;
  stateLicenceNumber: string;
  stateLicenceExpiryDate: Date;
  npi: string;
  decile: string;
  institutionalReference: string;
  npiTaxonomy: string;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateHcpBioProfessionRequestDTO = {
  profileId: number;
  roleId?: number;
  primaryDegreeId: number;
  secondaryDegreeId?: number;
  medicalLicenseJurisdictionsId: number;
  medicalLicenseNumber: string;
  medicalLicenseEffectiveDate: Date;
  medicalLicenseExpiryDate: Date;
  medicalLicenseTypeId: number;
  medicalLicenseStatusId: number;
  medicalLicenseStateId: number;
  segmentationId?: number;
  affiliationTypeId?: number;
  affliliationName?: string;
  primarySpecialtyId: number;
  secondarySpecialtyId?: number;
  npi?: string;
  academicInstitutionTitle?: string;
  isVAorDoD?: boolean;
  isGovernmentEmployee?: boolean;
  isHcpPrescriber: boolean;
  isMedicalSpeaker?: boolean;
  isMedicalFellow?: boolean;
  createdBy: number;
  updatedBy: number;
};

export type UpdateHcpCredentialsRequestDto = {
  profileId: number;
  roleId?: number;
  primaryDegreeId: number;
  secondaryDegreeId?: number;
  medicalLicenseJurisdictionsId: number;
  medicalLicenseNumber: string;
  medicalLicenseEffectiveDate: Date;
  medicalLicenseExpiryDate: Date;
  medicalLicenseTypeId: number;
  medicalLicenseStatusId: number;
  medicalLicenseStateId: number;
  segmentationId?: number;
  affiliationTypeId?: number;
  affliliationName?: string;
  primarySpecialtyId: number;
  secondarySpecialtyId?: number;
  npi?: string;
  academicInstitutionTitle?: string;
  isVAorDoD?: boolean;
  isGovernmentEmployee?: boolean;
  isHcpPrescriber: boolean;
  isMedicalSpeaker?: boolean;
  isMedicalFellow?: boolean;
  createdBy: number;
  updatedBy: number;
};

export type ProfileDetailsResponseDto = ProfileNameAndContactInfoDto & {
  profileClient: ProfileClientInfoDto[];
  createdByProfile: ProfileNameInfoDto;
  updatedByProfile: ProfileNameInfoDto;
  profileStatus: ProfileStatus;
  profileEmailAddress: ProfileEmailAddressDto[];
  profileAddressDetails: ProfileAddressDetailsDto[];
  timeZone: TimeZoneDto | null;
  locale: LocaleDetailsDto | null;
  profileFluentLanguages: ProfileFluentLanguages[];
  profileFunctionalArea: ProfileFunctionalAreaDto[];
  profileRole: ProfileRoleDto[];
  profilePermission: ProfilePermission[];
  profilePermissionGroup: ProfilePermissionGroup[];
  hcpBioProfessional: HcpBioProfessional[];
  loginDetails: ProfileLoginDetailsDto[];
  profileSegmentation: { segmentation: { id: number; name: string } }[];
};

export type HcpBioProfessional = {
  primaryDegree: { id: number; name: string };
  secondaryDegree?: { id: number; name: string } | null;
  medicalLicenseNumber: string;
  medicalLicenseEffectiveDate: Date;
  medicalLicenseExpiryDate: Date;
  medicalLicenseJurisdictions: { id: number; name: string };
  medicalLicenseType: { id: number; name: string };
  medicalLicenseStatus: { id: number; name: string };
  affiliationType?: { id: number; name: string } | null;
  affiliationName?: string | null;
  primarySpecialty: { id: number; name: string };
  secondarySpecialty?: { id: number; name: string } | null;
  npi?: string | null;
  academicInstitutionTitle?: string | null;
  isVAorDoD?: boolean | null;
  isGovernmentEmployee?: boolean | null;
  isHcpPrescriber: boolean;
  isMedicalFellow?: boolean | null;
  isMedicalSpeaker?: boolean | null;
  stateLicenseNumber?: string | null;
  stateLicenseExpiry?: Date | null;
};
export type ProfileNameAndContactInfoDto = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  preferredName: string | null;
  title: string | null;
  sapIntegration: boolean;
  isExternal: boolean;
  internalMasterId?: number | null;
  externalMasterId?: string | null;
  sapVendorId: string | null;
  clientId: number | null;
  managerId: number | null;
  delegateId: number | null;
  identityId: string | null;
  federationId: string | null;
  startDate: Date | null;
  endDate: Date | null;
  timezoneId: number | null;
  localeId: number | null;
  userName: string | null;
  archivedAt: Date | null;
  masterProfileId: string | null;
  salutation: string | null;
  suffix: string | null;
  assistantName: string | null;
  assistantEmail: string | null;
  oneKeyId: string | null;
  veevaId: string | null;
  photo: string | null;
  ocePersonalId: string | null;
  centrisId: string | null;
  isSpeaker: boolean;
  businessPhone: string | null;
  assistantPhone: string | null;
  mobilePhone: string | null;
  oceDigitialId: string | null;
};

interface ProfileClientInfoDto {
  client: {
    id: number;
    name: string;
    startDate: Date | null;
    endDate: Date | null;
    clientStatus : {
       name : string 
    }
  };
}

interface ProfileNameInfoDto {
  firstName: string;
  lastName: string;
}

interface ProfileEmailAddressDto {
  id: number;
  emailAddress: string;
  isPrimary: boolean;
}

interface ProfilePhoneInfoDto {
  id: number;
  phoneType: {
    id: number;
    name: string;
  };
  internationalPrefix: {
    id: number;
    name: string;
  };
  phoneNumber: string;
  phoneNumberExtension: string | null;
  faxNumber: string | null;
}
interface ProfileAddressDetailsDto {
  address: string;
  stateId : number ;
  cityId : number ; 
  zipcode: string;
  poBox: string | null;
  emailAddress: string | null;
  addressTypeId: number;
  isActive: boolean;
}

interface ProfileFluentLanguages {
  fluentLanguages: {
    id: number;
    name: string;
  };
}

interface ProfileFunctionalAreaDto {
  id: number;
  profileId: number;
  functionalAreaId: number;
  functionalArea: {
    id: number;
    name: string;
  };
}

interface ProfileRoleDto {
  id: number;
  profileId: number;
  roleId: number;
  role: {
    id: number;
    name: string;
  };
}

interface ProfilePermission {
  id: number;
  profileId: number;
  permissionId: number;
  permission: {
    id: number;
    name: string;
    startDate: Date | null;
    endDate: Date | null;
    description: string;
  };
}

interface ProfilePermissionGroup {
  id: number;
  profileId: number;
  permissionGroupId: number;
  permissionGroup: {
    id: number;
    name: string;
    startDate: Date | null;
    endDate: Date | null;
    description: string;
  };
}

interface TimeZoneDto {
  id: number;
  name: string;
}

interface LocaleDetailsDto {
  id: number;
  name: string;
}

interface ProfileLoginDetailsDto {
  id: number;
  browserName: string | null;
  device: string | null;
  applicationName: string | null;
  duration: Date | null;
  loggedinAt: Date;
  isLoginSuccess: boolean;
  loginUrl: string | null;
  sourceIp: string | null;
  country: string | null;
}

export type EditAndAddAddressAndEmailRequestDto = {
  profileId: number;
  addresses: {
    addressTypeId: number;
    address: string;
    emailAddress: string;
    cityId: number;
    stateId: number;
    zipcode: string;
    poBox: string;
    isActive: boolean;
    isPrimary: boolean;
    timeZoneId: number;
    localeId: number;
  }[];
  emails?: {
    emailAddressId?: number;
    emailAddress: string;
    isPrimary: boolean;
  }[];
  updatedBy: number;
  createdBy: number;
};

export type ExistingAddressesAndEmailForProfileDto = {
  id: number;
  profileId: number;
  isPrimary: boolean;
}[];

export type ProfileSegmentationResponseDto = {
  id: number;
  segmentationId: number;
  profileId: number;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;
} | null;

export type CreateHcpBioProfessionResponseDTO = {
  id: number;
  profileId: number;
  roleId: number | null;
  primaryDegreeId: number;
  secondaryDegreeId: number | null;
  medicalLicenseJurisdictionsId: number;
  medicalLicenseNumber: string;
  medicalLicenseEffectiveDate: Date;
  medicalLicenseExpiryDate: Date;
  medicalLicenseTypeId: number;
  medicalLicenseStatusId: number;
  medicalLicenseStateId: number | null;
  affiliationTypeId: number | null;
  affiliationName: string | null;
  primarySpecialtyId: number;
  secondarySpecialtyId: number | null;
  npi: string | null;
  academicInstitutionTitle?: string | null;
  academicInstitutionName?: string | null;
  isVAorDoD: boolean | null;
  isGovernmentEmployee: boolean | null;
  isHcpPrescriber: boolean;
  isMedicalFellow: boolean | null;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;
  
};
export type HcpBioProfessionresponseDto = {
  id: number;
  profileId: number;
  roleId: number | null;
  primaryDegreeId: number;
  secondaryDegreeId: number | null;
  medicalLicenseJurisdictionsId: number;
  medicalLicenseNumber: string;
  medicalLicenseEffectiveDate: Date;
  medicalLicenseExpiryDate: Date;
  medicalLicenseTypeId: number;
  medicalLicenseStatusId: number;
  medicalLicenseStateId: number | null;
  affiliationTypeId: number | null;
  affiliationName: string | null;
  primarySpecialtyId: number;
  secondarySpecialtyId: number | null;
  npi: string | null;
  academicInstitutionTitle?: string | null;
  academicInstitutionName?: string | null;
  isVAorDoD: boolean | null;
  isGovernmentEmployee: boolean | null;
  isHcpPrescriber: boolean;
  isMedicalFellow: boolean | null;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;
  profileSegmentation: ProfileSegmentationResponseDto
}
export type HcpBioProfessionDTO = Omit<
  CreateHcpBioProfessionRequestDTO,
  'segmentationId'
>;

export type ArchiveProfileRequestDto = {
  profileIds: Array<number>;
};

export type ArchiveProfileResponseDto = {
  status: number;
  message: string;
};

export type CheckArchiveProfileDto = {
  id: number;
  archivedAt: Date | null;
}[];

export type GetProfileNameReq = {
  profileIds: number[]
}
export type GetProfileNameRes = {
  id: number;
  firstName: string;
  lastName: string;
}[]
