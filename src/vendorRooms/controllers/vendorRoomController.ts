import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import TYPES from '../../dependencyManager/types';
import { CustomRequest } from '../../types/express';
import {
  AddRoomInfoRequestDto,
  CreateRoomInfoResponseDto,
  RoomDetailsResponseDto,
} from '../dto/vendorRoom.dto';
import VendorRoomService from '../services/vendorRoomService';
import { VENDOR_ROOM_MESSAGES } from '../../utils/Messages/vendorRoomMessage';
import { Prisma } from '@prisma/client';
import { VendorRoomDto } from '../../vendor/dto/vendor.dto';
import { MESSAGES } from '../../utils/message';

@injectable()
export default class VendorRoomController {
  constructor(
    @inject(TYPES.VendorRoomService)
    private readonly vendorRoomService: VendorRoomService
  ) {}

  async addRoomInfoAndQuestionnair(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const createdBy: number = req.docUser!.profileId;
    const updatedBy: number = req.docUser!.profileId;
    try {
      const data: AddRoomInfoRequestDto = req.body;
      const {
        roomInfo,
        questionsInserted,
      }: {
        roomInfo: CreateRoomInfoResponseDto;
        questionsInserted: Prisma.BatchPayload;
      } = await this.vendorRoomService.addRoomInfoAndQuestionnair({
        ...data,
        createdBy,
        updatedBy,
      });

      res.status(HttpStatusCode.Created).json({
        message: VENDOR_ROOM_MESSAGES.VENDOR_ROOM_CREATED_SUCCESSFULLY,
        roomDetailList: roomInfo,
        questionsInserted,
      });
    } catch (error) {
      next(error);
    }
  }

  async vendorRoomList(_req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const vendorRoom: VendorRoomDto[] =
        await this.vendorRoomService.roomList();
      res.status(HttpStatusCode.Ok).json({
        message: MESSAGES.VENDOR_ROOM_LIST,
        vendorRoom,
      });
    } catch (error) {
      next(error);
    }
  }

   async getRoomDetailsById(
    req: CustomRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const roomData: RoomDetailsResponseDto | null =
        await this.vendorRoomService.getRoomDetailsById(
          parseInt(req.params.id, 10)
        );
      res.status(HttpStatusCode.Ok).json(roomData);
    } catch (err) {
      next(err);
    }
  }
}

