export const PERMISSION_MESSAGES = {
  PERMISSION_CREATED_SUCCESSFULLY: 'Permission was created successfully.',
  PERMISSION_CLONED_SUCCESSFULLY: 'Permission cloned and saved successfully.',
  PERMISSION_ARCHIVED_SUCCESSFULLY:
    'Permission has been archived successfully.',
  PERMISSION_IS_ALREAY_ALIGNED_WITH_THIS_ROLE:
    'This Permission is alreay aligned with this current role',
  INVALID_PERMISSION_IDS: (permissionIds) =>
    `The following permissionIds are invalid or do not exist: ${permissionIds.join(', ')}`,
  PERMISSION_NAME_ALREADY_EXISTS: (name: string) =>
    `Permission with name ${name} already exists.`,
  PERMISSION_ID_NOT_FOUND: (permissionId: number) =>
    `Permission with id ${permissionId} not found.`,
  INACTIVE_PERMISSION_OR_DO_NOT_EXISTS: (inactivePermissionIds: number[] | undefined) =>
    `The following permissions are inactive or do not exist: ${inactivePermissionIds?.join(', ')}`,
  INACTIVE_PERMISSIONGROUP_OR_DO_NOT_EXISTS: (inactivePermissionIds: number[] | undefined) =>
    `The following permissionGroups are inactive or do not exist: ${inactivePermissionIds?.join(', ')}`,
  PERMISSION_NOT_FOUND: 'Permission not found',
  CANNOT_ARCHIVE_ACTIVE_PERMISSIONS: (activePermissionIds: number[]) =>
    `The following permissions are active: ${activePermissionIds.join(', ')}. we can't archive in this status`,
  PERMISSION_ALREADY_ARCHIVED: (archivedPermissionIds: number[]) =>
    `The following permissions are already archived: ${archivedPermissionIds.join(', ')}`,
  PERMISSION_ID_REQUIRED: 'PermissionId is required',
  PERMISSION_UPDATED_SUCCESSFULLY: 'Permission updated successfully.',
  INVALID_MENU_IDS: (ids: number[]) => `Invalid Menu IDs: ${ids.join(', ')}`,
  INVALID_SUB_MENU_IDS: (ids: number[]) =>
    `Invalid Sub Menu IDs: ${ids.join(', ')}`,

  // ZOD Schema validation messages
  NAME_REQUIRED: 'Name is required',
  NAME_NOT_EMPTY: 'Name cannot be empty',
  NAME_VALIDATION:
    'Name must start with a letter or a number and contain only letters, numbers, spaces, and dashes',
  DESCRIPTION_NOT_EMPTY: 'Description cannot be empty',
  DESCRIPTION_REQUIRED: 'Description is required',
  DESCRIPTION_VALIDATION: 'Description must be a string',
  MENU_IDS_VALIDATION: 'Menu IDs must be an array of numbers',
  MENU_ID_TYPE_VALIDATION: 'Each Menu ID must be a number',
  MENU_ID_REQUIRED: 'At least one Menu ID is required',
  SUB_MENU_IDS_VALIDATION: 'Sub Menu IDs must be an array of numbers',
  SUB_MENU_ID_TYPE_VALIDATION: 'Each Sub Menu ID must be a number',
  CLIENT_ID_VALIDATION: 'Client ID must be a number',
  CLIENT_ID_INTEGER: 'Client ID must be an integer',
  CLIENT_ID_NOT_EMPTY: 'Client IDs cannot be empty',
};
