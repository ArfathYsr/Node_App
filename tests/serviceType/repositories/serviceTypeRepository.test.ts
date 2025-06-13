import ServiceTypeRepository from '../../../src/serviceType/repositories/serviceTypeRepository'
import { EditServiceTypesRequestDTO, ServiceTypeListShortRequestDto,
    ServiceTypeListShortResponseDto } from '../../../src/serviceType/dto/serviceType.dto';
import { PrismaClient } from '@prisma/client';


describe('serviceTypeList', () => {
  let prismaMock: any;
  let repository: ServiceTypeRepository;

  beforeEach(() => {
    prismaMock = {
      serviceType: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };
    repository = new ServiceTypeRepository(prismaMock);
  });

  it('should return a paginated list of service types with metadata', async () => {
    const mockRequest = {
      searchText: 'test',
      sortBy: { field: 'name', order: 'asc' },
      offset: 0,
      limit: 2,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      serviceOfferingIds: [1, 2],
    };
    const mockServiceTypeList = [
      {
        id: 1,
        name: 'Service A',
        serviceTypeOffering: [
          { serviceOffering: { name: 'Offering A' } },
        ],
      },
      {
        id: 2,
        name: 'Service B',
        serviceTypeOffering: [
          { serviceOffering: { name: 'Offering B' } },
        ],
      },
    ];
    const mockCount = 5;

    prismaMock.serviceType.findMany.mockResolvedValue(mockServiceTypeList);
    prismaMock.serviceType.count.mockResolvedValue(mockCount);

    const result = await repository.serviceTypeList(mockRequest);

    expect(result).toEqual({
      serviceTypeList: mockServiceTypeList,
      totalAmount: mockCount,
      totalPages: 3,
      nextPage: true,
    });
    expect(prismaMock.serviceType.findMany).toHaveBeenCalledWith({
      where: expect.any(Object),
      orderBy: { name: 'asc' },
      skip: 0,
      take: 2,
      include: {
        serviceTypeOffering: {
          select: { serviceOffering: { select: { name: true } } },
        },
      },
    });
    expect(prismaMock.serviceType.count).toHaveBeenCalledWith({
      where: expect.any(Object),
    });
  });

  it('should handle missing optional filters gracefully', async () => {
    const mockRequest = {
      searchText: '',
      sortBy: { field: 'createdAt', order: 'desc' },
      offset: 0,
      limit: 10,
      startDate: undefined,
      endDate: new Date('2025-03-23'),
      serviceOfferingIds: [],
    };
    const mockServiceTypeList = [];
    const mockCount = 0;

    prismaMock.serviceType.findMany.mockResolvedValue(mockServiceTypeList);
    prismaMock.serviceType.count.mockResolvedValue(mockCount);

    const result = await repository.serviceTypeList(mockRequest);

    expect(result).toEqual({
      serviceTypeList: mockServiceTypeList,
      totalAmount: mockCount,
      totalPages: 0,
      nextPage: false,
    });
    expect(prismaMock.serviceType.findMany).toHaveBeenCalledWith({
      where: {
        createdAt: {
          lte: new Date('2025-03-23'),
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 10,
      include: {
        serviceTypeOffering: {
          select: { serviceOffering: { select: { name: true } } },
        },
      },
    });
  });

  it('should throw a RepositoryError if prisma throws an error', async () => {
    const mockRequest = {
      searchText: '',
      sortBy: { field: 'createdAt', order: 'desc' },
      offset: 0,
      limit: 5,
      startDate: undefined,
      endDate: undefined,
      serviceOfferingIds: [],
    };
    const mockError = new Error('Database Error');

    prismaMock.serviceType.findMany.mockRejectedValue(mockError);

    await expect(repository.serviceTypeList(mockRequest)).rejects.toThrow(
      `Repository Error: ${mockError.message}`
    );
  });
});

describe('getExistingServiceOfferingIds', () => {
    let prismaMock: any;
  
    beforeEach(() => {
      prismaMock = {
        serviceOffering: {
          findMany: jest.fn(),
        },
      };
    });
  
    it('should return an array of existing ServiceOfferingIds', async () => {
      const serviceOfferingIds = [1, 2, 3];
      const mockResult = [{ id: 1 }, { id: 2 }];
      prismaMock.serviceOffering.findMany.mockResolvedValue(mockResult);
  
      const repository = new ServiceTypeRepository(prismaMock);
      const result = await repository.getExistingServiceOfferingIds(serviceOfferingIds);
  
      expect(result).toEqual(mockResult);
      expect(prismaMock.serviceOffering.findMany).toHaveBeenCalledWith({
        where: { id: { in: serviceOfferingIds } },
        select: { id: true },
      });
    });
  
    it('should return an empty array if no service offering IDs match', async () => {
      const serviceOfferingIds = [4, 5, 6];
      prismaMock.serviceOffering.findMany.mockResolvedValue([]);
  
      const repository = new ServiceTypeRepository(prismaMock);
      const result = await repository.getExistingServiceOfferingIds(serviceOfferingIds);
  
      expect(result).toEqual([]);
      expect(prismaMock.serviceOffering.findMany).toHaveBeenCalledWith({
        where: { id: { in: serviceOfferingIds } },
        select: { id: true },
      });
    });
  });

  describe('getExistingWorkItemIds', () => {
    let prismaMock: any;
  
    beforeEach(() => {
      prismaMock = {
        workItem: {
          findMany: jest.fn(),
        },
      };
    });
  
    it('should return an array of existing WorkItemIds', async () => {
      const workItemIds = [1, 2, 3];
      const mockResult = [{ id: 1 }, { id: 2 }];
      prismaMock.workItem.findMany.mockResolvedValue(mockResult);
  
      const repository = new ServiceTypeRepository(prismaMock);
      const result = await repository.getExistingWorkItemIds(workItemIds);
  
      expect(result).toEqual(mockResult);
      expect(prismaMock.workItem.findMany).toHaveBeenCalledWith({
        where: { id: { in: workItemIds } },
        select: { id: true },
      });
    });
  
    it('should return an empty array if no work item IDs match', async () => {
      const workItemIds = [4, 5, 6];
      prismaMock.workItem.findMany.mockResolvedValue([]);
  
      const repository = new ServiceTypeRepository(prismaMock);
      const result = await repository.getExistingWorkItemIds(workItemIds);
  
      expect(result).toEqual([]);
      expect(prismaMock.workItem.findMany).toHaveBeenCalledWith({
        where: { id: { in: workItemIds } },
        select: { id: true },
      });
    });
  });


  describe('addServiceType', () => {
    let prismaMock: any;
  
    beforeEach(() => {
      prismaMock = {
        $transaction: jest.fn(),
        serviceType: {
          create: jest.fn(),
        },
        serviceTypeOffering: {
          createMany: jest.fn(),
        },
        serviceTypeWorkItem: {
          createMany: jest.fn(),
        },
      };
    });
  
    it('should successfully add a service type with service offerings and work items without cloneId', async () => {
      const data = {
        name: 'Service Type 1',
        description: 'Description',
        isActive: true,
        createdBy: 1,
        updatedBy: 1,
        serviceOfferingIds: [1, 2],
        workItemIds: [3, 4],
      };
  
      const serviceTypeInfo = { id: 101, ...data };
      const serviceOfferingIds = data.serviceOfferingIds;
      const workItemIds = data.workItemIds;
  
      prismaMock.$transaction.mockImplementation(async (transactionFn: Function) => {
        return await transactionFn(prismaMock);
      });
  
      prismaMock.serviceType.create.mockResolvedValue(serviceTypeInfo);
      prismaMock.serviceTypeOffering.createMany.mockResolvedValue({});
      prismaMock.serviceTypeWorkItem.createMany.mockResolvedValue({});
  
      const repository = new ServiceTypeRepository(prismaMock);
      const result = await repository.addServiceType(data);
  
      expect(result).toEqual({
        serviceTypeInfo,
        serviceOfferingIds,
        workItemIds,
      });
  
      expect(prismaMock.serviceType.create).toHaveBeenCalledWith({
        data: {
          name: data.name,
          description: data.description,
          isActive: data.isActive,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy,
          cloneId: null,
        },
      });
  
      expect(prismaMock.serviceTypeOffering.createMany).toHaveBeenCalledWith({
        data: [
          { serviceTypeId: 101, serviceOfferingId: 1, createdBy: 1, updatedBy: 1 },
          { serviceTypeId: 101, serviceOfferingId: 2, createdBy: 1, updatedBy: 1 },
        ],
      });
  
      expect(prismaMock.serviceTypeWorkItem.createMany).toHaveBeenCalledWith({
        data: [
          { serviceTypeId: 101, workItemId: 3, createdBy: 1, updatedBy: 1 },
          { serviceTypeId: 101, workItemId: 4, createdBy: 1, updatedBy: 1 },
        ],
      });
    });
  
    it('should successfully add a service type with service offerings and work items with cloneId', async () => {
      const data = {
        name: 'Service Type 2',
        description: 'Description',
        isActive: true,
        createdBy: 1,
        updatedBy: 1,
        serviceOfferingIds: [1, 2],
        workItemIds: [3, 4],
        type: 'CLONE',
        cloneId: 2,
      };
  
      const serviceTypeInfo = { id: 102, ...data };
      const serviceOfferingIds = data.serviceOfferingIds;
      const workItemIds = data.workItemIds;
  
      prismaMock.$transaction.mockImplementation(async (transactionFn: Function) => {
        return await transactionFn(prismaMock);
      });
  
      prismaMock.serviceType.create.mockResolvedValue(serviceTypeInfo);
      prismaMock.serviceTypeOffering.createMany.mockResolvedValue({});
      prismaMock.serviceTypeWorkItem.createMany.mockResolvedValue({});
  
      const repository = new ServiceTypeRepository(prismaMock);
      const result = await repository.addServiceType(data);
  
      expect(result).toEqual({
        serviceTypeInfo,
        serviceOfferingIds,
        workItemIds,
      });
  
      expect(prismaMock.serviceType.create).toHaveBeenCalledWith({
        data: {
          name: data.name,
          description: data.description,
          isActive: data.isActive,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy,
          cloneId: 2,
        },
      });
  
      expect(prismaMock.serviceTypeOffering.createMany).toHaveBeenCalledWith({
        data: [
          { serviceTypeId: 102, serviceOfferingId: 1, createdBy: 1, updatedBy: 1 },
          { serviceTypeId: 102, serviceOfferingId: 2, createdBy: 1, updatedBy: 1 },
        ],
      });
  
      expect(prismaMock.serviceTypeWorkItem.createMany).toHaveBeenCalledWith({
        data: [
          { serviceTypeId: 102, workItemId: 3, createdBy: 1, updatedBy: 1 },
          { serviceTypeId: 102, workItemId: 4, createdBy: 1, updatedBy: 1 },
        ],
      });
    });
  
    it('should handle cases where there are no work items', async () => {
      const data = {
        name: 'Service Type 3',
        description: 'No Work Items',
        isActive: false,
        createdBy: 2,
        updatedBy: 2,
        serviceOfferingIds: [5, 6],
        workItemIds: [],
      };
  
      const serviceTypeInfo = { id: 103, ...data };
      const serviceOfferingIds = data.serviceOfferingIds;
  
      prismaMock.$transaction.mockImplementation(async (transactionFn: Function) => {
        return await transactionFn(prismaMock);
      });
  
      prismaMock.serviceType.create.mockResolvedValue(serviceTypeInfo);
      prismaMock.serviceTypeOffering.createMany.mockResolvedValue({});
      prismaMock.serviceTypeWorkItem.createMany.mockResolvedValue({});
  
      const repository = new ServiceTypeRepository(prismaMock);
      const result = await repository.addServiceType(data);
  
      expect(result).toEqual({
        serviceTypeInfo,
        serviceOfferingIds,
        workItemIds: [],
      });
  
      expect(prismaMock.serviceType.create).toHaveBeenCalledWith({
        data: {
          name: data.name,
          description: data.description,
          isActive: data.isActive,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy,
          cloneId: null,
        },
      });
  
      expect(prismaMock.serviceTypeOffering.createMany).toHaveBeenCalledWith({
        data: [
          { serviceTypeId: 103, serviceOfferingId: 5, createdBy: 2, updatedBy: 2 },
          { serviceTypeId: 103, serviceOfferingId: 6, createdBy: 2, updatedBy: 2 },
        ],
      });
  
      expect(prismaMock.serviceTypeWorkItem.createMany).not.toHaveBeenCalled();
    });
  });
  
  describe('ServiceTypeRepository - serviceTypeListShort', () => {
  let serviceTypeRepository: ServiceTypeRepository;
  let prismaMock: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    prismaMock = {
      serviceType: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    } as any;
    serviceTypeRepository = new ServiceTypeRepository(prismaMock); 
  });

  it('should return a list of service types and total count', async () => {
    const mockRequestBody = { searchText: 'Test' };

    const mockServiceTypeList = [
      { id: 1, name: 'Test Service 1', description: 'Description 1' },
      { id: 2, name: 'Test Service 2', description: 'Description 2' },
    ];

    const mockTotalCount = 2;

    (prismaMock.serviceType?.findMany as jest.Mock).mockResolvedValue(mockServiceTypeList);
    (prismaMock.serviceType?.count as jest.Mock).mockResolvedValue(mockTotalCount);

    const result = await serviceTypeRepository.serviceTypeListShort(mockRequestBody);

    expect(prismaMock.serviceType.findMany).toHaveBeenCalledWith({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [{ name: { contains: 'Test' } }],
          },
        ],
      },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    expect(prismaMock.serviceType.count).toHaveBeenCalledWith({
      where: {
        AND: [
          { isActive: true },
          {
            OR: [{ name: { contains: 'Test' } }],
          },
        ],
      },
    });

    expect(result).toEqual({
      serviceTypeListShort: mockServiceTypeList,
      totalAmount: 2,
    });
});

  it('should return a list of service types and total count when searchText is not provided', async () => {
    const requestDto: ServiceTypeListShortRequestDto = {};

    const mockServiceTypeList: ServiceTypeListShortResponseDto[] = [
      { id: 1, name: 'Test Service 1', description: 'Description 1' },
      { id: 2, name: 'Test Service 2', description: 'Description 2' },
    ];

    const mockTotalCount = 2;

   (prismaMock.serviceType?.findMany as jest.Mock).mockResolvedValue(mockServiceTypeList);
    (prismaMock.serviceType?.count as jest.Mock).mockResolvedValue(mockTotalCount);

    const response = await serviceTypeRepository.serviceTypeListShort(requestDto);

    // Assert findMany was called with the correct parameters
    expect(prismaMock.serviceType.findMany).toHaveBeenCalledWith({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    // Assert count was called with the correct parameters
    expect(prismaMock.serviceType.count).toHaveBeenCalledWith({
      where: { isActive: true },
    });

    // Assert the response
    expect(response).toEqual({
      serviceTypeListShort: mockServiceTypeList,
      totalAmount: mockTotalCount,
    });
  });

  it('should handle errors gracefully and throw an error', async () => {
    const requestDto: ServiceTypeListShortRequestDto = { searchText: 'Test' };
  (prismaMock.serviceType!.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
    await expect(serviceTypeRepository.serviceTypeListShort(requestDto)).rejects.toThrow('Database error');
  });
});

describe('editServiceType', () => {
  let prismaMock: any;
  let repository: ServiceTypeRepository;

  beforeEach(() => {
    prismaMock = {
      serviceType: {
        update: jest.fn(),
      },
      serviceTypeOffering: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      serviceTypeWorkItem: {
        deleteMany: jest.fn(),
        createMany: jest.fn(),
      },
      $transaction: jest.fn((callback) => callback(prismaMock)),
    };
    repository = new ServiceTypeRepository(prismaMock);
  });

  it('should edit the service type and update service offerings, and work Items', async () => {
    const mockRequest: EditServiceTypesRequestDTO = {
      serviceTypeId: 1,
      serviceOfferingIds: [1, 2],
      workItemIds: [3, 4],
      createdBy: 1,
      updatedBy: 1,
      name: 'Location management',
      description: 'Location management',
      isActive: false
    };
    const mockServiceTypeInfo = {
      id: 1,
      name: 'Location management',
      createdBy: 1,
      updatedBy: 1,
      description: 'Location management',
      isActive: false
    };

    prismaMock.serviceType.update.mockResolvedValue(mockServiceTypeInfo);
    prismaMock.serviceTypeOffering.deleteMany.mockResolvedValue(null);
    prismaMock.serviceTypeOffering.createMany.mockResolvedValue(null);
    prismaMock.serviceTypeWorkItem.deleteMany.mockResolvedValue(null);
    prismaMock.serviceTypeWorkItem.createMany.mockResolvedValue(null);

    const result = await repository.editServiceType(mockRequest);

    expect(result).toEqual({
      serviceTypeInfo: mockServiceTypeInfo,
      serviceOfferingIds: [1, 2],
      workItemIds: [3, 4],
    });
    expect(prismaMock.serviceType.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: {
        name: 'Location management',
    description: 'Location management',
    isActive: false,
    updatedBy: 1,
      },
    });
    expect(prismaMock.serviceTypeOffering.deleteMany).toHaveBeenCalledWith({
      where: { serviceTypeId: 1 },
    });
    expect(prismaMock.serviceTypeOffering.createMany).toHaveBeenCalledWith({
      data: [
        { serviceTypeId: 1, serviceOfferingId: 1, createdBy: 1, updatedBy: 1 },
        { serviceTypeId: 1, serviceOfferingId: 2, createdBy: 1, updatedBy: 1 },
      ],
    });
    expect(prismaMock.serviceTypeWorkItem.deleteMany).toHaveBeenCalledWith({
      where: { serviceTypeId: 1 },
    });
  
    expect(prismaMock.serviceTypeWorkItem.createMany).toHaveBeenCalledWith({
      data: [
        { serviceTypeId: 1, workItemId: 3, createdBy: 1, updatedBy: 1 },
        { serviceTypeId: 1, workItemId: 4, createdBy: 1, updatedBy: 1 },
      ],
    });
  });

});

jest.mock('@prisma/client', () => {
  const mockFindUnique = jest.fn();
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      serviceType: {
        findUnique: mockFindUnique,
      },
    })),
  };
});

describe('viewServiceType', () => {
  const prisma = new PrismaClient();
  const repository = new ServiceTypeRepository(prisma);

  it('should return service type data when a valid id is provided', async () => {
    const mockServiceTypeData = {
      id: 1,
      serviceTypeOffering: [
        {
          serviceOffering: { id: 1, name: 'Offering 1', description: 'Desc 1', status: 'Active' },
        },
      ],
      serviceTypeWorkItem: [
        {
          workItem: {
            id: 1,
            name: 'WorkItem 1',
            workItemActionType: { name: 'ActionType 1' },
            workItemStatus: { name: 'Status 1' },
          },
        },
      ],
    };

    (prisma.serviceType.findUnique as jest.Mock).mockResolvedValue(mockServiceTypeData);

    const result = await repository.viewServiceType(1);

    expect(result).toEqual(mockServiceTypeData);
    expect(prisma.serviceType.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        serviceTypeOffering: {
          select: {
            serviceOffering: {
              select: {
                id: true,
                name: true,
                description: true,
                status: true,
              },
            },
          },
        },
        serviceTypeWorkItem: {
          select: {
            workItem: {
              select: {
                id: true,
                name: true,
                workItemActionType: {
                  select: { name: true },
                },
                workItemStatus: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });
  });
});

describe('archiveServiceType', () => {
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      serviceType: {
        update: jest.fn(),
      },
    };
  });

  it('should successfully archive a service type by setting archivedAt', async () => {
    const serviceTypeID = 1;

    prismaMock.serviceType.update.mockResolvedValue({
      id: serviceTypeID,
      archivedAt: new Date().toISOString(),
    });

    const repository = new ServiceTypeRepository(prismaMock);
    await expect(repository.archiveServiceType(serviceTypeID)).resolves.not.toThrow();

    expect(prismaMock.serviceType.update).toHaveBeenCalledWith({
      where: { id: serviceTypeID },
      data: {
        archivedAt: expect.any(String),
      },
    });
  });

});

describe("UnArchive ServiceType", () => {
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      serviceType: {
        update: jest.fn(),
      },
    };
  });

  it("should successfully UnArchive ServiceType by setting up archivedAt to null", async() => {
    const serviceTypeID = 1;

    prismaMock.serviceType.update.mockResolvedValue({
      id: serviceTypeID,
      archivedAt: null,
    });

    const repository = new ServiceTypeRepository(prismaMock);
    await expect(repository.archiveServiceType(serviceTypeID)).resolves.not.toThrow();

    expect(prismaMock.serviceType.update).toHaveBeenCalledWith({
      where: { id: serviceTypeID },
      data: {
        archivedAt: expect.any(String),
      },
    });
  })
})