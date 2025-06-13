import { PrismaClient } from '@prisma/client';
import ServiceOfferingRepository from '../../../src/serviceOffering/repositories/serviceOfferingRepository';
import RepositoryError from '../../../src/error/repositoryError';
import { BulkEditServiceOfferingRequestDTO } from '../../../src/serviceOffering/dto/serviceOffering.dto';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $transaction: jest.fn(),
      serviceOffering: {
        updateMany: jest.fn(),
      },
      serviceTypeOffering: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
    })),
  };
});

const prismaMock = new PrismaClient();
const mockTransaction = prismaMock.$transaction as jest.Mock;
const mockUpdateMany = prismaMock.serviceOffering.updateMany as jest.Mock;
const mockDeleteMany = prismaMock.serviceTypeOffering.deleteMany as jest.Mock;
const mockCreateMany = prismaMock.serviceTypeOffering.createMany as jest.Mock;

describe('bulkEditServiceOffering', () => {
  let repository: ServiceOfferingRepository;

  beforeEach(() => {
    repository = new ServiceOfferingRepository(prismaMock);
    jest.clearAllMocks();
  });

  it('should update service offerings and create service type offerings', async () => {
    const serviceOfferingEditPayload: BulkEditServiceOfferingRequestDTO = {
      ids: [1, 2, 3],
      status: true,
      serviceTypeIds: [10, 20],
    };
    const updatedBy = 100;

    mockTransaction.mockImplementation(async (callback) => callback(prismaMock));

    await repository.bulkEditServiceOffering(serviceOfferingEditPayload, updatedBy);

    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: { in: [1, 2, 3] } },
      data: {
        status: true,
        updatedBy: 100,
      },
    });

    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: { serviceOfferingId: { in: [1, 2, 3] } },
    });

    expect(mockCreateMany).toHaveBeenCalledWith({
      data: [
        { serviceOfferingId: 1, serviceTypeId: 10, createdBy: 100, updatedBy: 100 },
        { serviceOfferingId: 1, serviceTypeId: 20, createdBy: 100, updatedBy: 100 },
        { serviceOfferingId: 2, serviceTypeId: 10, createdBy: 100, updatedBy: 100 },
        { serviceOfferingId: 2, serviceTypeId: 20, createdBy: 100, updatedBy: 100 },
        { serviceOfferingId: 3, serviceTypeId: 10, createdBy: 100, updatedBy: 100 },
        { serviceOfferingId: 3, serviceTypeId: 20, createdBy: 100, updatedBy: 100 },
      ],
    });
  });

  it('should update service offerings without modifying service type offerings when serviceTypeIds is empty', async () => {
    const serviceOfferingEditPayload: BulkEditServiceOfferingRequestDTO = {
      ids: [1, 2, 3],
      status: false,
      serviceTypeIds: [],
    };
    const updatedBy = 100;

    mockTransaction.mockImplementation(async (callback) => callback(prismaMock));

    await repository.bulkEditServiceOffering(serviceOfferingEditPayload, updatedBy);

    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: { in: [1, 2, 3] } },
      data: {
        status: false,
        updatedBy: 100,
      },
    });

    expect(mockDeleteMany).not.toHaveBeenCalled();
    expect(mockCreateMany).not.toHaveBeenCalled();
  });

  it('should throw a RepositoryError on failure', async () => {
    const serviceOfferingEditPayload: BulkEditServiceOfferingRequestDTO = {
      ids: [1, 2, 3],
      status: true,
      serviceTypeIds: [10, 20],
    };
    const updatedBy = 100;
    const mockError = new Error('Database error');

    mockTransaction.mockRejectedValue(mockError);

    await expect(repository.bulkEditServiceOffering(serviceOfferingEditPayload, updatedBy))
      .rejects.toThrow(RepositoryError);
    await expect(repository.bulkEditServiceOffering(serviceOfferingEditPayload, updatedBy))
      .rejects.toThrow('Repository Error: Database error');
  });
});
