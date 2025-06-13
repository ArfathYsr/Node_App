import { PrismaClient } from '@prisma/client';
import RepositoryError from '../../../src/error/repositoryError';
import ServiceOfferingRepository from '../../../src/serviceOffering/repositories/serviceOfferingRepository';
import { ListWorkItemRequest } from '../../../src/serviceOffering/dto/serviceOffering.dto';

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      workItem: {
        findMany: jest.fn(),
      },
      serviceTypeWorkItem: {
        findMany: jest.fn(),
      },
    })),
  };
});

const prismaMock = new PrismaClient();
const mockFindManyWorkItem = prismaMock.workItem.findMany as jest.Mock;
const mockFindManyServiceTypeWorkItem = prismaMock.serviceTypeWorkItem.findMany as jest.Mock;

describe('listWorkItem', () => {
  let repository: ServiceOfferingRepository;

  beforeEach(() => {
    repository = new ServiceOfferingRepository(prismaMock);
    jest.clearAllMocks();
  });

  it('should return all work items when no serviceTypeId is provided', async () => {
    const mockWorkItems = [
      { id: 1, name: 'Work Item 1', actionTypeId: 101, workItemActionType: { name: 'Action Type 1' } },
      { id: 2, name: 'Work Item 2', actionTypeId: 102, workItemActionType: { name: 'Action Type 2' } },
    ];
    mockFindManyWorkItem.mockResolvedValue(mockWorkItems);

    const request: ListWorkItemRequest = {};
    const response = await repository.listWorkItem(request);

    expect(mockFindManyWorkItem).toHaveBeenCalled();
    expect(response.workItemList).toEqual(mockWorkItems);
  });

  it('should return work items filtered by serviceTypeId', async () => {
    const mockServiceTypeWorkItems = [
      { serviceTypeId: 10, workItem: { id: 3, name: 'Work Item 3', workItemActionType: { name: 'Action Type 3' } } },
    ];
    mockFindManyServiceTypeWorkItem.mockResolvedValue(mockServiceTypeWorkItems);

    const request: ListWorkItemRequest = { serviceTypeId: 10 };
    const response = await repository.listWorkItem(request);

    expect(mockFindManyServiceTypeWorkItem).toHaveBeenCalledWith({ where: { serviceTypeId: 10 }, select: expect.anything() });
    expect(response.workItemList).toEqual([{ id: 3, name: 'Work Item 3', workItemActionType: { name: 'Action Type 3' } }]);
  });

  it('should throw a RepositoryError when Prisma throws an error', async () => {
    mockFindManyWorkItem.mockRejectedValue(new Error('Database error'));

    const request: ListWorkItemRequest = {};
    await expect(repository.listWorkItem(request)).rejects.toThrow(RepositoryError);
    await expect(repository.listWorkItem(request)).rejects.toThrow('Repository Error: Database error');
  });
});
