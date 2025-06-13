export const PROFILE_MESSAGES = {
  TAG: 'Profiles',
  PROFILE_ADDRESS_SUCCESSFULLY_ADDED: 'Profile Address added successfully',
  EXISTINGDEFAULTADDRESS: `Only one address can be selected as default at any given time for a profile.`,
  EXISTINGDEFAULTEMAIL: `Only one email can be selected as default at any given time for a profile.`,
  PROFILE_HCP_CREDENTIALS_CREATE: `HCP profilecredentials created`,
  PROFILE_HCP_CREDENTIALS_UPDATE: `HCP profilecredentials updated`,
  COMMUNICATION_PREFERENCE_SUCCESSFULLY:
    'Communication preference added successfully',
  PROFILE_NOT_FOUND: (profileId: number) =>
    `Profile with id ${profileId} not found.`,
  PROFILE_ADDRESS_SUCCESSFULLY_UPDATED: `Profile Address and Email has been updated successfully`,
  INVALID_PROFILE_ID: (profileId: number) =>
    `Invalid Profile or Profile with ID ${profileId} does not exist.`,
  INVALID_ROLE_IDS: (roleId: number | undefined) =>
    `Invalid Role or Role with ID ${roleId} does not exist.`,
  INVALID_PROFILE_IDS: (profileIds) =>
    `The following profileId's are invalid or do not exist: ${profileIds.join(', ')}`,

  INVALID_PROFILE_ADDRESS_ID: (addressIds) =>
    `The following Address Id for Profile are invalid or do not exists: ${addressIds.join(',')}`,
  PRIMARY_ADDRESS_ERROR: `Only one Address can be designated as isPrimary for a profile at any given time.`,
  INVALID_PROFILE_EMAIL_ID: (emailIds) =>
    `The following Email Id for Profile are invalid or do not exists: ${emailIds.join(',')}`,
  PRIMARY_EMAIL_ERROR: `Only one Email can be designated as isPrimary for a profile at any given time.`,
  ROUTER_SCHEMA_MESSAGES: {
    ROUTER_ENTRY_DESCRIPTION:
      'In case of creating the internal profile, the employee Id field is required',
    ROUTER_PATH: {
      EDIT_ADDRESS: '/api/v1/profiles/edit_addresses/{profileId}',
    },
    PROFILE_SUMMARY: {
      EDIT_AADRESS: 'Edit and Add Address and Email',
    },
    RESPONSE_DESCRIPTION: {
      EDIT_ADDRESS: 'Address and Email updated successfully',
    },
  },
  PROFILE_CLONED_SUCCESSFULLY: 'Profile cloned and saved successfully.',
  MEDICAL_LICENSE_DATE_ERROR: (
    startDate?: Date | string,
    endDate?: Date | string,
  ): string =>
    `The Medical License ExpiryDate ${endDate} cannot be earlier than Medical License Effective Date ${startDate}`,

  INVALID_HCP_PROFILE_ID: (profileId: number) => {
    return `Invalid HCP Profile or Profile with ID ${profileId} does not exist.`;
  },
  INVALID_SEGMENTATION_ID: (segmentationId: number | undefined) => {
    return `Invalid Segmentation with ID ${segmentationId} does not exist.`;
  },
  PROFILE_ALREADY_HAVE_COMMUNICATION_PREFERENCE: (ids: number) =>
    ` Communication preferences already added for Profile Id: ${ids}.`,
  COMMUNICATION_PREFERENCES_UPDATED_SUCCESSFULLY:
    'Communication Preferences updated successfully',

  COMMUNICATION_PREFERENCES_DO_NOT_EXIST:
    'The Communication Preferences do not exist for this profile.',

  COMMUNICATION_PREFERENCES_ADDED_SUCCESSFULLY:
    'Communication Preferences added successfully',

  PROFILE_ARCHIVED_SUCCESSFULLY: 'Profile has been archived successfully.',
  PROFILE_ALREADY_ARCHIVED: (archivedProfielIds: number[]) =>
    `The following profiles are already archived: ${archivedProfielIds.join(', ')}`,
  PROFILE_EMPLOYEE_ID_EXISTS: (isExternal: boolean,identityId: string) => `There already exists a profile with such ${isExternal ? 'email' : 'employeeId'}: ${identityId}`,
};
