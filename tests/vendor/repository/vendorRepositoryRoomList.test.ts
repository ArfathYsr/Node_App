import { PrismaClient } from '@prisma/client';
import VendorRepository from '../../../src/vendor/repositories/vendorRepository'; 
import RepositoryError from '../../../src/error/repositoryError';
import commonRepository from '../../../src/common/repositories/commonRepository';

jest.mock('@prisma/client', () => {
  const actualPrisma = jest.requireActual('@prisma/client');
  return {
    ...actualPrisma,
    PrismaClient: jest.fn().mockImplementation(() => ({
      vendorRoom: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    })),
  };
});

const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('VendorRepository', () => {
  let vendorRepository: VendorRepository;
  let commonRepository: any;

  beforeEach(() => vendorRepository = new VendorRepository(mockPrisma, commonRepository));

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the vendor room details and total count', async () => {
    const mockRequestData = {
      searchText: 'Room 1',
      vendorId: 1,
    };

    const mockVendorRoomData = [
      {
        id: 1,
        roomName: 'Room 1',
        maxCapacity: 100,
        rentalFee: 1000,
        createdAt: new Date(),
        createdBy: 1,
      },
      {
        id: 2,
        roomName: 'Room 2',
        maxCapacity: 200,
        rentalFee: 2000,
        createdAt: new Date(),
        createdBy: 1,
      },
    ];

    const mockTotalCount = 2;

    (mockPrisma.vendorRoom.findMany as jest.Mock).mockResolvedValueOnce(mockVendorRoomData);
    (mockPrisma.vendorRoom.count as jest.Mock).mockResolvedValueOnce(mockTotalCount);

    const result = await vendorRepository.getVendorRoomdetails(mockRequestData);

    expect(result).toEqual({
      totalCount: mockTotalCount,
      vendorRoomdata: mockVendorRoomData,
    });

    expect(mockPrisma.vendorRoom.findMany).toHaveBeenCalledWith({
      where: {
        vendorId: mockRequestData.vendorId,
        OR: [
          { roomName: { contains: mockRequestData.searchText } },
        ],
      },
      select: {
        id: true,
        roomName: true,
        maxCapacity: true,
        rentalFee: true,
        createdAt: true,
        createdBy: true,
      },
    });
    
    expect(mockPrisma.vendorRoom.count).toHaveBeenCalledWith({
      where: {
        vendorId: mockRequestData.vendorId,
        OR: [
          { roomName: { contains: mockRequestData.searchText } },
        ],
      },
    });
  });

  it('should throw a RepositoryError if an error occurs', async () => {
    const mockRequestData = {
      searchText: 'Room 1',
      vendorId: 1,
    };

    const error = new Error('Test error');
    (mockPrisma.vendorRoom.findMany as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });

    await expect(vendorRepository.getVendorRoomdetails(mockRequestData)).rejects.toThrow(RepositoryError)
});
});