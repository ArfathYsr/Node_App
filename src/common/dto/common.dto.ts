export interface ArchiveDto {
  id: number;
  name: string;
}
export type StatusDto = {
  id: number;
  statusName: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: number;
  updatedBy: number;
};

export type ListStatusDto = {
  statusIds?: number[];
};
export type CommonListStatusResponseDto = Array<{
  id: number;
  statusName: string;
}>;

export type CommonListvendorStatusResponseDto = Array<{
  id: number;
  name: string;
}>;

export interface FluentLanguagesDto {
  id: number;
  name: string;
}
export type AddressTypeDto = {
  id: number;
  name: string;
};

export type StateDto = {
  id: number;
  name: string;
};

export type LocaleDto = {
  id: number;
  name: string;
};

export type CityDto = {
  id: number;
  name: string;
};

export type TimeZoneDto = {
  id: number;
  name: string;
};

export type CountryDto = {
  id: number;
  name: string;
};

export type CommunicationPreferencesDto =
  | {
      id: number;
      name: string;
      createdBy: number;
      createdAt: Date;
    }[]
  | undefined;

export type PhoneType =
  | {
      id: number;
      name: string;
      isActive: boolean;
    }[]
  | undefined;

export type VendorTypeDto = {
  id: number;
  name: string;
};

export type ContactTypeDto = {
  id: number;
  name: string;
};

export type statusRequestDto = {
  type : string 
}