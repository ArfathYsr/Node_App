export const SERVICE_TYPES_MESSAGES = {
    SERVICE_TYPES_CREATED: 'Service Type has been created successfully',
    DUPLICATE_NAME: 'The Service Type Name is already taken, Please provide different name',
    SERVICE_TYPES_UPDATED: 'Service Type has been updated successfully',
    SERVICE_TYPE_FETCH_SUCCESS: 'Service type retrieved successfully!',
    SERVICE_TYPE_NOT_FOUND: 'No data available for the provided service ID.',
    INVALID_SERVICE_TYPE_ID:(serviceTypeID: number) => `The given Service Type with ID: ${serviceTypeID} is invalid or do not exists`,
    ARCHIVED_SUCCESS: (serviceTypeID: number) => `The Service type with ID: ${serviceTypeID} has been archived successfully`,
    ARCHIVE_ERROR: (serviceTypeID: number) => `The Service type with ID: ${serviceTypeID} has already been archived`,
    UNARCHIVE_ERROR:(serviceTypeID: number) => `The Service Type with ID ${serviceTypeID} has already been UnArchived`,
    UNARCHIVE_SUCCESS: (serviceTypeID: number) => `The Service Type with ID ${serviceTypeID} has been UnArchived successfully`
}
