import VendorRepository from '../../../src/vendor/repositories/vendorRepository';
import { mockPrisma } from './data/mockPrisma';
import { mockData, mockResponse } from './data/vendorTestData';
import RepositoryError from '../../../src/error/repositoryError';

describe('VendorRepository', () => {
  let vendorRepository: VendorRepository;
  let commonRepository: any;

  beforeEach(() => {
    commonRepository = {
      getstatusIdByDate: jest.fn().mockResolvedValue([1]),
      getStatusId: jest.fn().mockResolvedValue(1),
    };
    vendorRepository = new VendorRepository(mockPrisma, commonRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a vendor and return the vendor details', async () => {
    (mockPrisma.vendor.create as unknown as jest.Mock).mockResolvedValueOnce(mockResponse);
    (mockPrisma.vendorAddressDetails.count as unknown as jest.Mock).mockResolvedValueOnce(0);
    (mockPrisma.$transaction as unknown as jest.Mock).mockImplementationOnce((fn) => fn(mockPrisma));

    const result = await vendorRepository.createVendor(mockData);

    expect(result).toEqual(mockResponse);
    expect(mockPrisma.vendor.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: mockData.name,
        vendorTypeId: mockData.vendorTypeId,
        isAlsoCaterer: mockData.isAlsoCaterer,
        startDate: mockData.startDate,
        endDate: mockData.endDate,
        additionalInformation: mockData.additionalInformation,
        createdBy: mockData.createdBy,
        updatedBy: mockData.updatedBy,
      }),
    });
  });

  it('should throw a RepositoryError if an error occurs', async () => {
    const error = new Error('Test error');
    (mockPrisma.$transaction as unknown as jest.Mock).mockImplementationOnce(() => {
      throw error;
    });

    await expect(vendorRepository.createVendor(mockData)).rejects.toThrow(RepositoryError);
  });
});
