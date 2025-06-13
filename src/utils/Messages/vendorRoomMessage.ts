export const VENDOR_ROOM_MESSAGES = {
  VENDOR_ROOM_CREATED_SUCCESSFULLY:
    'Vendor Room has been created successfully and added Room Questionnair',
  // ZOD Schema validation messages
  NAME_REQUIRED: 'Name is required',
  RENTAL_FEE_REQUIRED: 'Rental Fee is required',
  NAME_NOT_EMPTY: 'Name cannot be empty',
  RENTAL_FEE_NOT_EMPTY: 'Rental Fee cannot be empty',
  NAME_VALIDATION:
    'Name must start with a letter and contain only letters, spaces, and dashes, no numbers allowed',
  ROOM_NOT_FOUND: (roomId: number) => `Room with id ${roomId} not found.`,
  INVALID_VENDOR_ID: (vendorId: number) =>
    `The following Vendor ID is invalid or do not exists: ${vendorId}`,
  INVALID_QUESTION_ID: (questionId: number) =>
    `The following question is invalid or do not exists: ${questionId}`,
  INVALID_OPTION_IDS: (questionId: number, optionIds: number[]) =>
    `The following Option Id's ${optionIds.join(',')} are invalid for the the Question ${questionId}`,
  CUSTOM_VALUE:(questionId) => `The following Question ID should have a custom value and it won't accept options: ${questionId}`,
  FILE_SIZE_EXCEED: (size: string) =>
    `The Custom File should not exceed ${size}`,
  INVALID_BASE64_FILE: `The Custom file is invalid and it should be a Base64`,
  INVALID_TEXT_LENGTH:(size: string) => `The Custom text should not exceed ${size} characters`,
  INVALID_VALUE_AND_OPTION:(questionOptions: number[]) => `The question requires an option value and does not accept custom values. Please select from the following option IDs: ${questionOptions.join(', ')}.`

};
