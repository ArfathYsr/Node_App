import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import ServiceOfferingRepository from '../../../src/serviceOffering/repositories/serviceOfferingRepository';
import RepositoryError from '../../../src/error/repositoryError';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      serviceOffering: { findUnique: jest.fn() },
      serviceTypeWorkItem: { findMany: jest.fn() },
    })),
  };
});

const prismaMock = new PrismaClient();
const mockFindUnique = prismaMock.serviceOffering.findUnique as jest.Mock;
const mockFindMany = prismaMock.serviceTypeWorkItem.findMany as jest.Mock;

describe('viewServiceOffering', () => {
  let repository: ServiceOfferingRepository;

  beforeEach(() => {
    repository = new ServiceOfferingRepository(prismaMock);
    jest.clearAllMocks();
  });

  it('should return service offering with service types and work items', async () => {
    const serviceOfferingId = 1;

    mockFindUnique.mockResolvedValue({
      id: 1,
      name: 'Test Offering',
      description: 'Test description',
      isActive: true,
      serviceOfferingCodeId: 12,
      createdAt: new Date(),
      createdByProfile: { firstName: 'Alice', lastName: 'Smith' },
      updatedAt: new Date(),
      updatedByProfile: { firstName: 'Bob', lastName: 'Brown' },
      serviceTypeOffering: [
        { serviceTypeId: 101, serviceType: { name: 'Consulting' } },
        { serviceTypeId: 102, serviceType: { name: 'Implementation' } },
      ],
    });

    mockFindMany.mockResolvedValue([
      {
        workItem: {
          name: 'Review Documents',
          workItemActionType: { name: 'Read' },
        },
      },
      {
        workItem: {
          name: 'Prepare Report',
          workItemActionType: { name: 'Write' },
        },
      },
    ]);

    const result = await repository.viewServiceOffering(serviceOfferingId);

    expect(result?.id).toBe(1);
    expect(result?.serviceTypes).toEqual([
      { serviceTypeId: 101, name: 'Consulting' },
      { serviceTypeId: 102, name: 'Implementation' },
    ]);
    expect(result?.workItems).toEqual([
      { name: 'Review Documents', actionTypeName: 'Read' },
      { name: 'Prepare Report', actionTypeName: 'Write' },
    ]);
  });

  it('should return service offering without serviceTypes and workItems if none linked', async () => {
    const serviceOfferingId = 2;

    mockFindUnique.mockResolvedValue({
      id: 2,
      name: 'Simple Offering',
      description: 'Minimal data',
      isActive: true,
      serviceOfferingCodeId: null,
      createdAt: new Date(),
      createdByProfile: { firstName: 'Jane', lastName: 'Doe' },
      updatedAt: new Date(),
      updatedByProfile: { firstName: 'John', lastName: 'Doe' },
      serviceTypeOffering: [],
    });

    const result = await repository.viewServiceOffering(serviceOfferingId);

    expect(result?.id).toBe(2);
    expect(result?.serviceTypes).toBeUndefined();
    expect(result?.workItems).toBeUndefined();
  });

  it('should throw RepositoryError on failure', async () => {
    const error = new Error('DB exploded');
    mockFindUnique.mockRejectedValue(error);

    await expect(repository.viewServiceOffering(999)).rejects.toThrow(RepositoryError);
    await expect(repository.viewServiceOffering(999)).rejects.toThrow('Repository Error: DB exploded');
  });
});
