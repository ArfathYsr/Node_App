import { PrismaClient, Prisma } from '@prisma/client';
import VendorRepository from '../../../src/vendor/repositories/vendorRepository'; 
import { VendorListResponseDTO } from '../../../src/vendor/dto/vendor.dto';
import RepositoryError from '../../../src/error/repositoryError';

jest.mock('@prisma/client', () => {
  const actualPrisma = jest.requireActual('@prisma/client');
  return {
    ...actualPrisma,
    PrismaClient: jest.fn().mockImplementation(() => ({
      vendor: {
        count: jest.fn(),
      },
      $transaction: jest.fn(),
    })),
  };
});

const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
let commonRepository: any;

describe('VendorRepository', () => {
  let vendorRepository: VendorRepository;

  beforeEach(() => {
    vendorRepository = new VendorRepository(mockPrisma, commonRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the vendor list and pagination details', async () => {
    const mockRequestData = {
      searchText: 'test',
      filter: {},
      sortBy: 'name',
      offset: 0,
      limit: 10,
      startDate: new Date(),
      endDate: new Date(),
    };

    const mockVendorList = [
      {
        id: 1,
        name: 'Vendor 1',
    
      },
      {
        id: 2,
        name: 'Vendor 2',
     
      },
    ];

    const mockVendorCount = 2;

    jest.spyOn(vendorRepository as any, 'buildWhereClause').mockReturnValue({});
    jest.spyOn(vendorRepository as any, 'buildSortCriteria').mockReturnValue({});
    jest.spyOn(vendorRepository as any, 'buildSortMapping').mockReturnValue({});
    jest.spyOn(vendorRepository as any, 'fetchVendorList').mockResolvedValue(mockVendorList);
    (mockPrisma.vendor.count as jest.Mock).mockResolvedValue(mockVendorCount);

    const result = await vendorRepository.getVendorList(mockRequestData);

    expect(result).toEqual({
      vendorList: mockVendorList,
      totalAmount: mockVendorCount,
      totalPages: 1,
      nextPage: false,
    });

    expect(vendorRepository['buildWhereClause']).toHaveBeenCalledWith({
      searchText: 'test',
      filter: {},
      startDate: mockRequestData.startDate,
      endDate: mockRequestData.endDate,
    });
    expect(vendorRepository['buildSortCriteria']).toHaveBeenCalledWith('name');
    expect(vendorRepository['buildSortMapping']).toHaveBeenCalledWith({});
    expect(vendorRepository['fetchVendorList']).toHaveBeenCalledWith(
      {},
      {},
      0,
      10,
    );
    expect(mockPrisma.vendor.count).toHaveBeenCalledWith({
      where: {},
    });
  });

  it('should throw a RepositoryError if an error occurs', async () => {
    const mockRequestData = {
      searchText: 'test',
      filter: {},
      sortBy: 'name',
      offset: 0,
      limit: 10,
      startDate: new Date(),
      endDate: new Date(),
    };

    const error = new Error('Test error');
    jest.spyOn(vendorRepository as any, 'buildWhereClause').mockImplementationOnce(() => {
      throw error;
    });

    await expect(vendorRepository.getVendorList(mockRequestData)).rejects.toThrow(RepositoryError);
  });
});
