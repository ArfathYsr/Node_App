export const MESSAGES = {
  // AUTH
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  SOMETHING_WENT_WRONG: 'Something went wrong.',
  UNAUTHORIZED: 'Unauthorized access!',
  UNAUTHORIZED_USER: 'Unauthorized user access!',
  PUT: `put`,
  VALIDATTION_ERROR: `Validation Error`,

  // Miscellaneous
  ALREADY_EXIST: 'Already exists',
  SUCCESS: 'Success.',
  EMAIL_ALREADY_EXISTS: 'Email already exists.',
  MOBILE_NUMBER_ALREADY_EXISTS: 'Mobile number already exists',
  INVALID_EMAIL: 'Invalid email address.',
  NOT_FOUND: 'Data not found.',
  NO_RESULT_FOUND: 'No results found.',
  DATA_UPDATED_SUCCESSFULLY: 'Data Updated Successfully',
  DATA_FETCHED_SUCCESSFULLY: 'User Data Fetched Successfully',
  INVALID_STATUS: 'Invalid Status',
  CLONE_ID_REQUIRED: 'CloneId is Required',
  INVALID_START_END_DATE: 'End date cannot be earlier than start date',
  CLIENT_ID_REQUIRED: 'Client Id is Required',
  PARENT_CLIENT_NOT_FOUND: 'Client Id is Required',
  INVALID_ARCHIVED_FILTER_VALUE: `IsArchived filter value is not valid.
  Please provide 1-Include Archived Records, 2-Show All Archived`,
  PARENT_CLIENT_ID_NOT_FOUND: (ids: number) =>
    `Parent client Id ${ids} not found`,
  CLIENT_ID_ALREADY_EXISTS: (ids: number) =>
    `Clients with the following names already exist: ${ids} .`,
  CLIENT_NAME_ALREADY_EXISTS: (name: string) =>
    `Clients with the following names already exist: ${name} .`,
  THERAPEUTIC_AREA_ID_NOT_FOUND: (ids: number[]) =>
    `Therapeutic Area with id ${ids.join(', ')} not found.`,
  INVALID_MENU_IDS: (ids: number[]) => `Invalid Menu IDs: ${ids.join(', ')}`,
  INVALID_SUB_MENU_IDS: (ids: number[]) =>
    `Invalid Sub Menu IDs: ${ids.join(', ')}`,
  INVALID_ID_FORMAT: 'Invalid ids format',
  INVALID_CLONED_ID: (id: number) => `Invalid Clone ID: ${id}`,
  NO_MATCH_FOUND: `No match found for the given uploaded image string.`,
  DEFAULT_TYPE_NOT_FOUND: `The default email type is not found`,
  ALREADY_EXIST_EMAIL: (email: string): string =>
    `There already exists a profile with such email: ${email}`,
  NO_DELEGATE_ID_FOUND: (delegateId: number): string =>
    `There is no profile with id: ${delegateId} to add as a delegate`,
  NO_MANAGER_ID_FOUND: (managerId: number): string =>
    `There is no profile with id: ${managerId} to add as a manager`,
  NO_THEME_ID_FOUND: (interfaceThemeId: number): string =>
    `No theme found with id: ${interfaceThemeId}`,
  INVALID_BRAND_COLOR: (brandColorCode: string): string =>
    `Invalid brand color code: ${brandColorCode}`,
  NO_COLOR_CODE: (brandColorCode: number): string =>
    `No brand color found with id: ${brandColorCode}`,

  ROLE_ID_MUST_BE_A_NUMBER: 'Each role ID must be a number',
  ROLE_ID_MUST_BE_A_INTEGER: 'Each role ID must be a integer',
  FUNCTIONALAREA_ID_MUST_BE_A_NUMBER: 'Each functionalArea ID must be a number',
  FUNCTIONALAREA_ID_MUST_BE_A_INTEGER:
    'Each functionalArea ID must be a integer',
  PERMISSION_ID_MUST_BE_A_NUMBER: 'Each permission ID must be a number',
  PERMISSION_ID_MUST_BE_A_INTEGER: 'Each permission ID must be a integer',
  PERMISSIONGROUP_ID_MUST_BE_A_NUMBER:
    'Each permissionGroup ID must be a number',
  PERMISSIONGROUP_ID_MUST_BE_A_INTEGER:
    'Each permissionGroup ID must be a integer',

  // Common message for the API
  SUBMITTED_SUCCESSFULLY: 'Submitted successfully',
  UPDATED_SUCCESSFULLY: 'Record updated successfully',
  CREATED_SUCCESSFULLY: 'Created successfully',
  ADDED_SUCCESSFULLY: 'Added successfully',
  DELETED_SUCCESSFULLY: 'Deleted successfully',

  // QUERY PARAMETERS
  INVALID_QUERY_PARAMETERS: 'Invalid Query Prameters passed',

  // FILE
  FILE_UPLOADED_SUCCESSFULLY: 'File uploaded successfully',
  INVALID_DOCUMENT: 'Invalid document',
  INVALID_FILE_TYPE: 'Invalid file format, upload correct file format',

  // CLIENTS
  CLIENT_CREATED_SUCCESSFULLY: 'Client created successfully',
  CLIENT_UPDATED_SUCCESSFULLY: 'Client updated successfully',
  CLIENT_DETAILS_GET_SUCCESSFULLY: 'Client details get successfully',
  CLIENT_DELETED_SUCCESSFULLY: 'Clients deleted successfully',
  NOT_FOUND_CLIENTS_IDS: (clientId: number) =>
    `Client with id ${clientId} not found.`,
  NOT_AVAILABLE_IDS_CLIENT: (clientIds) =>
    `Client IDs not found: ${clientIds.join(', ')}`,
  INVALID_CLIENTS_IDS: (clientIds) =>
    `The following clientIds are invalid or do not exist: ${clientIds.join(', ')}`,
  INACTIVE_CLIENTS_OR_DO_NOT_EXISTS: (inactiveClientIds: number[]) =>
    `The following clients are inactive or do not exist: ${inactiveClientIds.join(', ')}`,

  // Profile
  PROFILE_CREATED_SUCCESSFULLY: 'Profile created successfully.',
  PROFILE_FETCHED_SUCCESSFULLY: 'Profile fetched successfully.',
  PROFILE_UPDATE_SUCCESSFULLY: 'Profile updated successfully.',
  USER_CREATED_SUCCESSFULLY: 'User was successfully created.',
  PERMISSION_LIST_SUMMARY: 'Get the Permission List',
  PERMISSION_LIST_RESPONSE: 'Permission List fetched Successfully.',

  // PERMISSION GROUP
  PERMISSION_GROUP_CREATED_SUCCESSFULLY:
    'Permission Group was created successfully.',
  PERMISSION_GROUP_CLONED_SUCCESSFULLY:
    'Permission Group cloned and saved successfully.',
  PERMISSION_GROUP_UPDATED_SUCCESSFULLY:
    'Permission Group updated successfully.',
  PERMISSION_GROUP_ARCHIVED_SUCCESSFULLY:
    'Permission Group has been archived successfully.',
  CANNOT_DELETE_ALIGNED_PERMISSION_GROUP:
    'Unable to delete the permission group because it is currently associated with one or more roles.',
  PERMISSION_GROUP_IS_ALREAY_ALIGNED_WITH_THIS_ROLE:
    'This Permission group is alreay aligned with this current role',
  PERMISSION_GROUP_DETAILS_FETCHED_SUCCESSFULLY:
    'Permission group details retrieved successfully',
  PERMISSION_GROUP_NOT_FOUND: 'Permission group not found',
  TYPE_REQUIRED :'Type is required',
  INVALID_PERMISSION_GROUP_IDS: (ids: number[]) =>
    `The following permissionIds are invalid or do not exist: ${ids.join(', ')}`,
  PERMISSION_GROUP_ID_INVALID: (ids: number[]) =>
    `Invalid PermissionGroup IDs: ${ids.join(', ')}`,
  PERMISSION_GROUP_NAME_ALREADY_EXISTS: (name: string) =>
    `Permission Group with name '${name}' already exists.`,

  // PERMISSION
  INACTIVE_PERMISSION_GROUPS_OR_DO_NOT_EXISTS: (
    inactivePermissionGroupIds: number[],
  ) =>
    `The following permission groups are inactive or do not exist: ${inactivePermissionGroupIds.join(', ')}`,
  CANNOT_ARCHIVE_ACTIVE_PERMISSION_GROUPS: (
    activePermissionGroupIds: number[],
  ) =>
    `The following permission groups are active: ${activePermissionGroupIds.join(', ')}. we can't archive in this status`,
  PERMISSION_GROUP_ALREADY_ARCHIVED: (archivedPermissionGroupIds: number[]) =>
    `The following permission groups are already archived: ${archivedPermissionGroupIds.join(', ')}`,

  // Role
  ROLE_CREATED_SUCCESSFULLY: 'Role was created successfully.',
  ROLE_UPDATED_SUCCESSFULLY: 'Role was updated successfully.',
  ROLE_ARCHIVED_SUCCESSFULLY: 'Role has been archived successfully.',
  ROLE_UNARCHIVED_SUCCESSFULLY: 'Role has been Unarchived successfully.',
  ROLE_CLONED_SUCCESSFULLY: 'Role cloned and saved successfully.',
  ROLE_LIST_RETRIVED_SUCCESSFULLY:
    'The list of available roles has been successfully retrieved from the database.',
  NO_ROLE_TO_LIST: 'No Role to List',
  NO_ROLE_FOUND_FOR_DATE_RANGE: 'No roles found for selected date range',
  START_DATE_ERROR: (
    startDate: Date | string,
    endDate: Date | string,
  ): string =>
    `The endDate ${endDate} cannot be earlier than startDate ${startDate}`,
  END_DATE_ERROR: (today: any, endDate: any): any =>
    `The endDate ${endDate} cannot be earlier than Today's Date ${today.toISOString()}`,
  ROLE_NOT_FOUND: (roleId: number) => `role with id ${roleId} not found.`,
  ROLE_NAME_ALREADY_EXISTS: (name: string) =>
    `Role name ${name} already exists.`,
  ROLE_ACTIVE_DEACTIVE: (roleIds: number[]) =>
    `role id (${roleIds}) was in active. we can't archive in this status.`,
  ROLE_CHECK: (checkRoles: number[]) =>
    `role with id (${checkRoles}) not found..`,
  INACTIVE_ROLES_OR_DO_NOT_EXISTS: (inactiveRoleIds: number[]) =>
    `The following roles are inactive or do not exist: ${inactiveRoleIds.join(', ')}`,
  ROLE_EDIT_ERROR: 'Role cannot edit in ArchiveStatus',

  // Functional Area
  FUNCTIONAL_AREA_CLONED_SUCCESSFULLY: 'Functional Area cloned successfully.',
  FUNCTIONAL_AREA_CREATED_SUCCESSFULLY: 'Functional Area created successfully.',
  FUNCTIONAL_AREA_NAME_ALREADY_EXISTS: (name: string) =>
    `Functional Area with name ${name} already exists.`,
  INVALID_FUNCTIONALAREA_IDS: (functionalAreaIds) =>
    `The following functionalAreaId's are invalid or do not exist: ${functionalAreaIds.join(', ')}`,

  // RoleCategoryCriteria Alignment
  ROLE_CATEGORY_CRITERIA_CREATED_SUCCESSFULLY:
    'Role Category Criteria was created successfully.',
  ROLE_CATEGORY_CRITERIA_UPDATED_SUCCESSFULLY:
    'Role Category Criteria was updated successfully.',
  ROLE_CATEGORY_CRITERIA_VALIDATION_MESSAGE: (count: number) =>
    `All ${count} criteria must have a response of either "yes" or "no".`,
  FUNCTIONAL_AREA_ID_REQUIRED: 'functionalAreaIds is required',
  FUNCTIONAL_AREA_DELETED_SUCCESSFULLY: 'Functional areas deleted successfully',
  FUNCTIONAL_AREA_IDS_NOTFOUND: (missingIds: number[]) =>
    `Functional Area with id (${missingIds.join(', ')}) not found.`,
  FUNCTIONAL_AREA_ID_NOT_FOUND: (functionalAreaId: number) =>
    `Functional Area with id ${functionalAreaId} not found.`,
  FUNCTIONAL_AREA_ARCHIVED_SUCCESSFULLY:
    'Functional Area archived successfully.',
  FUNCTIONAL_AREA_ACTIVE_CANT_ARCHIVE: (
    checkfunctionalAreasDeactivated: number[],
  ) =>
    `Functional Area id (${checkfunctionalAreasDeactivated.join(', ')}) was in active. we can't archive in this status.`,
  ROLE_CATEGORY_CRITERIA_CLONED_SUCCESSFULLY:
    'Role Category Criteria cloned and saved successfully.',
  ROLE_CRITERIA_IDS_ARE_REPEATED: 'Role Criteria Ids are repeated',
  ROLE_CATEGORY_AND_CRITERIA_CREATION_FOR_EXTERNAL_ROLES_ONLY:
    'Role category and criteria creation for external roles only',

  USER_UNAUTHORISED_TO_EDIT:
    'User is unauthorized to edit the requested fields',
  PERMISSION_GROUP_ID_REQUIRED: 'PermissionGroupIds is required',
  DELETED_SUCCESSFULLY_DYNAMIC: (data: string) =>
    `${data} Deleted successfully`,
  PERMISSION_GROUP_ID_NOTFOUND: (data: string) =>
    `Permission Group IDs not found: ${data}`,
  INVALID_CATEGORY_IDS: (ids: number[]) =>
    `Invalid Category IDs: ${ids.join(', ')}`,
  INVALID_CRITERIA_IDS: (ids: number[]) =>
    `Invalid Criteria IDs: ${ids.join(', ')}`,

  // RoleType IsExternal
  ROLE_CATEGORY_IS_EXTERNAL_NOT_SELECTED: `Role Type External is unacceptable.`,
  COMMON_LIST_STATUS_TITLE: 'ListStatusDTO',
  COMMON_LIST_STATUS_DESC: 'Schema for listing status with status IDs as input',
  UPDATEPROFILEROLEPERMISSIONALIGNMENT: `Profile role permission alignment updated successfully`,
  PROFILEROLEPERMISSIONALIGNMENT: `Profile role permission alignment created successfully`,
  EMAIL_REQUIRED: `Email cannot be empty`,
  PROFILE_DESCRIPTION: `The field is required in case the profile is creating for internal user`,
  REQUIRED_FIELD: (field: string) => `${field} is required`,
  NON_EMPTY_FIELD: (field: string) => `${field} cannot be empty`,

  CONTRY_CODE_REQUIRED: `Country code cannot be empty`,
  INVALID_TYPE_ERROR: (field: string, type: string) =>
    `${field} must be a ${type}`,
  VALID_PHONE_NO: `551-264-5857`,
  PHONE_TYPE_NOT_FOUND: (phoneTypeIdsNotFound: string) =>
    `There is no phone type(s) with Id(s): ${phoneTypeIdsNotFound}`,
  INVALID_PHONE_NO: (phoneType: string) =>
    `${phoneType} must be in the format XXX-XXX-XXXX`,

  INVALID_IDS: (ids: number[], propertyName: string) =>
    `${propertyName} Ids not found: ${ids.join(', ')}`,

  FETCHED_DATA_SUCCESSFULLY: 'Retrived data successfully.',
  INVALID_PAGE_NUMBER:
    'Invalid page number. Please enter a page number between 1 and ',

  // vendor
  VENDOR_VENUE_CHECKLIST_CREATED_SUCCESSFULLY:
    'Vendor venue checklist created successfully.',
  BASE64_VALIDATION_ERROR: (id: number) =>
    `Custom value for question ID ${id} is not a valid base64 image.`,
  INVALID_OPTION_IDS: "Invalid OptionIds Id's",

  // LookupData
  NO_QUESTIONS_EXIST: (questionCategoryId) =>
    `No questions exist for the Question Category: ${questionCategoryId}`,
  // HCP_Bio & Profession
  SELECTED_PROFILE_IS_ALREADY_EXIST_IN_HCP_BIO_PROFESSION:
    'The selected profile already exists in HCP Bio & Profession.',

   COMMUNICATION_PREFERENCE_ALREADY_EXIST_FOR_PROFILE:
    'The selected profile already has communication preference.',  

  INVALID_PROFILE_IDS: (ids: number) => `Invalid Profile IDs: ${ids}`,
    VENDOR_ROOM_LIST_CREATED_SUCCESSFULLY:
    'Vendor room list created successfully.',
  VENDOR_ID: (id: number) => `Vendor Id : ${id} not found`,
  VENDOR_ROOM_LIST: 'Vendor room listed successfully ',
  VENDOR_VENUE_DETAILS_FETCHED_SUCCESSFULLY: 'Vendor venue details fetched successfully',
  VENDOR_VENUE_NOT_FOUND : (id : number )=>  `There is no Vendor Venue data's for ${id}`,
  //THERAPEUTIC_AREA
  THERAPEUTIC_AREA_LIST : 'Therapeutic area list fetched successfully',
  PRODUCT_LIST_FETCHED_SUCCESSFULLY : 'Product list fetched successfully',
  
  // SERVICE OFFERING
  SERVICE_OFFERING_NOT_FOUND: (ids: number[]) =>
    `Service Offering with id (${ids}) not found..`,
  SERVICE_OFFERING_DEACTIVATED: (ids: number[]) =>
    `Service Offering id (${ids}) was in active. we can't archive in this status.`,
  SERVICE_OFFERING_ARCHIVED_SUCCESSFULLY: 'Service Offering has been archived successfully.',
  SERVICE_OFFERING_UNARCHIVED_SUCCESSFULLY:'Service Offering has been unarchived successfully.',
  SERVICE_OFFERING_ALREADY_ARCHIVED:  (ids: number[]) =>
    `Service Offering id (${ids}) was already archived.`,
  SERVICE_OFFERING_ALREADY_UN_ARCHIVED:  (ids: number[]) =>
    `Service Offering id (${ids}) was already unarchived.`,
};

export const ERROR_MESSAGES = {
  STATUS_REQUIRED: 'status field is required.',
  DATABASE_ERROR: 'Database error.',
  INVALID_SORTBY:'Invalid sortBy parameter. Use updatedBy instead.',
  INTERNAL_SERVER_ERR: 'Internal server error.',
  UNAUTHORIZED_ERR: 'Unauthorized',
  VALIDATION_ERROR: 'Validation Error',
};


export const SERVICE_OFFERING_ERROR_MESSAGES = {
  INVALID_IDS: (missingServiceOfferings: number[], missingServiceTypes: number[]): string => 
    `Validation failed: Some provided IDs are invalid or do not exist in the databas:
      ${missingServiceOfferings.length ? `- Invalid ServiceOffering IDs: ${missingServiceOfferings.join(', ')}` : ''}
      ${missingServiceTypes.length ? `- Invalid ServiceType IDs: ${missingServiceTypes.join(', ')}` : ''}`.trim()
};
