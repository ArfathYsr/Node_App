import { inject, injectable } from 'inversify';
import config from 'config';
import { HttpStatusCode } from 'axios';
import { MESSAGES } from '../../utils/message';
import TYPES from '../../dependencyManager/types';
import PermissionGroupRepository from '../repositories/permissionGroupRepository';
import PermissionRepository from '../../permission/repositories/permissionRepository';
import RoleRepository from '../../roles/repositories/roleRepository';
import {
  CreatePermissionGroupDto,
  UpdatePermissionGroupDto,
  PermissionGroupView,
  ViewPermissionGroupListDto,
  ViewShortPermissionGroupsDto,
  PermissionGroup,
  ArchivePermissionGroupRequestDto,
  ArchivePermissionGroupCheckDto,
  PermissionGroupDto,
} from '../dto/permissionGroup.dto';
import DateService from '../../libs/dateService';
import { NotFoundError } from '../../error/notFoundError';
import { validateIds } from '../../utils/utils';
import HistoryService from '../../utils/historyService';
import validateDates from '../../utils/statusUtils';
import { COMMON } from '../../utils/common';
import { BadRequestError } from '../../error/badRequestError';
import { PERMISSION_MESSAGES } from '../../utils/Messages/permissionMessage';

@injectable()
export default class PermissionGroupService {
  private readonly permissionGroupRepository: PermissionGroupRepository;

  private readonly permissionRepository: PermissionRepository;

  private readonly roleRepository: RoleRepository;

  private readonly dateService: DateService;

  constructor(
    @inject(TYPES.PermissionGroupRepository)
    permissionGroupRepository: PermissionGroupRepository,
    @inject(TYPES.PermissionRepository)
    permissionRepository: PermissionRepository,
    @inject(TYPES.RoleRepository)
    roleRepository: RoleRepository,
    @inject(TYPES.DateService) dateService: DateService,
    @inject(TYPES.HistoryService)
    private readonly historyService: HistoryService,
  ) {
    this.permissionGroupRepository = permissionGroupRepository;
    this.permissionRepository = permissionRepository;
    this.roleRepository = roleRepository;
    this.dateService = dateService;
  }

  private getDefaultEndDate(): Date {
    return new Date(config.get<string>(COMMON.DEFAULT_ENTITY_AND_DATE));
  }

  async createPermissionGroup(data: CreatePermissionGroupDto) {
    try {
      const {
        permissionIds,
        roleIds,
        name,
        cloneId,
        type,
        startDate,
        endDate,
        ...rest
      } = data;

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

      const existingPermissionGroup =
        await this.permissionGroupRepository.findPermissionGroupByName(name);
      if (type === COMMON.CLONE && !cloneId) {
        throw new Error(MESSAGES.CLONE_ID_REQUIRED);
      }

      if (existingPermissionGroup) {
        throw new Error(
          MESSAGES.PERMISSION_GROUP_NAME_ALREADY_EXISTS(data.name),
        );
      }

      const updatedData: CreatePermissionGroupDto = {
        ...rest,
        cloneId,
        name,
        startDate,
        endDate: finalEndDate,
      };

      const createdPermissionGroup =
        await this.permissionGroupRepository.createPermissionGroup(
          updatedData,
          permissionIds,
          roleIds,
        );

      await this.historyService.trackFieldChanges(
        'permissionGroup',
        0,
        updatedData,
        updatedData.createdBy,
      );
      return createdPermissionGroup;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async updatePermissionGroup(
    permissionGroupId: number,
    data: UpdatePermissionGroupDto,
  ) {
    try {
      const { startDate, endDate }: { startDate?: Date; endDate?: Date } = data;
      if (data.name) {
        const existingPermissionGroup: PermissionGroupDto =
          await this.permissionGroupRepository.findPermissionGroupByName(
            data.name,
            permissionGroupId,
          );

        if (existingPermissionGroup) {
          throw new BadRequestError(
            MESSAGES.PERMISSION_GROUP_NAME_ALREADY_EXISTS(data.name),
          );
        }
      }

      const getPermissionGroup: PermissionGroupView =
        await this.permissionGroupRepository.viewPermissionGroup(
          permissionGroupId,
        );

      const endDateDefault: Date = this.getDefaultEndDate();
      if (endDate) {
        const validatedStartDate: Date = startDate
          ? new Date(startDate)
          : new Date();
        let validatedEndDate: Date;
        if (endDate) {
          validatedEndDate = new Date(endDate);
        } else if (getPermissionGroup?.endDate) {
          validatedEndDate = new Date(getPermissionGroup.endDate);
        } else {
          validatedEndDate = endDateDefault;
        }
        validateDates({
          startDate: validatedStartDate,
          endDate: validatedEndDate,
        });
      }

      // Validate permission Ids
      await validateIds(
        data.permissionIds ?? [],
        this.permissionRepository.findActivePermissionsByIds.bind(
          this.permissionRepository,
        ),
        PERMISSION_MESSAGES.INACTIVE_PERMISSION_OR_DO_NOT_EXISTS,
      );

      // Validate role Ids
      await validateIds(
        data.roleIds ?? [],
        this.roleRepository.findActiveRolesByIds.bind(this.roleRepository),
        MESSAGES.INACTIVE_ROLES_OR_DO_NOT_EXISTS,
      );

      const updatedPermissionGroupId =
        this.permissionGroupRepository.updatePermissionGroup(
          permissionGroupId,
          data,
        );

      await this.historyService.trackFieldChanges(
        'permissionGroup',
        permissionGroupId,
        data,
        data.updatedBy,
      );
      return await updatedPermissionGroupId;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async viewPermissionGroup(permissionGroupId: number) {
    try {
      const permissionGroup: PermissionGroupView =
        await this.permissionGroupRepository.viewPermissionGroup(
          permissionGroupId,
        );
      if (
        !permissionGroup ||
        !(permissionGroup?.startDate && permissionGroup?.endDate)
      ) {
        return permissionGroup;
      }

      return {
        ...permissionGroup,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async viewPermissionGroupList(data: ViewPermissionGroupListDto) {
    try {
      const [startOfTodayDate, endOfTodayDate] =
        this.dateService.getTodaysStartAndEndDates();
      const newData: ViewPermissionGroupListDto = {
        ...data,
        startOfTodayDate: startOfTodayDate.toJSDate(),
        endOfTodayDate: endOfTodayDate.toJSDate(),
      };
      return await this.permissionGroupRepository.viewPermissionGroupList(
        newData,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getShortPermissionGroups(data: ViewShortPermissionGroupsDto) {
    try {
      return await this.permissionGroupRepository.getShortPermissionGroups(
        data,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async deletePermissionGroups(permissionGroupsIds: number[]): Promise<void> {
    try {
      const existingPermissionGroups: PermissionGroup[] =
        await this.permissionGroupRepository.getExistingPermissionGroupIds(
          permissionGroupsIds,
        );
      const existingIds: number[] = existingPermissionGroups.map((fa) => fa.id);
      const missingIds: number[] = permissionGroupsIds.filter(
        (id) => !existingIds.includes(id),
      );
      if (missingIds.length > 0) {
        throw new NotFoundError(
          MESSAGES.PERMISSION_GROUP_ID_NOTFOUND(missingIds.join(', ')),
        );
      }
      await this.permissionGroupRepository.deletePermissionGroups(
        permissionGroupsIds,
      );
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async archivePermissionGroup(data: ArchivePermissionGroupRequestDto) {
    const checkPermissionGroup: ArchivePermissionGroupCheckDto =
      await this.permissionGroupRepository.checkIfPermissionGroupExist(data);

    const foundPermissionGroupIds: Set<number> = new Set(
      checkPermissionGroup.map((permissionItem) => permissionItem.id),
    );
    const missingPermissionGroupIds: number[] = data.permissionGroupIds.filter(
      (id) => !foundPermissionGroupIds.has(id),
    );
    if (missingPermissionGroupIds.length !== 0)
      return {
        status: HttpStatusCode.BadRequest,
        message: MESSAGES.INVALID_PERMISSION_GROUP_IDS(
          missingPermissionGroupIds,
        ),
      };

    const archivedPermissionGroupIds: number[] = checkPermissionGroup
      .filter((permissionGroupItem) => permissionGroupItem.archivedAt !== null)
      .map((permissionGroupItem) => permissionGroupItem.id);

    if (archivedPermissionGroupIds.length !== 0)
      return {
        status: HttpStatusCode.BadRequest,
        message: MESSAGES.PERMISSION_GROUP_ALREADY_ARCHIVED(
          archivedPermissionGroupIds,
        ),
      };
    await this.permissionGroupRepository.archivePermissionGroup(data);
    return {
      status: HttpStatusCode.Ok,
      message: MESSAGES.PERMISSION_GROUP_ARCHIVED_SUCCESSFULLY,
    };
  }
}
