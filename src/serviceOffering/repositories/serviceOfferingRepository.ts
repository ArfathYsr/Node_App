import { Prisma, PrismaClient, serviceOffering } from '@prisma/client';
import { inject, injectable } from 'inversify';
import RepositoryError from '../../error/repositoryError';
import TYPES from '../../dependencyManager/types';
import {
  ListWorkItemResponse,
  ServiceTypeWorkItemResponse,
  ServiceTypeWorkItemRequest,
  workItemResponse,
  ExistingServiceOfferingNameDTO,
  ServiceOfferingDTO,
  ServiceOfferingDataDTO,
  ArchiveOrUnarchiveServiceOfferingDto,
  BulkEditServiceOfferingRequestDTO,
  ServiceOffering,
  GetExistingWorkItems,
  GetExistingServiceOfferings,
  GetExistingServiceTypes,
  ListWorkItemByServiceTypeResponse,
  ListWorkItemRequest,
  serviceTypeOfferingDataDTO,
  ViewServiceOfferingResponseDto,
  WorkItemData,
} from '../dto/serviceOffering.dto';
import { CreateServiceOfferingRequest,
  ServiceOfferingResponseDtos,
  ServiceOfferingResponseDto,
  SortCriteriaDTO, 
  SortMappingDTO, 
  ServiceOfferingDto,
  CreateServiceOfferingResponse, 
} from '../dto/serviceOffering.dto';
import { ERRORMESSAGE } from '../../utils/errorMessage';
import { SERVICE_OFFERING_MESSAGES } from '../../utils/Messages/serviceOfferingMessage';
import { buildArchivedFilter } from '../../utils/utils';

@injectable()
export default class ServiceOfferingRepository {
  private readonly prisma: PrismaClient;

  constructor(
    @inject(TYPES.PrismaClient) prisma: PrismaClient,
  ) {
    this.prisma = prisma;
  }

  async createServiceOffering(serviceOfferingData: CreateServiceOfferingRequest): Promise<CreateServiceOfferingResponse> {
    try {
      delete serviceOfferingData.type
      const {serviceTypeData, ...serviceOfferingPayload } = serviceOfferingData
      const serviceOfferingResponse: ServiceOfferingResponseDto =
      await this.prisma.$transaction(async (prisma) => {
        return await prisma.serviceOffering.create({
          data: {
            ...serviceOfferingPayload,
            serviceTypeOffering: {
              create: serviceTypeData?.map(({ serviceTypeId }) => ({
                serviceTypeId,
                createdBy: serviceOfferingPayload.createdBy,
                updatedBy: serviceOfferingPayload.updatedBy,
              })),
            },
          },
        });
      });

        const serviceTypeWorkItems: any[] = [];
        if(serviceOfferingData.serviceTypeData){
        for (const item of serviceOfferingData.serviceTypeData) {
          const { serviceTypeId, workItemIds } = item;
  
         const serviceTypeWorkingItemMappingData = workItemIds.map((workItemId) => ({
            serviceTypeId,
            workItemId,
            createdBy: serviceOfferingData.createdBy,
            updatedBy: serviceOfferingData.updatedBy,
          }));
  
          await this.prisma.serviceTypeWorkItem.createMany({
            data: serviceTypeWorkingItemMappingData,
          });
  
          serviceTypeWorkItems.push(...serviceTypeWorkingItemMappingData);
  
           await this.prisma.serviceTypeOffering.updateMany({
            where: { serviceTypeId },
            data: {
              updatedBy: serviceOfferingData.createdBy,
              updatedAt: new Date(),
            },
          });
  
        }
        }
        
      const response: CreateServiceOfferingResponse = {
      data: {
        name: serviceOfferingResponse.name,
        serviceOfferingCodeId: serviceOfferingResponse.serviceOfferingCodeId,
        description: serviceOfferingResponse.description,
        id: serviceOfferingResponse.id,
        isActive : serviceOfferingResponse.isActive,
        createdBy: serviceOfferingResponse.createdBy,
        updatedBy: serviceOfferingData.updatedBy,
        serviceTypeData: serviceTypeWorkItems
      },
    };

    return response;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async findServiceOfferingByName(serviceOfferingName: string): Promise<ServiceOfferingResponseDto | null> {
    return this.prisma.serviceOffering.findFirst({
      where: {
        name: serviceOfferingName,
      },
    });
  }

  async findInvalidWorkItemIds(workItemIds: number[]): Promise<number[]> {
    // Fetch the existing work item IDs that match the input IDs
    const existingWorkItemIds = await this.prisma.workItem.findMany({
      where: {
        id: {
          in: workItemIds,
        },
      },
      select: {
        id: true,
      },
    });
  
    // Extract IDs from the query result
    const existingIds = existingWorkItemIds.map((item) => item.id);
  
    // Filter out invalid IDs
    const invalidIds = workItemIds.filter((id) => !existingIds.includes(id));
  
    return invalidIds;
  }  

  async listWorkItem(data: ListWorkItemRequest): Promise<ListWorkItemResponse> {
    try {
      const { serviceTypeId } = data;
      let workItemList: workItemResponse[];
      if (!serviceTypeId) {
        workItemList = await this.prisma.workItem.findMany({
          select: {
            id: true,
            name: true,
            actionTypeId: true,
            workItemActionType:{
              select:{
                name: true
              }
            }
          },
        });
        return { workItemList };
      }
      const workItemListByServiceType: ListWorkItemByServiceTypeResponse[] =
        await this.prisma.serviceTypeWorkItem.findMany({
          where: { serviceTypeId: serviceTypeId },
          select: {
            serviceTypeId: true,
            workItem: {
              select: {
                id: true,
                name: true,
                workItemActionType:{
                  select:{
                    name: true
                  }
                }
              },
            },
          },
        });
       workItemList = workItemListByServiceType.map(
        (item: ListWorkItemByServiceTypeResponse) => item.workItem,
      );
      return {
        workItemList,
      };
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

async serviceTypeWorkItem(serviceOfferingData: ServiceTypeWorkItemRequest): Promise<ServiceTypeWorkItemResponse> {
 try {
    const serviceTypeWorkItems:ServiceTypeWorkItemResponse['serviceTypeWorkItems']= 
      await this.prisma.$transaction(async (prisma) => {
        return await Promise.all(
          serviceOfferingData.workItemId.map(async (workItemId) => {
            return prisma.serviceTypeWorkItem.create({
              data: {
                serviceTypeId: serviceOfferingData.serviceTypeId,
                workItemId: workItemId, 
                status: serviceOfferingData.status,
                createdBy: serviceOfferingData.createdBy,
                updatedBy: serviceOfferingData.updatedBy,
              },
            });
          })
        );
      });


    return {
      serviceTypeWorkItems: serviceTypeWorkItems,
    };
  } catch (err: unknown) {
    const error = err as Error;
    throw new RepositoryError(
      `Repository Error: ${error.message || 'Unknown error'}`,
    );
  }
}

  private buildSortCriteria(sortBy: any): SortCriteriaDTO {
    const validFields = ['id', 'name', 'status', 'serviceType', 'createdAt', 'updatedAt'];
    const field = sortBy?.field && validFields.includes(sortBy.field) ? sortBy.field : 'id';
    const order = sortBy?.order?.toLowerCase() === 'desc' ? Prisma.SortOrder.desc : Prisma.SortOrder.asc;
  
    // Map serviceType to nested field
    if (field === 'serviceType') {
      return { field: 'serviceTypeOffering.serviceType.id', order };
    }
  
    return { field, order };
  }  
    
  private addCondition = (array, condition) => [...(array || []), condition];

  private buildWhereClause({
    searchText,
    filter,
  }: {
    searchText?: string;
    filter?: {
      name?: string;
      description?: string;
      isActive?: boolean;
      archived?: number;
      id?: number;
      serviceType?: string | number;
    };
  }): Prisma.serviceOfferingWhereInput {
    const whereClause: Prisma.serviceOfferingWhereInput = {};
  
    // Case-insensitive filtering by name
    if (filter?.name) {
      whereClause.AND = this.addCondition(whereClause.AND, {
        name: { contains: filter.name.trim() } as Prisma.StringFilter, // Ensure it's cast correctly
      });
    } 

    if (filter?.isActive) {
      whereClause.isActive = filter.isActive;
    }
      
    
  // Filter by archived (integer)
  if (filter?.archived) {
    whereClause.AND  = buildArchivedFilter(filter.archived);
  }

  // Filter by serviceType
  if (filter?.serviceType) {
    let serviceTypeIds: number[];
    if (Array.isArray(filter.serviceType)) {
      // Already an array, use it directly
      serviceTypeIds = filter.serviceType;
    } else if (typeof filter.serviceType === 'string') {
      // Convert comma-separated string to an array of numbers
      serviceTypeIds = filter.serviceType.split(',').map(Number);
    } else {
      throw new Error(ERRORMESSAGE.INVALID_FILTER_FORMAT); // Handle unexpected types
    }

    whereClause.serviceTypeOffering = {
      some: {
        serviceType: {
          id: { in: serviceTypeIds },
        },
      },
    };
  }
  
  
    // Handle dynamic search text
    if (searchText) {
      const trimmedSearchText = searchText.trim(); // Trim to handle leading/trailing spaces
  
      whereClause.OR = [
        // Match ID
        { id: { equals: !isNaN(Number(trimmedSearchText)) ? Number(trimmedSearchText) : undefined } },
        
        // Match name
        { name: { contains: trimmedSearchText } as Prisma.StringFilter },
        
        // Match description
        { description: { contains: trimmedSearchText } as Prisma.StringFilter },
        
        // Match status
        { isActive : { equals: trimmedSearchText.toLowerCase() === 'active' ? true : trimmedSearchText.toLowerCase() === 'inactive' ? false : undefined } },
        
        // Match serviceOfferingId
        { serviceOfferingCodeId: { equals: !isNaN(Number(trimmedSearchText)) ? Number(trimmedSearchText) : undefined } },
        
        // Match serviceType (nested filter)
        {
          serviceTypeOffering: {
            some: {
              serviceType: {
                name: { contains: trimmedSearchText } as Prisma.StringFilter, // Correct Prisma type
              },
            },
          },
        }
      ];
      if ((!isNaN(Number(trimmedSearchText)) ? Number(trimmedSearchText) : undefined) !== undefined) {
        whereClause.OR.push({
          serviceTypeOffering: {
            some: {
              serviceType: {
                id: { equals: Number(trimmedSearchText) }
              }
            }
          }
        })
      }
    }
  
    return whereClause;
  }  

  private async fetchServiceOfferingList(
    whereClause: Prisma.serviceOfferingWhereInput,
    // orderBy: any
    sortCriteria: SortCriteriaDTO, // Accept SortCriteriaDTO instead
  ): Promise<ServiceOfferingDto[]> {
    return this.prisma.serviceOffering.findMany({
      where: whereClause,
      // orderBy,
      orderBy: {
        [sortCriteria.field]: sortCriteria.order, // Mapped field will be used here
      },
      select: { 
      id: true, 
      name: true, 
      description: true, 
      isActive : true ,
      serviceOfferingCodeId: true, 
      serviceTypeOffering: { 
        select: {
          serviceType: {
            select: {
              id: true, 
              name: true, 
            },
          },
        },
      },
    },
    });
  }

  async getExistingServiceOfferingIds(
    serviceOfferingIds: number[],
  ): Promise<ServiceOfferingDTO[]> {
    try {
      const existingServiceOfferingIds: ServiceOfferingDTO[] =
        await this.prisma.serviceOffering.findMany({
          where: { id: { in: serviceOfferingIds } },
          select: { id: true },
        });
      return existingServiceOfferingIds;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async checkExistingServiceTypeNameWithExclusion(
    name: string,
    excludedId: number,
  ): Promise<ExistingServiceOfferingNameDTO | null> {
    try {
      return await this.prisma.serviceType.findFirst({
        where: {
          name,
          id: {
            not: excludedId,
          },
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }
  
  async editServiceOffering(
    serviceOfferingId: number,
    serviceOfferingData: ServiceOfferingDataDTO,
    serviceTypeData: { serviceTypeId: number; workItemIds: number[] }[],
    profileId: number
  ): Promise<void> {
    try {
        await this.prisma.$transaction(async (prisma) => {
         await prisma.serviceOffering.update({
          where: { id: serviceOfferingId },
          data: {
            name: serviceOfferingData.name,
            description: serviceOfferingData.description,
            isActive : serviceOfferingData.isActive,
            serviceOfferingCodeId: serviceOfferingData?.serviceOfferingCodeId,
            updatedBy: profileId,
          },
        });
        
        const serviceTypeOfferingList = serviceTypeData.map((item) => ({
          serviceOfferingId,
          serviceTypeId: item.serviceTypeId,
          createdBy:profileId,
          updatedBy: profileId,
        }));

        //fetch already aligned serviceTypeOffering item with serviceOffering
       const serviceTypeOfferingData: serviceTypeOfferingDataDTO[] =
       await prisma.serviceTypeOffering.findMany({
        where : {serviceOfferingId: serviceOfferingId},
        select: {
          serviceTypeId: true
        }
      })

      const alignedserviceTypeIds: number[] = serviceTypeOfferingData.map((item=>item.serviceTypeId))

      let serviceTypeIds: number[] = serviceTypeOfferingList.map((item=>item.serviceTypeId))

      serviceTypeIds = [...alignedserviceTypeIds,...serviceTypeIds]


        const serviceTypeWorkItemList = serviceTypeData.flatMap((item) =>
          item.workItemIds.map((workItemId) => ({
            serviceTypeId: item.serviceTypeId,
            workItemId,
            createdBy: profileId,
            updatedBy: profileId,
          }))
        );

        //delete already aligned serviceTypeOffering item
        await prisma.serviceTypeOffering.deleteMany({
          where : {serviceOfferingId: serviceOfferingId}
        })

        //aligned updated serviceTypeOffering item
        await prisma.serviceTypeOffering.createMany({
          data : serviceTypeOfferingList
        })

       //delete already aligned serviceTypeWorkItem item
        await prisma.serviceTypeWorkItem.deleteMany({
          where : {serviceTypeId: {in: serviceTypeIds}}
        })

        //aligned updated serviceTypeWorkItem item
        await prisma.serviceTypeWorkItem.createMany({
          data : serviceTypeWorkItemList
        })

        return;
      });
    } catch (err) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async getServiceOfferingList(serviceOfferingListRequestData): Promise<ServiceOfferingResponseDtos> {
    try {
      const { searchText, filter, sortBy } =
      serviceOfferingListRequestData;

      const whereClause: Prisma.serviceOfferingWhereInput = this.buildWhereClause({ searchText, filter });

      // Generate SortCriteriaDTO
      const sortCriteria: SortCriteriaDTO = this.buildSortCriteria(sortBy);
  
      // Fetch service offering list with dynamic sorting and pagination
      const serviceOfferingList = await this.fetchServiceOfferingList(whereClause, sortCriteria);
  
      // Count total records
      const serviceOfferingListCount: number = await this.prisma.serviceOffering.count({
        where: whereClause,
      });
  
      return {
        serviceOfferingList,
        totalCount: serviceOfferingListCount,
      };

    } catch (err) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

    async checkServiceOfferingId(id: number) {
      try {
        const cloneIdData: { id: number } | null =
          await this.prisma.serviceOffering.findUnique({
            where: { id },
            select: {
              id: true,
            },
          });
  
        return cloneIdData;
      } catch (err: unknown) {
        const error = err as Error;
        throw new RepositoryError(
          `Repository Error: ${error.message || 'Unknown error'}`,
        );      }
    }

async archiveServiceOffering(data: ArchiveOrUnarchiveServiceOfferingDto){
  try {
    await this.prisma.serviceOffering.updateMany({
      where: { id: { in: data.serviceOfferingIds } },
      data: {
        archivedAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    throw new RepositoryError(
      `Repository Error: ${error.message || 'Unknown error'}`,
    );
  }
}

async unarchiveServiceOffering(data: ArchiveOrUnarchiveServiceOfferingDto){
  try {
    await this.prisma.serviceOffering.updateMany({
      where: { id: { in: data.serviceOfferingIds } },
      data: {
        archivedAt: null,
      },
    });
  } catch (err: unknown) {
    const error = err as Error;
    throw new RepositoryError(
      `Repository Error: ${error.message || 'Unknown error'}`,
    );
  }
}

  async getMissingServiceOfferingIds(serviceOfferingIds: number[]): Promise<number[]> {
    const serviceOfferings = await this.prisma.serviceOffering.findMany({
      where: { id: { in: serviceOfferingIds } },
      select: { id: true },
    });
  
    const foundIds = serviceOfferings.map((offering) => offering.id);
    return serviceOfferingIds.filter((id) => !foundIds.includes(id));
  }

  async getDeactivatedServiceOfferingIds(serviceOfferingIds: number[]): Promise<number[]> {
    const deactivatedServiceOfferings = await this.prisma.serviceOffering.findMany({
      where: { id: { in: serviceOfferingIds }, isActive : false },
      select: { id: true },
    });
  
    return deactivatedServiceOfferings.map((offering) => offering.id);
  }

  async getArchivedServiceOfferingIds(
    serviceOfferingIds: number[]
  ): Promise<number[]> {
    const results = await this.prisma.serviceOffering.findMany({
      where: {
        id: { in: serviceOfferingIds },
        archivedAt: { not: null },
      },
      select: { id: true },
    });
    return results.map((r) => r.id);
  }
  
  async getUnarchivedServiceOfferingIds(
    serviceOfferingIds: number[]
  ): Promise<number[]> {
    const results = await this.prisma.serviceOffering.findMany({
      where: {
        id: { in: serviceOfferingIds },
        archivedAt: null,
      },
      select: { id: true },
    });
    return results.map((r) => r.id);
  }

  async getExistingWorkItems(): Promise<GetExistingWorkItems> {
    try {
      return await this.prisma.workItem.findMany({
          select: {
            id: true,
          },
        });
  
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async getExistingServiceOfferings(): Promise<GetExistingServiceOfferings> {
    try {
     return await this.prisma.serviceOffering.findMany({
          select: {
            id: true,
          },
        });
  
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async getExistingServiceTypes(): Promise<GetExistingServiceTypes> {
    try {
      return await this.prisma.serviceType.findMany({
          select: {
            id: true,
          },
        });
  
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async bulkEditServiceOffering(
    serviceOfferingEditPayload: BulkEditServiceOfferingRequestDTO,
    updatedBy: number
  ){
    try {

        const { ids, isActive ,serviceTypeIds } = serviceOfferingEditPayload;
        return await this.prisma.$transaction(async (prisma) => {
        await prisma.serviceOffering.updateMany({
          where: { id: { in: ids } },
          data: {
            isActive : isActive,
            updatedBy: updatedBy,
          },
        });

        if(serviceTypeIds.length){
           await prisma.serviceTypeOffering.deleteMany({
            where: { serviceOfferingId: { in: ids } },
           });


           const createData = ids.flatMap(serviceOfferingId =>
            serviceTypeIds.map(serviceTypeId => ({
              serviceOfferingId,
              serviceTypeId,
              createdBy: updatedBy,
              updatedBy,
            }))
          );
          
          await prisma.serviceTypeOffering.createMany({
            data: createData
          });
        }
      })
    } catch (err) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async viewServiceOffering(
    serviceOfferingId: number
  ): Promise<ViewServiceOfferingResponseDto> {
    try {
      const serviceOfferingData: ViewServiceOfferingResponseDto = await this.prisma.serviceOffering.findUnique({
        where: { id: serviceOfferingId },
        select: {
          id: true,
          name: true,
          description: true,
          isActive: true,
          serviceOfferingCodeId: true,
          createdAt: true,
          createdByProfile: {
            select: { firstName: true, lastName: true },
          },
          updatedAt: true,
          updatedByProfile: {
            select: { firstName: true, lastName: true },
          },
          serviceTypeOffering: {
            select: {
              serviceTypeId: true,
              serviceType: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });



      if(serviceOfferingData && serviceOfferingData?.serviceTypeOffering?.length){
        const serviceTypeIds: number[] = serviceOfferingData?.serviceTypeOffering.map(item=>item.serviceTypeId)

        const workItemData: WorkItemData[] = await this.prisma.serviceTypeWorkItem.findMany({
          where: {
            serviceTypeId: {
              in: serviceTypeIds,
            },
          },
          select:{
            workItem:{
              select:{
                name: true,
                workItemActionType:{
                  select:{
                    name: true
                  }
                }
              }
            }
          }
        });

        serviceOfferingData.serviceTypes = serviceOfferingData.serviceTypeOffering.map(item => ({
          serviceTypeId: item.serviceTypeId,
          name: item.serviceType.name,
        }));

        delete serviceOfferingData.serviceTypeOffering;

        serviceOfferingData.workItems = workItemData.map((item) => ({
          name: item.workItem.name,
          actionTypeName: item.workItem.workItemActionType.name,
        }));
      }

      return serviceOfferingData;

    } catch (err) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }
}

