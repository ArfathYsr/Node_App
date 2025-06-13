import { PrismaClient } from '@prisma/client';
import ServiceOfferingRepository from '../../../src/serviceOffering/repositories/serviceOfferingRepository';
import RepositoryError from '../../../src/error/repositoryError';
import { ServiceOfferingDataDTO } from '../../../src/serviceOffering/dto/serviceOffering.dto';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      $transaction: jest.fn(),
      serviceOffering: {
        update: jest.fn(),
      },
      serviceTypeWorkItem: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      serviceTypeOffering: {
        updateMany: jest.fn(),
      },
    })),
  };
});

const prismaMock = new PrismaClient();
const mockTransaction = prismaMock.$transaction as jest.Mock;
const mockUpdateServiceOffering = prismaMock.serviceOffering.update as jest.Mock;
const mockDeleteMany = prismaMock.serviceTypeWorkItem.deleteMany as jest.Mock;
const mockCreateMany = prismaMock.serviceTypeWorkItem.createMany as jest.Mock;
const mockUpdateManyServiceTypeOffering = prismaMock.serviceTypeOffering.updateMany as jest.Mock;

describe('editServiceOffering', () => {
  let repository: ServiceOfferingRepository;

  beforeEach(() => {
    repository = new ServiceOfferingRepository(prismaMock);
    jest.clearAllMocks();
  });

  it('should update service offering, update work items, and service type offerings', async () => {
    const serviceOfferingId = 1;
    const profileId = 100;

    const serviceOfferingData: ServiceOfferingDataDTO = {
      name: 'New Name',
      description: 'New Desc',
      statusId: 2,
      serviceOfferingCodeId: 5,
    };

    const serviceTypeData = [
      { serviceTypeId: 10, workItemIds: [1, 2] },
      { serviceTypeId: 20, workItemIds: [3] },
    ];

    mockTransaction.mockImplementation(async (callback) => await callback(prismaMock));
    mockUpdateManyServiceTypeOffering.mockResolvedValue({ count: 2 });

    await repository.editServiceOffering(serviceOfferingId, serviceOfferingData, serviceTypeData, profileId);

    expect(mockUpdateServiceOffering).toHaveBeenCalledWith({
      where: { id: serviceOfferingId },
      data: {
        name: 'New Name',
        description: 'New Desc',
        statusId: 2,
        serviceOfferingCodeId: 5,
        updatedBy: profileId,
      },
    });

    expect(mockDeleteMany).toHaveBeenCalledTimes(2);
    expect(mockCreateMany).toHaveBeenCalledTimes(2);
    expect(mockUpdateManyServiceTypeOffering).toHaveBeenCalledTimes(2);

    expect(mockCreateMany).toHaveBeenCalledWith({
      data: [
        { serviceTypeId: 10, workItemId: 1, createdBy: profileId, updatedBy: profileId },
        { serviceTypeId: 10, workItemId: 2, createdBy: profileId, updatedBy: profileId },
      ],
    });

    expect(mockCreateMany).toHaveBeenCalledWith({
      data: [
        { serviceTypeId: 20, workItemId: 3, createdBy: profileId, updatedBy: profileId },
      ],
    });

    expect(mockUpdateManyServiceTypeOffering).toHaveBeenCalledWith({
      where: { serviceTypeId: 10 },
      data: {
        serviceOfferingId: serviceOfferingId,
        updatedBy: profileId,
        updatedAt: expect.any(Date),
      },
    });

    expect(mockUpdateManyServiceTypeOffering).toHaveBeenCalledWith({
      where: { serviceTypeId: 20 },
      data: {
        serviceOfferingId: serviceOfferingId,
        updatedBy: profileId,
        updatedAt: expect.any(Date),
      },
    });
  });

  it('should throw RepositoryError on failure', async () => {
    const serviceOfferingData: ServiceOfferingDataDTO = {
      name: 'Test',
      description: 'Desc',
      statusId: 1,
      serviceOfferingCodeId: 1,
    };

    const serviceTypeData = [
      { serviceTypeId: 10, workItemIds: [1] },
    ];

    const error = new Error('DB Failure');
    mockTransaction.mockRejectedValue(error);

    await expect(
      repository.editServiceOffering(1, serviceOfferingData, serviceTypeData, 1)
    ).rejects.toThrow(RepositoryError);

    await expect(
      repository.editServiceOffering(1, serviceOfferingData, serviceTypeData, 1)
    ).rejects.toThrow('Repository Error: DB Failure');
  });
});
