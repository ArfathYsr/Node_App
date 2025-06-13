import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import { Prisma } from '@prisma/client';
import TYPES from '../../dependencyManager/types';
import { CustomRequest } from '../../types/express';
import VendorVenueChecklistService from '../services/vendorVenueChecklistService';
import {
  AddVenueChecklistDto,
  CreateVenueChecklistDto,
  VendorVenueDetails,
} from '../dto/vendorVenueChecklist.dto';
import { MESSAGES } from '../../utils/message';

@injectable()
export default class VendorVenueChecklistController {
  constructor(
    @inject(TYPES.VendorVenueChecklistService)
    private readonly vendorVenueChecklistService: VendorVenueChecklistService,
  ) {}

  async createVenueCheckList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    const createdBy: number = req.docUser!.profileId;
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: AddVenueChecklistDto = req.body;
      const venueChecklist: {
        venuCheckList: CreateVenueChecklistDto;
        data: Prisma.BatchPayload;
      } = await this.vendorVenueChecklistService.addVenueCheckList({
        ...data,
        createdBy,
        updatedBy,
      });

      res.status(HttpStatusCode.Created).json({
        message: MESSAGES.VENDOR_VENUE_CHECKLIST_CREATED_SUCCESSFULLY,
        ...venueChecklist,
        ...data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getVendorVenueCheckListDetails(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const { vendorId } = req.params;
      const vendorVenueCheckListDetails :VendorVenueDetails[] | null= await this.vendorVenueChecklistService.getVendorVenueCheckListDetails(parseInt(vendorId,10));

      res.status(HttpStatusCode.Ok).json({vendorVenueCheckListDetails})
    } catch (error) {
      next(error);
    }
  }
}
