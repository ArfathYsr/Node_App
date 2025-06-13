import { Container } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { mockPrismaClient } from '../data/prisma';
import {
  mockPermissionsFromDatabase,
  listPermissionDataWithNoRecords,
  listPermissionData,
  listPermissionInvalidData,
} from '../data/fixture.permissionRepository';
import TYPES from '../../../src/dependencyManager/types';
import 'reflect-metadata';
import PermissionRepository from '../../../src/permission/repositories/permissionRepository';
import RepositoryError from '../../../src/error/repositoryError';

const mockCount = 5;

// Set up Inversify container
const container = new Container();
container
  .bind<PrismaClient>(TYPES.PrismaClient)
  .toConstantValue(mockPrismaClient as unknown as PrismaClient);
container.bind<PermissionRepository>(PermissionRepository).toSelf();

describe('PermissionRepository', () => {
  let permissionRepository: PermissionRepository;

  beforeAll(() => {
    permissionRepository =
      container.get<PermissionRepository>(PermissionRepository);
  });

  beforeEach(() => {
    mockPrismaClient.permission.count.mockResolvedValue(mockCount);
    mockPrismaClient.permission.findMany.mockResolvedValue(
      mockPermissionsFromDatabase,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct response structure', async () => {
    const mockPermissions = [
      {
        id: 1,
        cloneId: 1,
        createdAt: new Date(),
        createdBy: 1,
        updatedAt: new Date(),
        updatedBy: 1,
        startDate: new Date(),
        endDate: new Date(),
        name: 'ABC',
        description: 'Description 1',
        isActive: true,
        archivedAt: null,
        createdByProfile: { firstName: 'John', lastName: 'Doe' },
        updatedByProfile: { firstName: 'Jane', lastName: 'Doe' },
        totalAmount: 100,
      },
    ];

    mockPrismaClient.permission.findMany.mockResolvedValue(mockPermissions);
    mockPrismaClient.permission.count.mockResolvedValue(mockCount);
    const response =
      await permissionRepository.listPermissions(listPermissionData);
    expect(response).toEqual({
      permissions: mockPermissions,
      totalAmount: mockCount,
    });
    expect(response.permissions).toHaveLength(mockPermissions.length);
    expect(response.totalAmount).toBe(mockCount);
    expect(response.permissions[0]).toHaveProperty('name', 'ABC');
  });

  it('should throw RepositoryError when an error occurs', async () => {
    const errorMessage = 'Database error';
    mockPrismaClient.permission.findMany.mockRejectedValue(
      new Error(errorMessage),
    );
    await expect(
      permissionRepository.listPermissions(listPermissionData),
    ).rejects.toThrow(RepositoryError);
    await expect(
      permissionRepository.listPermissions(listPermissionData),
    ).rejects.toThrow(`Repository Error: ${errorMessage}`);
  });

  it('should throw error on invalid input input like date', async () => {
    try {
      await permissionRepository.listPermissions(listPermissionInvalidData);
    } catch (error) {
      expect(error).toEqual({
        code: 'invalid_string',
        validation: 'datetime',
        message: 'Invalid datetime',
        path: ['body', 'startDate'],
      });
    }
  });

  it('should return an empty array if data not found', async () => {
    mockPrismaClient.permission.findMany.mockResolvedValue([]);
    mockPrismaClient.permission.count.mockResolvedValue(0);
    const response = await permissionRepository.listPermissions(
      listPermissionDataWithNoRecords,
    );
    expect(response).toEqual(
      expect.objectContaining({
        permissions: [],
        totalAmount: 0,
      }),
    );
  });
});
