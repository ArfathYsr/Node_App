import { PrismaClient } from '@prisma/client';
import 'reflect-metadata';
import { Container } from 'inversify';
import { mockPrismaClient } from '../data/prisma';
import { NotFoundError } from '../../../src/error/notFoundError';
import RepositoryError from '../../../src/error/repositoryError';
import TYPES from '../../../src/dependencyManager/types';
import OrgHierarchyRepository from '../../../src/orgHierarchy/repositories/orgHierarchyRepository';
import { mockData, mockHierarchyData, mockHierarchyDataWithoutLevels, mockHierarchyList } from '../data/fixture.orgHierarchy';

const container = new Container();
container
  .bind<PrismaClient>(TYPES.PrismaClient)
  .toConstantValue(mockPrismaClient as PrismaClient);
container.bind<OrgHierarchyRepository>(OrgHierarchyRepository).toSelf();

describe('OrgHierarchyRepository - listOrgHierarchy', () => {
  let orgHierarchyRepository: OrgHierarchyRepository;

  beforeAll(() => {
    orgHierarchyRepository = container.get<OrgHierarchyRepository>(OrgHierarchyRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a list of hierarchy data when found', async () => {

    mockPrismaClient.clientHierarchy.findMany.mockResolvedValue(mockHierarchyList);
    mockPrismaClient.clientHierarchy.count.mockResolvedValue(mockHierarchyList.length);
    const result = await orgHierarchyRepository.listOrgHierarchy(mockData);

    expect(result).toEqual({
      clientHierarchyList: mockHierarchyList,
      totalAmount: mockHierarchyList.length,
    });

    expect(mockPrismaClient.clientHierarchy.findMany).toHaveBeenCalledWith({
      where: {},
      skip: 0,
      take: 10,
      include: {
        hierarchyLevel: true,
        status: true,
        client: true,
      },
      orderBy: {
        status: { statusName: 'asc' },
        effectiveDate: "desc",
      },
    });
  });

  it('should filter hierarchy data based on search text', async () => {
    mockData.searchText = 'Test'
    mockPrismaClient.clientHierarchy.findMany.mockResolvedValue(mockHierarchyList);
    mockPrismaClient.clientHierarchy.count.mockResolvedValue(mockHierarchyList.length);

    const result = await orgHierarchyRepository.listOrgHierarchy(mockData);

    expect(result.clientHierarchyList).toEqual(mockHierarchyList);
    expect(result.totalAmount).toBe(mockHierarchyList.length);

    expect(mockPrismaClient.clientHierarchy.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: 'Test' } },
          { description: { contains: 'Test' } },
        ],
      },
      skip: 0,
      take: 10,
      include: {
        hierarchyLevel: true,
        client: true,
        status: true,
      },
      orderBy: {
        status: { statusName: 'asc' },
        effectiveDate: "desc",
      },
    });
  });

  it('should sort hierarchy data based on sortBy parameter', async () => {
    mockData.sortBy = { field: 'statusName', order: 'asc' };
    mockData.searchText = ''

    mockPrismaClient.clientHierarchy.findMany.mockResolvedValue(mockHierarchyList);
    mockPrismaClient.clientHierarchy.count.mockResolvedValue(mockHierarchyList.length);

    const result = await orgHierarchyRepository.listOrgHierarchy(mockData);

    expect(result.clientHierarchyList).toEqual(mockHierarchyList);
    expect(result.totalAmount).toBe(mockHierarchyList.length);

    expect(mockPrismaClient.clientHierarchy.findMany).toHaveBeenCalledWith({
      where: {},
      skip: 0,
      take: 10,
      include: {
        hierarchyLevel: true,
        client: true,
        status: true,
      },
      orderBy: {
        status: { statusName: 'asc' },
      },
    });
  });

  it('should throw RepositoryError when a database error occurs', async () => {

    mockPrismaClient.clientHierarchy.findMany.mockRejectedValue(new RepositoryError('Database error'));

    await expect(orgHierarchyRepository.listOrgHierarchy(mockData)).rejects.toThrow(RepositoryError);
  });

  //filter
  it("should return only clientName filter when clientName is provided", async () => {
    const result = await orgHierarchyRepository.buildWhereConditionForOrgHierarchy(undefined, {
      clientName: ["Client A", "Client B"],
    });

    expect(result).toEqual({
      client: { name: { in: ["Client A", "Client B"] } },
    });
  });

  it("should return only statusId filter when status is provided", async () => {
    const result = await orgHierarchyRepository.buildWhereConditionForOrgHierarchy(undefined, {
      status: [1, 2, 3],
    });

    expect(result).toEqual({
      statusId: { in: [1, 2, 3] },
    });
  });

  it("should return both clientName and statusId filters when both are provided", async () => {
    const result = await orgHierarchyRepository.buildWhereConditionForOrgHierarchy(undefined, {
      clientName: ["Client X", "Client Y"],
      status: [4, 5],
    });

    expect(result).toEqual({
      client: { name: { in: ["Client X", "Client Y"] } },
      statusId: { in: [4, 5] },
    });
  });

  it("should return an empty object when no filters are provided", async () => {
    const result = await orgHierarchyRepository.buildWhereConditionForOrgHierarchy();
    expect(result).toEqual({});
  });
});

describe('OrgHierarchyRepository - Clone Hierarchy', () => {
  let orgHierarchyRepository: OrgHierarchyRepository;
  beforeAll(() => {
    orgHierarchyRepository = container.get<OrgHierarchyRepository>(OrgHierarchyRepository);
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup default mocks
    mockPrismaClient.$transaction.mockImplementation(async (callback) => {
      return callback(mockPrismaClient);
    });
    
    mockPrismaClient.clientHierarchy.create.mockResolvedValue({
        id: 1,
        name: 'Test Hierarchy',
        description: null,
        numberOfLevels: 0,
        statusId: 0,
        effectiveDate: new Date(),
        endDate: null,
        fieldReleaseDate: null,
        createdBy: 0,
        createdAt: new Date(),
        updatedBy: 0,
        updatedAt: new Date(),
        clientId: null,
        cloneId: null
    });
    
    mockPrismaClient.hierarchyLevel.create.mockResolvedValue({
        id: 1,
        name: 'Level 1',
        allowMultipleLevelValue: true,
        isActive: true,
        levelOrder: 1,
        clientHierarchyId: 1,
        parentHierarchyLevelId: null,
        createdBy: 0,
        createdAt: new Date(),
        updatedBy: 0,
        updatedAt: new Date()
    });
    
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

    it('should successfully clone hierarchy ', async () => {
      const response = await orgHierarchyRepository.cloneClientOrgHierarchy(
        mockHierarchyData      );

      // Verify transaction was called
      expect(mockPrismaClient.$transaction).toHaveBeenCalledTimes(1);

      // Verify client hierarchy creation
      expect(mockPrismaClient.clientHierarchy.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: mockHierarchyData.name,
          description: mockHierarchyData.description,
        }),
      });

      // Verify hierarchy levels creation
      expect(mockPrismaClient.hierarchyLevel.create).toHaveBeenCalledTimes(
        mockHierarchyData.hierarchyLevels?.length || 0
      );

     

      // Verify response structure
      expect(response).toEqual(expect.objectContaining({
        id: expect.any(Number),
        clientOrgHierarchyName: mockHierarchyData.name,
        createdHierarchyLevels: expect.arrayContaining([
          expect.objectContaining({
            name: 'Level 1',
            levelOrder: 1,
          }),
        ]),
      }));
    });

    it('should throw RepositoryError when database transaction fails', async () => {
      const errorMessage = 'Database transaction failed';
      mockPrismaClient.$transaction.mockRejectedValue(new Error(errorMessage));

      await expect(
        orgHierarchyRepository.cloneClientOrgHierarchy(mockHierarchyData)
      ).rejects.toThrow(RepositoryError);
      
      await expect(
        orgHierarchyRepository.cloneClientOrgHierarchy(mockHierarchyData)
      ).rejects.toThrow(`Repository Error: ${errorMessage}`);
    });


    it('should handle empty hierarchy levels', async () => {
        const response = await orgHierarchyRepository.cloneClientOrgHierarchy(
          mockHierarchyDataWithoutLevels,
        );
  
        expect(response.createdHierarchyLevels).toHaveLength(0);
        expect(mockPrismaClient.hierarchyLevel.create).not.toHaveBeenCalled();
      });
    });
