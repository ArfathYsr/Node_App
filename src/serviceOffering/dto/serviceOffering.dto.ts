import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { ArchiveOrUnarchiveServiceOfferingSchema } from '../schemas/serviceofferingSchema';

export type CreateServiceOfferingRequest = {
  name: string;
  serviceOfferingCodeId: number;
  description: string;
   serviceTypeData: {
    serviceTypeId: number;
    workItemIds: number[];
  }[];
   isActive : boolean;
  createdBy: number;
  updatedBy: number;
  cloneId?: number;
  type?: string;
};

export type ServiceOfferingDto = {
  id: number;
  name: string;
  description: string;
  isActive : boolean ; 
  serviceOfferingCodeId: number;
};

export type ArchiveOrUnarchiveServiceOfferingDto = z.infer<typeof ArchiveOrUnarchiveServiceOfferingSchema>["body"]

export type CreateServiceOfferingResponse = {
  data: {
      name: string;
      serviceOfferingCodeId: number;
      description: string;
      id:number;
      isActive : boolean;
      createdBy: number;
      updatedBy: number;
      serviceTypeData: {
        serviceTypeId: number;
        workItemIds: number[];
      }[];
  }
 };


export type ServiceOfferingResponseDto = {
  name: string;
  serviceOfferingCodeId: number;
  description: string;
  id:number;
  isActive : boolean;
  createdBy: number;
  updatedBy: number;
} 

export type ListWorkItemRequest = {
  serviceTypeId?: number
};

export type ListWorkItemResponse = {
  workItemList:workItemResponse[]
};


export type ListWorkItemByServiceTypeResponse = {
  serviceTypeId: number;
  workItem:{
    id: number,
    name: string;
    workItemActionType: {
      name: string
    },
  }
};

export type workItemResponse = {
  id: number,
  name: string,  
  workItemActionType: {
    name: string
  },
 };

export type ServiceTypeWorkItemResponse = {
  serviceTypeWorkItems: {
    id: number;
    serviceTypeId: number;
    workItemId: number;
    status: boolean;
    createdBy: number;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: number;
  }[];
};

export type ServiceTypeWorkItemRequest = {
  serviceTypeId: number,
  workItemId: number[],
  status: boolean,
  createdBy: number,
  updatedBy: number,
}

export interface workItemCreateManyInput {
  workItemId: number;
  createdBy: number;
  updatedBy: number;
  name: string;
  actionTypeId: number;
  statusId: number;
};

export interface SortMappingDTO {
  serviceType?: { serviceTypeOffering: { serviceType: { name: SortOrderDto } } }; 
}

export type ServiceOfferingResponseDtos = {
  serviceOfferingList: ServiceOfferingDto[];
  totalCount: number;
};

export type ServiceOfferingListRequestDto = {
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

export interface EditServiceOfferingRequestDTO {
  name: string;
  description: string;
  status: boolean;
  serviceOfferingCodeId: number;
  serviceTypeData: {
    serviceTypeId: number;
    workItemIds: number[];
  }[];
}
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

export type AddServiceOfferingInfoResponseDTO = {
  serviceTypeInfo: ServiceTypeInfoDTO;
  serviceOfferingIds: number[];
  workItemIds: number[];
};

export type ServiceTypeDataDTO = {
  serviceTypeId: number;
  workItemIds: number[];
}

export type EditServiceOfferingDTO = {
  name: string;
  description: string;
  isActive : boolean;
  serviceOfferingCodeId?: number;
  serviceTypeData: ServiceTypeDataDTO[];
}


export type ServiceTypeOfferingUpdate = {
  serviceTypeId: number;
  count: number;
};

export type ExistingServiceOfferingNameDTO = {
  id: number;
  name: string;
} | null;

export interface ServiceOfferingDTO {
  id: number;
}

export interface ServiceOfferingDataDTO {
  name: string; description: string; isActive : boolean; serviceOfferingCodeId?: number ;
}


export type ServiceOffering = {
  id: number;
  name: string;
  description: string;
  status: boolean;
  serviceOfferingCodeId: number;
  serviceTypeData: Array<{
    serviceTypeId: number;
    workItemIds: number[];
  }>;
}

export type BulkEditServiceOfferingRequestDTO = {
  ids: number[];
  isActive : boolean;
  serviceTypeIds: number[]
}

export type GetExistingServiceOfferings = {
  id: number;
}[];

export type GetExistingServiceTypes = {
  id: number;
}[];

export type GetExistingWorkItems= {
  id: number;
}[];

export type serviceTypeOfferingDataDTO = {
  serviceTypeId: number;
}

export type ViewServiceOfferingResponseDto = {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  serviceOfferingCodeId: number;
  createdAt: Date;
  createdByProfile: {
    firstName: string;
    lastName: string;
  };
  updatedAt: Date;
  updatedByProfile: {
    firstName: string;
    lastName: string;
  };
  serviceTypeOffering?: {
    serviceTypeId: number;
    serviceType: {
      name: string;
    };
  }[];
  serviceTypes?: {
    serviceTypeId: number;
    name: string;
  }[];
  workItems?: {
    name: string;
    actionTypeName: string;
  }[];
} | null ;


export type workItem= {
  name: string;
  actionTypeName: string;
}

export type WorkItemData = {
  workItem: {
    name: string;
    workItemActionType: {
      name: string;
    };
  };
};
