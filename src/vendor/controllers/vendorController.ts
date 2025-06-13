import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import { vendor } from '@prisma/client';
import { VENDOR_MESSAGES } from '../../utils/Messages/vendorMessage';
import TYPES from '../../dependencyManager/types';
import { CustomRequest } from '../../types/express';
import {
  AddVendorBodyData,
  GetVendorRoomDetailsResponseDto,
  VendorListDTO,
  VendorListRequestDTO,
  VendorMatchListRequestDto,
  VendorMatchListResponseDto,
  AddVendorResponse,
} from '../dto/vendor.dto';
import VendorService from '../services/vendorService';
import { MESSAGES } from '../../utils/message';

@injectable()
export default class VendorController {
  constructor(
    @inject(TYPES.VendorService)
    private readonly vendorService: VendorService,
  ) {}

  async createVendor(req: CustomRequest, res: Response, next: NextFunction) {
    const createdBy: number = req.docUser!.profileId;
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: AddVendorBodyData = req.body;
      const vendorCreateResponse:AddVendorResponse = await this.vendorService.createVendor({
        ...data,
        createdBy,
        updatedBy,
      });

      res
        .status(HttpStatusCode.Created)
        .json({ message: VENDOR_MESSAGES.VENDOR_CREATED,
          vendorCreateResponse
         });
      
         
    } catch (error) {
      next(error);
    }
  }

  async getVendorById(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const vendorData: vendor | null = await this.vendorService.getVendorById(
        parseInt(req.params.id, 10),
      );
      res.status(HttpStatusCode.Ok).json(vendorData);
    } catch (error) {
      next(error);
    }
  }

  async getVendorList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ): Promise<Response<any, Record<string, any>> | undefined> {
    try {
      const data: VendorListRequestDTO = req.body;
      const {
        vendorList,
        totalAmount,
        totalPages,
        nextPage,
      }: {
        vendorList: VendorListDTO[];
        totalAmount: number;
        totalPages: number;
        nextPage: boolean;
      } = await this.vendorService.getVendorList(data);
      if (data.offset > totalPages) {
        return res.status(HttpStatusCode.BadRequest).json({
          error: `${MESSAGES.INVALID_PAGE_NUMBER}${totalPages}`,
        });
      }
      res.status(HttpStatusCode.Ok).json({
        vendorList,
        totalAmount,
        totalPages,
        nextPage,
      });
    } catch (error) {
      next(error);
    }
  }

  async viewVendorMatchList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data: VendorMatchListRequestDto = req.body;
      const vendorMatchList: VendorMatchListResponseDto =
        await this.vendorService.viewVendorMatchList(data);

      if (vendorMatchList) {
        res.status(HttpStatusCode.Ok).json(vendorMatchList);
      } else {
        res
          .status(HttpStatusCode.Ok)
          .json({ message: VENDOR_MESSAGES.NO_DATA_FOUND, vendorMatchList });
      }
    } catch (error) {
      next(error);
    }
  }

  async getVendorRoomList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {      
      const data = req.body
       const { totalCount , vendorRoomdata } : GetVendorRoomDetailsResponseDto =
              await this.vendorService.getVendorRoomList(data);
       res.status(HttpStatusCode.Ok).json({ totalCount , vendorRoomdata });
    } catch (err) {
      next(err);
    }
  }
}
