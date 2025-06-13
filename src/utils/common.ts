export const COMMON = {
  LOGINEXPORTPATH: 'export/logindetails',
  AUDITEXPORTPATH: 'export/auditHistory',
  CLONE: 'clone',
  UPDATEDBYPROFILE: 'updatedByProfile',
  ACTIVE: 'Active',
  DEFAULT_ENTITY_AND_DATE: 'defaultEntity.defaultEndDate',
  PERMISSION_GROUP: 'Permission Group',
  CREATEDBYPROFILE: 'createdByProfile',
  VENDOR_IMGAGE_PATH: 'vendor/',
  VENDOR_VENUE_CHECKLIST: 'vendor-venue-checklist',
  PERMISSION: 'Permission',
  IMGPATH: 'images/',
  ENCODEING: 'base64',
  BASEPATH: 'logos/client',
  INCLUDE_ARCHIVED_RECORDS: 1,
  SHOW_ALL_ARCHIVED: 2,
  ACTIVE_VALUE: 1,
  INACTIVE_VALUE: 2,
  STATUS: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
  },
  VENDOR_ROOM_LIST: 'vendor-room-list',
  VENDOR_ROOM_INFO: 'vendor-room-info',
};

export const VendorMeetingRoomConfig = {
  API_METHOD: 'post' as const,
  API_PATHS: {
    VENDOR_MEETING_ROOM_DATA_PATH: '/api/v1/vendor/vendor-meeting-rooms/list',
  },
  API_TAG: 'Vendor',
  API_SUMMARY: {
    VENDOR_MEETING_ROOM_SUMMARY: 'Route to view vendor meeting room list',
  },
  API_RESPONSE_SUCCESS_DESCRIPTION: {
    VENDOR_MEETING_ROOM_DESCRIPTION: 'Vendor Room list fetched successfully',
  },
  API_RESPONSE_VALIDATION_ERROR_DESCRIPTION: 'Validation Error',
  API_RESPONSE_UNAUTHORIZED_DESCRIPTION: 'Unauthorized',
  API_RESPONSE_BODY: 'application/json',
};
export enum TypeField {
  FILE_SIZE = 'FileSize',
  FILE_FORMATE = 'FileFormat',
  TEXT_LENGTH = 'TextLength',
}
