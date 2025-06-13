import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import { MESSAGES } from '../../utils/message';
import TYPES from '../../dependencyManager/types';
import PermissionGroupService from '../services/permissionGroupService';
import { CustomRequest } from '../../types/express';
import {
  CreatePermissionGroupDto,
  CreatePermissionGroupResponseDto,
  UpdatePermissionGroupDto,
  UpdatePermissionGroupResponseDto,
  ViewPermissionGroupResponseDto,
  ViewPermissionGroupListDto,
  ViewPermissionGroupListResponseDto,
  ViewShortPermissionGroupsDto,
  ViewShortPermissionGroupsResponseDto,
  ArchivePermissionGroupRequestDto,
  ArchivePermissionGroupResponseDto,
} from '../dto/permissionGroup.dto';
import { COMMON } from '../../utils/common';

@injectable()
export default class PermissionGroupController {
  constructor(
    @inject(TYPES.PermissionGroupService)
    private readonly permissionGroupService: PermissionGroupService,
  ) {}

  async createPermissionGroup(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const createdBy: number = req.docUser?.profileId ?? 0;
    const updatedBy: number = req.docUser?.profileId ?? 0;
    try {
      const data: CreatePermissionGroupDto = req.body;
      const permissionGroup: CreatePermissionGroupResponseDto =
        await this.permissionGroupService.createPermissionGroup({
          ...data,
          createdBy,
          updatedBy,
        });

      const responseMessage: string =
        data?.cloneId && data?.type === COMMON.CLONE
          ? MESSAGES.PERMISSION_GROUP_CLONED_SUCCESSFULLY
          : MESSAGES.PERMISSION_GROUP_CREATED_SUCCESSFULLY;

      res.status(HttpStatusCode.Created).json({
        message: responseMessage,
        permissionGroup,
      });
    } catch (error) {
      next(error);
    }
  }

  async updatePermissionGroup(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const updatedBy: number = req.docUser?.profileId ?? 0;
    try {
      const data: UpdatePermissionGroupDto = req.body;
      const updatedPermissionGroup: UpdatePermissionGroupResponseDto =
        await this.permissionGroupService.updatePermissionGroup(
          parseInt(req.params.id, 10),
          { ...data, updatedBy },
        );
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.PERMISSION_GROUP_UPDATED_SUCCESSFULLY,
        updatedPermissionGroup,
      });
    } catch (error) {
      next(error);
    }
  }

  async viewPermissionGroup(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const permissionGroup: ViewPermissionGroupResponseDto =
        await this.permissionGroupService.viewPermissionGroup(
          parseInt(req.params.id, 10),
        );
      res.json({
        message: MESSAGES.PERMISSION_GROUP_DETAILS_FETCHED_SUCCESSFULLY,
        data: permissionGroup,
      });
    } catch (error) {
      next(error);
    }
  }

  async viewPermissionGroupList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ViewPermissionGroupListDto = req.body;
      const permissionGroupList: ViewPermissionGroupListResponseDto =
        await this.permissionGroupService.viewPermissionGroupList(data);
      res.json(permissionGroupList);
    } catch (error) {
      next(error);
    }
  }

  async getShortPermissionGroups(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ViewShortPermissionGroupsDto = req.body;
      const permissionGroups: ViewShortPermissionGroupsResponseDto =
        await this.permissionGroupService.getShortPermissionGroups(data);
      res.json(permissionGroups);
    } catch (error) {
      next(error);
    }
  }

  async deletePermissionGroups(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { ids } = req.query;
      if (!ids) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ message: MESSAGES.PERMISSION_GROUP_ID_REQUIRED });
      }
      const permissionGroupsIds =
        typeof ids === 'string' ? ids.split(',').map(Number) : [];

      if (
        permissionGroupsIds.length === 0 ||
        permissionGroupsIds.some((id) => Number.isNaN(id))
      ) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ message: MESSAGES.INVALID_ID_FORMAT });
      }

      await this.permissionGroupService.deletePermissionGroups(
        permissionGroupsIds,
      );
      return res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.DELETED_SUCCESSFULLY_DYNAMIC(COMMON.PERMISSION_GROUP),
      });
    } catch (error) {
      next(error);
    }
  }

  async archivePermissionGroup(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ArchivePermissionGroupRequestDto = req.body;
      const archiveResponse: ArchivePermissionGroupResponseDto =
        await this.permissionGroupService.archivePermissionGroup(data);
      res
        .status(archiveResponse.status)
        .json({ message: archiveResponse.message });
    } catch (error) {
      next(error);
    }
  }
}
