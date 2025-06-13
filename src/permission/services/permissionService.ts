import { inject, injectable } from 'inversify';
import config from 'config';
import { HttpStatusCode } from 'axios';
import { client, permission, permissionGroup, role } from '@prisma/client';
import { DateTime } from 'luxon';
import { COMMON } from '../../utils/common';
import TYPES from '../../dependencyManager/types';
import PermissionRepository from '../repositories/permissionRepository';
import { BadRequestError } from '../../error/badRequestError';
import { validateIds } from '../../utils/utils';
import {
  EditPermissionDto,
  PermissionResponseDto,
  AddPermissionBodyData,
  AddPermissionCreatedData,
  PermissionData,
  ListPermissionBodyDto,
  Permission,
  ViewShortPermissionsDto,
  ShortPermissionsDto,
  ShortPermissionObjectDto,
  ArchivePermissionRequestDto,
  ArchivePermissionCheckDto,
  PermissionList,
} from '../dto/permission.dto';
import { NotFoundError } from '../../error/notFoundError';
import DateService from '../../libs/dateService';
import validateDates from '../../utils/statusUtils';
import HistoryService from '../../utils/historyService';
import { MESSAGES } from '../../utils/message';
import { PERMISSION_MESSAGES } from '../../utils/Messages/permissionMessage';
import PermissionGroupRepository from '../../permissionGroup/repositories/permissionGroupRepository';
import RoleRepository from '../../roles/repositories/roleRepository';
import ClientRepository from '../../client/repositories/clientRepository';

@injectable()
export default class PermissionService {
  constructor(
    @inject(TYPES.PermissionRepository)
    private readonly permissionRepository: PermissionRepository,
    @inject(TYPES.ClientRepository)
    private clientRepository: ClientRepository,
    @inject(TYPES.DateService)
    private readonly dateService: DateService,
    @inject(TYPES.HistoryService)
    private readonly historyService: HistoryService,
    @inject(TYPES.PermissionGroupRepository)
    private permissionGroupRespository: PermissionGroupRepository,
    @inject(TYPES.RoleRepository)
    private roleRepository: RoleRepository,
  ) {}

  private getDefaultEndDate(): Date {
    return new Date(config.get<string>(COMMON.DEFAULT_ENTITY_AND_DATE));
  }

  async listMenu() {
    return this.permissionRepository.listMenuData();
  }

  async editPermission(
    permissionId: number,
    data: EditPermissionDto,
  ): Promise<PermissionResponseDto> {
    try {
      // Validating the permission id
      const getPermissionData: permission | null =
        await this.permissionRepository.findPermissionData(permissionId);
      if (!getPermissionData) {
        throw new NotFoundError(
          PERMISSION_MESSAGES.PERMISSION_ID_NOT_FOUND(permissionId),
        );
      }
      if (data.name) {
        const getPermissionName: permission | null =
          await this.permissionRepository.findByName(data.name, permissionId);
        if (getPermissionName) {
          throw new Error(
            PERMISSION_MESSAGES.PERMISSION_NAME_ALREADY_EXISTS(data.name),
          );
        }
      }

      // Validating the permissionGroupIds
      await validateIds(
        data.permissionGroupIds ?? [],
        this.permissionGroupRespository.findActivePermissionGroupsByIds.bind(
          this.permissionGroupRespository,
        ),
        MESSAGES.INACTIVE_PERMISSION_GROUPS_OR_DO_NOT_EXISTS,
      );

      // Validate role Ids
      await validateIds(
        data.roleIds ?? [],
        this.roleRepository.findActiveRolesByIds.bind(this.roleRepository),
        MESSAGES.INACTIVE_ROLES_OR_DO_NOT_EXISTS,
      );
      // Validate client Ids
      await validateIds(
        data.clientIds ?? [],
        this.clientRepository.findActiveClientsByIds.bind(
          this.clientRepository,
        ),
        MESSAGES.INACTIVE_CLIENTS_OR_DO_NOT_EXISTS,
      );
      // validate endDate
      const endDateDefault: Date = this.getDefaultEndDate();
      if (data.endDate) {
        const validatedStartDate: Date = data.startDate
          ? new Date(data.startDate)
          : new Date();

        let validatedEndDate: Date;
        if (data.endDate) {
          validatedEndDate = new Date(data.endDate);
        } else if (getPermissionData.endDate) {
          validatedEndDate = new Date(getPermissionData.endDate);
        } else {
          validatedEndDate = endDateDefault;
        }
        validateDates({
          startDate: validatedStartDate,
          endDate: validatedEndDate,
        });
      }

      // Validate Menu Ids
      if (data.menuIds) {
        await this.validateMenuIds(data.menuIds, false);
      }

      // Validate Sub Menu Ids
      if (data.subMenuIds) {
        await this.validateMenuIds(data.subMenuIds, true);
      }

      // Updating the permission data
      const updatedData: EditPermissionDto = {
        ...data,
        endDate: data.endDate || getPermissionData.endDate || endDateDefault,
      };
      await this.historyService.trackFieldChanges(
        'permission',
        permissionId,
        updatedData,
        data.updatedBy,
      );
      const permissionData: PermissionResponseDto =
        await this.permissionRepository.editPermission(
          permissionId,
          updatedData,
        );

      return permissionData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async validateMenuIds(menuIds: number[], isSubMenu: boolean) {
    const validMenuIds: { id: number }[] =
      await this.permissionRepository.findMenuIds(menuIds, isSubMenu);

    const validIds: number[] = validMenuIds.map((menu) => menu.id);
    const invalidIds: number[] = menuIds.filter(
      (id) => !new Set(validIds).has(id),
    );

    if (invalidIds.length) {
      throw new BadRequestError(
        isSubMenu
          ? PERMISSION_MESSAGES.INVALID_SUB_MENU_IDS(invalidIds)
          : PERMISSION_MESSAGES.INVALID_MENU_IDS(invalidIds),
      );
    }
  }

  async createPermission(data: AddPermissionBodyData): Promise<{ id: number }> {
    try {
      const {
        createdBy,
        updatedBy,
        startDate,
        endDate,
        name,
        cloneId,
        type,
      }: {
        createdBy: number;
        updatedBy: number;
        startDate: Date;
        endDate: Date;
        name: string;
        cloneId?: number;
        type?: string;
      } = data;
      // validate endDate
      const endDateDefault: Date = this.getDefaultEndDate();
      const validatedStartDate: Date = startDate
        ? new Date(startDate)
        : new Date();
      const validatedEndDate: Date = endDate
        ? new Date(endDate)
        : endDateDefault;
      const finalEndDate: Date = validateDates({
        startDate: validatedStartDate,
        endDate: validatedEndDate,
      });

      if (type === COMMON.CLONE && !cloneId) {
        throw new Error(MESSAGES.CLONE_ID_REQUIRED);
      }
      if (cloneId && type === COMMON.CLONE) {
        const validCloneData: { id: number } | null | undefined =
          await this.permissionRepository.findValidCloseId(cloneId);
        if (!validCloneData) {
          throw new Error(MESSAGES.INVALID_CLONED_ID(cloneId));
        }
      }

      const getPermissionCount: number =
        await this.permissionRepository.findPermissionByNames(name);
      if (getPermissionCount > 0) {
        throw new Error(
          PERMISSION_MESSAGES.PERMISSION_NAME_ALREADY_EXISTS(data.name),
        );
      }

      const newData: AddPermissionBodyData = {
        ...data,
        createdBy,
        updatedBy,
        startDate,
        endDate: finalEndDate,
        cloneId,
        name,
      };
      const menuChecks: { ids: number[] | undefined; isSubMenu: boolean }[] = [
        { ids: data.menuIds, isSubMenu: false },
        { ids: data.subMenuIds, isSubMenu: true },
      ];
      for (const { ids, isSubMenu } of menuChecks) {
        if (ids) {
          await this.validateMenuIds(ids, isSubMenu);
        }
      }
      await this.validatePermissionGroupIds(data.permissionGroupIds);
      await this.validateRoleIds(data.roleIds);
      await this.validateClientIds(data.clientIds);
      const createdData: AddPermissionCreatedData =
        await this.permissionRepository.createPermission(newData);
      await this.historyService.trackFieldChanges(
        'permission',
        0,
        newData,
        createdBy,
      );
      return {
        id: createdData.id,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async viewPermission(id: number) {
    try {
      const getPermissionData: PermissionData | null =
        await this.permissionRepository.getPermission(id);
      if (!getPermissionData) {
        throw new NotFoundError(PERMISSION_MESSAGES.PERMISSION_NOT_FOUND);
      }
      return await this.permissionRepository.viewPermission(getPermissionData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async listPermissions(data: ListPermissionBodyDto) {
    try {
      const {
        permissions,
        totalAmount,
      }: { permissions: PermissionList; totalAmount: number } =
        await this.permissionRepository.listPermissions(data);

      return {
        permissions,
        totalAmount,
      };
    } catch (error: unknown) {
      throw error as Error;
    }
  }

  async deletePermissions(permissionsIds: number[]): Promise<void> {
    try {
      const existingPermissions: Permission[] =
        await this.permissionRepository.getExistingPermissionIds(
          permissionsIds,
        );
      const existingIds: number[] = existingPermissions.map((perm) => perm.id);
      const missingIds: number[] = permissionsIds.filter(
        (id) => !new Set(existingIds).has(id),
      );
      if (missingIds.length > 0) {
        throw new NotFoundError(
          PERMISSION_MESSAGES.INVALID_PERMISSION_IDS(missingIds),
        );
      }
      await this.permissionRepository.deletePermissions(permissionsIds);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getShortPermissions(data: ViewShortPermissionsDto) {
    try {
      const {
        permissions,
        totalAmount,
      }: { permissions: ShortPermissionsDto; totalAmount: number } =
        await this.permissionRepository.getShortPermissions(data);

      const updatedAvailablePermissions: ShortPermissionsDto = permissions.map(
        (permissionObj: ShortPermissionObjectDto) => {
          if (
            !permissionObj ||
            !(permissionObj?.startDate && permissionObj?.endDate)
          ) {
            return permissionObj;
          }
          return {
            ...permissionObj,
          };
        },
      );

      return {
        permissions: updatedAvailablePermissions,
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

  async archivePermission(data: ArchivePermissionRequestDto) {
    const checkPermission: ArchivePermissionCheckDto =
      await this.permissionRepository.checkIfPermissionExist(data);

    const foundPermissionIds: Set<number> = new Set(
      checkPermission.map((permissionItem) => permissionItem.id),
    );
    const missingPermissionIds: number[] = data.permissionIds.filter(
      (id) => !foundPermissionIds.has(id),
    );
    if (missingPermissionIds.length !== 0)
      return {
        status: HttpStatusCode.BadRequest,
        message:
          PERMISSION_MESSAGES.INACTIVE_PERMISSION_OR_DO_NOT_EXISTS(
            missingPermissionIds,
          ),
      };
    const archivedPermissionIds: number[] = checkPermission
      .filter((permissionItem) => permissionItem.archivedAt !== null)
      .map((permissionItem) => permissionItem.id);
    if (archivedPermissionIds.length !== 0)
      return {
        status: HttpStatusCode.BadRequest,
        message: PERMISSION_MESSAGES.PERMISSION_ALREADY_ARCHIVED(
          archivedPermissionIds,
        ),
      };

    await this.permissionRepository.archivePermission(data);
    return {
      status: HttpStatusCode.Ok,
      message: PERMISSION_MESSAGES.PERMISSION_ARCHIVED_SUCCESSFULLY,
    };
  }

  async getValidateMenuIds(
    ids: number[] | undefined,
    errorMessage: (invalidIds: number[]) => string,
  ): Promise<void> {
    try {
      if (ids) {
        const validMenuIds = await this.permissionRepository.findMenuIds(ids);
        const validIds = validMenuIds.map((menu) => menu.id);
        const invalidIds = ids.filter((id) => !validIds.includes(id));

        if (invalidIds.length > 0) {
          throw new Error(errorMessage(invalidIds));
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async validatePermissionGroupIds(
    permissionGroupIds: number[] | undefined,
  ): Promise<void> {
    try {
      if (permissionGroupIds) {
        const activePermissionGroups: permissionGroup[] =
          await this.permissionGroupRespository.findActivePermissionGroupsByIds(
            permissionGroupIds,
          );
        const activePermissionGroupIds: number[] = activePermissionGroups.map(
          (group) => group.id,
        );
        const inactivePermissionGroupIds: number[] = permissionGroupIds.filter(
          (id) => !activePermissionGroupIds.includes(id),
        );

        if (inactivePermissionGroupIds.length > 0) {
          throw new Error(
            MESSAGES.INACTIVE_PERMISSION_GROUPS_OR_DO_NOT_EXISTS(
              inactivePermissionGroupIds,
            ),
          );
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async validateRoleIds(roleIds: number[] | undefined) {
    try {
      if (roleIds) {
        const activeRoles: role[] =
          await this.roleRepository.findActiveRolesByIds(roleIds);
        const activeRoleIds: number[] = activeRoles.map((roleId) => roleId.id);
        const inactiveRoleIds: number[] = roleIds.filter(
          (id) => !activeRoleIds.includes(id),
        );

        if (inactiveRoleIds.length > 0) {
          throw new Error(
            MESSAGES.INACTIVE_ROLES_OR_DO_NOT_EXISTS(inactiveRoleIds),
          );
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async validateClientIds(clientIds: number[] | undefined) {
    try {
      if (clientIds) {
        const activeClients: client[] =
          await this.clientRepository.findActiveClientsByIds(clientIds);
        const activeClientIds: number[] = activeClients.map(
          (clientId) => clientId.id,
        );
        const inactiveClientIds: number[] = clientIds.filter(
          (id) => !activeClientIds.includes(id),
        );

        if (inactiveClientIds.length > 0) {
          throw new BadRequestError(
            MESSAGES.INACTIVE_CLIENTS_OR_DO_NOT_EXISTS(inactiveClientIds),
          );
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }
}
