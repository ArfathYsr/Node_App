import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import { buildArchivedFilter, repositoryError } from '../../utils/utils';
import {
  AddServiceTypeInfoResponseDTO,
  AddServiceTypesRequestDTO,
  EditServiceTypeInfoResponseDTO,
  EditServiceTypesRequestDTO,
  ExistingServiceTypeNameDTO,
  ServiceOfferingDTO,
  ServiceTypeDTO,
  ServiceTypeDto,
  ServiceTypeInfoDTO,
  ServiceTypeListRequestDto,
  ServiceTypeListShortRequestDto,
  ServiceTypeListShortResponseDto,
  ServiceTypeOfferingDataDTO,
  ServiceTypeWorkItemDataDTO,
  WorkItemsDTO,
} from '../dto/serviceType.dto';
import RepositoryError from '../../error/repositoryError';
import { COMMON } from '../../utils/common';
import { SERVICE_TYPES_MESSAGES } from '../../utils/Messages/serviceType';

@injectable()
export default class ServiceTypeRepository {
  private readonly prisma: PrismaClient;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private buildSortCriteria(sortBy: any): {
    field: string;
    order: Prisma.SortOrder;
  } {
    return sortBy
      ? {
          field: sortBy.field,
          order:
            sortBy.order.toLowerCase() === 'asc'
              ? Prisma.SortOrder.asc
              : Prisma.SortOrder.desc,
        }
      : { field: 'id', order: 'asc' };
  }

  async serviceTypeList(data: ServiceTypeListRequestDto) {
    try {
      const { searchText, sortBy, offset, limit, filter } = data;
      const { serviceOfferingIds = [], status } = data.filter ?? {};
      const whereClause: Prisma.serviceTypeWhereInput = {};

      const pageSize: number = limit || 20;

      const sortCriteria: {
        field: string;
        order: Prisma.SortOrder;
      } = this.buildSortCriteria(sortBy);

      if (searchText) {
        const numericSearch = parseInt(searchText, 10);
        whereClause.OR = [
          { name: { contains: searchText} },
          { description: { contains: searchText} },
          {
            serviceTypeOffering: {
              some: { serviceOffering: { name: { contains: searchText } } },
            },
          },
        ];
        if (searchText.toLowerCase() === 'active' || searchText.toLowerCase() === 'inactive') {
          whereClause.OR.push(
            {
            isActive : {
              equals : searchText.toLowerCase() === 'active'
            }
          })
        }
        if (!isNaN(numericSearch)) {
          whereClause.OR.push(
            { id: { equals: numericSearch } },
          )
        }
      }

      if (filter) {
        const { isArchived, status } = filter;
        if (isArchived !== undefined) {
          const archivedFilter = buildArchivedFilter(filter.isArchived);
          whereClause.archivedAt = archivedFilter.archivedAt;
        }
        if (status === 1 || status === 2) {
          whereClause.isActive =  status === 1 ? true : false;
        }
      }

      const orderBy: { [x: string]: Prisma.SortOrder } = {
        [sortCriteria.field]: sortCriteria.order,
      };
      const serviceTypeList: ServiceTypeDto[] =
        await this.prisma.serviceType.findMany({
          where: {
            ...whereClause,
            ...(serviceOfferingIds?.length > 0 && {
              serviceTypeOffering: {
                some: {
                  serviceOfferingId: {
                    in: serviceOfferingIds,
                  },
                },
              },
            }),
          },
          orderBy,
          skip: offset,
          take: limit,
          include: {
            serviceTypeOffering: {
              select: {
                serviceOffering: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        });
      const serviceTypelistCount: number = await this.prisma.serviceType.count({
        where: {
          ...whereClause,
          ...(serviceOfferingIds?.length > 0 && {
            serviceTypeOffering: {
              some: {
                serviceOfferingId: {
                  in: serviceOfferingIds,
                },
              },
            },
          }),
        },
      });
      const totalPages: number = Math.ceil(serviceTypelistCount / pageSize);
      const nextPage: boolean = offset + pageSize < serviceTypelistCount;

      return {
        serviceTypeList,
        totalAmount: serviceTypelistCount,
        totalPages,
        nextPage,
      };
    } catch (err: unknown) {
      repositoryError(err);
    }
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

  async getExistingWorkItemIds(workItemIds: number[]): Promise<WorkItemsDTO[]> {
    try {
      const existingWorkItemIds: WorkItemsDTO[] =
        await this.prisma.workItem.findMany({
          where: { id: { in: workItemIds } },
          select: { id: true },
        });
      return existingWorkItemIds;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async checkExistingServiceTypeName(
    name: string,
  ): Promise<ExistingServiceTypeNameDTO> {
    try {
      return await this.prisma.serviceType.findUnique({
        where: { name },
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

  async findValidCloneId(id: number) {
    try {
      const cloneIdData: { id: number } | null =
        await this.prisma.serviceType.findUnique({
          where: { id },
          select: {
            id: true,
          },
        });

      return cloneIdData;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async checkExistingServiceTypeNameWithExclusion(
    name: string,
    excludedId: number,
  ): Promise<ExistingServiceTypeNameDTO | null> {
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

  async addServiceType(
    data: AddServiceTypesRequestDTO,
  ): Promise<AddServiceTypeInfoResponseDTO> {
    try {
      const {
        serviceOfferingIds,
        workItemIds,
        createdBy,
        updatedBy,
        type,
        cloneId,
        ...serviceType
      }: AddServiceTypesRequestDTO = data;

      return await this.prisma.$transaction(async (prisma) => {
        const serviceTypeInfo: ServiceTypeInfoDTO =
          await prisma.serviceType.create({
            data: {
              name: serviceType.name,
              description: serviceType.description,
              isActive: serviceType.isActive,
              cloneId: type === COMMON.CLONE ? cloneId : null,
              createdBy,
              updatedBy,
            },
          });

        const serviceTypeId: number = serviceTypeInfo.id;

        const serviceTypeOfferingData: ServiceTypeOfferingDataDTO =
          serviceOfferingIds.map((serviceOfferingId) => ({
            serviceTypeId,
            serviceOfferingId,
            createdBy,
            updatedBy,
          }));

        const serviceTypeWorkItemData: ServiceTypeWorkItemDataDTO =
          (workItemIds &&
            workItemIds?.map((workItemId) => ({
              serviceTypeId,
              workItemId,
              createdBy,
              updatedBy,
            }))) ||
          [];

        const alignPromises = [
          prisma.serviceTypeOffering.createMany({
            data: serviceTypeOfferingData,
          }),
        ];

        if (serviceTypeWorkItemData.length > 0) {
          alignPromises.push(
            prisma.serviceTypeWorkItem.createMany({
              data: serviceTypeWorkItemData,
            }),
          );
        }
        await Promise.all(alignPromises);
        if (workItemIds) {
          return {
            serviceTypeInfo,
            serviceOfferingIds,
            workItemIds,
          };
        } else {
          return {
            serviceTypeInfo,
            serviceOfferingIds,
            workItemIds: [],
          };
        }
      });
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async serviceTypeListShort(data: ServiceTypeListShortRequestDto) {
    try {
      const { searchText } = data;

      const whereClause: Prisma.serviceTypeWhereInput = {};

      if (searchText) {
        whereClause.AND = [
          { isActive: true },
          {
            OR: [{ name: { contains: searchText } }],
          },
        ];
      } else {
        whereClause.isActive = true;
      }

      const serviceTypeListShort: ServiceTypeListShortResponseDto[] =
        await this.prisma.serviceType.findMany({
          where: whereClause,
          select: {
            id: true,
            name: true,
            description: true,
          },
        });
      const serviceTypelistCount: number = await this.prisma.serviceType.count({
        where: whereClause,
      });

      return {
        serviceTypeListShort,
        totalServiceTypeCount: serviceTypelistCount,
      };
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async editServiceType(
    data: EditServiceTypesRequestDTO,
  ): Promise<EditServiceTypeInfoResponseDTO> {
    try {
      const {
        serviceTypeId,
        serviceOfferingIds = [],
        workItemIds = [],
        createdBy,
        updatedBy,
        ...serviceData
      }: EditServiceTypesRequestDTO = data;

      return await this.prisma.$transaction(async (prisma) => {
        const serviceTypeInfo: ServiceTypeInfoDTO =
          await prisma.serviceType.update({
            where: { id: serviceTypeId },
            data: {
              ...serviceData,
              updatedBy,
            },
          });

        if (serviceOfferingIds.length > 0) {
          await prisma.serviceTypeOffering.deleteMany({
            where: { serviceTypeId },
          });

          const createServiceTypeOfferingData:ServiceTypeOfferingDataDTO = serviceOfferingIds.map(
            (id) => ({
              serviceTypeId,
              serviceOfferingId: id,
              createdBy,
              updatedBy,
            }),
          );

          await prisma.serviceTypeOffering.createMany({
            data: createServiceTypeOfferingData,
          });          
        }

        if (workItemIds && workItemIds.length > 0) {
          await prisma.serviceTypeWorkItem.deleteMany({
            where: { serviceTypeId },
          });
  
          const createServiceTypeWorkItemData: ServiceTypeWorkItemDataDTO = workItemIds.map((id) => ({
            serviceTypeId,
            workItemId: id,
            createdBy,
            updatedBy,
          }));
  
          await prisma.serviceTypeWorkItem.createMany({
            data: createServiceTypeWorkItemData,
          });
        }      

        return { serviceTypeInfo, serviceOfferingIds,workItemIds: workItemIds || []};
      });
    } catch (err) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async viewServiceType(id: number): Promise<ServiceTypeDTO | null> {
    try {
      return await this.prisma.serviceType.findUnique({
        where: { id },
        include: {
          serviceTypeOffering: {
            select: {
              serviceOffering: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  isActive : true
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
                    select: {
                      name: true,
                    },
                  },
                  workItemStatus: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          createdByProfile: {
            select : {
              firstName: true,
              lastName: true
            }
          },
          updatedByProfile: {
            select : {
              firstName: true,
              lastName: true
            }
          },
        },
      });
    } catch (err) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async archiveServiceType(serviceTypeID: number): Promise<void> {
    try {
      await this.prisma.serviceType.update({
        where: { id: serviceTypeID },
        data: {
          archivedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async unArchiveServiceType(serviceTypeID: number): Promise<void> {
    try {
      await this.prisma.serviceType.update({
        where: { id: serviceTypeID },
        data: {
          archivedAt: null,
        },
      });
    } catch (err) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }
}
