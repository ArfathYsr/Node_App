import { Prisma } from '@prisma/client';

export type VendorResponseDto = {
  id: number;
};

export type AddVendorBodyData = {
  startDate: Date;
  endDate: Date;
  name: string;
  dba: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  vendorTypeId: number;
  isAlsoCaterer: boolean;
  vendorStatusId: number;
  addresses: AddAddressRequestDto[];
  contactInfos: AddContactInfoRequestDto[];
  clientIds: number[];
  additionalInformation: string;
  createdBy: number;
  updatedBy: number;
};
export type AddVendorCreatedData = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  description: string;
};
export type VendorData = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  description: string;
  addresses: Address[];
  VendorAddressDetails;
};

export type VendorAddressDetails = {
  id: number;
  vendorId: number;
  addressTypeId: number;
  address1: string;
  address2: string;
  cityId: number;
  stateId: number;
  countryId: number;
  zipcode: string | null;
  emailAddress: string | null;
  phoneNumber: string | null;
  isPrimary: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
};

export type VendorContactinfo = {
  vendorId: number;
  contactTypeId: number;
  name: string;
  phoneNumber: string | null;
  emailAddress: string | null;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
};

export type AddContactInfoRequestDto = {
  createdBy: number;
  updatedBy: number;
  vendorId: number;
  contactInfos: VendorContactinfo[];
};

export type AddAddressRequestDto = {
  createdBy: number;
  updatedBy: number;
  vendorId: number;
  addresses: Address[];
};

export type Address = {
  addressTypeId: number;
  address1: string;
  address2: string;
  emailAddress: string | null;
  cityId: number;
  stateId: number;
  countryId: number;
  phoneNumber: string | null;
  isPrimary: boolean;
  zipCode?: string | null;
};

export type AlignClientsToVendorRequest = {
  vendorId: number;
  clientIds: number[];
  createdBy: number;
  updatedBy: number;
};

export type AddVendorResponse = {
  id: number;
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  vendorTypeId: number;
  isAlsoCaterer: boolean;
  vendorStatusId: number;
  addresses: Address[];
  contactInfos: VendorContactinfo[];
  clientIds: number[];
  additionalInformation: string | null;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateVendorData = {
  id: number;
  name: string;
  vendorTypeId: number;
  isAlsoCaterer: boolean;
  startDate: Date;
  endDate: Date | null;
  additionalInformation: string | null;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
  vendorStatusId: number;
};

export interface AddressTypeDTO {
  id: number;
  name: string;
  isActive: boolean;
}

export interface CityDTO {
  id: number;
  name: string;
}

export interface StateDTO {
  id: number;
  name: string;
}

export interface CountryDTO {
  id: number;
  name: string;
}

export interface AddressDTO {
  id: number;
  vendorId: number;
  addressType: AddressTypeDTO;
  city: CityDTO;
  state: StateDTO;
  country: CountryDTO;
  address1: string;
  address2: string;
  zipcode: string | null;
  emailAddress: string | null;
  phoneNumber: string | null;
  isPrimary: boolean;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
}

export interface VendorStatusDTO {
  id: number;
  name: string;
}

export interface ProfileDTO {
  firstName: string;
  lastName: string;
}

export interface VendorTypeDTO {
  id: number;
  name: string;
  createdAt: Date;
  createdBy: number;
  updatedBy: number;
  updatedAt: Date;
}

export type VendorListDTO = {
  id: number;
  name: string;
  isAlsoCaterer: boolean;
  vendorType: VendorTypeDTO;
  additionalInformation: string | null;
  startDate: Date | null;
  endDate: Date | null;
  dba: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  addresses: AddressDTO[] | null;
  vendorStatus: VendorStatusDTO;
  createdAt: Date;
  updatedAt: Date;
  createdByProfile: ProfileDTO;
  updatedByProfile: ProfileDTO;
};

export type VendorListResponseDTO = {
  vendorList: VendorListDTO[];
  totalAmount: number;
  totalPages: number;
  nextPage: boolean;
};

export type VendorListRequestDTO = {
  filter?: {
    type?: string;
    name?: string;
    status?: number[];
  };
  startDate?: Date;
  endDate?: Date;
  sortBy: {
    field: string;
    order: string;
  };
  offset: number;
  limit: number;
  searchText?: string;
};

export interface SortCriteriaDTO {
  field: string;
  order: Prisma.SortOrder;
}

type SortOrderDto = 'asc' | 'desc';

export interface SortMappingDTO {
  type: { vendorType: { name: SortOrderDto } };
  address1: { addresses: { address1: SortOrderDto } };
  address2: { addresses: { address2: SortOrderDto } };
  city: { addresses: { city: { name: SortOrderDto } } };
  state: { addresses: { state: { name: SortOrderDto } } };
  updatedByProfile: [
    { updatedByProfile: { firstName: SortOrderDto } },
    { updatedByProfile: { lastName: SortOrderDto } },
  ];
}

export type VendorMatchListRequestDto = {
  filter?: {
    name: string;
    addressLine1?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  offset: number;
  limit: number;
};

export type VendorMatchListResponseDto = {
  vendorList: VendorMatchDto[];
  totalAmount: number;
};

export type VendorMatchDto = {
  id: number;
  name: string;
  vendorType: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  contactName: string;
  contactType: string;
  phoneNumber: string;
  email: string;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  createdByProfile?: {
    firstName: string;
    lastName: string;
  };
  updatedByProfile?: {
    firstName: string;
    lastName: string;
  };
  matchPercentage: number;
};

export type VendorDto = {
  id: number;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  vendorType: {
    id: number;
    name: string;
  };
  vendorStatusId: number;
  addresses:
    | {
        id: number;
        address1: string;
        address2: string;
        city: {
          id: number;
          name: string;
        };
        state: {
          id: number;
          name: string;
        };
        country: {
          id: number;
          name: string;
        };
        zipcode: string | null;
        emailAddress: string | null;
        phoneNumber: string | null;
      }[]
    | null;
  contacts:
    | {
        id: number;
        name: string;
        contactType: {
          id: number;
          name: string;
        };
        phoneNumber: string | null;
        emailAddress: string | null;
      }[]
    | null;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  createdByProfile?: {
    firstName: string;
    lastName: string;
  };
  updatedByProfile?: {
    firstName: string;
    lastName: string;
  };
};

export type VendorCount = [{ count: number }];

export type OrderByCondition =
  | Array<Record<string, Record<string, 'asc' | 'desc'>>>
  | Array<Record<string, 'asc' | 'desc'>>;

  export type GetVendorRoomDetailsRequestDto = {
    searchText?: string; 
    vendorId: number; 
  }
  
  export type VendorRoomDto = {
    id: number;
    roomName: string;
    maxCapacity: number;
    createdAt: Date;
    createdBy: number;
  }
  
  export type GetVendorRoomDetailsResponseDto = {
    totalCount: number  ;
    vendorRoomdata: VendorRoomDto[];
  }
  