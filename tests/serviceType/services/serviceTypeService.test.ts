import ServiceTypeService from '../../../src/serviceType/services/serviceTypeService'; 
import ServiceTypeRepository from '../../../src/serviceType/repositories/serviceTypeRepository';
import { EditServiceTypeInfoResponseDTO, EditServiceTypesRequestDTO, ExistingServiceTypeNameDTO, ServiceOfferingDTO, ServiceTypeDTO, ServiceTypeListShortRequestDto,
         ServiceTypeListShortResponseDto, 
         ViewServiceTypeResponseDTO,
         WorkItemsDTO} from '../../../src/serviceType/dto/serviceType.dto';
import { jest } from '@jest/globals';
import { Prisma} from '@prisma/client';
import { ValidationError } from '../../../src/error/validationError';
import { SERVICE_TYPES_MESSAGES } from '../../../src/utils/Messages/serviceType';
import { NotFoundError } from '../../../src/error/notFoundError';
import { MESSAGES } from '../../../src/utils/message';

let service: ServiceTypeService;
let serviceTypeRepositoryMock: jest.Mocked<ServiceTypeRepository>;

describe('ServiceTypeService - serviceTypeListShort', () => {

   beforeEach(() => {
    const serviceTypeRepositoryMock1 = {
    buildSortCriteria: jest.fn(() => ({
        field: 'name',
        order: 'asc',
    })),
    prisma: {}, // Mock other dependencies
} as unknown as ServiceTypeRepository;


   serviceTypeRepositoryMock = {
     buildSortCriteria: jest.fn(() => ({
        field: 'name',
        order: Prisma.SortOrder.asc
    })),
      serviceTypeListShort: jest.fn() as jest.MockedFunction<(data: ServiceTypeListShortRequestDto) => Promise<{
        serviceTypeListShort: ServiceTypeListShortResponseDto[];
        totalAmount: number;
      }>>,
      serviceTypeList: jest.fn(),
    } as unknown as jest.Mocked<ServiceTypeRepository>
  service = new ServiceTypeService(serviceTypeRepositoryMock);
});

it('should call serviceTypeRepository.serviceTypeListShort with correct data and return the result', async () => {

    const mockRequest: ServiceTypeListShortRequestDto = { searchText: 'Test' };
    const mockResponse = {
      serviceTypeListShort: [
        { id: 1, name: 'Test Service 1', description: 'Description 1' },
        { id: 2, name: 'Test Service 2', description: 'Description 2' },
      ],
      totalAmount: 2,
    };


    (serviceTypeRepositoryMock.serviceTypeListShort as jest.Mock).mockResolvedValue(mockResponse as never);
    const result = await service.serviceTypeListShort(mockRequest);
    expect(serviceTypeRepositoryMock.serviceTypeListShort).toHaveBeenCalledWith(mockRequest);
    expect(result).toEqual(mockResponse);

  });

 it('should throw an error if serviceTypeRepository.serviceTypeListShort fails', async () => {
    const mockRequest: ServiceTypeListShortRequestDto = { searchText: 'Test' };
    const mockError:Error = new Error('Repository Error');

    (serviceTypeRepositoryMock.serviceTypeListShort as jest.Mock).mockRejectedValue(mockError as never);

    await expect(service.serviceTypeListShort(mockRequest)).rejects.toThrow('Repository Error');
    expect(serviceTypeRepositoryMock.serviceTypeListShort).toHaveBeenCalledWith(mockRequest);
  });
});

describe('ServiceTypeService - Edit Service Type', () => {
  beforeEach(() => {
    serviceTypeRepositoryMock = {
      getExistingServiceOfferingIds: jest.fn(),
      checkExistingServiceTypeNameWithExclusion: jest.fn(),
      getExistingWorkItemIds:jest.fn(),
      editServiceType: jest.fn(),
    } as unknown as jest.Mocked<ServiceTypeRepository>;

    service = new ServiceTypeService(serviceTypeRepositoryMock);
  });

  describe('editServiceTypes', () => {
    it('should successfully edit a service type', async () => {
      const data: EditServiceTypesRequestDTO = {
        serviceTypeId: 1,
        serviceOfferingIds: [1, 2],
        workItemIds: [3, 4],
        name: 'Venue management',
        description: 'Venue management desc',
        isActive: true,
        createdBy: 1,
        updatedBy: 1,
      };

      const mockServiceOfferingIds: ServiceOfferingDTO[] = [
        { id: 1 },
        { id: 2 },
      ];

      const mockWorkItemIds: WorkItemsDTO[] = [
        { id: 3 },
        { id: 4 },
      ];

      const mockResponse: EditServiceTypeInfoResponseDTO = {
        serviceTypeInfo: {
          id: 1,
          name: 'Venue management',
          description: 'Venue management desc',
          isActive: true,
          createdBy: 1,
          updatedBy: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        serviceOfferingIds: [1, 2],
        workItemIds: [3, 4]
      };

      serviceTypeRepositoryMock.getExistingServiceOfferingIds.mockResolvedValue(mockServiceOfferingIds);
      serviceTypeRepositoryMock.getExistingWorkItemIds.mockResolvedValue(mockWorkItemIds)
      serviceTypeRepositoryMock.checkExistingServiceTypeNameWithExclusion.mockResolvedValue(null);
      serviceTypeRepositoryMock.editServiceType.mockResolvedValue(mockResponse);

      const result = await service.editServiceTypes(data);

      expect(result).toEqual(mockResponse);
      expect(serviceTypeRepositoryMock.getExistingServiceOfferingIds).toHaveBeenCalledWith([1, 2]);
      expect(serviceTypeRepositoryMock.getExistingWorkItemIds).toHaveBeenCalledWith([3,4])
      expect(serviceTypeRepositoryMock.checkExistingServiceTypeNameWithExclusion).toHaveBeenCalledWith(
        'Venue management',
        1,
      );
      expect(serviceTypeRepositoryMock.editServiceType).toHaveBeenCalledWith(data);
    });

    it('should handle duplicate service type name error', async () => {
      const data: EditServiceTypesRequestDTO = {
        serviceTypeId: 1,
        serviceOfferingIds: [1, 2],
        name: 'AV management 5',
        description: 'AV management 5 desc',
        isActive: true,
        createdBy: 1,
        updatedBy: 1,
      };

      const mockExistingServiceTypeName: ExistingServiceTypeNameDTO = {
        id: 1,
        name: 'AV management 5',
      };

      serviceTypeRepositoryMock.checkExistingServiceTypeNameWithExclusion.mockResolvedValue(mockExistingServiceTypeName);

      await expect(service.editServiceTypes(data)).rejects.toThrow(
        new ValidationError(SERVICE_TYPES_MESSAGES.DUPLICATE_NAME),
      );

      expect(serviceTypeRepositoryMock.checkExistingServiceTypeNameWithExclusion).toHaveBeenCalledWith(
        'AV management 5',
        1,
      );
      expect(serviceTypeRepositoryMock.getExistingServiceOfferingIds).not.toHaveBeenCalled();
      expect(serviceTypeRepositoryMock.editServiceType).not.toHaveBeenCalled();
    });

    it('should handle missing service offering IDs error', async () => {
      const data: EditServiceTypesRequestDTO = {
        serviceTypeId: 1,
        serviceOfferingIds: [1, 2],
        workItemIds: [3,4],
        name: 'AV management 5',
        description: 'AV management 5 desc',
        isActive: true,
        createdBy: 1,
        updatedBy: 1,
      };

      const mockServiceOfferingEntities = [
        { id: 1 },
      ];

      serviceTypeRepositoryMock.checkExistingServiceTypeNameWithExclusion.mockResolvedValue(null);
      serviceTypeRepositoryMock.getExistingServiceOfferingIds.mockResolvedValue(mockServiceOfferingEntities);

      await expect(service.editServiceTypes(data)).rejects.toThrow(
        new NotFoundError(MESSAGES.INVALID_IDS([2], 'Service Offering')),
      );

      expect(serviceTypeRepositoryMock.checkExistingServiceTypeNameWithExclusion).toHaveBeenCalledWith(
        'AV management 5',
        1,
      );
      expect(serviceTypeRepositoryMock.getExistingServiceOfferingIds).toHaveBeenCalledWith([1, 2]);
      expect(serviceTypeRepositoryMock.editServiceType).not.toHaveBeenCalled();
    });
  });
});


describe('ServiceTypeService - View Service Type', () => {
  let service: ServiceTypeService;
  let serviceTypeRepositoryMock: jest.Mocked<ServiceTypeRepository>;

  beforeEach(() => {
    serviceTypeRepositoryMock = {
      viewServiceType: jest.fn(),
    } as unknown as jest.Mocked<ServiceTypeRepository>;

    service = new ServiceTypeService(serviceTypeRepositoryMock);
  });

  describe('viewServiceType', () => {
    it('should return the reformatted service type info when the service type exists', async () => {
      const serviceTypeId = 1;
      const mockServiceTypeInfo: ServiceTypeDTO = {
        id: 1,
        name: 'Venue Management',
        description: 'Venue management desc',
        isActive: true,
        archivedAt: null,
        createdBy: 1,
        cloneId: 1,
        createdAt: new Date('2022-01-01'),
        updatedBy: 1,
        updatedAt: new Date('2022-01-02'),
        serviceTypeOffering: [
          {
            serviceOffering: {
              id: 1,
              name: 'Enterprise Solution',
              description: 'Enterprise Solution services',
              statusId: 1,
            },
          },
        ],
        serviceTypeWorkItem: [
          {
            workItem: {
              id: 1,
              name: 'Invitation to Speak',
              workItemActionType: { name: 'Email' },
              workItemStatus: { name: 'Accepted' },
            },
          },
        ],
        createdByProfile: {
          firstName: "Sourabh",
          lastName: "Kanaka",
        },
        updatedByProfile: {
          firstName: "Sourabh",
          lastName: "Kanaka",
        }
      };

      const expectedResponse: ViewServiceTypeResponseDTO = {
        id: 1,
        name: 'Venue Management',
        description: 'Venue management desc',
        isActive: true,
        archivedAt: null,
        createdBy: 1,
        createdAt: new Date('2022-01-01'),
        updatedBy: 1,
        updatedAt: new Date('2022-01-02'),
        serviceOfferings: [
          {
            id: 1,
            name: 'Enterprise Solution',
            description: 'Enterprise Solution services',
            statusId: 1,
          },
        ],
        workItems: [
          {
            id: 1,
            name: 'Invitation to Speak',
            actionType: 'Email',
            status: 'Accepted',
          },
        ],
      };

      serviceTypeRepositoryMock.viewServiceType.mockResolvedValue(mockServiceTypeInfo);

      const result = await service.viewServiceType(serviceTypeId);

      expect(result).toEqual(expectedResponse);
      expect(serviceTypeRepositoryMock.viewServiceType).toHaveBeenCalledWith(serviceTypeId);
    });

    it('should throw NotFoundError when the service type does not exist', async () => {
      const serviceTypeId = 999;

      serviceTypeRepositoryMock.viewServiceType.mockResolvedValue(null);

      await expect(service.viewServiceType(serviceTypeId)).rejects.toThrow(
        new NotFoundError(SERVICE_TYPES_MESSAGES.SERVICE_TYPE_NOT_FOUND),
      );

      expect(serviceTypeRepositoryMock.viewServiceType).toHaveBeenCalledWith(serviceTypeId);
    });
  });
});

describe('ServiceTypeService - Archive Service Type', () => {
  beforeEach(() => {
    serviceTypeRepositoryMock = {
      viewServiceType: jest.fn(),
      archiveServiceType: jest.fn(),
    } as unknown as jest.Mocked<ServiceTypeRepository>;

    service = new ServiceTypeService(serviceTypeRepositoryMock);
  });

  describe('archiveServiceType', () => {
    it('should successfully archive a service type', async () => {
      const serviceTypeId = 1;

      const mockServiceType: ServiceTypeDTO = {
        id: 1,
        name: 'Test Service',
        description: 'Test Description',
        isActive: true,
        createdBy: 1,
        updatedBy: 1,
        cloneId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        archivedAt: null,
        serviceTypeOffering: [
          {
            serviceOffering: {
              id: 1,
              name: 'Enterprise Solution',
              description: 'Enterprise Solution services',
              statusId: 1,
            },
          },
        ],
        serviceTypeWorkItem: [
          {
            workItem: {
              id: 1,
              name: 'Invitation to Speak',
              workItemActionType: { name: 'Email' },
              workItemStatus: { name: 'Accepted' },
            },
          },
        ],
        createdByProfile: {
          firstName: "Sourabh",
          lastName: "Kanaka",
        },
        updatedByProfile: {
          firstName: "Sourabh",
          lastName: "Kanaka",
        }
      };

      serviceTypeRepositoryMock.viewServiceType.mockResolvedValue(mockServiceType);
      serviceTypeRepositoryMock.archiveServiceType.mockResolvedValue();

      const result = await service.archiveServiceType(serviceTypeId);

      expect(result).toEqual({
        message: SERVICE_TYPES_MESSAGES.ARCHIVED_SUCCESS(serviceTypeId),
      });
      expect(serviceTypeRepositoryMock.viewServiceType).toHaveBeenCalledWith(serviceTypeId);
      expect(serviceTypeRepositoryMock.archiveServiceType).toHaveBeenCalledWith(serviceTypeId);
    });

    it('should handle invalid service type ID error', async () => {
      const serviceTypeId = 9;

      serviceTypeRepositoryMock.viewServiceType.mockResolvedValue(null);

      await expect(service.archiveServiceType(serviceTypeId)).rejects.toThrow(
        new NotFoundError(SERVICE_TYPES_MESSAGES.INVALID_SERVICE_TYPE_ID(serviceTypeId)),
      );

      expect(serviceTypeRepositoryMock.viewServiceType).toHaveBeenCalledWith(serviceTypeId);
      expect(serviceTypeRepositoryMock.archiveServiceType).not.toHaveBeenCalled();
    });

    it('should handle service type already archived error', async () => {
      const serviceTypeId = 1;

      const mockServiceType: ServiceTypeDTO = {
        id: 1,
        name: 'Test Service',
        description: 'Test Description',
        isActive: true,
        createdBy: 1,
        updatedBy: 1,
        cloneId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        archivedAt: new Date(),
        serviceTypeOffering: [
          {
            serviceOffering: {
              id: 1,
              name: 'Enterprise Solution',
              description: 'Enterprise Solution services',
              statusId: 1,
            },
          },
        ],
        serviceTypeWorkItem: [
          {
            workItem: {
              id: 1,
              name: 'Invitation to Speak',
              workItemActionType: { name: 'Email' },
              workItemStatus: { name: 'Accepted' },
            },
          },
        ],
        createdByProfile: {
          firstName: "Sourabh",
          lastName: "Kanaka",
        },
        updatedByProfile: {
          firstName: "Sourabh",
          lastName: "Kanaka",
        }
      };

      serviceTypeRepositoryMock.viewServiceType.mockResolvedValue(mockServiceType);

      await expect(service.archiveServiceType(serviceTypeId)).rejects.toThrow(
        new ValidationError(SERVICE_TYPES_MESSAGES.ARCHIVE_ERROR(serviceTypeId)),
      );

      expect(serviceTypeRepositoryMock.viewServiceType).toHaveBeenCalledWith(serviceTypeId);
      expect(serviceTypeRepositoryMock.archiveServiceType).not.toHaveBeenCalled();
    });
  });
});


describe('ServiceTypeService - unArchiveServiceType', () => {
  let service: ServiceTypeService;
  let serviceTypeRepositoryMock: jest.Mocked<ServiceTypeRepository>;

  beforeEach(() => {
    serviceTypeRepositoryMock = {
      viewServiceType: jest.fn(),
      unArchiveServiceType: jest.fn(),
    } as unknown as jest.Mocked<ServiceTypeRepository>;

    service = new ServiceTypeService(serviceTypeRepositoryMock);
  });

  it('should successfully unarchive a service type', async () => {
    const serviceTypeId = 1;

    const mockServiceType: ServiceTypeDTO = {
      id: 1,
      name: 'Test Service',
      description: 'Test Description',
      isActive: true,
      createdBy: 1,
      updatedBy: 1,
      cloneId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      archivedAt: new Date(),
      serviceTypeOffering: [],
      serviceTypeWorkItem: [],
      createdByProfile: {
        firstName: "Sourabh",
          lastName: "Kanaka",
      },
      updatedByProfile: {
        firstName: "Sourabh",
          lastName: "Kanaka",
      }
    };

    serviceTypeRepositoryMock.viewServiceType.mockResolvedValue(mockServiceType);
    serviceTypeRepositoryMock.unArchiveServiceType.mockResolvedValue();

    const result = await service.unArchiveServiceType(serviceTypeId);

    expect(result).toEqual({
      message: SERVICE_TYPES_MESSAGES.UNARCHIVE_SUCCESS(serviceTypeId),
    });
    expect(serviceTypeRepositoryMock.viewServiceType).toHaveBeenCalledWith(serviceTypeId);
    expect(serviceTypeRepositoryMock.unArchiveServiceType).toHaveBeenCalledWith(serviceTypeId);
  });

  it('should throw NotFoundError for an invalid service type ID', async () => {
    const serviceTypeId = 9;

    serviceTypeRepositoryMock.viewServiceType.mockResolvedValue(null);

    await expect(service.unArchiveServiceType(serviceTypeId)).rejects.toThrow(
      new NotFoundError(SERVICE_TYPES_MESSAGES.INVALID_SERVICE_TYPE_ID(serviceTypeId)),
    );

    expect(serviceTypeRepositoryMock.viewServiceType).toHaveBeenCalledWith(serviceTypeId);
    expect(serviceTypeRepositoryMock.unArchiveServiceType).not.toHaveBeenCalled();
  });

  it('should throw ValidationError if service type is already unarchived', async () => {
    const serviceTypeId = 1;

    const mockServiceType: ServiceTypeDTO = {
      id: 1,
      name: 'Test Service',
      description: 'Test Description',
      isActive: true,
      createdBy: 1,
      updatedBy: 1,
      cloneId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      archivedAt: null,
      serviceTypeOffering: [],
      serviceTypeWorkItem: [],
      createdByProfile: {
        firstName: "Sourabh",
          lastName: "Kanaka",
      },
      updatedByProfile: {
        firstName: "Sourabh",
          lastName: "Kanaka",
      }
    };

    serviceTypeRepositoryMock.viewServiceType.mockResolvedValue(mockServiceType);

    await expect(service.unArchiveServiceType(serviceTypeId)).rejects.toThrow(
      new ValidationError(SERVICE_TYPES_MESSAGES.UNARCHIVE_ERROR(serviceTypeId)),
    );

    expect(serviceTypeRepositoryMock.viewServiceType).toHaveBeenCalledWith(serviceTypeId);
    expect(serviceTypeRepositoryMock.unArchiveServiceType).not.toHaveBeenCalled();
  });
});
