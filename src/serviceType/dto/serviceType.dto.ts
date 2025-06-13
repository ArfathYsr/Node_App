export type ServiceTypeDto = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;
  serviceTypeOffering: Array<{
    serviceOffering: {
      name: string;
    };
  }>;
};

export type ServiceResponseDto = {
  serviceTypeList: ServiceTypeDto[];
  totalAmount: number;
  totalPages: number;
  nextPage: boolean;
};

export type ServiceTypeListRequestDto = {
  sortBy: {
    field: string;
    order: string;
  };
  startDate?: Date;
  endDate?: Date;
  offset: number;
  limit: number;
  searchText?: string;
  filter?: {
    status?: number;
    serviceOfferingIds?: number[];
    isArchived: number;
  };
};

export type ServiceTypeListShortRequestDto = {
  searchText?: string;
};

export type ServiceTypeListShortResponse = {
  serviceTypeListShort: ServiceTypeListShortResponseDto[];
  totalServiceTypeCount: number;
};

export type ServiceTypeListShortResponseDto = {
  id: number;
  name: string;
  description: string;
};
export type AddServiceTypesRequestDTO = {
  name: string;
  description: string;
  isActive: boolean;
  serviceOfferingIds: number[];
  workItemIds?: number[];
  createdBy: number;
  updatedBy: number;
  cloneId?: number;
  type?: string;
};

export interface ServiceOfferingDTO {
  id: number;
}

export interface WorkItemsDTO {
  id: number;
}

export type ExistingServiceTypeNameDTO = {
  id: number;
  name: string;
} | null;

export interface ServiceTypeInfoDTO {
  createdBy: number;
  updatedBy: number;
  name: string;
  description: string;
  isActive: boolean;
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceTypeOfferingDataDTO = {
  serviceTypeId: number;
  serviceOfferingId: number;
  createdBy: number;
  updatedBy: number;
}[];

export type ServiceTypeWorkItemDataDTO = {
  serviceTypeId: number;
  workItemId: number;
  createdBy: number;
  updatedBy: number;
}[];

export type AddServiceTypeInfoResponseDTO = {
  serviceTypeInfo: ServiceTypeInfoDTO;
  serviceOfferingIds: number[];
  workItemIds: number[];
};

export type EditServiceTypesRequestDTO = AddServiceTypesRequestDTO & {
  serviceTypeId: number;
};

export type EditServiceTypeInfoResponseDTO = AddServiceTypeInfoResponseDTO

type ServiceTypeServiceOfferingDTO = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  }

type ServiceTypeWorkItemsDTO = {
  id: number;
  name: string;
  actionType: string;
  status: string;
};

export type ViewServiceTypeResponseDTO = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;
  archivedAt: Date | null;
  serviceOfferings: ServiceTypeServiceOfferingDTO[];
  workItems: ServiceTypeWorkItemsDTO[];
  createdByProfile?: { firstName: string; lastName: string };
  updatedByProfile?: { firstName: string; lastName: string };
};

export interface ServiceTypeDTO {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  cloneId: number | null;
  archivedAt: Date | null;
  createdBy: number;
  createdAt: Date;
  updatedBy: number;
  updatedAt: Date;
  serviceTypeOffering: ServiceTypeOfferingDTO[];
  serviceTypeWorkItem: ServiceTypeWorkItemDTO[];
  createdByProfile: {
    firstName: string;
    lastName: string;
  };
  updatedByProfile: {
    firstName: string;
    lastName: string;
  }
}

export interface ServiceTypeOfferingDTO {
  serviceOffering: ServiceOfferingRepoDTO;
}

export interface ServiceOfferingRepoDTO {
  id: number;
  name: string;
  description: string;
  isActive : boolean
}

export interface ServiceTypeWorkItemDTO {
  workItem: WorkItemRepoDTO;
}

export interface WorkItemRepoDTO {
  id: number;
  name: string;
  workItemActionType: WorkItemActionTypeDTO;
  workItemStatus: WorkItemStatusDTO;
}

export interface WorkItemActionTypeDTO {
  name: string;
}

export interface WorkItemStatusDTO {
  name: string;
}
