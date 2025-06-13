import { ListPermissionResponseSchema } from '../../../src/permission/schemas/permissionSchema';

describe('ListPermissionResponseSchema', () => {
  it('should validate a correct schema', () => {
    const validData = {
      permissions: {
        id: 1,
        name: 'TestPermission',
        description: 'Permission Description',
        createdAt: new Date(),
        createdBy: 1,
        updatedAt: new Date(),
        updatedBy: 2,
        isActive: true,
        archivedAt: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        createdByProfile: {
          firstName: 'ABC',
          lastName: 'PQR',
        },
        updatedByProfile: {
          firstName: 'ABC',
          lastName: 'PQR',
        },
      },
      totalAmount: 100,
    };

    expect(() => ListPermissionResponseSchema.parse(validData)).not.toThrow();
  });

  it('should throw an error for an invalid schema', () => {
    const invalidData = {
      permissions: {
        id: 'invalidtestid',
        name: 'Permission Name',
        description: 'Permission Description',
        createdAt: 'invaliddate', // createdAt should be a date
        createdBy: 1,
        updatedAt: new Date(),
        updatedBy: 2,
        isActive: true,
        archivedAt: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        createdByProfile: {
          firstName: 'ABC',
          lastName: 'PQR',
        },
        updatedByProfile: {
          firstName: 'ABC',
          lastName: 'PQR',
        },
      },
      totalAmount: 100,
    };

    expect(() => ListPermissionResponseSchema.parse(invalidData)).toThrow();
  });
});
