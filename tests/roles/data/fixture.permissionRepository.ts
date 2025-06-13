import {
  ListPermissionBodyDto,
  PermissionList,
} from '../../../src/permission/dto/permission.dto';

export const mockPermissionsFromDatabase: PermissionList = [
  {
    id: 1,
    createdAt: new Date('2024-12-12T07:45:26.101Z'),
    createdBy: 40,
    updatedAt: new Date('2024-12-12T07:45:26.101Z'),
    updatedBy: 40,
    startDate: new Date('2024-07-23T00:00:00.000Z'),
    endDate: new Date('2050-12-31T00:00:00.000Z'),
    name: 'Muskan',
    description: 'Test',
    isActive: true,
    archivedAt: new Date('2024-12-12T07:45:26.101Z'),
    createdByProfile: {
      firstName: 'Muskan',
      lastName: 'Bennur',
    },
    updatedByProfile: {
      firstName: 'Muskan',
      lastName: 'Bennur',
    },
  },
];

export const expectedResponse = {
  permissions: [
    {
      archivedAt: null,
      createdAt: '2024-12-12T07:45:26.101Z',
      createdBy: 40,
      createdByProfile: { firstName: 'Muskan', lastName: 'Bennur' },
      description: 'Test',
      endDate: '2050-12-31T00:00:00.000Z',
      id: 1,
      isActive: true,
      name: 'Muskan',
      startDate: '2024-07-23T00:00:00.000Z',
      updatedAt: '2024-12-12T07:45:26.101Z',
      updatedBy: 40,
      updatedByProfile: { firstName: 'Muskan', lastName: 'Bennur' },
    },
  ],
  totalAmount: 5,
};

export const listPermissionData: ListPermissionBodyDto = {
  searchText: 'Muskan',
  startDate: new Date('2024-07-23T00:00:00.000Z'),
  endDate: new Date('2050-12-31T00:00:00.000Z'),
  sortBy: {
    field: 'name',
    order: 'asc',
  },
  offset: 0,
  limit: 20,
  startOfTodayDate: new Date('2024-07-23T00:00:00.000Z'),
  endOfTodayDate: new Date('2024-07-23T00:00:00.000Z'),
  filter: { isArchived: false },
};

export const listPermissionInvalidData = {
  filter: {
    isArchived: false,
  },
  sortBy: {
    field: 'name',
    order: 'asc',
  },
  offset: 0,
  limit: 20,
  startDate: 'abc',
  endDate: 'pqr',
  searchText: '',
  isActive: true,
} as unknown as ListPermissionBodyDto;

export const listPermissionDataWithNoRecords: ListPermissionBodyDto = {
  searchText: 'Muskan',
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
  filter: { isArchived: false },
};
