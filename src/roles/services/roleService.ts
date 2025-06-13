import { inject, injectable } from 'inversify';
import config from 'config';
import { Prisma } from '@prisma/client';
import { HttpStatusCode } from 'axios';
import { ClientIdDto } from 'src/client/dto/client.dto';
import { MESSAGES } from '../../utils/message';
import { PERMISSION_MESSAGES } from '../../utils/Messages/permissionMessage';
import TYPES from '../../dependencyManager/types';
import RoleRepository from '../repositories/roleRepository';
import {
  CreateRoleDataToDbDto,
  CreateRoleDto,
  RoleListDataToDbDto,
  ViewRoleResponseDto,
  EditRoleDto,
  EditRoleResponseDto,
  Role,
  RolePermissionGroupListDataToDbDto,
  RoleArchiveDto,
  RoleShortListDataToDbDto,
  RolePermissionResponseDto,
  RolePermissionGroupIdsDto,
  RoleAdditionalDataResponseDto,
  EditRoleCategoryCriteriaAlignment,
  RoleCriteriaDto,
  ExistingRoleDto,
  FormatPermissionDto,
  RoleDataResponseDto,
  ExistingClientDto,
  PermissionGroupDto,
  PermissionRolesDto,
  RoleDto,
  RoleCategoryDto,
  EditRoleCriteriaAlignmentDTO,
  RoleCriteriaAlignmentDTO,
} from '../dto/role.dto';
import { ShortPermissionGroupsDto } from '../../permissionGroup/dto/permissionGroup.dto';
import { NotFoundError } from '../../error/notFoundError';
import DateService from '../../libs/dateService';
import HistoryService from '../../utils/historyService';
import ClientRepository from '../../client/repositories/clientRepository';
import PermissionRepository from '../../permission/repositories/permissionRepository';
import { dateValidation, isEndDateAfterToday } from '../../utils/dateAndTime';
import { ValidationError } from '../../error/validationError';
import PermissionGroupRepository from '../../permissionGroup/repositories/permissionGroupRepository';
import { CustomError } from '../../error/customError';

@injectable()
export default class RoleService {
  private readonly roleRepository: RoleRepository;

  private readonly dateService: DateService;

  private readonly clientRepository: ClientRepository;

  private readonly permissionRepository: PermissionRepository;

  private readonly permissionGroupRepository: PermissionGroupRepository;

  constructor(
    @inject(TYPES.RoleRepository) roleRepository: RoleRepository,
    @inject(TYPES.ClientRepository) clientRepository: ClientRepository,
    @inject(TYPES.PermissionRepository)
    permissionRepository: PermissionRepository,
    @inject(TYPES.PermissionGroupRepository)
    permissionGroupRepository: PermissionGroupRepository,
    @inject(TYPES.DateService) dateService: DateService,
    @inject(TYPES.HistoryService)
    private readonly historyService: HistoryService,
  ) {
    this.roleRepository = roleRepository;
    this.dateService = dateService;
    this.clientRepository = clientRepository;
    this.permissionRepository = permissionRepository;
    this.permissionGroupRepository = permissionGroupRepository;
  }

  private getDefaultEndDate(): Date {
    return new Date(config.get<string>('defaultEntity.defaultEndDate'));
  }

  private getDefaultStartDate(): Date {
    return new Date();
  }

  async createRole<T extends CreateRoleDto>(data: T) {
    try {
      const {
        createdBy,
        updatedBy,
        startDate,
        endDate,
        name,
        cloneId,
        type,
        isExternal,
        roleCriteriaDatas,
        roleCategoryIds,
        ...filteredData
      } = data;

      const createRoleData: CreateRoleDataToDbDto = {
        ...filteredData,
        isExternal,
        startDate: data.startDate || this.getDefaultStartDate(),
        createdBy,
        updatedBy,
        endDate: data.endDate || this.getDefaultEndDate(),
        cloneId,
        name,
        statusId: data.statusId,
        roleCriteriaDatas,
        roleCategoryIds,
      };

      if (type === 'clone' && !cloneId) {
        throw new CustomError(
          MESSAGES.CLONE_ID_REQUIRED,
          HttpStatusCode.BadRequest,
        );
      }

      const createRoleStartDate: Date = createRoleData?.startDate as Date;
      const createRoleEndDate: Date = createRoleData?.endDate as Date;
      this.validateCreatRoleDates(createRoleStartDate, createRoleEndDate);

      const existingRole: ExistingRoleDto | null =
        await this.roleRepository.findRoleByName(name);
      // If the name already exists, return an error message
      if (existingRole) {
        throw new CustomError(
          MESSAGES.ROLE_NAME_ALREADY_EXISTS(name),
          HttpStatusCode.BadRequest,
        );
      }

      // Validating permissionGroupIds
      if (data.permissionGroupIds && data.permissionGroupIds.length > 0) {
        const activePermissionGroups =
          await this.permissionGroupRepository.findActivePermissionGroupsByIds(
            data.permissionGroupIds,
          );

        const activePermissionGroupIds = activePermissionGroups.map(
          (group) => group.id,
        );
        const inactivePermissionGroupIds = data.permissionGroupIds.filter(
          (id) => !activePermissionGroupIds.includes(id),
        );

        if (inactivePermissionGroupIds.length > 0) {
          throw new CustomError(
            MESSAGES.INACTIVE_PERMISSION_GROUPS_OR_DO_NOT_EXISTS(
              inactivePermissionGroupIds,
            ),
            HttpStatusCode.BadRequest,
          );
        }
      }

      // Validating permissionIds
      if (data.permissionIds && data.permissionIds.length > 0) {
        const activePermissions =
          await this.permissionRepository.findActivePermissionsByIds(
            data.permissionIds,
          );
        const activePermissionIds = activePermissions.map(
          (permission) => permission.id,
        );
        const inactivePermissionIds = data.permissionIds.filter(
          (id) => !activePermissionIds.includes(id),
        );

        if (inactivePermissionIds.length > 0) {
          throw new CustomError(
            PERMISSION_MESSAGES.INACTIVE_PERMISSION_OR_DO_NOT_EXISTS(
              inactivePermissionIds,
            ),
            HttpStatusCode.BadRequest,
          );
        }
      }

      // Validating clientIds
      if (data.clientIds && data.clientIds.length > 0) {
        const activeClients =
          await this.clientRepository.findActiveClientsByIds(data.clientIds);
        const activeClientIds = activeClients.map((client) => client.id);
        const inactiveClientIds = data.clientIds.filter(
          (id) => !activeClientIds.includes(id),
        );

        if (inactiveClientIds.length > 0) {
          throw new CustomError(
            MESSAGES.INACTIVE_CLIENTS_OR_DO_NOT_EXISTS(inactiveClientIds),
            HttpStatusCode.BadRequest,
          );
        }
      }
      if (
        isExternal === true &&
        roleCriteriaDatas?.length &&
        roleCategoryIds?.length
      ) {
        const filterRolCriteria = roleCriteriaDatas.filter(
          (value, index, self) =>
            index ===
            self.findIndex((t) => t.roleCriteriaId === value.roleCriteriaId),
        );

        if (filterRolCriteria.length !== roleCriteriaDatas.length) {
          throw new CustomError(
            MESSAGES.ROLE_CRITERIA_IDS_ARE_REPEATED,
            HttpStatusCode.BadRequest,
          );
        }
        const roleCriterias: RoleCriteriaDto[] =
          await this.roleRepository.getRoleCriteriasList();
        const CRITERIA_COUNT: number = Object.keys(roleCriterias).length;
        // validate criteria response
        const invalidEntries: RoleCriteriaAlignmentDTO[] =
          roleCriteriaDatas.filter(
            (entry) =>
              entry.roleCriteriaResponse.toLowerCase() !== 'yes' &&
              entry.roleCriteriaResponse.toLowerCase() !== 'no',
          );

        if (roleCriteriaDatas.length !== CRITERIA_COUNT) {
          throw new Error(
            MESSAGES.ROLE_CATEGORY_CRITERIA_VALIDATION_MESSAGE(CRITERIA_COUNT),
          );
        }

        if (invalidEntries.length > 0) {
          throw new Error(
            MESSAGES.ROLE_CATEGORY_CRITERIA_VALIDATION_MESSAGE(CRITERIA_COUNT),
          );
        }
        // validate the criteria ids
        const roleCriteriaIds =
          roleCriteriaDatas.map((rcData) => rcData.roleCriteriaId) || [];
        const getValidCriteriaDatas =
          await this.roleRepository.getValidRoleCriteriasList(roleCriteriaIds);
        const getValidCriteriaIds: number[] = getValidCriteriaDatas.map(
          (category) => category.id,
        );
        const invalidCriteriaIds: number[] = roleCriteriaIds.filter(
          (id) => !getValidCriteriaIds.includes(id),
        );

        if (invalidCriteriaIds.length > 0) {
          throw new Error(MESSAGES.INVALID_CRITERIA_IDS(invalidCriteriaIds));
        }

        // validate the category ids
        const getValidCategoryDatas =
          await this.roleRepository.getValidRoleCategoriesList(roleCategoryIds);
        const getValidCategoryIds: number[] = getValidCategoryDatas.map(
          (category) => category.id,
        );
        const invalidCategoryIds: number[] = roleCategoryIds.filter(
          (id) => !getValidCategoryIds.includes(id),
        );

        if (invalidCategoryIds.length > 0) {
          throw new Error(MESSAGES.INVALID_CATEGORY_IDS(invalidCategoryIds));
        }
      } else if (
        isExternal === false &&
        roleCriteriaDatas?.length &&
        roleCategoryIds?.length
      ) {
        throw new Error(
          MESSAGES.ROLE_CATEGORY_AND_CRITERIA_CREATION_FOR_EXTERNAL_ROLES_ONLY,
        );
      }
      const role: Record<string, any> =
        await this.roleRepository.createRole(createRoleData);
      await this.historyService.trackFieldChanges('role', 0, role, createdBy);

      return {
        role: { id: role.id },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getRoleList(data: RoleListDataToDbDto) {
    try {
      return await this.roleRepository.getRoleList(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getRoleShortList(data: RoleShortListDataToDbDto) {
    return this.roleRepository.getRoleShortList(data);
  }

  async getRoleById(roleId: number) {
    try {
      const roleData: ViewRoleResponseDto =
        await this.roleRepository.findRoleById(roleId, 'view');
      const formattedData: FormatPermissionDto[] =
        roleData.rolePermissionGroup.map((rData) => {
          return { ...rData.permissionGroup };
        });
      const formatePermission: FormatPermissionDto[] =
        roleData.rolePermission.map((pData) => {
          return { ...pData.permission };
        });
      const { rolePermissionGroup, rolePermission, ...restData } = roleData;
      return {
        role: {
          ...restData,
          permissionGroups: formattedData,
          Permission: formatePermission,
        },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async editRole(roleId: number, data: EditRoleDto) {
    try {
      const { name, isExternal, roleCriteriaDatas, roleCategoryIds } = data;

      // Validating the role id
      const getRoleData: RoleDataResponseDto =
        await this.roleRepository.findRoleById(roleId, 'edit');
      if (!getRoleData) {
        throw new NotFoundError(MESSAGES.ROLE_NOT_FOUND(roleId));
      }

      const existingClient: ExistingClientDto | null =
        await this.roleRepository.findRoleByNameAndId(name, roleId);

      // If the name already exists not in same roleId, return an error message
      if (existingClient) {
        throw new Error(MESSAGES.ROLE_NAME_ALREADY_EXISTS(data.name));
      }
      // Validating permissionIds
      if (data.permissionIds && data.permissionIds.length > 0) {
        const existingPermissionIds: { id: number }[] =
          await this.permissionRepository.findValidPermissionIds(
            data.permissionIds,
          );
        const validIds: number[] = existingPermissionIds.map(
          (client) => client.id,
        );
        const invalidIds: number[] = data.permissionIds.filter(
          (id) => !validIds.includes(id),
        );

        if (invalidIds.length > 0) {
          throw new Error(
            PERMISSION_MESSAGES.INVALID_PERMISSION_IDS(invalidIds),
          );
        }
      }

      if (data.clientIds && data.clientIds.length > 0) {
        const validClientIds: ClientIdDto[] =
          await this.clientRepository.getExistingClientIds(data.clientIds);

        const validIds: number[] = validClientIds.map((client) => client.id);
        const invalidIds: number[] = data.clientIds.filter(
          (id) => !validIds.includes(id),
        );

        if (invalidIds.length > 0) {
          throw new Error(MESSAGES.INVALID_CLIENTS_IDS(invalidIds));
        }
      }

      const endDateDefault: Date = this.getDefaultEndDate();
      if (
        isExternal === true &&
        roleCriteriaDatas?.length &&
        roleCategoryIds?.length
      ) {
        const roleCriterias: RoleCriteriaDto[] =
          await this.roleRepository.getRoleCriteriasList();
        const CRITERIA_COUNT: number = Object.keys(roleCriterias).length;
        // validate criteria response
        const invalidEntries: RoleCriteriaAlignmentDTO[] =
          roleCriteriaDatas.filter(
            (entry) =>
              entry.roleCriteriaResponse.toLowerCase() !== 'yes' &&
              entry.roleCriteriaResponse.toLowerCase() !== 'no',
          );

        if (roleCriteriaDatas.length !== CRITERIA_COUNT) {
          throw new Error(
            MESSAGES.ROLE_CATEGORY_CRITERIA_VALIDATION_MESSAGE(CRITERIA_COUNT),
          );
        }

        if (invalidEntries.length > 0) {
          throw new Error(
            MESSAGES.ROLE_CATEGORY_CRITERIA_VALIDATION_MESSAGE(CRITERIA_COUNT),
          );
        }
        // validate the criteria ids
        const roleCriteriaIds =
          roleCriteriaDatas.map((rcData) => rcData.roleCriteriaId) || [];
        const getValidCriteriaDatas =
          await this.roleRepository.getValidRoleCriteriasList(roleCriteriaIds);
        const getValidCriteriaIds: number[] = getValidCriteriaDatas.map(
          (category) => category.id,
        );
        const invalidCriteriaIds: number[] = roleCriteriaIds.filter(
          (id) => !getValidCriteriaIds.includes(id),
        );

        if (invalidCriteriaIds.length > 0) {
          throw new Error(MESSAGES.INVALID_CRITERIA_IDS(invalidCriteriaIds));
        }

        // validate the category ids
        const getValidCategoryDatas =
          await this.roleRepository.getValidRoleCategoriesList(roleCategoryIds);
        const getValidCategoryIds: number[] = getValidCategoryDatas.map(
          (category) => category.id,
        );
        const invalidCategoryIds: number[] = roleCategoryIds.filter(
          (id) => !getValidCategoryIds.includes(id),
        );

        if (invalidCategoryIds.length > 0) {
          throw new Error(MESSAGES.INVALID_CATEGORY_IDS(invalidCategoryIds));
        }
      }

      // Updating role data
      const updatedData: EditRoleDto = {
        ...data,
        endDate:
          data?.endDate ??
          getRoleData.endDate?.toISOString() ??
          endDateDefault.toISOString(),
      };
      await this.historyService.trackFieldChanges(
        'role',
        roleId,
        data,
        data.updatedBy,
        getRoleData?.name || '',
      );
      const roleData: EditRoleResponseDto = await this.roleRepository.editRole(
        roleId,
        updatedData,
      );

      return {
        role: { id: roleData.role.id },
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async deleteRoles(rolesIds: number[]): Promise<void> {
    try {
      const existingRoles: Role[] =
        await this.roleRepository.getExistingRoleIds(rolesIds);
      const existingIds: number[] = existingRoles.map((perm) => perm.id);
      const missingIds: number[] = rolesIds.filter(
        (id) => !existingIds.includes(id),
      );
      if (missingIds.length > 0) {
        throw new NotFoundError(`role Ids not found: ${missingIds.join(', ')}`);
      }
      await this.roleRepository.deleteRoles(rolesIds);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getRolePermissionGroupList(data: RolePermissionGroupListDataToDbDto) {
    const [startOfTodayDate, endOfTodayDate] =
      this.dateService.getTodaysStartAndEndDates();

    const permissionGroups: PermissionGroupDto[] =
      await this.roleRepository.getRolePermissionGroupList({
        ...data,
        startOfTodayDate,
        endOfTodayDate,
      });
    let updatedPermissionGroups: ShortPermissionGroupsDto =
      permissionGroups.map((permissionGroup) => {
        if (
          !permissionGroup ||
          !(permissionGroup?.startDate && permissionGroup?.endDate)
        ) {
          return permissionGroup;
        }
        const today: Date = new Date();
        const isActive: boolean =
          today >= new Date(permissionGroup.startDate) &&
          today <= new Date(permissionGroup.endDate);
        return {
          ...permissionGroup,
          isActive,
        };
      });

    updatedPermissionGroups = updatedPermissionGroups.filter(
      (item) => item.isActive === true,
    );
    return {
      permissionGroups: updatedPermissionGroups,
      totalAmount: updatedPermissionGroups.length,
    };
  }

  async getRolePermissionGroupListUnaligned(
    data: RolePermissionGroupListDataToDbDto,
  ) {
    const [startOfTodayDate, endOfTodayDate] =
      this.dateService.getTodaysStartAndEndDates();

    const permissionGroups: PermissionGroupDto[] =
      await this.roleRepository.getRolePermissionGroupListUnaligned({
        ...data,
        startOfTodayDate,
        endOfTodayDate,
      });
    let updatedPermissionGroups: ShortPermissionGroupsDto =
      permissionGroups.map((permissionGroup) => {
        if (
          !permissionGroup ||
          !(permissionGroup?.startDate && permissionGroup?.endDate)
        ) {
          return permissionGroup;
        }
        const today: Date = new Date();
        const isActive: boolean =
          today >= new Date(permissionGroup.startDate) &&
          today <= new Date(permissionGroup.endDate);
        return {
          ...permissionGroup,
          isActive,
        };
      });

    updatedPermissionGroups = updatedPermissionGroups.filter(
      (item) => item.isActive === true,
    );
    return {
      permissionGroups: updatedPermissionGroups,
      totalAmount: updatedPermissionGroups.length,
    };
  }

  async archiveRole(data: RoleArchiveDto) {
    const checkRoles: number[] = await this.roleRepository.checkRoles(data);
    if (checkRoles.length !== 0)
      return { message: MESSAGES.ROLE_CHECK(checkRoles) };
    const checkRolesIsdeactivated: number[] =
      await this.roleRepository.checkRolesIsdeactivated(data);
    if (checkRolesIsdeactivated.length !== 0)
      return {
        message: MESSAGES.ROLE_ACTIVE_DEACTIVE(checkRolesIsdeactivated),
      };
    await this.roleRepository.archiveRole(data);
    if(data.unArchive == false){
    return { message: MESSAGES.ROLE_ARCHIVED_SUCCESSFULLY };
    }else{
      return { message: MESSAGES.ROLE_UNARCHIVED_SUCCESSFULLY };
    }
  }

  async getRolePermission(data: number) {
    const rolePermission: RolePermissionResponseDto =
      await this.roleRepository.getRolePermission(data);
    return rolePermission;
  }

  async getPermissionGroupRoles(permissionGroupId: number) {
    const permissionGroupRoles: PermissionRolesDto[] =
      await this.roleRepository.getPermissionGroupRoles(permissionGroupId);
    return { role: permissionGroupRoles };
  }

  async alignRolePermissionGroups(data: RolePermissionGroupIdsDto) {
    const { roleId, permissionGroupIds } = data;
    const role: RoleDto = await this.roleRepository.alignPermissionGroups(
      roleId,
      permissionGroupIds,
    );
    return role;
  }

  async getRoleAdditionalData(id: number) {
    try {
      const roleAdditionalData: RoleAdditionalDataResponseDto =
        await this.roleRepository.getRoleAdditionalData(id);
      return roleAdditionalData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  validateCreatRoleDates(
    createRoleStartDate: string | Date,
    createRoleEndDate: string | Date,
  ) {
    const today = new Date();
    if (!dateValidation(createRoleStartDate, createRoleEndDate)) {
      throw new ValidationError(
        MESSAGES.START_DATE_ERROR(createRoleStartDate, createRoleEndDate),
      );
    }

    if (!isEndDateAfterToday(createRoleEndDate)) {
      throw new ValidationError(
        MESSAGES.END_DATE_ERROR(today, createRoleEndDate),
      );
    }
  }

  async getRoleCategories() {
    const roleCategories: RoleCategoryDto[] =
      await this.roleRepository.getRoleCategoriesList();
    return roleCategories.map((category) => ({
      id: category.id,
      roleCategoryName: category.roleCategoryName,
    }));
  }

  async getRoleCriterias() {
    const roleCriterias: RoleCriteriaDto[] =
      await this.roleRepository.getRoleCriteriasList();
    return roleCriterias.map((criteria) => ({
      id: criteria.id,
      roleCriteriaName: criteria.roleCriteriaName,
    }));
  }

  async editRoleCategoryCriteriaAlignment(
    data: EditRoleCategoryCriteriaAlignment,
  ) {
    const { roleCategory, roleCriteria, roleId, updatedBy } = data;
    const roleCriterias = await this.roleRepository.getRoleCriteriasList();
    const CRITERIA_COUNT = Object.keys(roleCriterias).length;
    // validate criteria response
    const invalidEntries: EditRoleCriteriaAlignmentDTO[] = roleCriteria.filter(
      (entry) =>
        entry.roleCriteriaResponse.toLowerCase() !== 'yes' &&
        entry.roleCriteriaResponse.toLowerCase() !== 'no',
    );
    if (roleCriteria.length !== CRITERIA_COUNT) {
      throw new Error(
        MESSAGES.ROLE_CATEGORY_CRITERIA_VALIDATION_MESSAGE(CRITERIA_COUNT),
      );
    }

    if (invalidEntries.length > 0) {
      throw new Error(
        MESSAGES.ROLE_CATEGORY_CRITERIA_VALIDATION_MESSAGE(CRITERIA_COUNT),
      );
    }
    const roleCategories: Prisma.BatchPayload =
      await this.roleRepository.updateRoleCategoryAlignment(
        roleId,
        roleCategory,
        updatedBy,
      );
    const roleCriteriaEntries: Prisma.BatchPayload =
      await this.roleRepository.updateRoleCriteriaAlignment(
        roleId,
        roleCriteria,
        updatedBy,
      );
    return { roleCategories, roleCriteriaEntries };
  }
}
