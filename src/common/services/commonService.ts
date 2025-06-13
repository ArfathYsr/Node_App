import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import CommonRepository from '../repositories/commonRepository';
import {
  ArchiveDto,
  CommonListStatusResponseDto,
  FluentLanguagesDto,
  AddressTypeDto,
  StateDto,
  CityDto,
  CountryDto,
  CommunicationPreferencesDto,
  PhoneType,
  VendorTypeDto,
  ContactTypeDto,
  CommonListvendorStatusResponseDto,
  statusRequestDto,
} from '../dto/common.dto';

@injectable()
export default class CommonService {
  constructor(
    @inject(TYPES.CommonRepository)
    private readonly commonRepository: CommonRepository,
  ) {}

  async getArchiveFilterlist(): Promise<ArchiveDto[]> {
    try {
      const archiveFilterList: ArchiveDto[] =
        await this.commonRepository.getArchiveFilterlistData();
      return archiveFilterList;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async listStatus(data : statusRequestDto ): Promise<CommonListStatusResponseDto> {
    try {
      const listStatusEntries: CommonListStatusResponseDto =
        await this.commonRepository.listStatus(data);
      return listStatusEntries;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getFluentLanguageList(): Promise<FluentLanguagesDto[]> {
    try {
      const fluentLanguageList: FluentLanguagesDto[] =
        await this.commonRepository.getFluentLanguageListData();
      return fluentLanguageList;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getAddressTypes(): Promise<AddressTypeDto[]> {
    try {
      const addressTypeList: AddressTypeDto[] =
        await this.commonRepository.getAddressTypes();
      return addressTypeList;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async listProfileStatus(): Promise<CommonListStatusResponseDto> {
    try {
      const listProfileStatusEntries: CommonListStatusResponseDto =
        await this.commonRepository.listProfileStatus();
      return listProfileStatusEntries;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getStates(): Promise<StateDto[]> {
    try {
      const states: StateDto[] = await this.commonRepository.getStates();
      return states;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getInternationalPrefix() {
    try {
      const listInternationalPrefix: CommunicationPreferencesDto =
        await this.commonRepository.getInternationalPrefix();
      return listInternationalPrefix;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getPhoneType() {
    try {
      const listPhoneType: PhoneType =
        await this.commonRepository.getPhoneType();
      return listPhoneType;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getCity(): Promise<CityDto[]> {
    try {
      const cityDatas: CityDto[] = await this.commonRepository.getCity();
      return cityDatas;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getCountry(): Promise<CountryDto[]> {
    try {
      const countryDatas: CountryDto[] =
        await this.commonRepository.getCountry();
      return countryDatas;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getVendorType(): Promise<VendorTypeDto[]> {
    try {
      const vendorTypeDatas: VendorTypeDto[] =
        await this.commonRepository.getVendorType();
      return vendorTypeDatas;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getContactType(): Promise<ContactTypeDto[]> {
    try {
      const contactTypeDatas: ContactTypeDto[] =
        await this.commonRepository.getContactType();
      return contactTypeDatas;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async listVendorStatus(): Promise<CommonListvendorStatusResponseDto> {
    try {
      const listVendorStatusEntries: CommonListvendorStatusResponseDto =
        await this.commonRepository.listVendorStatus();
      return listVendorStatusEntries;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }
}
