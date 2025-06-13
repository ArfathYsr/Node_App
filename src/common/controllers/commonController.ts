import { Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { HttpStatusCode } from 'axios';
import TYPES from '../../dependencyManager/types';
import { CustomRequest } from '../../types/express';
import CommonService from '../services/commonService';
import {
  ArchiveDto,
  FluentLanguagesDto,
  AddressTypeDto,
  StateDto,
  CityDto,
  CountryDto,
  CommunicationPreferencesDto,
  PhoneType,
  VendorTypeDto,
  ContactTypeDto,
  statusRequestDto,
} from '../dto/common.dto';

@injectable()
export default class CommonController {
  constructor(
    @inject(TYPES.CommonService) private readonly commonService: CommonService,
  ) {}

  async getArchiveFilterlist(_req: CustomRequest, res: Response) {
    const archivelist: ArchiveDto[] =
      await this.commonService.getArchiveFilterlist();
    res.status(HttpStatusCode.Ok).json({ archivelist });
  }

  async getStatusList(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const data : statusRequestDto = req.body
      const statuses = await this.commonService.listStatus(data);
      res.status(HttpStatusCode.Ok).json({ statuses });
    } catch (error) {
      next(error);
    }
  }

  async getFluentLanguages(_req: CustomRequest, res: Response) {
    const fluentLanguageList: FluentLanguagesDto[] =
      await this.commonService.getFluentLanguageList();
    res.status(HttpStatusCode.Ok).json({ fluentLanguageList });
  }

  async getAddressTypes(_req: CustomRequest, res: Response) {
    const addressTypes: AddressTypeDto[] =
      await this.commonService.getAddressTypes();
    res.status(HttpStatusCode.Ok).json({ addressTypes });
  }

  async getProfileStatusList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const statuses = await this.commonService.listProfileStatus();
      res.status(HttpStatusCode.Ok).json({ statuses });
    } catch (error) {
      next(error);
    }
  }

  async getState(_req: CustomRequest, res: Response) {
    const states: StateDto[] = await this.commonService.getStates();
    res.status(HttpStatusCode.Ok).json({ states });
  }

  async getCity(_req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const citys: CityDto[] = await this.commonService.getCity();
      res.status(HttpStatusCode.Ok).json({ citys });
    } catch (error) {
      next(error);
    }
  }

  async getCountry(_req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const countrys: CountryDto[] = await this.commonService.getCountry();
      res.status(HttpStatusCode.Ok).json({ countrys });
    } catch (error) {
      next(error);
    }
  }

  async getInternationalPrefix(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const getInternationalPrefix: CommunicationPreferencesDto =
        await this.commonService.getInternationalPrefix();
      res.status(HttpStatusCode.Ok).json({ getInternationalPrefix });
    } catch (error) {
      next(error);
    }
  }

  async getPhoneType(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const getPhoneType: PhoneType = await this.commonService.getPhoneType();
      res.status(HttpStatusCode.Ok).json({ getPhoneType });
    } catch (error) {
      next(error);
    }
  }

  async getVendorType(_req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const vendorTypes: VendorTypeDto[] =
        await this.commonService.getVendorType();
      res.status(HttpStatusCode.Ok).json({ vendorTypes });
    } catch (error) {
      next(error);
    }
  }

  async getContactType(_req: CustomRequest, res: Response, next: NextFunction) {
    try {
      const contactTypes: ContactTypeDto[] =
        await this.commonService.getContactType();
      res.status(HttpStatusCode.Ok).json({ contactTypes });
    } catch (error) {
      next(error);
    }
  }

  async getVendorStatusList(
    req: CustomRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const statuses = await this.commonService.listVendorStatus();
      res.status(HttpStatusCode.Ok).json({ statuses });
    } catch (error) {
      next(error);
    }
  }
}
