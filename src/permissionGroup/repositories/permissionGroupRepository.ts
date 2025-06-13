import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { buildArchivedFilter } from '../../utils/utils';
import TYPES from '../../dependencyManager/types';
import {
  CreatePermissionGroupToDBDto,
  UpdatePermissionGroupDto,
  ViewPermissionGroupListDto,
  ViewShortPermissionGroupsDto,
  ShortPermissionGroupsDto,
  PermissionGroup,
  UpdatePermissionGroupResponseDto,
  Permission,
  SortCriteria,
  OrderByCondition,
  PermissionGroupList,
  PermissionGroupListByName,
  PermissionGroupIdAlignedWithRole,
  PermissionGroupView,
  PermissionGroupResponse,
  UpdatedPermissionGroup,
  ArchivePermissionGroupRequestDto,
  ArchivePermissionGroupCheckDto,
} from '../dto/permissionGroup.dto';
import { BadRequestError } from '../../error/badRequestError';
import { NotFoundError } from '../../error/notFoundError';
import { MESSAGES } from '../../utils/message';
import { COMMON } from '../../utils/common';
import CommonRepository from '../../common/repositories/commonRepository';
import { Status } from '../../utils/constants';

@injectable()
class PermissionGroupRepository {
  private readonly prisma: PrismaClient;

  constructor(
    @inject(TYPES.PrismaClient)
    prisma: PrismaClient,
    @inject(TYPES.CommonRepository)
    private commonRepository: CommonRepository,
  ) {
    this.prisma = prisma;
  }

  async findActivePermissionGroupsByIds(permissionGroupIds: number[]) {
    return this.prisma.permissionGroup.findMany({
      where: {
        id: { in: permissionGroupIds },
      },
    });
  }

  async createPermissionGroup(
    permissionGroupCreationData: CreatePermissionGroupToDBDto,
    permissionIds: number[] | undefined,
    roleIds: number[] | undefined,
  ) {
    try {
      const { createdBy, updatedBy, ...restData } = permissionGroupCreationData;
      let statusIds: number[] = [];
      if (
        permissionGroupCreationData.startDate &&
        permissionGroupCreationData.endDate
      ) {
        statusIds = await this.commonRepository.getstatusIdByDate(
          permissionGroupCreationData.startDate,
          permissionGroupCreationData.endDate,
        );
      }
      const status: number =
        statusIds.length === 1 && statusIds[0]
          ? statusIds[0]
          : await this.commonRepository.getStatusId(COMMON.STATUS.INACTIVE);

      const newPermissionGroup = await this.prisma.permissionGroup.create({
        data: {
          ...restData,
          ...(permissionIds?.length
            ? {
                permissionGroupPermission: {
                  create: permissionIds.map((id) => ({
                    permission: {
                      connect: { id },
                    },
                  })),
                },
              }
            : {}),
          ...(roleIds?.length
            ? {
                rolePermissionGroup: {
                  create: roleIds.map((groupId) => ({
                    role: {
                      connect: { id: groupId },
                    },
                  })),
                },
              }
            : {}),
          status: {
            connect: {
              id: status,
            },
          },
          createdByProfile: {
            connect: {
              id: createdBy,
            },
          },
          updatedByProfile: {
            connect: {
              id: updatedBy,
            },
          },
        },
      });
      return newPermissionGroup;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async updatePermissionGroup(
    permissionGroupId: number,
    permissionGroupUpdationData: UpdatePermissionGroupDto,
  ): Promise<UpdatePermissionGroupResponseDto> {
    try {
      let statusIds: number[] = [];
      if (
        permissionGroupUpdationData.startDate &&
        permissionGroupUpdationData.endDate
      ) {
        statusIds = await this.commonRepository.getstatusIdByDate(
          permissionGroupUpdationData.startDate,
          permissionGroupUpdationData.endDate,
        );
      }
      const status: number =
        statusIds.length === 1 && statusIds[0]
          ? statusIds[0]
          : await this.commonRepository.getStatusId(COMMON.STATUS.INACTIVE);

      const existingRoleIds: number[] = await this.prisma.rolePermissionGroup
        .findMany({
          where: { permissionGroupId },
          select: { roleId: true },
        })
        .then((result) => result.map((pg) => pg.roleId));
      const { roleIds, permissionIds, ...updateData } =
        permissionGroupUpdationData;
      if (roleIds) {
        const idsToAdd = roleIds.filter(
          (roleId) => !existingRoleIds.includes(roleId),
        );
        const idsToRemove = existingRoleIds.filter(
          (existId) => !roleIds.includes(existId),
        );
        if (idsToRemove.length) {
          await this.prisma.rolePermissionGroup.deleteMany({
            where: {
              permissionGroupId,
              roleId: { in: idsToRemove },
            },
          });
        }
        if (idsToAdd.length) {
          await this.prisma.rolePermissionGroup.createMany({
            data: idsToAdd.map((groupId) => ({
              permissionGroupId,
              roleId: groupId,
            })),
          });
        }
      }
      const existingPermissionIds: number[] =
        await this.prisma.permissionGroupPermission
          .findMany({
            where: { permissionGroupId },
            select: { permissionId: true },
          })
          .then((result) => result.map((pg) => pg.permissionId));
      if (permissionIds) {
        const idsToAdd: number[] = permissionIds.filter(
          (roleId) => !existingPermissionIds.includes(roleId),
        );
        const idsToRemove: number[] = existingPermissionIds.filter(
          (existId) => !permissionIds.includes(existId),
        );
        if (idsToRemove.length) {
          await this.prisma.permissionGroupPermission.deleteMany({
            where: {
              permissionGroupId,
              permissionId: { in: idsToRemove },
            },
          });
        }
        if (idsToAdd.length) {
          await this.prisma.permissionGroupPermission.createMany({
            data: idsToAdd.map((groupId) => ({
              permissionGroupId,
              permissionId: groupId,
            })),
          });
        }
      }
      const updatedPermissionGroup: UpdatedPermissionGroup =
        await this.prisma.permissionGroup.update({
          where: {
            id: permissionGroupId,
          },
          data: {
            ...updateData,
            statusId: status,
          },
        });
      return { id: updatedPermissionGroup.id };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async viewPermissionGroup(permissionGroupId: number) {
    try {
      const permissionGroup: PermissionGroupView | null =
        await this.prisma.permissionGroup.findUnique({
          where: {
            id: permissionGroupId,
          },
          include: {
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
            permissionGroupPermission: {
              include: {
                permission: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    startDate: true,
                    endDate: true,
                  },
                },
              },
            },
            rolePermissionGroup: {
              where: { permissionGroupId },
              include: {
                role: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    isExternal: true,
                    startDate: true,
                    endDate: true,
                  },
                },
              },
            },
            status: {
              select: {
                statusName: true,
                id: true,
              },
            },
          },
        });
      if (!permissionGroup) {
        throw new NotFoundError(MESSAGES.PERMISSION_GROUP_NOT_FOUND);
      }

      const permissions: Permission[] =
        permissionGroup.permissionGroupPermission?.map((pgp) => ({
          id: pgp.permission.id,
          name: pgp.permission.name,
          description: pgp.permission.description,
          startDate: pgp.permission.startDate,
          endDate: pgp.permission.endDate,
        })) || [];

      const permissionGroupResponse: PermissionGroupResponse = {
        ...permissionGroup,
        permissions,
      };
      delete permissionGroupResponse.permissionGroupPermission;
      return permissionGroupResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async viewPermissionGroupList(
    viewPermissionGroupListDto: ViewPermissionGroupListDto,
  ) {
    try {
      const { offset, limit } = viewPermissionGroupListDto;

      const whereClause: Prisma.permissionGroupWhereInput =
        this.buildPermissionGroupWhereClause(viewPermissionGroupListDto);

      const sortCriteria: SortCriteria = viewPermissionGroupListDto.sortBy
        ? {
            field: viewPermissionGroupListDto.sortBy.field,
            order:
              viewPermissionGroupListDto.sortBy.order.toLowerCase() === 'asc'
                ? Prisma.SortOrder.asc
                : Prisma.SortOrder.desc,
          }
        : {
            field: 'name',
            order: 'asc',
          };

      let orderByCondition: OrderByCondition = [];
      if (
        viewPermissionGroupListDto.sortBy?.field === COMMON.UPDATEDBYPROFILE
      ) {
        orderByCondition = [
          { updatedByProfile: { firstName: sortCriteria.order } },
          { updatedByProfile: { lastName: sortCriteria.order } },
        ];
      } else if (
        viewPermissionGroupListDto.sortBy?.field === COMMON.CREATEDBYPROFILE
      ) {
        orderByCondition = [
          { createdByProfile: { firstName: sortCriteria.order } },
          { createdByProfile: { lastName: sortCriteria.order } },
        ];
      } else {
        orderByCondition = [{ [sortCriteria.field]: sortCriteria.order }];
      }

      const permissionGroupList: PermissionGroupList =
        await this.prisma.permissionGroup.findMany({
          where: whereClause,
          orderBy: orderByCondition,
          skip: offset,
          take: limit,
          select: {
            id: true,
            name: true,
            description: true,
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
                statusName: true,
                id: true,
              },
            },
          },
        });

      const totalCount = await this.prisma.permissionGroup.count({
        where: whereClause,
      });

      return { permissionGroups: permissionGroupList, totalAmount: totalCount };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  private buildPermissionGroupWhereClause(
    viewPermissionGroupListDto: ViewPermissionGroupListDto,
  ): Prisma.permissionGroupWhereInput {
    const { startDate, endDate, searchText, filter } =
      viewPermissionGroupListDto;
    const whereClause: Prisma.permissionGroupWhereInput = {};

    if (startDate && endDate) {
      whereClause.startDate = {
        gte: startDate,
        lte: endDate,
      };
      whereClause.status = {
        statusName: COMMON.STATUS.ACTIVE
      }
    }


    if (searchText) {
      whereClause.OR = [
        { name: { contains: searchText } },
        { description: { contains: searchText } },
        {
          createdByProfile: {
            OR: [
              { firstName: { contains: searchText } },
              { lastName: { contains: searchText } },
              { fullName: { contains: searchText } }
            ]
          }
        },
        {
          updatedByProfile: {
            OR: [
              { firstName: { contains: searchText } },
              { lastName: { contains: searchText } },
              { fullName: { contains: searchText } }
            ]
          }
        },
        { 
          status: { 
            statusName: { 
              equals: searchText 
            } 
          } 
        },
        ...(!isNaN(Number(searchText)) ? [{ id: { equals: Number(searchText) } }] : []),
       
      ];
    }

    if (filter) {
      if (Array.isArray(filter.status) && filter.status.length !== 0) {
        whereClause.statusId = { in: filter.status };
      }
      if (filter.isArchived !== undefined) {
        const archivedFilter = buildArchivedFilter(filter.isArchived);
        whereClause.archivedAt = archivedFilter.archivedAt;
      }
    } else {
      whereClause.archivedAt = null;
    }

    return whereClause;
  }

  async getShortPermissionGroups(
    viewShortPermissionGroupsDto: ViewShortPermissionGroupsDto,
  ) {
    try {
      const { searchText, roleId } = viewShortPermissionGroupsDto;
      const whereClause: Prisma.permissionGroupWhereInput = {};
      const statusId: number = await this.commonRepository.getStatusId(
           Status.ACTIVE,
      );
      whereClause.AND = [{ statusId }];

      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
        ];
      }

      const connectedPermissionGroups: ShortPermissionGroupsDto =
        await this.prisma.permissionGroup.findMany({
          where: {
            rolePermissionGroup: {
              some: {
                roleId,
              },
            },
          },
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            status: {
              select: {
                id: true,
                statusName: true,
              },
            },
          },
        });

      const availablePermissionGroups: ShortPermissionGroupsDto =
        await this.prisma.permissionGroup.findMany({
          where: whereClause,
          skip: viewShortPermissionGroupsDto.offset,
          take: viewShortPermissionGroupsDto.limit,
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
          },
        });

      const totalAmount: number = await this.prisma.permissionGroup.count({
        where: whereClause,
      });
      return {
        connectedPermissionGroups,
        availablePermissionGroups: {
          permissionGroups: availablePermissionGroups,
          totalAmount,
        },
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getExistingPermissionGroupIds(permissionGroupIds) {
    try {
      const existingPermissionGroups: PermissionGroup[] =
        await this.prisma.permissionGroup.findMany({
          where: { id: { in: permissionGroupIds }, statusId: COMMON.ACTIVE_VALUE },
          select: { id: true },
        });
      return existingPermissionGroups;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async deletePermissionGroups(permissionGroupIds: number[]) {
    try {
      const permissionGroupIdAlignedWithRole: PermissionGroupIdAlignedWithRole =
        await this.prisma.rolePermissionGroup.findMany({
          where: { permissionGroupId: { in: permissionGroupIds } },
          select: { permissionGroupId: true },
        });
      if (permissionGroupIdAlignedWithRole.length) {
        throw new BadRequestError(
          MESSAGES.CANNOT_DELETE_ALIGNED_PERMISSION_GROUP,
        );
      }

      await this.prisma.permissionGroup.deleteMany({
        where: { id: { in: permissionGroupIds } },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async findPermissionGroupsByNameAndDesc(
    id: number,
    name: string,
    description: string,
  ) {
    try {
      const permissionGroups: PermissionGroupListByName =
        await this.prisma.permissionGroup.findMany({
          where: {
            id: { not: id },
            OR: [
              { name: { equals: name } },
              { description: { equals: description } },
            ],
          },
          select: { id: true, name: true, description: true },
        });

      return permissionGroups;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async findPermissionGroupByName(name: string, id?: number | undefined) {
    try {
      return await this.prisma.permissionGroup.findFirst({
        where: { AND: [{ id: id !== undefined ? { not: id } : {} }, { name }] },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async checkIfPermissionGroupExist(data: ArchivePermissionGroupRequestDto) {
    try {
      const checkPermissionGroup: ArchivePermissionGroupCheckDto =
        await this.prisma.permissionGroup.findMany({
          where: { id: { in: data.permissionGroupIds } },
          select: { id: true, archivedAt: true },
        });
      return checkPermissionGroup;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async archivePermissionGroup(data: ArchivePermissionGroupRequestDto) {
    try {
      await this.prisma.permissionGroup.updateMany({
        where: { id: { in: data.permissionGroupIds } },
        data: {
          archivedAt: new Date().toISOString(),
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }
}
export default PermissionGroupRepository;
