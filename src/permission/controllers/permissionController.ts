import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import { COMMON } from '../../utils/common';
import { MESSAGES } from '../../utils/message';
import { PERMISSION_MESSAGES } from '../../utils/Messages/permissionMessage';
import TYPES from '../../dependencyManager/types';
import { CustomRequest } from '../../types/express';
import {
  AddPermissionBodyData,
  ViewPermissionResponse,
  EditPermissionDto,
  PermissionResponseDto,
  ListPermissionBodyDto,
  ListPermissionDto,
  ViewShortPermissionsDto,
  ViewShortPermissionsResponseDto,
  ArchivePermissionRequestDto,
  ArchivePermissionResponseDto,
  MenuDto,
} from '../dto/permission.dto';
import PermissionService from '../services/permissionService';

@injectable()
export default class PermissionController {
  constructor(
    @inject(TYPES.PermissionService)
    private readonly permissionService: PermissionService,
  ) {}

  async editPermission(req: CustomRequest, res: Response, next: NextFunction) {
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: EditPermissionDto = req.body;
      const permission: PermissionResponseDto =
        await this.permissionService.editPermission(
          parseInt(req.params.id, 10),
          { ...data, updatedBy },
        );
      res.status(HttpStatusCode.Ok).json({
        message: PERMISSION_MESSAGES.PERMISSION_UPDATED_SUCCESSFULLY,
        permission,
      });
    } catch (error) {
      next(error);
    }
  }

  async viewPermission(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const permission: ViewPermissionResponse =
        await this.permissionService.viewPermission(parseInt(id, 10));
      res.status(HttpStatusCode.Ok).json({ permission });
    } catch (error) {
      next(error);
    }
  }

  async listPermissions(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: ListPermissionBodyDto = req.body;
      const {
        permissions,
        totalAmount,
      }: { permissions: ListPermissionDto; totalAmount: number } =
        await this.permissionService.listPermissions(data);
      res.status(HttpStatusCode.Ok).json({ permissions, totalAmount });
    } catch (error) {
      next(error);
    }
  }

  async listMenu(_req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const menu: MenuDto[] = await this.permissionService.listMenu();
      res.status(HttpStatusCode.Ok).json({ menu });
    } catch (error) {
      next(error);
    }
  }

  async createPermission(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const createdBy: number = req.docUser!.profileId;
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: AddPermissionBodyData = req.body;
      const permission: PermissionResponseDto =
        await this.permissionService.createPermission({
          ...data,
          createdBy,
          updatedBy,
        });

      // Set the appropriate response message
      const responseMessage: string =
        data?.cloneId && data?.type === COMMON.CLONE
          ? PERMISSION_MESSAGES.PERMISSION_CLONED_SUCCESSFULLY
          : PERMISSION_MESSAGES.PERMISSION_CREATED_SUCCESSFULLY;

      res.status(HttpStatusCode.Created).json({
        message: responseMessage,
        permission,
      });
    } catch (error) {
      next(error);
    }
  }

  async deletePermissions(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { ids } = req.query;
      if (!ids) {
        res
          .status(HttpStatusCode.BadRequest)
          .json({ message: PERMISSION_MESSAGES.PERMISSION_ID_REQUIRED });
        return;
      }
      const permissionIds: number[] =
        typeof ids === 'string'
          ? ids.split(',').map(Number) // if ids is a comma-separated string
          : [];

      if (
        permissionIds.length === 0 ||
        permissionIds.some((id) => Number.isNaN(id))
      ) {
        res
          .status(HttpStatusCode.BadRequest)
          .json({ message: MESSAGES.INVALID_ID_FORMAT });
        return;
      }

      await this.permissionService.deletePermissions(permissionIds);
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.DELETED_SUCCESSFULLY_DYNAMIC(COMMON.PERMISSION),
      });
    } catch (error) {
      next(error);
    }
  }

  async getShortPermissions(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ViewShortPermissionsDto = req.body;
      const permissions: ViewShortPermissionsResponseDto =
        await this.permissionService.getShortPermissions(data);
      res.status(HttpStatusCode.Ok).json(permissions);
    } catch (error) {
      next(error);
    }
  }

  async archivePermission(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ArchivePermissionRequestDto = req.body;
      const archiveResponse: ArchivePermissionResponseDto =
        await this.permissionService.archivePermission(data);
      res
        .status(archiveResponse.status)
        .json({ message: archiveResponse.message });
    } catch (error) {
      next(error);
    }
  }
}
