// Define Role enum
export enum AvailableRoles {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  PLANNER = 'Planner',
}

// API endpoint for the external server
export enum APIEndPoint {
  CHILD_PROFILE_API = '/api/v1/profiles/child_profile',
  VENDOR_LIST_API = '/api/v1/vendor/list',
  ADD_ROOM_API_PATH = '/api/v1/vendor-rooms',
}

export enum Methods {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
}

export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DRAFT = 'Draft',
}

export const ACTIVE_ROLE_CONDITIONS = (now: Date) => ({
  startDate: { lte: now },
  AND: [
    {
      OR: [{ endDate: { gte: now } }, { endDate: null }],
    },
    {
      status: {
        statusName: 'Active',
      },
    },
  ],
});
export enum EntityTags {
  PROFILE = 'Profile',
  ROLE = 'Role',
  FUNCTIONAL_AREA = 'Functional Area',
  PERMISSION = 'Permission',
  PERMISSION_GROUP = 'Permission group',
  VENDOR = 'Vendor',
  VENDOR_ROOM = 'VendorRooms',
  QUESTION = 'Question',
  QUESTION_OPTION = 'QuestionOption',
  SERVICE_OFFERING = 'Service Offering',
  WORK_ITEM = 'Work Item'


}
export const EXAMPLE_DATE = '2025-01-22T00:00:00.000Z';

export const OFFSET = true;

export const EXAMPLE_ID = '1';

export enum ExampleValues {
  ZERO = 0,
  ONE = 1,
  TWENTY = 20,
}

export enum ExampleStrings {
  TYPE = 'Caterer',
  NAME = 'Vendor A',
}

export enum ExampleServiceStrings {
  TYPE = 'Service',
  NAME = 'Service A',
}

export enum VendorSortSchemaEntities {
  ID = 'id',
  CREATEDAT = 'createdAt',
  UPDATEDAT = 'updatedAt',
  UPDATEDBYPROFILE = 'updatedByProfile',
  NAME = 'name',
  TYPE = 'type',
}

export enum ServiceOfferingSortSchemaEntities {
  ID = 'id',
  CREATEDAT = 'createdAt',
  UPDATEDAT = 'updatedAt',
  UPDATEDBYPROFILE = 'updatedByProfile',
  NAME = 'name',
  TYPE = 'type',
  SERVICETYPE = 'serviceType',
  STATUS = 'status'
}
export const FILE_UPLOAD = 'file upload';
export const PRE_SET_PACKAGES = 'pre-set packages';
export const YES = 'yes';
export const VENDOR_ROOM_QUESTION_CATEGORY = 1;
