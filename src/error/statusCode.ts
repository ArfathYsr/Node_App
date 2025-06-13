// Define and export all status codes and their corresponding messages
const StatusCodes = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

const StatusMessages = {
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  CONFLICT: 'Conflict',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  PERMISSION_GROUP_NOT_FOUND: 'Permission group ids not found.',
  INVALID_INPUT: 'Invalid input provided.',
  INVALID_SERVICEID_FORMAT: 'Invalid Service Offering ID format.',
  USER_NOT_AUTHORIZED: 'User is not authorized to perform this action.',
  PROFILE_ID_MISSING: 'Profile ID is missing from the request.',
  SERVICE_OFFERING_ID_MISSING: 'Service Offering ID is missing in the request parameters.',
  SERVICE_TYPE_DATA_IS_MISSING: 'Service Type Data is missing from the request body.',
  SERVICE_OFFERING_ID_REQUIRED : "Service Offering ID is required.",
  SERVICE_OFFERING_DATA_INCOMPLETE : "Service Offering data is incomplete.",
  INVALID_SERVICE_TYPE : "Invalid service type data provided.",
  AT_LEAST_ONE_SERVICE_TYPE_MUST_BE_SELECTED : "At least one Service Type must be selected.",
  AT_LEAST_ONE_WORK_ITEM_MUST_BE_ENABLED : "At least one Work Item must be enabled per service type.",

  INVALID_SERVICE_TYPES_ID: (ids: number[]) => `Invalid Service Type Id(s): [${ids.join(', ')}]`,
  INVALID_WORK_ITEMS_ID: (ids: number[]) => `Invalid Work Item Id(s): [${ids.join(', ')}]`,
};

export { StatusCodes, StatusMessages };
