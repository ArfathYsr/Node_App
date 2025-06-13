import { Prisma, PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { COMMON } from '../../utils/common';
import {
  getIdsFromObjects,
  rawQuerybuildArchivedFilter,
} from '../../utils/utils';
import {
  CreateRoleDataToDbDto,
  RoleListDataToDbDto,
  EditRoleDto,
  Role,
  RolePermissionGroupListDataToDbDto,
  RolePermissionGroupsDto,
  RoleArchiveDto,
  RoleShortListDataToDbDto,
  RolePermissionResponseDto,
  PermissionGroupRolesDto,
  SelectDto,
  RoleAdditionalDataResponseDto,
  CreateRoleCategoryAlignmentDTO,
  EditRoleCriteriaAlignmentDTO,
  NewRoleDto,
  CriteriaAlignmentsDto,
  RoleCriteriaDto,
  RoleCategoryDto,
  NewPermissionDto,
  UnalignedPermissionGroupsDto,
  RolelistDto,
  GetRoleListDto,
  UpdatedRoleListDto,
  AvailablePermissionGroupsDto,
  RoleListCount,
  RoleObjDto,
} from '../dto/role.dto';
import RepositoryError from '../../error/repositoryError';
import TYPES from '../../dependencyManager/types';
import { NotFoundError } from '../../error/notFoundError';
import { MESSAGES } from '../../utils/message';
import { ERRORMESSAGE } from '../../utils/errorMessage';
import CommonRepository from '../../common/repositories/commonRepository';
import { ACTIVE_ROLE_CONDITIONS } from '../../utils/constants';

@injectable()
class RoleRepository {
  private readonly prisma: PrismaClient;

  constructor(
    @inject(TYPES.PrismaClient) prisma: PrismaClient,
    @inject(TYPES.CommonRepository)
    private commonRepository: CommonRepository,
  ) {
    this.prisma = prisma;
  }

  async findActiveRolesByIds(roleIds: number[]) {
    const now: Date = new Date();

    return this.prisma.role.findMany({
      where: {
        id: { in: roleIds },
        statusId: 1,
        ...ACTIVE_ROLE_CONDITIONS(now),
      },
      include: {
        status: true,
      }
    });
  }

  async createRole({
    functionalAreaId,
    permissionGroupIds,
    permissionIds,
    clientIds,
    createdBy,
    updatedBy,
    statusId,
    roleCriteriaDatas,
    roleCategoryIds,
    ...roleCreationData
  }: CreateRoleDataToDbDto) {
    try {
      let statusIds: number[] = [];
      if (roleCreationData.startDate && roleCreationData.endDate) {
        statusIds = await this.commonRepository.getstatusIdByDate(
          roleCreationData.startDate,
          roleCreationData.endDate,
        );
      }
      const status: number =
        statusId ||
        (statusIds.length === 1 && statusIds[0]
          ? statusIds[0]
          : await this.commonRepository.getStatusId(COMMON.STATUS.INACTIVE));

      const newRole: NewRoleDto = await this.prisma.role.create({
        data: {
          ...roleCreationData,
          status: {
            connect: {
              id: status,
            },
          },
          functionalArea: {
            connect: {
              id: functionalAreaId,
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
          ...(roleCriteriaDatas?.length && roleCreationData.isExternal === true
            ? {
                roleCriteriaAlignment: {
                  create: roleCriteriaDatas.map((rc) => ({
                    roleCriteriaId: rc.roleCriteriaId,
                    createdBy,
                    updatedBy,
                    isActive: true,
                    roleCriteriaResponse: rc.roleCriteriaResponse,
                  })),
                },
              }
            : {}),
          ...(roleCategoryIds?.length && roleCreationData.isExternal === true
            ? {
                roleCategoryAlignment: {
                  create: roleCategoryIds.map((rc) => ({
                    roleCategoryId: rc,
                    createdBy,
                    updatedBy,
                    isActive: true,
                  })),
                },
              }
            : {}),
        },
      });
      // align with permission group
      if (permissionGroupIds?.length) {
        await this.alignPermissionGroups(newRole.id, permissionGroupIds);
      }
      // align with permission
      if (permissionIds?.length) {
        await this.alignPermission(
          newRole.id,
          permissionIds,
          createdBy,
          updatedBy,
        );
      }
      // align with clients
      if (clientIds?.length) {
        await this.alignClients(newRole.id, clientIds);
      }
      return newRole;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async findRoleById(roleId: number, type: string) {
    try {
      const roleData = await this.prisma.role.findUnique({
        where: { id: roleId },
        select: {
          id: true,
          name: true,
          description: true,
          functionalAreaId: true,
          isExternal: true,
          startDate: true,
          endDate: true,
          createdAt: true,
          updatedAt: true,
          createdBy: true,
          updatedBy: true,
          archivedAt: true,
          statusId: true,
          roleClient: {
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
          rolePermission: {
            include: {
              permission: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  startDate: true,
                  endDate: true,
                  isActive: true,
                },
              },
            },
          },
          rolePermissionGroup: {
            include: {
              permissionGroup: {
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
          functionalArea: {
            select: {
              name: true,
            },
          },
          status: {
            select: {
              statusName: true,
            },
          },
          roleCategoryAlignment: {
            include: {
              roleCategory: {
                select: {
                  id: true,
                  roleCategoryName: true,
                },
              },
            },
          },
          roleCriteriaAlignment: {
            include: {
              roleCriteria: {
                select: {
                  id: true,
                  roleCriteriaName: true,
                },
              },
            },
          },
        },
      });

      if (!roleData) throw new NotFoundError(MESSAGES.ROLE_NOT_FOUND(roleId));
      if (roleData && roleData.archivedAt !== null && type === 'edit')
        throw new NotFoundError(MESSAGES.ROLE_EDIT_ERROR);

      const role = {
        ...roleData,
        functionalAreaName: roleData.functionalArea!.name,
        roleCategory:
          roleData.roleCategoryAlignment?.map((rca) => ({
            roleId: rca.roleId,
            roleCategoryId: rca.roleCategoryId,
            roleCategory: {
              id: rca.roleCategory.id,
              roleCategoryName: rca.roleCategory.roleCategoryName,
            },
          })) || [],
        roleCriteria:
          roleData.roleCriteriaAlignment?.map((rca) => ({
            roleId: rca.roleId,
            roleCriteriaId: rca.roleCriteriaId,
            roleCriteria: {
              id: rca.roleCriteria.id,
              roleCriteriaName: rca.roleCriteria.roleCriteriaName,
            },
            roleCriteriaResponse: rca.roleCriteriaResponse ?? '',
          })) || [],
        roleType: roleData.isExternal === true ? 'external' : 'internal',
        roleClient:
          roleData.roleClient?.map((rc) => ({
            client: {
              id: rc.client.id,
              name: rc.client.name,
              startDate: rc.client.startDate,
              endDate: rc.client.endDate,
              status: rc.client.clientStatus.name,
            },
          })) || [],
        statusName: roleData.status!.statusName,
      };
      delete (role as any).functionalArea;
      delete (role as any).roleCategoryAlignment;
      delete (role as any).roleCriteriaAlignment;

      return { ...role };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async editRole(roleId: number, roleEditData: EditRoleDto) {
    try {
      const {
        permissionGroupIds,
        permissionIds,
        clientIds,
        roleCategoryIds,
        roleCriteriaDatas,
        ...dataToUpdate
      } = roleEditData;

      // check permission group ids exists or not
      let availablePermissionGroupIds: number[] = [];
      if (permissionGroupIds?.length) {
        const availablePermissionGroups: AvailablePermissionGroupsDto[] =
          await this.prisma.permissionGroup.findMany({
            where: { id: { in: permissionGroupIds } },
            select: { id: true },
          });
        availablePermissionGroupIds = getIdsFromObjects(
          availablePermissionGroups,
        );
        if (!availablePermissionGroupIds.length) {
          throw new NotFoundError('Permission group ids not found.');
        }
      }

      let statusIds: number[] = [];
      if (
        dataToUpdate.startDate &&
        dataToUpdate.endDate &&
        dataToUpdate.statusId === undefined
      ) {
        statusIds = await this.commonRepository.getstatusIdByDate(
          dataToUpdate.startDate,
          dataToUpdate.endDate,
        );
      }

      let status: number = await this.commonRepository.getStatusId(
        COMMON.STATUS.INACTIVE,
      );
      if (dataToUpdate.statusId) {
        status = dataToUpdate.statusId;
      } else if (statusIds.length === 1) {
        const [firstStatusId] = statusIds;
        if (firstStatusId) {
          status = firstStatusId;
        }
      }

      const role: NewRoleDto = await this.prisma.role.update({
        where: {
          id: roleId,
        },
        data: {
          ...dataToUpdate,
          statusId: status,
        },
      });
      if (availablePermissionGroupIds.length) {
        await this.alignPermissionGroups(roleId, availablePermissionGroupIds);
      }
      if (permissionIds?.length) {
        await this.alignPermission(
          roleId,
          permissionIds,
          dataToUpdate.updatedBy,
          dataToUpdate.updatedBy,
        );
      }
      // align with client
        await this.alignClients(roleId, clientIds);
      
      // Align with CategoryIds
      if (roleCategoryIds) {
        await this.alignCategories(
          roleId,
          roleCategoryIds,
          dataToUpdate.updatedBy,
        );
      }

      // Align with CriteriaIds
      if (roleCriteriaDatas) {
        await this.alignCriterias(
          roleId,
          roleCriteriaDatas,
          dataToUpdate.updatedBy,
        );
      }

      return { role: { id: role.id } };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getRoleList(roleListDataToDbDto: RoleListDataToDbDto) {
    try {
      const { searchText, filter, sortBy, startDate, endDate, offset, limit } =
        roleListDataToDbDto;
      // Base condition
      let whereConditions: Prisma.Sql = Prisma.sql`r.id IS NOT NULL`;

      if (searchText) {
        whereConditions = Prisma.sql`${whereConditions} AND (
          r.name LIKE ${`%${searchText}%`}
          OR r.description LIKE ${`%${searchText}%`}
          OR f.name LIKE ${`%${searchText}%`}
          OR (CASE WHEN r.isExternal = 1 THEN 'External' ELSE 'Internal' END) LIKE ${`%${searchText}%`}
          OR CONVERT(VARCHAR, r.startDate, 23) LIKE ${`%${searchText}%`}  -- Convert startDate to string (YYYY-MM-DD format)
          OR CONVERT(VARCHAR, r.endDate, 23) LIKE ${`%${searchText}%`}    -- Convert endDate to string (YYYY-MM-DD format)
          OR EXISTS (SELECT 1 FROM profile WHERE profile.id = r.updatedBy AND profile.fullName LIKE ${`%${searchText}%`})
          OR EXISTS (SELECT 1 FROM profile WHERE profile.id = r.createdBy AND profile.fullName LIKE ${`%${searchText}%`})
          )`;
      }

      if (filter?.roleTypes?.length) {
        // Check if both external and internal roles are requested
        const isExternalFilter: boolean = filter.roleTypes.includes('external');
        const isInternalFilter: boolean = filter.roleTypes.includes('internal');

        if (isExternalFilter && isInternalFilter) {
          // If both are requested, no need to filter by isExternal
          whereConditions = Prisma.sql`${whereConditions} AND (r.isExternal = 1 OR r.isExternal = 0)`;
        } else if (isExternalFilter) {
          // If only external roles are requested
          whereConditions = Prisma.sql`${whereConditions} AND r.isExternal = 1`;
        } else if (isInternalFilter) {
          // If only internal roles are requested
          whereConditions = Prisma.sql`${whereConditions} AND r.isExternal = 0`;
        }
      }
      // Status Filter
      if (filter?.statusIds?.length) {
        const statusIdsSql = Prisma.sql`${Prisma.join(filter.statusIds)}`;
        whereConditions = Prisma.sql`${whereConditions} AND r.StatusID in (${statusIdsSql})`;
      }
      // Roles Filter
      if (filter?.roles?.length) {
        const roleIdsSql = Prisma.sql`${Prisma.join(filter.roles)}`;
        whereConditions = Prisma.sql`${whereConditions} AND r.ID in (${roleIdsSql})`;
      }
      // functionalAreas Filter
      if (filter?.functionalAreas?.length) {
        const functionalAreasSql = Prisma.sql`${Prisma.join(filter.functionalAreas)}`;
        whereConditions = Prisma.sql`${whereConditions} AND r.FunctionalAreaID IN (${functionalAreasSql})`;
      }
      // isArchived Filter

      const archivedFilter = rawQuerybuildArchivedFilter(filter?.isArchived !== undefined ? filter.isArchived : 0);
      if (archivedFilter?.whereClause) {
        whereConditions = Prisma.sql`
            ${whereConditions}
            AND r.${Prisma.raw(archivedFilter.whereClause)}
        `;
      }

      // Date wise filter
      if (startDate && endDate) {
        whereConditions = Prisma.sql`${whereConditions} AND r.startDate >= ${startDate} AND r.startDate <= ${endDate}`;
      }

      // Sort Condition
      const sortCondition: Prisma.Sql = sortBy
        ? Prisma.sql`ORDER BY ${Prisma.raw(sortBy.field.includes('.') ? `r.${sortBy.field}` : `${sortBy.field}`)} ${Prisma.raw(sortBy.order.toUpperCase())}`
        : Prisma.sql`ORDER BY r.id ASC`;
      
      // Pagination Condition
      const paginationCondition: Prisma.Sql =
        typeof offset === 'number' && typeof limit === 'number'
          ? Prisma.sql`OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY`
          : Prisma.empty;

      const roleList: GetRoleListDto = await this.prisma.$queryRaw(
        Prisma.sql`
          SELECT 
            r.id, 
            r.name, 
            r.description, 
            r.functionalAreaId, 
            r.isExternal, 
            r.startDate, 
            r.endDate, 
            r.createdAt, 
            r.createdBy, 
            r.updatedAt, 
            r.updatedBy, 
            r.statusId, 
            s.statusName, 
            f.name as functionalAreaName, 
            p.firstName as createdByFirstName, 
            p.lastName as createdByLastName, 
            up.firstName as updatedByFirstName, 
            up.lastName as updatedByLastName, 
            r.archivedAt, 
             CASE 
            WHEN r.isExternal = 1 THEN 'External'
            ELSE 'Internal'
          END AS externalStatus,
            COUNT(pr.id) as userAmount
          FROM role r
          LEFT JOIN status s ON r.statusId = s.id
          LEFT JOIN functionalArea f ON r.functionalAreaId = f.id
          LEFT JOIN profile p ON r.createdBy = p.id
          LEFT JOIN profile up ON r.updatedBy = up.id
          LEFT JOIN profileRole pr ON r.id = pr.roleId
          WHERE ${whereConditions}
          GROUP BY 
            r.id, 
            r.name, 
            r.description, 
            r.functionalAreaId, 
            r.isExternal, 
            r.startDate, 
            r.endDate, 
            r.createdAt, 
            r.createdBy, 
            r.updatedAt, 
            r.updatedBy, 
            r.statusId, 
            s.statusName, 
            f.name, 
            p.firstName, 
            p.lastName, 
            up.firstName, 
            up.lastName, 
            r.archivedAt
          ${sortCondition} ${paginationCondition}
        `,
      );

      // Total Records Count
      const roleCount: RoleListCount = await this.prisma.$queryRaw(
        Prisma.sql`
        SELECT COUNT(*)
        FROM Role r
        LEFT JOIN functionalArea f ON r.functionalAreaId = f.id
        WHERE ${whereConditions}
      `,
      );

      const updatedRoleList: UpdatedRoleListDto[] = (
        roleList as unknown as RoleObjDto[]
      ).map((item: RoleObjDto) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        externalStatus: item.externalStatus,
        functionalAreaId: item.functionalAreaId,
        functionalAreaName: item.functionalAreaName || '',
        isExternal: item.isExternal,
        createdAt: item.createdAt,
        createdBy: item.createdBy,
        createdByProfile: {
          firstName: item.createdByFirstName || '',
          lastName: item.createdByLastName || '',
        },
        updatedAt: item.updatedAt,
        updatedBy: item.updatedBy,
        updatedByProfile: {
          firstName: item.updatedByFirstName || '',
          lastName: item.updatedByLastName || '',
        },
        startDate: item.startDate,
        endDate: item.endDate,
        userAmount: item.userAmount || 0,
        archivedAt: item.archivedAt,
        statusId: item.statusId,
        statusName: item.statusName || '',
      }));

      return {
        roles: updatedRoleList || [],
        totalAmount: roleCount[0][''] || 0,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getRoleShortList(roleListDataToDbDto: RoleShortListDataToDbDto) {
    try {
      const { searchText } = roleListDataToDbDto;
      const whereClause: Prisma.roleWhereInput = {};

      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
          { functionalArea: { name: { contains: searchText } } },
        ];
      }

      whereClause.AND = [
        { statusId: await this.commonRepository.getStatusId('Active') },
      ];

      const roleList: RolelistDto[] = await this.prisma.role.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          description: true,
        },
      });
      return roleList;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getExistingRoleIds(roleIds) {
    try {
      const existingroles: Role[] = await this.prisma.role.findMany({
        where: { id: { in: roleIds }, statusId: COMMON.ACTIVE_VALUE },
        select: { id: true },
      });
      return existingroles;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async deleteRoles(roleIds: number[]) {
    try {
      await this.prisma.role.deleteMany({
        where: { id: { in: roleIds } },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getRolePermissionGroupList(
    rolePermissionGroupListDataToDbDto: RolePermissionGroupListDataToDbDto,
  ) {
    try {
      const { searchText } = rolePermissionGroupListDataToDbDto;
      const whereClause: Prisma.rolePermissionGroupWhereInput = {
        roleId: rolePermissionGroupListDataToDbDto.roleId,
      };
      if (searchText) {
        whereClause.OR = [
          {
            permissionGroup: {
              OR: [
                { name: { contains: searchText } },
                { description: { contains: searchText } },
              ],
            },
          },
        ];
      }
      const rolePermissionGroups: RolePermissionGroupsDto =
        await this.prisma.rolePermissionGroup.findMany({
          where: whereClause,
          skip: rolePermissionGroupListDataToDbDto.offset,
          take: rolePermissionGroupListDataToDbDto.limit,
          select: {
            permissionGroup: {
              select: {
                id: true,
                name: true,
                description: true,
                startDate: true,
                endDate: true,
              },
            },
          },
        });
      const permissionGroups = rolePermissionGroups.map(
        (group) => group.permissionGroup,
      );
      return permissionGroups;
    } catch (error) {
      throw new RepositoryError(`Repository Error: Unknown error`);
    }
  }

  async getRolePermissionGroupListUnaligned(
    rolePermissionGroupListDataToDbDto: RolePermissionGroupListDataToDbDto,
  ) {
    try {
      const { searchText, roleId } = rolePermissionGroupListDataToDbDto;
      const whereClause: Prisma.permissionGroupWhereInput = {
        rolePermissionGroup: {
          none: {
            roleId,
          },
        },
      };

      if (searchText) {
        whereClause.OR = [
          { name: { contains: searchText } },
          { description: { contains: searchText } },
        ];
      }
      const unalignedPermissionGroups: UnalignedPermissionGroupsDto[] =
        await this.prisma.permissionGroup.findMany({
          where: whereClause,
          skip: rolePermissionGroupListDataToDbDto.offset,
          take: rolePermissionGroupListDataToDbDto.limit,
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
          },
        });

      return unalignedPermissionGroups;
    } catch (error) {
      throw new RepositoryError(`Repository Error: Unknown error`);
    }
  }

  async archiveRole(data: RoleArchiveDto) {
    try {
      if (data.unArchive == false){
      await this.prisma.role.updateMany({
        where: { id: { in: data.roleIds } },
        data: {
          archivedAt: new Date().toISOString(),
        },
      });
    }else {
      await this.prisma.role.updateMany({
        where: { id: { in: data.roleIds } },
        data: {
          archivedAt: null,
        },
      });
    }
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async checkRoles(data: RoleArchiveDto) {
    try {
      const checkRole = await this.prisma.role.findMany({
        where: { id: { in: data.roleIds } },
        select: { id: true },
      });

      const foundRoleIds: number[] = checkRole.map((role) => role.id);
      const missingRoleIds: number[] = data.roleIds.filter(
        (id) => !foundRoleIds.includes(id),
      );

      return missingRoleIds;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async findRoleByName(name: string) {
    return this.prisma.role.findFirst({
      where: { name },
    });
  }

  async getRolePermission(data: number) {
    try {
      const rolePermission: RolePermissionResponseDto =
        await this.prisma.rolePermission.findMany({
          where: {
            roleId: data,
          },
          select: {
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
        });
      return rolePermission;
    } catch (error) {
      throw new RepositoryError(`Repository Error: Unknown error`);
    }
  }

  async getPermissionGroupRoles(permissionGroupId: number) {
    try {
      const permissionGroupRoles: PermissionGroupRolesDto =
        await this.prisma.rolePermissionGroup.findMany({
          where: {
            permissionGroupId,
          },
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                statusId: true,
                isExternal: true,
                startDate: true,
                endDate: true,
              },
            },
          },
        });
      const roles = permissionGroupRoles.map((group) => group.role);
      return roles;
    } catch (error) {
      throw new RepositoryError(`Repository Error: Unknown error`);
    }
  }

  async checkRolesIsdeactivated(data: RoleArchiveDto) {
    try {
      const checkRole = await this.prisma.role.findMany({
        where: { id: { in: data.roleIds }, statusId: 1 },
        select: { id: true },
      });

      const foundRoleIds: number[] = checkRole.map((role) => role.id);

      return foundRoleIds;
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async alignPermissionGroups(
    roleId: number,
    permissionGroupIdsToAlign: number[],
  ) {
    try {
      // Fetch existing permission group ids for the role
      const existingPermissionGroups =
        await this.prisma.rolePermissionGroup.findMany({
          where: { roleId },
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
        (existId) => !permissionGroupIdsToAlign.includes(existId),
      );

      // Delete only the relations that need to be removed
      if (idsToRemove.length) {
        await this.prisma.rolePermissionGroup.deleteMany({
          where: { roleId, permissionGroupId: { in: idsToRemove } },
        });
      }

      // Add new relations
      if (idsToAdd.length) {
        const newPermissionGroups = idsToAdd.map((permissionGroupId) => ({
          roleId,
          permissionGroupId,
        }));

        await this.prisma.rolePermissionGroup.createMany({
          data: newPermissionGroups,
        });
      }

      return { role: { id: roleId } };
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async alignPermission(
    roleId: number,
    permissionIdsToAlign: number[],
    createdBy: number,
    updatedBy: number,
  ) {
    try {
      // Fetch existing permission  ids for the role
      const existingPermission = await this.prisma.rolePermission.findMany({
        where: { roleId },
        select: { permissionId: true },
      });

      const existingPermissionIds: number[] = existingPermission.map(
        (pg) => pg.permissionId,
      );

      // Determine which ids to add and which to remove
      const idsToAdd: number[] = permissionIdsToAlign.filter(
        (permissionId) => !existingPermissionIds.includes(permissionId),
      );
      const idsToRemove: number[] = existingPermissionIds.filter(
        (existId) => !permissionIdsToAlign.includes(existId),
      );

      // Delete only the relations that need to be removed
      if (idsToRemove.length) {
        await this.prisma.rolePermission.deleteMany({
          where: { roleId, permissionId: { in: idsToRemove } },
        });
      }

      // Add new relations
      if (idsToAdd.length) {
        const newPermission: NewPermissionDto[] = idsToAdd.map(
          (permissionId) => ({
            roleId,
            permissionId,
            createdBy,
            updatedBy,
          }),
        );

        await this.prisma.rolePermission.createMany({
          data: newPermission,
        });
      }

      return { role: { id: roleId } };
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async alignClients(roleId: number, clientIdsToAlign: number[]) {
    try {
      // Fetch existing Client ids for the role
      const existingClient = await this.prisma.roleClient.findMany({
        where: {
          roleId,
          client: {
            isActive: true,
          },
        },
        select: { clientId: true },
      });

      const existingClientIds: number[] = existingClient.map(
        (pg) => pg.clientId,
      );

      // Determine which ids to add and which to remove
      const idsToAdd: number[] = clientIdsToAlign.filter(
        (clientId) => !existingClientIds.includes(clientId),
      );
      const idsToRemove: number[] = existingClientIds.filter(
        (existId) => !clientIdsToAlign.includes(existId),
      );

      // Delete only the relations that need to be removed
      if (idsToRemove.length) {
        await this.prisma.roleClient.deleteMany({
          where: { roleId, clientId: { in: idsToRemove } },
        });
      }

      // Add new relations
      if (idsToAdd.length) {
        const newClient = idsToAdd.map((clientId: number) => ({
          roleId,
          clientId,
        }));

        await this.prisma.roleClient.createMany({
          data: newClient,
        });
      }

      return { role: { id: roleId } };
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async alignCategories(
    roleId: number,
    categoryIdsToAlign: number[],
    updatedBy,
  ): Promise<void> {
    try {
      // Fetch existing category ids for the role
      const existingCategoryId =
        await this.prisma.roleCategoryAlignment.findMany({
          where: { roleId },
          select: { roleCategoryId: true },
        });

      const existingCategoryIds: number[] = existingCategoryId.map(
        (pg) => pg.roleCategoryId,
      );

      // Determine which ids to add and which to remove
      const idsToAdd: number[] = categoryIdsToAlign.filter(
        (categoryId) => !existingCategoryIds.includes(categoryId),
      );
      const idsToRemove: number[] = existingCategoryIds.filter(
        (existId) => !categoryIdsToAlign.includes(existId),
      );

      // Delete only the relations that need to be removed
      if (idsToRemove.length) {
        await this.prisma.roleCategoryAlignment.deleteMany({
          where: { roleId, roleCategoryId: { in: idsToRemove } },
        });
      }

      // Add new relations
      if (idsToAdd.length) {
        const newCategory = idsToAdd.map((roleCategoryId: number) => ({
          roleId,
          roleCategoryId,
          createdBy: updatedBy,
          updatedBy,
          isActive: true,
        }));

        await this.prisma.roleCategoryAlignment.createMany({
          data: newCategory,
        });
      }
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async alignCriterias(
    roleId: number,
    roleCriteriaDatas: {
      roleCriteriaId: number;
      roleCriteriaResponse: string;
    }[],
    updatedBy,
  ): Promise<void> {
    try {
      const updatePromises: Prisma.PrismaPromise<Prisma.BatchPayload>[] =
        roleCriteriaDatas.map((criteria) =>
          this.prisma.roleCriteriaAlignment.updateMany({
            where: {
              roleId,
              roleCriteriaId: criteria.roleCriteriaId,
            },
            data: {
              roleCriteriaResponse: criteria.roleCriteriaResponse,
              updatedBy,
              isActive: true,
            },
          }),
        );
      await Promise.all(updatePromises);
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async findRoleByNameAndId(name: string, id: number) {
    return this.prisma.role.findFirst({
      where: {
        name,
        id: {
          not: id,
        },
      },
    });
  }

  async getRoleCategoriesList() {
    const roleCategoryList: RoleCategoryDto[] | null =
      await this.prisma.roleCategory.findMany({
        where: { isActive: true },
        select: { id: true, roleCategoryName: true },
      });
    return roleCategoryList;
  }

  async getValidRoleCategoriesList(categoryIds: number[]) {
    const roleCategoryList: RoleCategoryDto[] | null =
      await this.prisma.roleCategory.findMany({
        where: { isActive: true, id: { in: categoryIds } },
        select: { id: true, roleCategoryName: true },
      });
    return roleCategoryList;
  }

  async getValidRoleCriteriasList(criteriaIds: number[]) {
    const roleCriteriaList: RoleCriteriaDto[] | null =
      await this.prisma.roleCriteria.findMany({
        where: { isActive: true, id: { in: criteriaIds } },
        select: { id: true, roleCriteriaName: true },
      });
    return roleCriteriaList;
  }

  async getRoleCriteriasList() {
    const roleCriteriaList: RoleCriteriaDto[] | null =
      await this.prisma.roleCriteria.findMany({
        where: { isActive: true },
        select: { id: true, roleCriteriaName: true },
      });
    return roleCriteriaList;
  }

  async updateRoleCategoryAlignment(
    roleId: number,
    roleCategoryIds: number[],
    updatedBy: number,
  ) {
    try {
      await this.prisma.roleCategoryAlignment.deleteMany({
        where: { roleId },
      });
      const categoryAlignment: CreateRoleCategoryAlignmentDTO[] =
        roleCategoryIds.map((roleCategoryId) => ({
          roleId,
          roleCategoryId,
          createdBy: updatedBy,
          updatedBy,
          isActive: true,
        }));

      return await this.prisma.roleCategoryAlignment.createMany({
        data: categoryAlignment,
      });
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error in Edit Role Catergory: ${error.message || 'Unknown error'}`,
      );
    }
  }

  async updateRoleCriteriaAlignment(
    roleId: number,
    roleCriteriaIds: EditRoleCriteriaAlignmentDTO[],
    updatedBy: number,
  ) {
    try {
      await this.prisma.roleCriteriaAlignment.deleteMany({
        where: { roleId },
      });

      const criteriaAlignments: CriteriaAlignmentsDto[] = roleCriteriaIds.map(
        ({ roleCriteriaId, roleCriteriaResponse }) => ({
          roleId,
          roleCriteriaId,
          roleCriteriaResponse,
          createdBy: updatedBy,
          updatedBy,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
      return await this.prisma.roleCriteriaAlignment.createMany({
        data: criteriaAlignments,
      });
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(
        `Repository Error in Edit Role Criteria: ${error.message || 'Unknown error'}`,
      );
    }
  }
  // async checkRole(startDate: Date, endDate: Date): boolean{
  //   return roles.some((role) => {
  //     return (startDate >= role.startDate &&
  //       startDate <= role.endDate) ||
  //     (endDate >= role.startDate && endDate <= role.endDate) ||
  //     (startDate <= role.startDate && endDate >= role.endDate)
  //     }
  //   );
  // }

  async getRoleAdditionalData(id: number) {
    try {
      const select: SelectDto = {
        select: {
          id: true,
          name: true,
          description: true,
          startDate: true,
          endDate: true,
        },
      };

      const role: RoleAdditionalDataResponseDto | null =
        await this.prisma.role.findUnique({
          where: { id },
          include: {
            rolePermission: {
              select: {
                permission: select,
              },
            },
            rolePermissionGroup: {
              select: {
                permissionGroup: select,
              },
            },
            roleClient: {
              select: {
                client: select,
              },
            },
          },
        });

      return {
        rolePermission: role?.rolePermission || [],
        rolePermissionGroup: role?.rolePermissionGroup || [],
        roleClient: role?.roleClient || [],
      };
    } catch (err: unknown) {
      const error = err as Error;
      throw new RepositoryError(ERRORMESSAGE.REPOSITORY_ERROR(error.message));
    }
  }
}

export default RoleRepository;
