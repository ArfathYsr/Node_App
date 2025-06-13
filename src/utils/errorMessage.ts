export const ERRORMESSAGE = {
  INVALID_IMAGE_FORMAT: 'Invalid image data format',
  INVALID_FILTER_FORMAT: 'Invalid format for serviceType filter',
  REPOSITORY_ERROR: (error: string) =>
    `Repository Error: ${error || 'Unknown error'}`,
};
