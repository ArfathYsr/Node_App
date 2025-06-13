import { inject, injectable } from 'inversify';
import config from 'config';
import { client, vendor } from '@prisma/client';
import { COMMON } from '../../utils/common';
import TYPES from '../../dependencyManager/types';
import VendorRepository from '../repositories/vendorRepository';
import {
  AddVendorResponse,
  AddVendorBodyData,
  VendorListRequestDTO,
  VendorListResponseDTO,
  VendorMatchListRequestDto,
  VendorMatchListResponseDto,
  GetVendorRoomDetailsRequestDto,
  GetVendorRoomDetailsResponseDto,
} from '../dto/vendor.dto';
import validateDates from '../../utils/statusUtils';
import ClientRepository from '../../client/repositories/clientRepository';
import { MESSAGES } from '../../utils/message';
import { VENDOR_MESSAGES } from '../../utils/Messages/vendorMessage';
import { BadRequestError } from '../../error/badRequestError';
import { NotFoundError } from '../../error/notFoundError';

@injectable()
export default class VendorService {
  constructor(
    @inject(TYPES.VendorRepository)
    private readonly vendorRepository: VendorRepository,
    @inject(TYPES.ClientRepository)
    private clientRepository: ClientRepository,
  ) {}

  private getDefaultEndDate(): Date {
    return new Date(config.get<string>(COMMON.DEFAULT_ENTITY_AND_DATE));
  }

  async createVendor(data: AddVendorBodyData): Promise<AddVendorResponse> {
    try {
      const {
        createdBy,
        updatedBy,
        startDate,
        endDate,
        name,
      }: {
        createdBy: number;
        updatedBy: number;
        startDate: Date;
        endDate: Date;
        name: string;
      } = data;
      const endDateDefault: Date = this.getDefaultEndDate();
      const validatedStartDate: Date = startDate
        ? new Date(startDate)
        : new Date();
      const validatedEndDate: Date = endDate
        ? new Date(endDate)
        : endDateDefault;
      const finalEndDate: Date = validateDates({
        startDate: validatedStartDate,
        endDate: validatedEndDate,
      });

      const existingVendor = await this.vendorRepository.findVendorByName(name);

      if (existingVendor) {
        throw new Error(VENDOR_MESSAGES.VENDOR_ALREADY_EXISTS);
      }

      const newData: AddVendorBodyData = {
        ...data,
        createdBy,
        updatedBy,
        startDate,
        endDate: finalEndDate,
        name,
      };

      await this.validateClientIds(data.clientIds);
      const vendorDataResponse: AddVendorResponse =
        await this.vendorRepository.createVendor(newData);

      return vendorDataResponse;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async validateClientIds(clientIds: number[] | undefined) {
    try {
      if (clientIds) {
        const activeClients: client[] =
          await this.clientRepository.findActiveClientsByIds(clientIds);
        const activeClientIds: number[] = activeClients.map(
          (clientId) => clientId.id,
        );
        const inactiveClientIds: number[] = clientIds.filter(
          (id) => !activeClientIds.includes(id),
        );

        if (inactiveClientIds.length > 0) {
          throw new Error(
            MESSAGES.INACTIVE_CLIENTS_OR_DO_NOT_EXISTS(inactiveClientIds),
          );
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getVendorById(vendorId: number): Promise<vendor | null> {
    try {
      const isVendorExists: number =
        await this.vendorRepository.findVendorById(vendorId);

      if (!isVendorExists) {
        throw new BadRequestError(VENDOR_MESSAGES.VENDOR_NOT_FOUND(vendorId));
      }

      const vendorDetails: vendor | null =
        await this.vendorRepository.getVendorById(vendorId);
      return vendorDetails;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  getVendorList(
    vandorListRequestData: VendorListRequestDTO,
  ): Promise<VendorListResponseDTO> {
    try {
      const { startDate, endDate } = vandorListRequestData;
      validateDates({
        startDate,
        endDate,
      });
      return this.vendorRepository.getVendorList(vandorListRequestData);
    } catch (error) {
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  async viewVendorMatchList(
    data: VendorMatchListRequestDto,
  ): Promise<VendorMatchListResponseDto> {
    try {
      return await this.vendorRepository.viewVendorMatchList(data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getVendorRoomList(data:GetVendorRoomDetailsRequestDto){
    try {

      const existingVendorId : vendor | null =
        await this.vendorRepository.getVendorById(data.vendorId);

      if (!existingVendorId) {
        throw new NotFoundError( VENDOR_MESSAGES.VENDOR_NOT_FOUND(data.vendorId))
      }

      const listVendorRoomdata : GetVendorRoomDetailsResponseDto =
        await this.vendorRepository.getVendorRoomdetails(data);

      return listVendorRoomdata;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

}
