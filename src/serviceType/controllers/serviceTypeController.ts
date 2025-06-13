import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import TYPES from '../../dependencyManager/types';
import { CustomRequest } from '../../types/express';

import ServiceTypeService from '../services/serviceTypeService';
import {
  AddServiceTypeInfoResponseDTO,
  AddServiceTypesRequestDTO,
  EditServiceTypeInfoResponseDTO,
  EditServiceTypesRequestDTO,
  ServiceResponseDto,
  ServiceTypeListRequestDto,
  ServiceTypeListShortResponse,
  ViewServiceTypeResponseDTO,
} from '../dto/serviceType.dto';
import { SERVICE_TYPES_MESSAGES } from '../../utils/Messages/serviceType';

@injectable()
export default class ServiceTypeController {
  constructor(
    @inject(TYPES.ServiceTypeService)
    private readonly serviceTypeService: ServiceTypeService,
  ) {}

  async serviceTypeList(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: ServiceTypeListRequestDto = req.body;
      const serviceTypeList: ServiceResponseDto =
        await this.serviceTypeService.serviceTypeList(data);
      res.status(HttpStatusCode.Ok).json({ ...serviceTypeList });
    } catch (error) {
      next(error);
    }
  }

  async addServiceTypes(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const profileId: number = req.docUser!.profileId;
      const data: AddServiceTypesRequestDTO = {
        ...req.body,
        createdBy: profileId,
        updatedBy: profileId,
      };
      const {
        serviceTypeInfo,
        serviceOfferingIds,
        workItemIds,
      }: AddServiceTypeInfoResponseDTO =
        await this.serviceTypeService.addServiceTypes(data);

      res.status(HttpStatusCode.Created).json({
        message: SERVICE_TYPES_MESSAGES.SERVICE_TYPES_CREATED,
        data: {
          serviceTypeInfo,
          serviceOfferingIds,
          workItemIds,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async serviceTypeListShort(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ServiceTypeListRequestDto = req.body;
      const serviceTypeListShort: ServiceTypeListShortResponse =
        await this.serviceTypeService.serviceTypeListShort(data);
      res.status(HttpStatusCode.Ok).json({ ...serviceTypeListShort });
    } catch (error) {
      next(error);
    }
  }

  async editServiceTypes(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const profileId: number = req.docUser!.profileId;
      const serviceTypeId: number = parseInt(req.params.id, 10);
      const data: EditServiceTypesRequestDTO = {
        ...req.body,
        serviceTypeId,
        updatedBy: profileId,
        createdBy: profileId,
      };
      const {
        serviceTypeInfo,
        serviceOfferingIds,
        workItemIds
      }: EditServiceTypeInfoResponseDTO =
        await this.serviceTypeService.editServiceTypes(data);

      res.status(HttpStatusCode.Created).json({
        message: SERVICE_TYPES_MESSAGES.SERVICE_TYPES_UPDATED,
        data: { serviceTypeInfo, serviceOfferingIds,workItemIds },
      });
    } catch (error) {
      next(error);
    }
  }

  async archiveServiceType(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const serviceTypeId: number = parseInt(req.params.id, 10);
      const response: {
        message: string;
      } = await this.serviceTypeService.archiveServiceType(serviceTypeId);
      res.status(HttpStatusCode.Ok).json({ message: response.message });
    } catch (error) {
      next(error);
    }
  }

  async viewServiceType(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const serviceTypeId: number = parseInt(req.params.id, 10);
      const serviceTypeInfo: ViewServiceTypeResponseDTO =
        await this.serviceTypeService.viewServiceType(serviceTypeId);
      res
        .status(HttpStatusCode.Ok)
        .json({
          message: SERVICE_TYPES_MESSAGES.SERVICE_TYPE_FETCH_SUCCESS,
          serviceTypeInfo,
        });
    } catch (error) {
      next(error);
    }
  }

  async unArchiveServiceType(req: CustomRequest,res: Response,next: NextFunction){
    try {
      const serviceTypeId: number = parseInt(req.params.id, 10);
      const response: {
        message: string;
      } = await this.serviceTypeService.unArchiveServiceType(serviceTypeId);
      res.status(HttpStatusCode.Ok).json({ message: response.message });
    } catch (error) {
      next(error)
    }
  }
}
