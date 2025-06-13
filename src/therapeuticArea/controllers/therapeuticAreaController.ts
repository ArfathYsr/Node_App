import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import { CustomRequest } from '../../types/express';
import {
  CreateTherapeuticAreaDto,
  CreateTherapeuticAreaResponseDto,
  EditTherapeuticAreaDto,
  EditTherapeuticAreaResponseDto,
  ViewTherapeuticAreaByIdDataResponseDto,
} from '../dto/therapeuticArea.dto';
import TherapeuticAreaService from '../services/therapeuticAreaService';
import TYPES from '../../dependencyManager/types';

@injectable()
export default class TherapeuticAreaController {
  constructor(
    @inject(TYPES.TherapeuticAreaService)
    private readonly therapeuticAreaService: TherapeuticAreaService,
  ) {}

  async createTherapeuticArea(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const createdBy = req.docUser!.profileId;
    const updatedBy = req.docUser!.profileId;
    try {
      const data: CreateTherapeuticAreaDto = req.body;
      const therapeuticArea: CreateTherapeuticAreaResponseDto =
        await this.therapeuticAreaService.createTherapeuticArea({
          ...data,
          createdBy,
          updatedBy,
        });
      res.status(200).json({ therapeuticArea });
    } catch (error) {
      next(error);
    }
  }

  async listTheraputicArea(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const TheraputicArea =
        await this.therapeuticAreaService.listTherapeuticArea();
      res.json({ TheraputicArea });
    } catch (error) {
      next(error);
    }
  }

  async getTherapeuticArea(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const TherapeuticArea: ViewTherapeuticAreaByIdDataResponseDto =
        await this.therapeuticAreaService.gettherapeuticAreaById(
          parseInt(req.params.id, 10),
        );
      res.json(TherapeuticArea);
    } catch (error) {
      next(error);
    }
  }

  async editTherapeuticArea(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const updatedBy = req.docUser!.profileId;
    try {
      const data: EditTherapeuticAreaDto = req.body;
      const therapeuticArea: EditTherapeuticAreaResponseDto =
        await this.therapeuticAreaService.editTherapeuticArea(
          parseInt(req.params.id, 10),
          { ...data, updatedBy },
        );
      res.status(HttpStatusCode.Ok).json(therapeuticArea);
    } catch (error) {
      next(error);
    }
  }

  async deleteTherapeuticArea(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { ids } = req.query;
      if (!ids) {
        return res
          .status(400)
          .json({ message: 'therapeuticArea Ids are required' });
      }
      const therapeuticAreaIds =
        typeof ids === 'string' ? ids.split(',').map(Number) : [];

      if (
        therapeuticAreaIds.length === 0 ||
        therapeuticAreaIds.some((id) => Number.isNaN(id))
      ) {
        return res.status(400).json({ message: 'Invalid ids format' });
      }

      await this.therapeuticAreaService.deleteTherapeuticArea(
        therapeuticAreaIds,
      );
      return res
        .status(200)
        .json({ message: 'therapeuticArea deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
