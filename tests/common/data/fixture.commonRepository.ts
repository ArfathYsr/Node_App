import { ViewPermissionGroupListDto } from '../../../src/permissionGroup/dto/permissionGroup.dto';

export const mockPermissionsGroupFromDatabase = [
  {
    id: 1,
    cloneId: 1,
    createdAt: new Date('2024-12-12T07:45:26.101Z'),
    createdBy: 40,
    updatedAt: new Date('2024-12-12T07:45:26.101Z'),
    updatedBy: 40,
    startDate: new Date('2024-07-23T00:00:00.000Z'),
    endDate: new Date('2050-12-31T00:00:00.000Z'),
    name: 'test',
    description: 'Test',
    statusId: 1,
    archivedAt: new Date('2024-12-12T07:45:26.101Z'),
    createdByProfile: {
      firstName: 'test1',
      lastName: 'test2',
    },
    updatedByProfile: {
      firstName: 'test1',
      lastName: 'test2',
    },
    status: {
      statusName: 'Avtive',
      id: 1,
    },
  },
];

export const expectedResponse = {
  permissionGroups: [
    {
      archivedAt: '2024-12-12T07:45:26.101Z',
      createdAt: '2024-12-12T07:45:26.101Z',
      createdBy: 40,
      createdByProfile: { firstName: 'test1', lastName: 'test2' },
      description: 'Test',
      endDate: '2050-12-31T00:00:00.000Z',
      id: 1,
      name: 'test',
      startDate: '2024-07-23T00:00:00.000Z',
      updatedAt: '2024-12-12T07:45:26.101Z',
      updatedBy: 40,
      statusId: 1,
      updatedByProfile: { firstName: 'test1', lastName: 'test2' },
      status: { statusName: 'Active', id: 1 },
    },
  ],
  totalAmount: 1,
};

export const listPermissionGroupInvalidData: ViewPermissionGroupListDto = {
  searchText: 'Test',
  startDate: new Date('2034-07-23T00:00:00.000Z'),
  endDate: new Date('2050-12-31T00:00:00.000Z'),
  sortBy: {
    field: 'name',
    order: 'asc',
  },
  offset: 0,
  limit: 20,
  startOfTodayDate: new Date('2024-07-23T00:00:00.000Z'),
  endOfTodayDate: new Date('2024-07-23T00:00:00.000Z'),
  filter: { status: [] },
};

export const listPermissionGroupDataWithNoRecords: ViewPermissionGroupListDto =
  {
    searchText: 'Test',
    startDate: new Date('2034-07-23T00:00:00.000Z'),
    endDate: new Date('2050-12-31T00:00:00.000Z'),
    sortBy: {
      field: 'name',
      order: 'asc',
    },
    offset: 0,
    limit: 20,
    startOfTodayDate: new Date('2024-07-23T00:00:00.000Z'),
    endOfTodayDate: new Date('2024-07-23T00:00:00.000Z'),
    filter: { status: [4] },
  };

export const listPermissionGroupDataWithRecords: ViewPermissionGroupListDto = {
  searchText: 'Test',
  startDate: new Date('2034-07-23T00:00:00.000Z'),
  endDate: new Date('2050-12-31T00:00:00.000Z'),
  sortBy: {
    field: 'name',
    order: 'asc',
  },
  offset: 0,
  limit: 20,
  startOfTodayDate: new Date('2024-07-23T00:00:00.000Z'),
  endOfTodayDate: new Date('2024-07-23T00:00:00.000Z'),
  filter: { status: [2] },
};

export const expectedStatusResponse = {
  status: [
    {
      id: 1,
      name: 'Active',
    },
  ],
};
