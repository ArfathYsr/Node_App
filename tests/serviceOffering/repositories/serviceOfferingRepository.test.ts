import ServiceOfferingRepository from '../../../src/serviceOffering/repositories/serviceOfferingRepository';

describe('serviceOfferingList', () => {
  let prismaMock: any;
  let repository: ServiceOfferingRepository;

  beforeEach(() => {
    prismaMock = {
      serviceOffering: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };
    repository = new ServiceOfferingRepository(prismaMock);
  });

  it('should return a paginated list of service offerings with metadata', async () => {
    const mockRequest = {
      searchText: 'test',
      sortBy: { field: 'name', order: 'asc' },
      offset: 0,
      limit: 2,
      filter: { name: 'Service A' },
    };
    const mockServiceOfferingList = [
      {
        id: 1,
        name: 'Service A',
        description: 'Description A',
        status: true,
        serviceOfferingId: 101,
        createdBy: 1,
        createdAt: new Date('2023-01-01'),
        updatedBy: 2,
        updatedAt: new Date('2023-01-15'),
        serviceTypeOffering: { someField: 'value' },
      },
      {
        id: 2,
        name: 'Service B',
        description: 'Description B',
        status: false,
        serviceOfferingId: 102,
        createdBy: 3,
        createdAt: new Date('2023-01-02'),
        updatedBy: 4,
        updatedAt: new Date('2023-01-16'),
        serviceTypeOffering: { someField: 'value' },
      },
    ];
    const mockCount = 5;

    prismaMock.serviceOffering.findMany.mockResolvedValue(mockServiceOfferingList);
    prismaMock.serviceOffering.count.mockResolvedValue(mockCount);

    const result = await repository.getServiceOfferingList(mockRequest);

    expect(result).toEqual({
      serviceOfferingList: mockServiceOfferingList,
      totalCount: mockCount,
    });
    expect(prismaMock.serviceOffering.findMany).toHaveBeenCalledWith({
      where: expect.any(Object),
      orderBy: { name: 'asc' },
      skip: 0,
      take: 2,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        serviceOfferingId: true,
        createdBy: true,
        createdAt: true,
        updatedBy: true,
        updatedAt: true,
        serviceTypeOffering: true,
      },
    });
    expect(prismaMock.serviceOffering.count).toHaveBeenCalledWith({
      where: expect.any(Object),
    });
  });

  it('should handle missing optional filters gracefully', async () => {
    const mockRequest = {
      searchText: '',
      sortBy: { field: 'createdAt', order: 'desc' },
      offset: 0,
      limit: 10,
      filter: {},
    };
    const mockServiceOfferingList = [];
    const mockCount = 0;

    prismaMock.serviceOffering.findMany.mockResolvedValue(mockServiceOfferingList);
    prismaMock.serviceOffering.count.mockResolvedValue(mockCount);

    const result = await repository.getServiceOfferingList(mockRequest);

    expect(result).toEqual({
      serviceOfferingList: mockServiceOfferingList,
      totalCount: mockCount,
    });
    expect(prismaMock.serviceOffering.findMany).toHaveBeenCalledWith({
      where: expect.any(Object),
      orderBy: { createdAt: 'desc' },
      skip: 0,
      take: 10,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        serviceOfferingId: true,
        createdBy: true,
        createdAt: true,
        updatedBy: true,
        updatedAt: true,
        serviceTypeOffering: true,
      },
    });
    expect(prismaMock.serviceOffering.count).toHaveBeenCalledWith({
      where: expect.any(Object),
    });
  });

  it('should throw a RepositoryError if prisma throws an error', async () => {
    const mockRequest = {
      searchText: '',
      sortBy: { field: 'createdAt', order: 'desc' },
      offset: 0,
      limit: 5,
      filter: {},
    };
    const mockError = new Error('Database Error');

    prismaMock.serviceOffering.findMany.mockRejectedValue(mockError);

    await expect(repository.getServiceOfferingList(mockRequest)).rejects.toThrow(
      `Repository Error: ${mockError.message}`
    );
  });
});

describe('listWorkItem', () => {
  let prismaMock: any;
  let repository: ServiceOfferingRepository;

  beforeEach(() => {
    prismaMock = {
      workItem: {
        findMany: jest.fn()
      },
    };
    repository = new ServiceOfferingRepository(prismaMock);
  });

  it('should return a work item list data', async () => {
     const mockWorkItemList = [
    {
      "id": 3,
      "name": "test",
      "actionTypeId": 1,
      "statusId": 1
    },
    {
      "id": 4,
      "name": "test new",
      "actionTypeId": 1,
      "statusId": 1
    }
  ];

    prismaMock.workItem.findMany.mockResolvedValue(mockWorkItemList);
    const result = await repository.listWorkItem();

    expect(result).toEqual({
          workItemList: mockWorkItemList
          });

    expect(prismaMock.workItem.findMany).toHaveBeenCalledWith({
       select: {
        id: true,
        name: true,
        actionTypeId: true,
        statusId: true
       },
    });
   });

   it('should throw a RepositoryError if prisma throws an error', async () => {
    const mockRequest = {
        "serviceTypeId": 1,
        "workItemId": [
          3
        ],
        "status": true,
        "createdBy": 1,
        "createdAt": "2024-08-23T00:00:00.000Z",
        "updatedBy": 1,
        "updatedAt": "2024-08-23T00:00:00.000Z"
    };
    const mockError = new Error('Database Error');

    prismaMock.workItem.findMany.mockRejectedValue(mockError);

    await expect(repository.listWorkItem()).rejects.toThrow(
      `Repository Error: ${mockError.message}`
    );
  });
});

describe('serviceTypeWorkItem', () => {
  let prismaMock: any;

   beforeEach(() => {

  prismaMock = {
      $transaction: jest.fn(),
      serviceTypeWorkItem: {
      create: jest.fn(), 
    },
    };

});
 
  it('should create a service type work item mapping', async () => {
     const data = {
        "serviceTypeId": 1,
        "workItemId": [
          3
        ],
        "status": true,
        "createdBy": 1,
        "createdAt": "2024-08-23T00:00:00.000Z",
        "updatedBy": 1,
        "updatedAt": "2024-08-23T00:00:00.000Z"
    }

    const expectedResult = {
        "id": 1005,
        "serviceTypeId": 1,
        "workItemId": [3],
        "status": true,
        "createdBy": 43,
        "updatedBy": 43,
    
    }
     prismaMock.$transaction.mockImplementation(async (transactionFn: Function) => {
        return await transactionFn(prismaMock);
      });

     prismaMock.serviceTypeWorkItem.create.mockResolvedValue(data); 
    const repository = new ServiceOfferingRepository(prismaMock);
  
    const result = await repository.serviceTypeWorkItem(data);
  
      expect(prismaMock.serviceTypeWorkItem.create).toHaveBeenCalledWith({
        data: {
        "serviceTypeId": 1,
        "workItemId": 
          3
        ,
        "status": true,
        "createdBy": 1,
        "updatedBy": 1,
    },
      });
  });

    it('should throw a RepositoryError if prisma throws an error', async () => {
    const mockRequest = {
        "serviceTypeId": 1,
        "workItemId": [
          3
        ],
        "status": true,
        "createdBy": 1,
        "updatedBy": 1,
    };
    const mockError = new Error('Database Error');
   prismaMock.$transaction = jest.fn().mockRejectedValue(mockError);

  const repository = new ServiceOfferingRepository(prismaMock);
  await expect(repository.serviceTypeWorkItem(mockRequest)).rejects.toThrow(
    `Repository Error: ${mockError.message}`
  );
});
});
