import { PrismaClient, vendor } from '@prisma/client';
import VendorRepository from '../../../src/vendor/repositories/vendorRepository'; 
import RepositoryError from '../../../src/error/repositoryError';

jest.mock('@prisma/client', () => {
  const actualPrisma = jest.requireActual('@prisma/client');
  return {
    ...actualPrisma,
    PrismaClient: jest.fn().mockImplementation(() => ({
      vendor: {
        findUnique: jest.fn(),
      },
    })),
  };
});

const mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;

describe('VendorRepository', () => {
  let vendorRepository: VendorRepository;
  let commonRepository: any;


  beforeEach(() => {
    vendorRepository = new VendorRepository(mockPrisma,commonRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the vendor data when found', async () => {
    const mockVendor: vendor = {
        id: 1,
        name: 'Test Vendor',
        createdAt: new Date(),
        createdBy: 0,
        updatedAt: new Date(),
        updatedBy: 0,
        vendorTypeId: 0,
        isAlsoCaterer: false,
        vendorStatusId: 0,
        startDate: null,
        endDate: null,
        additionalInformation: null,
        dba: null,
        websiteUrl: null,
        facebookUrl: null,
        instagramUrl: null
    };
    
    (mockPrisma.vendor.findUnique as jest.Mock).mockResolvedValueOnce(mockVendor);

    const result = await vendorRepository.getVendorById(1);

    expect(result).toEqual(mockVendor);
    expect(mockPrisma.vendor.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      include: {
        addresses: true,
        contacts: true,
        clientVendors: {
          include: {
            client: true,
          },
        },
        createdByProfile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        updatedByProfile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  });

  it('should return null when vendor not found', async () => {
    (mockPrisma.vendor.findUnique as jest.Mock).mockResolvedValueOnce(null);

    const result = await vendorRepository.getVendorById(2);

    expect(result).toBeNull();
    expect(mockPrisma.vendor.findUnique).toHaveBeenCalledWith({
      where: { id: 2 },
      include: {
        addresses: true,
        contacts: true,
        clientVendors: {
          include: {
            client: true,
          },
        },
        createdByProfile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        updatedByProfile: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  });

  it('should throw a RepositoryError if an error occurs', async () => {
    const error = new Error('Test error');
    (mockPrisma.vendor.findUnique as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });

    await expect(vendorRepository.getVendorById(3)).rejects.toThrow(RepositoryError);
  });
});
