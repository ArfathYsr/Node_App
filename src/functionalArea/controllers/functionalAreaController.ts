import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import { COMMON } from '../../utils/common';
import { MESSAGES } from '../../utils/message';
import TYPES from '../../dependencyManager/types';
import FunctionalAreaService from '../services/functionalAreaService';
import { CustomRequest } from '../../types/express';
import {
  CreateFunctionalAreaDto,
  CreateFunctionalAreaResponseDto,
  GetFunctionalAreaResponseDto,
  FunctionalAreaListDataToDbDto,
  FunctionalAreaListDataResponseDto,
  EditFunctionalAreaDto,
  FunctionalAreaRoleListDataToDbDto,
  FunctionalAreaRoleListDataResponseDto,
  FunctionalAreaArchiveDto,
  FunctionalAreaArchiveResponseDto,
  ViewShortFunctionalAreasDto,
  ViewShortFunctionalAreasResponseDto,
} from '../dto/functionalArea.dto';

@injectable()
export default class FunctionalAreaController {
  constructor(
    @inject(TYPES.FunctionalAreaService)
    private readonly functionalAreaService: FunctionalAreaService,
  ) {}

  async createFunctionalArea(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const createdBy = req.docUser!.profileId;
    const updatedBy = req.docUser!.profileId;
    try {
      const data: CreateFunctionalAreaDto = req.body;
      const functionalArea: CreateFunctionalAreaResponseDto =
        await this.functionalAreaService.createFunctionalArea({
          ...data,
          createdBy,
          updatedBy,
        });

      // Set the appropriate response message
      const responseMessage =
        data?.cloneId && data?.type === COMMON.CLONE
          ? MESSAGES.FUNCTIONAL_AREA_CLONED_SUCCESSFULLY
          : MESSAGES.FUNCTIONAL_AREA_CREATED_SUCCESSFULLY;

      res.status(HttpStatusCode.Created).json({
        message: responseMessage,
        functionalArea,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFunctionalArea(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const functionalArea: GetFunctionalAreaResponseDto =
        await this.functionalAreaService.getFunctionalArea(parseInt(id, 10));
      res.status(HttpStatusCode.Ok).json({ functionalArea });
    } catch (error) {
      next(error);
    }
  }

  async getFunctionalAreaList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: FunctionalAreaListDataToDbDto = req.body;
      const functionalAreaList: FunctionalAreaListDataResponseDto =
        await this.functionalAreaService.getFunctionalAreaList(data);

      res.json({ functionalAreaList });
    } catch (error) {
      next(error);
    }
  }

  async editFunctionalArea(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: EditFunctionalAreaDto = req.body;
      const updatedBy = req.docUser!.profileId;
      const functionalArea: CreateFunctionalAreaResponseDto =
        await this.functionalAreaService.editFunctionalArea(
          parseInt(req.params.id, 10),
          { ...data, updatedBy },
        );
      res
        .status(HttpStatusCode.Ok)
        .json({ message: MESSAGES.UPDATED_SUCCESSFULLY, functionalArea });
    } catch (error) {
      next(error);
    }
  }

  async deleteFunctionalAreas(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { ids } = req.query;
      if (!ids) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ message: MESSAGES.FUNCTIONAL_AREA_ID_REQUIRED });
      }
      const functionalAreaIds =
        typeof ids === 'string'
          ? ids.split(',').map(Number) // if ids is a comma-separated string
          : [];

      if (
        functionalAreaIds.length === 0 ||
        functionalAreaIds.some((id) => Number.isNaN(id))
      ) {
        return res
          .status(HttpStatusCode.BadRequest)
          .json({ message: MESSAGES.INVALID_ID_FORMAT });
      }

      await this.functionalAreaService.deleteFunctionalAreas(functionalAreaIds);
      return res
        .status(HttpStatusCode.Ok)
        .json({ message: MESSAGES.FUNCTIONAL_AREA_DELETED_SUCCESSFULLY });
    } catch (error) {
      next(error);
    }
  }

  async getFunctionalAreaRoleList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: FunctionalAreaRoleListDataToDbDto = req.body;
      const roles: FunctionalAreaRoleListDataResponseDto =
        await this.functionalAreaService.getFunctionalAreaRoleList(data);

      res.json({ roles });
    } catch (error) {
      next(error);
    }
  }

  async archiveFunctionalArea(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: FunctionalAreaArchiveDto = req.body;
      const archiveResponse: FunctionalAreaArchiveResponseDto =
        await this.functionalAreaService.archiveFunctionalArea(data);
      res.json(archiveResponse.message);
    } catch (error) {
      next(error);
    }
  }

  async getShortFunctionalAreas(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ViewShortFunctionalAreasDto = req.body;
      const functionalAreas: ViewShortFunctionalAreasResponseDto =
        await this.functionalAreaService.getShortFunctionalAreas(data);
      res.status(HttpStatusCode.Ok).json(functionalAreas);
    } catch (error) {
      next(error);
    }
  }
}
