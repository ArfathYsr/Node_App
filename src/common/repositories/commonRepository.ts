import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';
import TYPES from '../../dependencyManager/types';
import {
  ArchiveDto,
  StatusDto,
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
import { repositoryError, getStatus } from '../../utils/utils';

@injectable()
class CommonRepository {
  private readonly prisma: PrismaClient;

  constructor(@inject(TYPES.PrismaClient) prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getArchiveFilterlistData(): Promise<ArchiveDto[]> {
    try {
      const archiveFilterList: ArchiveDto[] =
        await this.prisma.archiveFilter.findMany({
          select: {
            id: true,
            name: true,
          },
        });
      return archiveFilterList;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getstatusIdByDate(
    startDate: Date | string,
    endDate: Date | string,
  ): Promise<number[]> {
    try {
      const statusIds: number[] = (
        await this.prisma.status.findMany({
          where: {
            statusName: getStatus(startDate, endDate),
          },
          select: {
            id: true,
          },
        })
      ).map((status) => status.id);

      return statusIds;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getStatusId(status: string): Promise<number> {
    try {
      const statusIds: StatusDto[] = await this.prisma.status.findMany({
        where: { statusName: status },
      });
      return statusIds.length === 1 ? statusIds[0].id : 0;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async listStatus(data : statusRequestDto): Promise<CommonListStatusResponseDto> {
    try {
      const { type } = data
      const statusList: CommonListStatusResponseDto =
        await this.prisma.status.findMany({
          select: { id: true, statusName: true },
          orderBy: {
            id: 'asc',
          },
        });
      let status : CommonListStatusResponseDto = type === "withOutDraft" ? statusList.filter(status => status.statusName !== 'Draft')  : statusList;  
      return status;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getFluentLanguageListData(): Promise<ArchiveDto[]> {
    try {
      const fluentLanguageList: FluentLanguagesDto[] =
        await this.prisma.fluentLanguages.findMany({
          select: {
            id: true,
            name: true,
          },
        });
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
        await this.prisma.addressType.findMany({
          select: {
            id: true,
            name: true,
          },
        });
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
      const profileStatusList: CommonListStatusResponseDto =
        await this.prisma.profileStatus.findMany({
          select: { id: true, statusName: true },
        });

      return profileStatusList;
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
      const status: StateDto[] = await this.prisma.state.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {name: 'asc'}
      });
      return status;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }

  async getInternationalPrefix(): Promise<
    CommunicationPreferencesDto | undefined
  > {
    try {
      const listInternationalPrefix: CommunicationPreferencesDto =
        await this.prisma.internationalPrefix.findMany();
      return listInternationalPrefix;
    } catch (error) {
      repositoryError(error);
    }
  }

  async getPhoneType(): Promise<PhoneType | undefined> {
    try {
      const listPhoneType: PhoneType = await this.prisma.phoneType.findMany();
      return listPhoneType;
    } catch (error) {
      repositoryError(error);
    }
  }

  async getCity(): Promise<CityDto[]> {
    try {
      const cityDatas: CityDto[] = await this.prisma.city.findMany({
        select: {
          id: true,
          name: true,
        },
        orderBy: {name: 'asc' }
      });
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
      const countryDatas: CountryDto[] = await this.prisma.country.findMany({
        select: {
          id: true,
          name: true,
        },
      });
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
        await this.prisma.vendorType.findMany({
          select: {
            id: true,
            name: true,
          },
        });
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
        await this.prisma.contactType.findMany({
          select: {
            id: true,
            name: true,
          },
        });
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
      const vendorStatusList: CommonListvendorStatusResponseDto =
        await this.prisma.vendorStatus.findMany({
          select: { id: true, name: true },
        });

      return vendorStatusList;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(String(error));
      }
    }
  }
}

export default CommonRepository;
