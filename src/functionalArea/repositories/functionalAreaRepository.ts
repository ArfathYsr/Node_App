import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { buildArchivedFilter } from '../../utils/utils';
import TYPES from '../../dependencyManager/types';
import { COMMON } from '../../utils/common';
import {
  CreateFunctionalAreaDataToDbDto,
  FunctionalAreaListDataTodayToDbDto,
  EditFunctionalAreaDto,
  FunctionalArea,
  FunctionalAreaRoleListDataToDbDto,
  FunctionalAreaArchiveDto,
  ViewShortFunctionalAreasDto,
  ShortFunctionalAreasDto,
  UpdatedFunctionalArea,
  SortCriteria,
  OrderByCondition,
  Role,
  FunctionalAreaListDataToDbDto,
} from '../dto/functionalArea.dto';
import { convertUTCToDateWithoutTime } from '../../utils/dateAndTime';
import CommonRepository from '../../common/repositories/commonRepository';

@injectable()
class FunctionalAreaRepository {
  private readonly prisma: PrismaClient;

  private readonly commonRepository: CommonRepository;

  constructor(
    @inject(TYPES.PrismaClient) prisma: PrismaClient,
    @inject(TYPES.CommonRepository)
    commonRepository: CommonRepository,
  ) {
    this.prisma = prisma;
    this.commonRepository = commonRepository;
  }

  async createFunctionalArea(
    functionalAreaCreationData: CreateFunctionalAreaDataToDbDto,
  ) {
    try {
      let statusIds: number[] = [];
      if (
        functionalAreaCreationData.startDate &&
        functionalAreaCreationData.endDate
      ) {
        statusIds = await this.commonRepository.getstatusIdByDate(
          functionalAreaCreationData.startDate,
          functionalAreaCreationData.endDate,
        );
      }
      const status: number =
        statusIds.length === 1 && statusIds[0]
          ? statusIds[0]
          : await this.commonRepository.getStatusId(COMMON.STATUS.INACTIVE);
      const { clientIds, ...restData } = functionalAreaCreationData;
      const newFunctionalArea = await this.prisma.functionalArea.create({
        data: {
          ...restData,
          statusId: status,
          clientFunctionalArea: {
            create: clientIds?.map((id) => ({ clientId: id })) || [],
          },
        },
      });
      return newFunctionalArea;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async getFunctionalAreaById(id: number) {
    try {
      const functionalAreaData = await this.prisma.functionalArea.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          description: true,
          isExternal: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          createdBy: true,
          updatedAt: true,
          updatedBy: true,
          archivedAt: true,
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
          clientFunctionalArea: {
            select: {
              client: {
                select: {
                  id: true,
                  name: true,
                  startDate: true,
                  endDate: true,
                  clientStatus: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
          status: {
            select: {
              id: true,
              statusName: true,
            },
          },
        },
      });

      return functionalAreaData
        ? {
            id: functionalAreaData.id,
            name: functionalAreaData.name,
            description: functionalAreaData.description,
            isExternal: functionalAreaData.isExternal,
            startDate: functionalAreaData.startDate,
            endDate: functionalAreaData.endDate,
            createdAt: functionalAreaData.createdAt,
            createdBy: functionalAreaData.createdBy,
            updatedAt: functionalAreaData.updatedAt,
            updatedBy: functionalAreaData.updatedBy,
            archivedAt: functionalAreaData.archivedAt,
            createdByProfile: {
              firstName: functionalAreaData.createdByProfile.firstName,
              lastName: functionalAreaData.createdByProfile.lastName,
            },
            updatedByProfile: {
              firstName: functionalAreaData.updatedByProfile.firstName,
              lastName: functionalAreaData.updatedByProfile.lastName,
            },
            clients: functionalAreaData.clientFunctionalArea.map((cfa) => ({
              id: cfa.client.id,
              name: cfa.client.name,
              startDate: cfa.client.startDate,
              endDate: cfa.client.endDate,
              status: cfa.client.clientStatus.name,
            })),
            status: {
              id: functionalAreaData.status.id,
              statusName: functionalAreaData.status.statusName,
            },
          }
        : null;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async getFunctionalAreaList(
    functionalAreaListDataToDbDto: FunctionalAreaListDataToDbDto,
  ) {
    try {
      const { searchText, startDate, endDate, filter, offset, limit } =
        functionalAreaListDataToDbDto;
      const whereClause: Prisma.functionalAreaWhereInput =
        this.buildWhereClause({
          searchText,
          startDate,
          endDate,
        });
      const sortCriteria: SortCriteria = functionalAreaListDataToDbDto.sortBy
        ? {
            field: functionalAreaListDataToDbDto.sortBy.field,
            order:
              functionalAreaListDataToDbDto.sortBy.order.toLowerCase() === 'asc'
                ? Prisma.SortOrder.asc
                : Prisma.SortOrder.desc,
          }
        : {
            field: 'id',
            order: 'asc',
          };
      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
        ];
      }

      if (filter?.roleType?.length) {
        whereClause.isExternal = filter.roleType[0] === 'external';
      }

      if (filter?.statusId?.length) {
        whereClause.statusId = { in: filter.statusId };
      }

      if (filter?.isArchived) {
        const archivedFilter = buildArchivedFilter(filter.isArchived);
        whereClause.archivedAt = archivedFilter.archivedAt;
      } else {
        whereClause.archivedAt = null;
      }

      let orderBy: OrderByCondition = [];
      if (sortCriteria.field === COMMON.UPDATEDBYPROFILE) {
        orderBy = [
          { updatedByProfile: { firstName: sortCriteria.order } },
          { updatedByProfile: { lastName: sortCriteria.order } },
        ];
      } else {
        orderBy = [
          {
            [sortCriteria.field]: sortCriteria.order,
          },
        ];
      }

      const functionalAreaList = await this.prisma.functionalArea.findMany({
        where: whereClause,
        orderBy,
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          isExternal: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          createdBy: true,
          updatedAt: true,
          updatedBy: true,
          archivedAt: true,
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
          status: {
            select: {
              id: true,
              statusName: true,
            },
          },
        },
      });

      const functionalAreaCount = await this.prisma.functionalArea.count({
        where: whereClause,
      });
      const updatedFunctionalAreaList = functionalAreaList.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        isExternal: item.isExternal,
        startDate: item.startDate,
        endDate: item.endDate,
        createdAt: item.createdAt,
        createdBy: item.createdBy,
        createdByProfile: item.createdByProfile,
        updatedAt: item.updatedAt,
        updatedBy: item.updatedBy,
        updatedByProfile: item.updatedByProfile,
        archivedAt: item.archivedAt,
        status: item.status,
      }));
      const functionalAreaListSorted = updatedFunctionalAreaList;

      return {
        functionalAreas: functionalAreaListSorted || [],
        totalAmount: functionalAreaCount || 0,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  private buildWhereClause({
    searchText,
    startDate,
    endDate,
  }: {
    searchText?: string;
    startDate?: Date;
    endDate?: Date;
  }): Prisma.functionalAreaWhereInput {
    const whereClause: Prisma.functionalAreaWhereInput = {};

    if (searchText) {
      whereClause.OR = [
        { name: { contains: searchText } },
        { description: { contains: searchText } },
      ];
    }

    if (startDate && endDate) {
      whereClause.startDate = {
        gte: startDate,
        lte: endDate,
      };
    }

    return whereClause;
  }

  async editFunctionalArea(
    functionalAreaId: number,
    functionalAreaData: EditFunctionalAreaDto,
  ) {
    try {
      const existingClientIds: number[] = await this.prisma.clientFunctionalArea
        .findMany({
          where: { functionalAreaId },
          select: { clientId: true },
        })
        .then((result) => result.map((pg) => pg.clientId));

      const idsToAdd: number[] = [];
      const idsToRemove: number[] = [];
      const seenExistingIds = new Set<number>();

      existingClientIds.forEach((id) => seenExistingIds.add(id));
      if (functionalAreaData.clientIds) {
        for (const roleId of functionalAreaData.clientIds) {
          if (!seenExistingIds.has(roleId)) {
            idsToAdd.push(roleId);
          } else {
            seenExistingIds.delete(roleId);
          }
        }
      }

      idsToRemove.push(...seenExistingIds);

      let statusIds: number[] = [];
      if (functionalAreaData.startDate && functionalAreaData.endDate) {
        statusIds = await this.commonRepository.getstatusIdByDate(
          functionalAreaData.startDate,
          functionalAreaData.endDate,
        );
      }
      const isActiveCheck: number =
        statusIds.length === 1 && statusIds[0]
          ? statusIds[0]
          : await this.commonRepository.getStatusId(COMMON.STATUS.INACTIVE);

      if (idsToRemove?.length) {
        await this.prisma.clientFunctionalArea.deleteMany({
          where: {
            functionalAreaId,
            clientId: { in: idsToRemove },
          },
        });
      }

      if (idsToAdd?.length) {
        await this.prisma.clientFunctionalArea.createMany({
          data: idsToAdd.map((clientId) => ({
            functionalAreaId,
            clientId,
          })),
        });
      }
      const editFunctionalArea: UpdatedFunctionalArea =
        await this.prisma.functionalArea.update({
          where: { id: functionalAreaId },
          data: {
            name: functionalAreaData.name,
            description: functionalAreaData.description,
            isExternal: functionalAreaData.isExternal,
            startDate: functionalAreaData.startDate,
            endDate: functionalAreaData.endDate,
            updatedBy: functionalAreaData.updatedBy,
            statusId: isActiveCheck,
          },
        });

      return editFunctionalArea;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async getExistingFunctionalAreaIds(functionalAreaIds) {
    try {
      const existingFunctionalAreas: FunctionalArea[] =
        await this.prisma.functionalArea.findMany({
          where: { id: { in: functionalAreaIds }, statusId: COMMON.ACTIVE_VALUE },
          select: { id: true },
        });
      return existingFunctionalAreas;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async deleteFunctionalAreas(functionalAreaIds: number[]) {
    try {
      await this.prisma.functionalArea.deleteMany({
        where: { id: { in: functionalAreaIds } },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async getFunctionalAreaRoleList(
    functionalAreaRoleListDataToDbDto: FunctionalAreaRoleListDataToDbDto,
  ) {
    try {
      const { functionalAreaId, searchText, offset, limit } =
        functionalAreaRoleListDataToDbDto;
      const currentDate: Date = new Date();
      const statusId: number = await this.commonRepository.getStatusId(
        COMMON.STATUS.ACTIVE,
      );

      const whereClause: Prisma.roleWhereInput = {
        functionalAreaId,
        isExternal: false,
        endDate: {
          gte: currentDate,
        },
        startDate: {
          lte: currentDate,
        },
        statusId,
      };
      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
        ];
      }
      const sortCriteria: SortCriteria = {
        field: 'id',
        order: 'asc',
      };
      const totalAmount: number = await this.prisma.role.count({
        where: whereClause,
      });
      const roleList: Role[] = await this.prisma.role.findMany({
        where: whereClause,
        orderBy: [
          {
            [sortCriteria.field]: sortCriteria.order,
          },
        ],
        skip: offset,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          functionalAreaId: true,
          isExternal: true,
          startDate: true,
          endDate: true,
          functionalArea: { select: { name: true } },
          status: { select: { id: true, statusName: true } },
        },
      });

      const roleListSorted = roleList.map((item) => ({
        ...item,
        functionalAreaName: item.functionalArea?.name,
      }));

      return {
        roles: roleListSorted,
        totalAmount,
      };
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async archiveFunctionalArea(data: FunctionalAreaArchiveDto) {
    try {
      await this.prisma.functionalArea.updateMany({
        where: { id: { in: data.functionalAreaIds } },
        data: {
          archivedAt: new Date().toISOString(),
        },
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async checkFunctionalAreas(data: FunctionalAreaArchiveDto) {
    try {
      const checkFunctionalAreas = await this.prisma.functionalArea.findMany({
        where: { id: { in: data.functionalAreaIds } },
        select: { id: true },
      });

      const foundfunctionalAreasIds = checkFunctionalAreas.map(
        (functionalArea) => functionalArea.id,
      );

      const missingfunctionalAreaIds = data.functionalAreaIds.filter(
        (id) => !foundfunctionalAreasIds.includes(id),
      );

      return missingfunctionalAreaIds;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async checkfunctionalAreasDeactivated(data: FunctionalAreaArchiveDto) {
    try {
      const statusId: number = await this.commonRepository.getStatusId(
        COMMON.STATUS.ACTIVE,
      );
      const checkFunctionalAreas = await this.prisma.functionalArea.findMany({
        where: { id: { in: data.functionalAreaIds }, statusId },
        select: { id: true },
      });

      const foundfunctionalAreasIds = checkFunctionalAreas.map(
        (functionalArea) => functionalArea.id,
      );

      return foundfunctionalAreasIds;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async findInactiveClients(clientIds: number[]) {
    try {
      const clients = await this.prisma.client.findMany({
        where: {
          id: { in: clientIds },
          clientStatus: { name: { not: COMMON.ACTIVE } },
        },
        select: { id: true },
      });
      return clients;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getExistingClientIds(clientIds: number[]) {
    try {
      const existingClientids = await this.prisma.client.findMany({
        where: { id: { in: clientIds } },
        select: { id: true },
      });
      return existingClientids;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async getShortFunctionalAreas(
    viewShortFunctionalAreasDto: ViewShortFunctionalAreasDto,
  ) {
    try {
      const { searchText } = viewShortFunctionalAreasDto;
      const whereClause: Prisma.functionalAreaWhereInput = {};

      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
        ];
      }
      const statusId: number = await this.commonRepository.getStatusId(
        COMMON.STATUS.ACTIVE,
      );

      whereClause.AND = [{ statusId }];

      const availableFunctionalAreas: ShortFunctionalAreasDto =
        await this.prisma.functionalArea.findMany({
          where: whereClause,
          skip: viewShortFunctionalAreasDto.offset,
          take: viewShortFunctionalAreasDto.limit,
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            isExternal: true,
            status: true,
          },
        });

      const totalAmount: number = await this.prisma.functionalArea.count({
        where: whereClause,
      });
      return {
        functionalAreas: availableFunctionalAreas,
        totalAmount,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async findValidFunctionalArea(id: number) {
    try {
      const whereClause: Prisma.functionalAreaWhereUniqueInput = {
        id,
      };
      const functionalAreaData: { id: number } | null =
        await this.prisma.functionalArea.findUnique({
          where: whereClause,
          select: {
            id: true,
          },
        });

      return functionalAreaData;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      } else {
        throw new Error(String(err));
      }
    }
  }

  async findFunctionalAreaByName(name: string, id?: number) {
    const whereClause: { name: string; id?: { not: number } } = {
      name,
    };

    if (id !== undefined) {
      whereClause.id = { not: id };
    }

    return this.prisma.functionalArea.findFirst({
      where: whereClause,
      select: {
        id: true,
      },
    });
  }
}

export default FunctionalAreaRepository;
