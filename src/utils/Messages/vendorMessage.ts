export const VENDOR_MESSAGES = {
  VENDOR_CREATED: 'Vendor created successfully',
  EXISTINGDEFAULTADDRESS: `Only one address can be selected as default at any given time for a profile.`,
  VENDOR_ALREADY_EXISTS: 'Vendor with this name already exists.',
  // ZOD Schema validation messages
  NAME_REQUIRED: 'Name is required',
  NAME_NOT_EMPTY: 'Name cannot be empty',
  NAME_VALIDATION:
    'Name must start with a letter and contain only letters, spaces, and dashes, no numbers allowed',
  DESCRIPTION_NOT_EMPTY: 'Description cannot be empty',
  DESCRIPTION_REQUIRED: 'Description is required',
  DESCRIPTION_VALIDATION: 'Description must be a string',
  CLIENT_ID_VALIDATION: 'Client ID must be a number',
  CLIENT_ID_INTEGER: 'Client ID must be an integer',
  CLIENT_ID_NOT_EMPTY: 'Client IDs cannot be empty',
  REQUIRED_FIELD: 'Required Field',
  VENDOR_NOT_FOUND: (vendorId: number) =>
    `Vendor with id ${vendorId} not found.`,
  LIST_SUMMARY: 'Route to get vendor list',
  LIST_RESPONSE_DESCRIPTION: 'Vendor list fetched successfully',
  NO_DATA_FOUND: 'No data found for the selected criteria',
};
