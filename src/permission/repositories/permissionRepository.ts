import { Prisma, PrismaClient, status } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { COMMON } from '../../utils/common';
import {
  buildArchivedFilter,
  getActiveStatusBasedOnStartDateAndEndDate,
  repositoryError,
} from '../../utils/utils';
import TYPES from '../../dependencyManager/types';
import {
  ListPermissionBodyDto,
  EditPermissionDto,
  AddPermissionBodyData,
  PermissionData,
  ViewPermissionResponse,
  Permission,
  ViewShortPermissionsDto,
  ShortPermissionsDto,
  ListPermissionResponse,
  PermissionList,
  ArchivePermissionRequestDto,
  ArchivePermissionCheckDto,
  MenuDto,
  OrderByCondition,
} from '../dto/permission.dto';
import { BadRequestError } from '../../error/badRequestError';
import CommonRepository from '../../common/repositories/commonRepository';
import { ACTIVE_ROLE_CONDITIONS, Status } from '../../utils/constants';

@injectable()
export default class PermissionRepository {
  private readonly prisma: PrismaClient;

  private readonly commonRepository: CommonRepository;

  constructor(
    @inject(TYPES.PrismaClient) prisma: PrismaClient,
    @inject(TYPES.CommonRepository) commonRepository: CommonRepository,
  ) {
    this.prisma = prisma;
    this.commonRepository = commonRepository;
  }

  async findPermissionData(permissionId: number) {
    try {
      return await this.prisma.permission.findUnique({
        where: { id: permissionId },
      });
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async findMenuIds(menuIds: number[], isSubMenu?: boolean) {
    try {
      const whereClause: Prisma.menuWhereInput = {
        AND: [
          { id: { in: menuIds } },
          { parentMenuId: isSubMenu ? { not: null } : { equals: null } },
        ],
      };

      const menuData: { id: number }[] = await this.prisma.menu.findMany({
        where: whereClause,
        select: { id: true },
      });
      return menuData;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async findMenuIdsWithTransaction(
    menuIds: number[],
    prisma: Prisma.TransactionClient,
    isSubMenu?: boolean,
  ) {
    try {
      const whereClause: Prisma.menuWhereInput = {
        AND: [
          { id: { in: menuIds } },
          { parentMenuId: isSubMenu ? { not: null } : { equals: null } },
        ],
      };

      const menuData: { id: number }[] = await prisma.menu.findMany({
        where: whereClause,
        select: { id: true },
      });
      return menuData;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async findValidPermissionIds(permissionIds: number[]) {
    try {
      return await this.prisma.permission.findMany({
        where: {
          id: { in: permissionIds },
        },
        select: { id: true },
      });
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async listMenuData() {
    try {
      const listMenu: MenuDto[] = await this.prisma.menu.findMany({
        where: {
          parentMenuId: null,
        },
        select: {
          id: true,
          name: true,
          subMenus: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return listMenu;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async findByName(permissionName: string, permissionId: number) {
    return this.prisma.permission.findFirst({
      where: {
        AND: [
          { id: permissionId !== undefined ? { not: permissionId } : {} },
          { name: permissionName },
        ],
      },
    });
  }

  async findValidPermissionGroupIds(permissionGroupIds: number[]) {
    try {
      return await this.prisma.permissionGroup.findMany({
        where: {
          id: { in: permissionGroupIds },
        },
        select: { id: true },
      });
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async editPermission(
    permissionId: number,
    permissionEditData: EditPermissionDto,
  ) {
    try {
      await this.prisma.$transaction(
        async (prisma: Prisma.TransactionClient) => {
          const {
            permissionGroupIds,
            roleIds,
            clientIds,
            menuIds,
            subMenuIds,
            ...updateData
          }: EditPermissionDto = permissionEditData;
          await Promise.all([
            prisma.permission.update({
              where: { id: permissionId },
              data: {
                ...updateData,
                statusId: await this.setStatus(
                  updateData.startDate as Date,
                  updateData.endDate as Date,
                  updateData.statusId,
                ),
              },
            }),
          ]);

          if (permissionGroupIds?.length || permissionGroupIds?.length === 0 ) {
            await this.alignPermissionGroupsToPermission(
              permissionId,
              permissionGroupIds,
              prisma,
            );
          }
          if (roleIds?.length) {
            await this.alignRolesToPermission(
              permissionId,
              roleIds,
              updateData.updatedBy,
              updateData.updatedBy,
              prisma,
            );
          }
          if (clientIds?.length) {
            await this.alignClientsToPermission(
              permissionId,
              clientIds,
              prisma,
            );
          }

          await this.alignMenuSubMenu(
            permissionId,
            menuIds,
            subMenuIds,
            updateData.updatedBy,
            prisma,
          );
        },
      );
      return { id: permissionId };
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async getPermission(id: number) {
    try {
      const permissionData: PermissionData | null =
        await this.prisma.permission.findUnique({
          where: { id },
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
                permissionGroup: true,
              },
            },
            clientPermissions: {
              include: {
                client: true,
              },
            },
            rolePermission: {
              include: {
                role: true,
              },
            },
            permissionMenu: {
              include: {
                menu: true,
              },
            },
            status: { select: { statusName: true, id: true } },
          },
        });
      return permissionData;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async viewPermission(permissionData: PermissionData) {
    try {
      // Format the response data
      const {
        permissionGroupPermission,
        clientPermissions,
        rolePermission,
        permissionMenu,
        ...updatedData
      } = permissionData;
      const formattedPermissionData: ViewPermissionResponse = {
        ...updatedData,
        status: updatedData?.status,
        permissionGroups: permissionData.permissionGroupPermission.map(
          (pgp) => ({
            id: pgp.permissionGroup.id,
            name: pgp.permissionGroup.name,
            description: pgp.permissionGroup.description,
            startDate: pgp.permissionGroup.startDate,
            endDate: pgp.permissionGroup.endDate,
          }),
        ),
        clients: permissionData.clientPermissions.map((cl) => ({
          id: cl.client.id,
          name: cl.client.name,
          description: cl.client.description,
          startDate: cl.client.startDate,
          endDate: cl.client.endDate,
        })),
        roles: permissionData.rolePermission.map((ro) => ({
          id: ro.role.id,
          name: ro.role.name,
          description: ro.role.description,
          startDate: ro.role.startDate,
          endDate: ro.role.endDate,
        })),
        menus: permissionData.permissionMenu
          .filter((me) => !me.menu.parentMenuId) // Filter menus without a parent (main menus)
          .map((me) => ({
            id: me.menu.id,
            name: me.menu.name,
            parentMenuId: me.menu.parentMenuId,
          })),
        subMenus: permissionData.permissionMenu
          .filter((me) => me.menu.parentMenuId) // Filter menus with a parent (submenus)
          .map((me) => ({
            id: me.menu.id,
            name: me.menu.name,
            parentMenuId: me.menu.parentMenuId,
          })),
      };
      return formattedPermissionData;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async listPermissions(
    data: ListPermissionBodyDto,
  ): Promise<ListPermissionResponse> {
    try {
      const { searchText, startDate, endDate, filter } = data;
      const whereClause: Prisma.permissionWhereInput = {};
      if (startDate && endDate) {
        whereClause.startDate = {
          gte: startDate,
          lte: endDate,
        };
      }

      if (filter) {
        if (Array.isArray(filter?.status) && filter?.status?.length !== 0) {
          whereClause.statusId = { in: filter.status };
        }
        if (filter.isArchived !== undefined) {
          const archivedFilter = buildArchivedFilter(filter?.isArchived);
          whereClause.archivedAt = archivedFilter.archivedAt;
        }
      } else {
        whereClause.archivedAt = null;
      }

      const sortCriteria: { field: string; order: Prisma.SortOrder } =
        data.sortBy
          ? {
              field: data.sortBy.field,
              order:
                data.sortBy.order.toLowerCase() === 'asc'
                  ? Prisma.SortOrder.asc
                  : Prisma.SortOrder.desc,
            }
          : {
              field: 'name',
              order: 'asc',
            };

      let orderByCondition: OrderByCondition = [];

      if (data.sortBy?.field === COMMON.UPDATEDBYPROFILE) {
        orderByCondition = [
          { updatedByProfile: { firstName: sortCriteria.order } },
          { updatedByProfile: { lastName: sortCriteria.order } },
        ];
      } else if (data.sortBy?.field === 'status') {
        orderByCondition = [{ status: { statusName: sortCriteria.order } }];
      } else if (data.sortBy?.field === COMMON.CREATEDBYPROFILE) {
        orderByCondition = [
          { createdByProfile: { firstName: sortCriteria.order } },
          { createdByProfile: { lastName: sortCriteria.order } },
        ];
      } else {
        orderByCondition = [{ [sortCriteria.field]: sortCriteria.order }];
      }

      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
          { updatedByProfile: { firstName: { contains: searchText } } },
          { updatedByProfile: { lastName: { contains: searchText } } },
        ];
      }

      const permissionList = (await this.prisma.permission.findMany({
        orderBy: orderByCondition,
        where: whereClause,
        skip: data.offset,
        take: data.limit,
        select: {
          id: true,
          cloneId: true,
          createdAt: true,
          createdBy: true,
          updatedAt: true,
          updatedBy: true,
          startDate: true,
          endDate: true,
          name: true,
          description: true,
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
      })) as PermissionList;
      const permissionCount: number = await this.prisma.permission.count({
        where: whereClause,
      });

      return {
        permissions: permissionList,
        totalAmount: permissionCount,
      } as ListPermissionResponse;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async createPermission(data: AddPermissionBodyData) {
    try {
      const now: Date = new Date();
      return await this.prisma.permission.create({
        data: {
          name: data.name,
          description: data.description,
          startDate: data.startDate,
          endDate: data.endDate,
          createdBy: data.createdBy,
          updatedBy: data.updatedBy,
          cloneId: data.cloneId,
          isActive: getActiveStatusBasedOnStartDateAndEndDate(
            data.startDate,
            data.endDate,
          ),

          // PermissionGroup Permission logic
          ...(data.permissionGroupIds?.length
            ? {
                permissionGroupPermission: {
                  create: data.permissionGroupIds.map((groupId) => ({
                    permissionGroup: {
                      connect: { id: groupId },
                    },
                  })),
                },
              }
            : {}),

          // Permission Menu logic (Menu & SubMenu logic combined)
          ...(data.menuIds?.length || data.subMenuIds?.length
            ? {
                permissionMenu: {
                  create: [
                    ...(data.menuIds?.map((menuId) => ({
                      menu: {
                        connect: { id: menuId },
                      },
                      createdByProfile: {
                        connect: { id: data.createdBy },
                      },
                      updatedByProfile: {
                        connect: { id: data.updatedBy },
                      },
                      startDate: data.startDate,
                      endDate: data.endDate,
                    })) || []),
                    ...(data.subMenuIds?.map((subMenuId) => ({
                      menu: {
                        connect: { id: subMenuId },
                      },
                      createdByProfile: {
                        connect: { id: data.createdBy },
                      },
                      updatedByProfile: {
                        connect: { id: data.updatedBy },
                      },
                      startDate: data.startDate,
                      endDate: data.endDate,
                    })) || []),
                  ],
                },
              }
            : {}),

          // Role Permission logic
          ...(data.roleIds?.length
            ? {
                rolePermission: {
                  create: data.roleIds.map((roleId) => ({
                    role: {
                      connect: { id: roleId },
                    },
                    createdBy: data.createdBy,
                    updatedBy: data.updatedBy,
                  })),
                },
              }
            : {}),

          // Client Permissions logic
          ...(data.clientIds?.length
            ? {
                clientPermissions: {
                  create: data.clientIds.map((clientId) => ({
                    client: {
                      connect: { id: clientId },
                    },
                  })),
                },
              }
            : {}),
        },
      });
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async findValidCloseId(id: number) {
    try {
      const cloneIdData: { id: number } | null =
        await this.prisma.permission.findUnique({
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

  async getExistingPermissionIds(permissionIds) {
    try {
      const existingPermissions: Permission[] =
        await this.prisma.permission.findMany({
          where: { id: { in: permissionIds }, statusId: COMMON.ACTIVE_VALUE },
          select: { id: true },
        });
      return existingPermissions;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async deletePermissions(permissionIds: number[]) {
    try {
      await this.prisma.permission.deleteMany({
        where: { id: { in: permissionIds } },
      });
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async getShortPermissions(viewShortPermissionsDto: ViewShortPermissionsDto) {
    try {
      const { searchText }: { searchText?: string } = viewShortPermissionsDto;
      const statusId: number = await this.commonRepository.getStatusId(
        Status.ACTIVE,
      );
      const whereClause: Prisma.permissionWhereInput = {};

      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
        ];
      }
      whereClause.AND = [{ statusId }];
      const availablePermissions: ShortPermissionsDto =
        await this.prisma.permission.findMany({
          where: whereClause,
          skip: viewShortPermissionsDto.offset,
          take: viewShortPermissionsDto.limit,
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

      const totalAmount: number = await this.prisma.permission.count({
        where: whereClause,
      });
      return {
        permissions: availablePermissions,
        totalAmount,
      };
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async findPermissionByNames(names: string | string[]) {
    try {
      const nameArray: string[] = Array.isArray(names) ? names : [names];
      const permissionCount: number = await this.prisma.permission.count({
        where: {
          name: {
            in: nameArray,
          },
        },
      });
      return permissionCount;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async findActivePermissionsByIds(permissionIds: number[]) {
    return this.prisma.permission.findMany({
      where: {
        id: { in: permissionIds },
        statusId: COMMON.ACTIVE_VALUE,
      },
    });
  }

  async checkIfPermissionExist(data: ArchivePermissionRequestDto) {
    try {
      const checkPermission: ArchivePermissionCheckDto =
        await this.prisma.permission.findMany({
          where: { id: { in: data.permissionIds } },
          select: { id: true, archivedAt: true },
        });
      return checkPermission;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async archivePermission(data: ArchivePermissionRequestDto) {
    try {
      await this.prisma.permission.updateMany({
        where: { id: { in: data.permissionIds } },
        data: {
          archivedAt: new Date().toISOString(),
        },
      });
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async alignMenuSubMenu(
    permissionId: number,
    menuIds: number[] | undefined,
    subMenuIds: number[] | undefined,
    updatedBy: number,
    prisma: Prisma.TransactionClient,
  ) {
    try {
      let menuIdsToAdd: number[] = [];
      let menuIdsToRemove: number[] = [];
      // Fetch existing menu ids for the permission
      const existingMenu: { menuId: number }[] =
        await prisma.permissionMenu.findMany({
          where: { permissionId },
          select: { menuId: true },
        });
      const existingMenuIds: number[] = existingMenu.map((item) => item.menuId);

      if (menuIds?.length) {
        const validMenus: { id: number }[] =
          await this.findMenuIdsWithTransaction(existingMenuIds, prisma, false);

        const validMenuIds: number[] = validMenus.map((item) => item.id);

        // Determine which ids to add and which to remove
        menuIdsToAdd = menuIds.filter(
          (menuId) => !new Set(validMenuIds).has(menuId),
        );
        menuIdsToRemove = validMenuIds.filter(
          (existingId) => !new Set(menuIds).has(existingId),
        );
      }

      if (subMenuIds?.length) {
        const validSubMenus: { id: number }[] =
          await this.findMenuIdsWithTransaction(existingMenuIds, prisma, true);
        const validSubMenuIds: number[] = validSubMenus.map((item) => item.id);

        // Determine which ids to add and which to remove
        menuIdsToAdd = [
          ...menuIdsToAdd,
          ...subMenuIds.filter(
            (menuId) => !new Set(validSubMenuIds).has(menuId),
          ),
        ];
        menuIdsToRemove = [
          ...menuIdsToRemove,
          ...validSubMenuIds.filter(
            (existingId) => !new Set(subMenuIds).has(existingId),
          ),
        ];
      }
      // Delete only the relations that need to be removed
      if (menuIdsToRemove.length) {
        await prisma.permissionMenu.deleteMany({
          where: { permissionId, menuId: { in: menuIdsToRemove } },
        });
      }
      // Add new relations
      if (menuIdsToAdd.length) {
        const newMenu: {
          permissionId: number;
          menuId: number;
          createdBy: number;
          updatedBy: number;
        }[] = menuIdsToAdd.map((menuId) => ({
          permissionId,
          menuId,
          createdBy: updatedBy,
          updatedBy,
        }));

        await prisma.permissionMenu.createMany({
          data: newMenu,
        });
      }
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async alignPermissionGroupsToPermission(
    permissionId: number,
    permissionGroupIdsToAlign: number[],
    prisma: Prisma.TransactionClient,
  ) {
    try {
      const existingPermissionGroups =
        await prisma.permissionGroupPermission.findMany({
          where: { permissionId },
          select: { permissionGroupId: true },
        });

      const existingPermissionGroupIds: number[] = existingPermissionGroups.map(
        (pg) => pg.permissionGroupId,
      );

      // Determine which ids to add and which to remove
      const idsToAdd: number[] = permissionGroupIdsToAlign.filter(
        (permissionGroupId) =>
          !existingPermissionGroupIds.includes(permissionGroupId),
      );
      const idsToRemove: number[] = existingPermissionGroupIds.filter(
        (existId) => !new Set(permissionGroupIdsToAlign).has(existId),
      );

      // Delete only the relations that need to be removed
      if (idsToRemove.length) {
        await prisma.permissionGroupPermission.deleteMany({
          where: { permissionId, permissionGroupId: { in: idsToRemove } },
        });
      }

      // Add new relations
      if (idsToAdd.length) {
        const newPermissionGroups = idsToAdd.map((permissionGroupId) => ({
          permissionId,
          permissionGroupId,
        }));

        await prisma.permissionGroupPermission.createMany({
          data: newPermissionGroups,
        });
      }

      return { permission: { id: permissionId } };
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async alignRolesToPermission(
    permissionId: number,
    roleIdsToAlign: number[],
    createdBy: number,
    updatedBy: number,
    prisma: Prisma.TransactionClient,
  ) {
    try {
      // Fetch existing Client ids for the role
      const existingRoles = await prisma.rolePermission.findMany({
        where: { permissionId },
        select: { roleId: true },
      });

      const existingRoleIds: number[] = existingRoles.map(
        (item) => item.roleId,
      );

      // Determine which ids to add and which to remove
      const idsToAdd: number[] = roleIdsToAlign.filter(
        (clientId) => !new Set(existingRoleIds).has(clientId),
      );
      const idsToRemove: number[] = existingRoleIds.filter(
        (existId) => !new Set(roleIdsToAlign).has(existId),
      );

      // Delete only the relations that need to be removed
      if (idsToRemove.length) {
        await prisma.rolePermission.deleteMany({
          where: { permissionId, roleId: { in: idsToRemove } },
        });
      }

      // Add new relations
      if (idsToAdd.length) {
        const newRole = idsToAdd.map((roleId: number) => ({
          roleId,
          permissionId,
          createdBy,
          updatedBy,
        }));

        await prisma.rolePermission.createMany({
          data: newRole,
        });
      }

      return { permission: { id: permissionId } };
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async alignClientsToPermission(
    permissionId: number,
    clientIdsToAlign: number[],
    prisma: Prisma.TransactionClient,
  ) {
    try {
      // Fetch existing Client ids for the role
      const existingClient = await prisma.clientPermission.findMany({
        where: { permissionId },
        select: { clientId: true },
      });

      const existingClientIds: number[] = existingClient.map((c) => c.clientId);

      // Determine which ids to add and which to remove
      const idsToAdd: number[] = clientIdsToAlign.filter(
        (clientId) => !new Set(existingClientIds).has(clientId),
      );
      const idsToRemove: number[] = existingClientIds.filter(
        (existId) => !new Set(clientIdsToAlign).has(existId),
      );

      // Delete only the relations that need to be removed
      if (idsToRemove.length) {
        await prisma.clientPermission.deleteMany({
          where: { permissionId, clientId: { in: idsToRemove } },
        });
      }

      // Add new relations
      if (idsToAdd.length) {
        const newClient = idsToAdd.map((clientId: number) => ({
          permissionId,
          clientId,
        }));

        await prisma.clientPermission.createMany({
          data: newClient,
        });
      }

      return { permission: { id: permissionId } };
    } catch (err: unknown) {
      repositoryError(err);
    }
  }

  async setStatus(startDate?: Date, endDate?: Date, statusId?: number) {
    try {
      const isActive: boolean = getActiveStatusBasedOnStartDateAndEndDate(
        startDate,
        endDate,
      );
      const tempStatusId: number = isActive
        ? COMMON.ACTIVE_VALUE
        : COMMON.INACTIVE_VALUE;

      if (statusId !== undefined) {
        const statusData: status | null = await this.prisma.status.findFirst({
          where: { id: statusId },
        });

        if (!statusData) {
          throw new BadRequestError(`Status Not Found`);
        }
        if (
          statusId !== COMMON.ACTIVE_VALUE &&
          statusId !== COMMON.INACTIVE_VALUE
        ) {
          return statusId;
        }
      }
      return tempStatusId;
    } catch (err: unknown) {
      repositoryError(err);
    }
  }
}
