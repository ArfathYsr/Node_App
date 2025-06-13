import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import { COMMON } from '../../utils/common';
import { MESSAGES } from '../../utils/message';
import { CustomRequest } from '../../types/express';
import {
  CreateRoleDto,
  CreateRoleResponseDto,
  RoleListDataResponseDto,
  RoleListDataToDbDto,
  ViewRoleByIdDataResponseDto,
  EditRoleDto,
  EditRoleResponseDto,
  RolePermissionGroupListDataToDbDto,
  RolePermissionGroupListDataResponseDto,
  RoleArchiveDto,
  RoleArchiveResponseDto,
  RoleShortListDataResponseDto,
  RoleShortListDataToDbDto,
  RolePermissionResponseDto,
  PermissionGroupRolesResponseDto,
  RolePermissionGroupIdsDto,
  RoleAdditionalDataResponseDto,
  RoleCategoryDto,
  RoleCriteriaDto,
} from '../dto/role.dto';
import TYPES from '../../dependencyManager/types';
import RoleService from '../services/roleService';

@injectable()
export default class RoleController {
  constructor(
    @inject(TYPES.RoleService) private readonly roleService: RoleService,
  ) {}

  async createRole(req: CustomRequest, res: Response, next: NextFunction) {
    const createdBy: number = req.docUser!.profileId;
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: CreateRoleDto = req.body;
      const role: CreateRoleResponseDto = await this.roleService.createRole({
        ...data,
        createdBy,
        updatedBy,
      });

      const responseMessage: string =
        data?.cloneId && data?.type === COMMON.CLONE
          ? MESSAGES.ROLE_CLONED_SUCCESSFULLY
          : MESSAGES.ROLE_CREATED_SUCCESSFULLY;

      res
        .status(HttpStatusCode.Created)
        .json({ message: responseMessage, role });
    } catch (error) {
      next(error);
    }
  }

  async getRoleList(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: RoleListDataToDbDto = req.body;
      if (!data) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ message: MESSAGES.INVALID_QUERY_PARAMETERS });
      }
      const roleList: RoleListDataResponseDto =
        await this.roleService.getRoleList(data);

      if (roleList.message) {
        return res
          .status(HttpStatusCode.Ok)
          .json({ message: MESSAGES.NO_ROLE_FOUND_FOR_DATE_RANGE });
      }
      if (roleList.totalAmount === 0) {
        return res
          .status(HttpStatusCode.Ok)
          .json({ message: MESSAGES.NO_ROLE_TO_LIST, roleList });
      }
      res
        .status(HttpStatusCode.Ok)
        .json({ message: MESSAGES.ROLE_LIST_RETRIVED_SUCCESSFULLY, roleList });
    } catch (error) {
      next(error);
    }
  }

  async getRoleShortList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: RoleShortListDataToDbDto = req.body;
      const roleList: RoleShortListDataResponseDto =
        await this.roleService.getRoleShortList(data);
      res.status(HttpStatusCode.Ok).json({ roleList });
    } catch (error) {
      next(error);
    }
  }

  async getRole(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const role: ViewRoleByIdDataResponseDto =
        await this.roleService.getRoleById(parseInt(req.params.id, 10));
      res.json(role);
    } catch (error) {
      next(error);
    }
  }

  async editRole(req: CustomRequest, res: Response, next: NextFunction) {
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: EditRoleDto = req.body;
      const role: EditRoleResponseDto = await this.roleService.editRole(
        parseInt(req.params.id, 10),
        { ...data, updatedBy },
      );
      res
        .status(HttpStatusCode.Ok)
        .json({ message: MESSAGES.ROLE_UPDATED_SUCCESSFULLY, role });
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { ids } = req.query;
      if (!ids) {
        return res.status(400).json({ message: 'Role Ids are required' });
      }
      const roleIds: number[] =
        typeof ids === 'string'
          ? ids.split(',').map(Number) // if ids is a comma-separated string
          : [];

      if (roleIds.length === 0 || roleIds.some((id) => Number.isNaN(id))) {
        return res.status(400).json({ message: 'Invalid ids format' });
      }

      await this.roleService.deleteRoles(roleIds);
      return res.status(200).json({ message: 'Roles deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async getRolePermissionGroupList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: RolePermissionGroupListDataToDbDto = req.body;
      const permissionGroupList: RolePermissionGroupListDataResponseDto =
        await this.roleService.getRolePermissionGroupList(data);
      res.json(permissionGroupList);
    } catch (error) {
      next(error);
    }
  }

  async getRolePermissionGroupListUnaligned(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: RolePermissionGroupListDataToDbDto = req.body;
      const permissionGroupList: RolePermissionGroupListDataResponseDto =
        await this.roleService.getRolePermissionGroupListUnaligned(data);
      res.json(permissionGroupList);
    } catch (error) {
      next(error);
    }
  }

  async archiveRole(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: RoleArchiveDto = req.body;
      const archiveResponse: RoleArchiveResponseDto =
        await this.roleService.archiveRole(data);
      res.status(HttpStatusCode.Ok).json({ message: archiveResponse.message });
    } catch (error) {
      next(error);
    }
  }

  async getRolePermission(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const RolePermission: RolePermissionResponseDto =
        await this.roleService.getRolePermission(Number(req.params.id));
      res.json(RolePermission);
    } catch (error) {
      next(error);
    }
  }

  async getPermissionGroupRoles(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json({ message: 'PermissionGroupId is required' });
      }

      if (Number.isNaN(id)) {
        return res.status(400).json({ message: 'Invalid id format' });
      }

      const permissionGroupRoles: PermissionGroupRolesResponseDto =
        await this.roleService.getPermissionGroupRoles(Number(id));
      res.json(permissionGroupRoles);
    } catch (error) {
      next(error);
    }
  }

  async alignRolePermissionGroup(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: RolePermissionGroupIdsDto = req.body;
      const role: EditRoleResponseDto =
        await this.roleService.alignRolePermissionGroups(data);
      res.status(HttpStatusCode.Ok).json(role);
    } catch (error) {
      next(error);
    }
  }

  async getRoleAdditionalData(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const roleAdditionalData: RoleAdditionalDataResponseDto =
        await this.roleService.getRoleAdditionalData(Number(req.params.id));
      res.status(HttpStatusCode.Ok).json(roleAdditionalData);
    } catch (error) {
      next(error);
    }
  }

  async getRoleCategories(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const roleCategories: RoleCategoryDto[] =
        await this.roleService.getRoleCategories();
      const roleCriterias: RoleCriteriaDto[] =
        await this.roleService.getRoleCriterias();
      const combinedResponse = { roleCategories, roleCriterias };
      res.status(HttpStatusCode.Ok).json({ combinedResponse });
    } catch (error) {
      next(error);
    }
  }

  async editRoleCategoryCriteriaAlignment(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { body }: { body: any } = req;
      const { roleId } = body;
      const updatedBy: number = req.docUser!.profileId;
      const data = { ...body, updatedBy, roleId };
      const roleDetail: ViewRoleByIdDataResponseDto =
        await this.roleService.getRoleById(roleId);
      if (!roleDetail?.role?.isExternal === false) {
        return res.status(HttpStatusCode.NotFound).json({
          message: MESSAGES.ROLE_CATEGORY_IS_EXTERNAL_NOT_SELECTED,
        });
      }
      const result =
        await this.roleService.editRoleCategoryCriteriaAlignment(data);
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.ROLE_CATEGORY_CRITERIA_UPDATED_SUCCESSFULLY,
        result,
      });
    } catch (error) {
      next(error);
    }
  }
}
