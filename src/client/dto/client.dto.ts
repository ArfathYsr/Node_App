export type CreateChildClientsDto = {
  clients: CreateClientDto[];
  createdBy: number;
  updatedBy: number;
  parentClientId: number;
};
export type CreateClientDto = {
  name: string;
  description: string;
  logo: string;
  clientAddress: {
    street1: string;
    city: string;
    state: string;
    countryId: number;
    zipCode: string;
  };
  startDate: Date | null;
  endDate?: Date;
  fieldDate: Date | null;
  createdBy: number;
  updatedBy: number;
  therapeuticAreaId: number[];
};

export type EditChildClientDto = {
  name: string;
  description: string;
  logo?: string;
  clientId: number;
  clientStatusId: number;
  updatedBy: number;
  clientAddress: {
    street1: string;
    city: string;
    state: string;
    countryId: number;
    zipCode: string;
  };
  startDate?: Date | null;
  endDate?: Date;
  fieldDate?: Date | null;
  therapeuticAreaId: number[];
};

export type CreateClientDataToDbDto = {
  name: string;
  description: string;
  createdBy: number;
  updatedBy: number;
  clientStatusId: number;
  currencyId: number;
  languageId: number;
  logo: string;
  parentClientId?: number;
  clientAddress: Array<{
    street1: string;
    city: string;
    state: string;
    countryId: number;
    zipCode: string;
    createdBy: number;
    updatedBy: number;
    isActive: boolean;
    addressTypeId: number;
  }>;
  therapeuticAreaId: number[];
  startDate: Date | null;
  endDate?: Date;
};
export type ClientListDataToDbDto = {
  sortBy: {
    field: string;
    order: string;
  };
  startDate: Date;
  endDate: Date;
  fieldDate: Date;
  offset: number;
  limit: number;
  searchText?: string;
  filter: {
    name?: string[];
    status?: number[];
    isArchived?: boolean;
  };
};

export type ClientListDataResponseDto = {
  clients: Array<{
    id: number;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    clientStatus: {
      id: number;
      name: string;
    };
    clientAddress: {
      street1: string;
      zipCode: string;
      city: string | null;
      state: string | null;
      country: {
        id: number;
        name: string;
        code: string;
      };
    };
    logo: string | null;
    startDate: Date | null;
    endDate: Date;
    archivedAt: Date | null;
  }>;
  totalAmount: number;
};

export type ClientByIdDataResponseDto = {
  client: {
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    clientStatus: {
      id: number;
      name: string;
    };
    clientAddress: {
      street1: string;
      city: string | null;
      state: string | null;
      zipCode: string;
    };
    parentClient: {
      id: number;
      name: string;
    } | null;
    startDate: Date | null;
    endDate: Date;
    fieldDate: Date | null;
  };
};

export type CreateClientResponseDto = {
  client: {
    id: number;
    logo: string;
  };
};
export type CreateChildClientsResponseDto = {
  clients: {
    id: number;
    logo: string;
  }[];
};

export type UpdateLogo = {
  logo: string;
};

export type EditClientDto = {
  name: string;
  description: string;
  logo?: string;
  clientStatusId: number;
  updatedBy: number;
  clientAddress: {
    street1: string;
    city: string | null;
    state: string | null;
    countryId: number;
    zipCode: string;
  };
  startDate?: Date | null;
  endDate?: Date;
  therapeuticAreaId: number[];
};

export type EditClientDataToDbDto = {
  name: string;
  description: string;
  clientStatusId: number;
  parentClientId?: number;
  updatedBy: number;
  logo?: string;
  clientAddress: Array<{
    street1: string;
    city: string | null;
    state: string | null;
    countryId: number;
    zipCode: string;
  }>;
  startDate?: Date | null;
  endDate?: Date;
  therapeuticAreaId: number[];
};

export type ParentClientListDataToDbDto = {
  offset: number;
  limit: number;
  searchText?: string;
};

export type ParentClientListResponseDto = {
  parentClients: {
    id: number;
    name: string;
  }[];
};

export type DeleteClientsDto = {
  clientIds: number[];
};

export type ClientIdDto = {
  id: number;
};

export type ClientShortListDataToDbDto = {
  searchText?: string;
  filter?: {
    status: string[];
  };
};

export type ClientShortListDataResponseDto = Array<{
  id: number;
  name: string;
}>;

export type ClientDTO = {
  id: number;
  name: string;
  description?: string | null; // Allow `null` here
  parentClientId?: number | null;
  clientStatusId: number;
  currencyId: number;
  languageId: number;
  logo: string;
  startDate?: Date | null;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date | null;
};

export type GetClientNameReq = {
  clientIds: number[]
}
export type GetClientNameRes = {
  id: number;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  clientStatus: {
    id: number;
    name: string;
  }
}[]