import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import { SERVICE_OFFERING_MESSAGES } from '../../utils/Messages/serviceOfferingMessage';
import TYPES from '../../dependencyManager/types';
import { CustomRequest } from '../../types/express';
import {
  CreateServiceOfferingRequest,
  CreateServiceOfferingResponse,
  ListWorkItemResponse,
  ServiceTypeWorkItemRequest,
  ServiceTypeWorkItemResponse,
  ServiceOfferingDto,
  ServiceOfferingListRequestDto,
  EditServiceOfferingRequestDTO,
  BulkEditServiceOfferingRequestDTO,
  ArchiveOrUnarchiveServiceOfferingDto,
  ListWorkItemRequest,
  EditServiceOfferingDTO,
  ViewServiceOfferingResponseDto
} from '../dto/serviceOffering.dto';
import ServiceOfferingService from '../services/serviceOfferingService';
import { SERVICE_TYPES_MESSAGES } from '../../utils/Messages/serviceType';
import { StatusMessages } from '../../error/statusCode';
import { COMMON } from '../../utils/common';
import { MESSAGES } from '../../utils/message';

@injectable()
export default class serviceOfferingController {
  constructor(
    @inject(TYPES.SeviceOfferingService)
    private readonly ServiceOfferingService: ServiceOfferingService,
  ) {}

  async createServiceOffering(req: CustomRequest, res: Response, next: NextFunction) {
    const createdBy: number = req.docUser!.profileId;
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: CreateServiceOfferingRequest = req.body;
      const createServiceOfferingResponse:CreateServiceOfferingResponse = await this.ServiceOfferingService.createServiceOffering({
        ...data,
        createdBy,
        updatedBy,
      });
      const responseMessage: string =
        data?.cloneId && data?.type === COMMON.CLONE
          ? SERVICE_OFFERING_MESSAGES.SERVICE_OFFERING_CLONED
          : SERVICE_OFFERING_MESSAGES.SERVICE_OFFERING_CREATED;
      res
        .status(HttpStatusCode.Created)
        .json({ message: responseMessage,
          createServiceOfferingResponse
         });
   
    } catch (error) {
      next(error);
    }
  }

  async listWorkItem(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data: ListWorkItemRequest = req.body;
      const listWorkItemResponse: ListWorkItemResponse = await this.ServiceOfferingService.listWorkItem(data);  
      res.status(HttpStatusCode.Ok).json({ ...listWorkItemResponse });
       } catch (error) {
      next(error);
    }
  }

  async serviceTypeWorkItem(req: CustomRequest, res: Response, next: NextFunction) {
    const createdBy: number = req.docUser!.profileId;
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: ServiceTypeWorkItemRequest = req.body;
      const serviceTypeWorkItem: ServiceTypeWorkItemResponse= await this.ServiceOfferingService.serviceTypeWorkItem({
         ...data,
        createdBy,
        updatedBy
      });  
      res.status(HttpStatusCode.Ok).json({ ...serviceTypeWorkItem });
       } catch (error) {
      next(error);
    }
  }
  async editServiceOffering(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract `profileId` from the authenticated user
      const profileId: number = req.docUser?.profileId ?? (() => {
        throw new Error(StatusMessages.PROFILE_ID_MISSING);
      })();
  
      // Extract `serviceOfferingId` from request parameters
      const serviceOfferingId: number = parseInt(req.params.id, 10);
      if (isNaN(serviceOfferingId)) {
        throw new Error(StatusMessages.INVALID_SERVICEID_FORMAT);
      }
  
      // Extract request body data
      const payloadData: EditServiceOfferingDTO = req.body;
      const {
        name,
        description,
        isActive,
        serviceOfferingCodeId,
        serviceTypeData,
      } = payloadData;

      // Call the service layer
      await this.ServiceOfferingService.editServiceOffering(
        serviceOfferingId,
        {
          name,
          description,
          isActive,
          serviceOfferingCodeId,
        },
        serviceTypeData,
        profileId,
      );
  
      // Send success response
      res.status(HttpStatusCode.Ok).json({
        message: SERVICE_OFFERING_MESSAGES.SERVICE_OFFERING_UPDATED,
      });
    } catch (error) {
      next(error);
    }
  }

  async serviceOfferingList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const data: ServiceOfferingListRequestDto = req.body;
      const {
        serviceOfferingList,
        totalCount,
      }: {
        serviceOfferingList: ServiceOfferingDto[];
        totalCount: number;
      } = await this.ServiceOfferingService.serviceOfferingList(data);
  
      // Return the response object to ensure the function adheres to its promise signature
      return res.status(HttpStatusCode.Ok).json({
        serviceOfferingList,
        totalCount,
      });
    } catch (error) {
      // Call next(error) to pass the error to the error handler, but return undefined explicitly
      next(error);
      return undefined;
    }
  }


  /**
   * Handles bulk editing of service offerings.
   *
   * @param req - The HTTP request object containing the bulk edit payload.
   * @param res - The HTTP response object used to send the success message.
   * @param next - The next middleware function for error handling.
   */

  async bulkEditServiceOffering(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ){
    try {
      const updatedBy: number = req.docUser!.profileId;
      const data: BulkEditServiceOfferingRequestDTO = req.body;
      await this.ServiceOfferingService.bulkEditServiceOffering(
        data,
        updatedBy
      );
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.UPDATED_SUCCESSFULLY,
      });  
    } catch (error) {
      next(error);
    }
  }
      
  async archiveServiceOffering(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ArchiveOrUnarchiveServiceOfferingDto = req.body;
      const archiveResponse  =
        await this.ServiceOfferingService.archiveServiceOffering(data);
        res.status(HttpStatusCode.Ok).json({ message: archiveResponse.message });
    } catch (error) {
      next(error);
    }
  }
  

  async unarchiveServiceOffering(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: ArchiveOrUnarchiveServiceOfferingDto = req.body;
      const archiveResponse  =
        await this.ServiceOfferingService.unarchiveServiceOffering(data);
        res.status(HttpStatusCode.Ok).json({ message: archiveResponse.message });
    } catch (error) {
      next(error);
    }
  }  

  async viewServiceOffering(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ){
    try {
      const serviceOfferingId: number = parseInt(req.params.id, 10);
      const serviceOfferingResponse: ViewServiceOfferingResponseDto = 
      await this.ServiceOfferingService.viewServiceOffering(serviceOfferingId,
      );

      // Send success response
      res.status(HttpStatusCode.Ok).json({
        message: SERVICE_OFFERING_MESSAGES.SERVICE_OFFERING_DETAILS,
        data: serviceOfferingResponse
      });
    
    } catch (error) {
      next(error);
    }
  }

}
  
