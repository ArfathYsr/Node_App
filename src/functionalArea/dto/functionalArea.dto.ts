import { DateTime } from 'luxon';

export type CreateFunctionalAreaDto = {
  name: string;
  description: string;
  isExternal: boolean;
  startDate: Date | null;
  endDate: Date | null;
  createdBy: number;
  updatedBy: number;
  clientIds?: number[];
  cloneId?: number;
  type?: string;
};

export type CreateFunctionalAreaDataToDbDto = {
  name: string;
  description: string;
  createdBy: number;
  updatedBy: number;
  isExternal: boolean;
  startDate: Date | null;
  endDate: Date | null;
  clientIds?: number[];
  cloneId?: number;
};

export type EditFunctionalAreaDto = {
  name: string;
  description: string;
  isExternal: boolean;
  startDate: Date | null;
  endDate: Date | null;
  updatedBy: number;
  clientIds: number[];
};
export type CreateFunctionalAreaResponseDto = {
  functionalArea: {
    id: number;
  };
};

export type GetFunctionalAreaResponseDto = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  description: string;
  isExternal: boolean;
  status: Status;
  clients:
    | {
        id: number;
        name: boolean;
        startDate: Date | null;
        endDate: Date | null;
        status: string;
      }[]
    | null;
};

export type FunctionalAreaDataDto = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  description: string;
  isExternal: boolean;
  archivedAt: Date | null;
  clients:
    | {
        id: number;
        name: boolean;
        startDate: Date | null;
        endDate: Date | null;
        status: string;
      }[]
    | null;
  status: Status;
};

export type FunctionalAreaListDataToDbDto = {
  sortBy: {
    field: string;
    order: string;
  };
  startDate: Date;
  endDate: Date;
  offset: number;
  limit: number;
  searchText?: string;
  filter?: {
    statusId?: number[];
    roleType?: string[];
    isArchived?: number;
  };
};

export type FunctionalAreaListDataResponseDto = {
  functionalAreas: Array<{
    id: number;
    name: string;
    description: string;
    isExternal: boolean;
    startDate: Date | null;
    endDate: Date | null;
    updatedAt: Date;
    createdAt: Date;
    createdBy: number | null;
    createdByProfile: {
      firstName: string;
      lastName: string;
    } | null;
    updatedBy: number | null;
    updatedByProfile: {
      firstName: string;
      lastName: string;
    } | null;
    status: Status;
  }>;
  totalAmount: number;
};

export type FunctionalAreaListDataTodayToDbDto =
  FunctionalAreaListDataToDbDto & {
    startOfTodayDate: DateTime<true>;
    endOfTodayDate: DateTime<true>;
  };

export type FunctionalAreaListDataToDbRawDto = (FunctionalAreaDataDto & {
  isActive: boolean;
  createdByFirstName: string;
  createdByLastName: string;
  updatedByFirstName: string;
  updatedByLastName: string;
})[];

export type FunctionalArea = {
  id: number;
};

export type FunctionalAreaRoleListDataToDbDto = {
  functionalAreaId: number;
  offset: number;
  limit: number;
  searchText?: string;
};

export type FunctionalAreaRoleListDataResponseDto = {
  roles: Array<{
    id: number;
    name: string;
    description: string;
    functionalAreaId: number;
    functionalAreaName: string;
    isExternal: boolean;
    startDate: Date | null;
    endDate: Date | null;
    status: Status;
  }>;
  totalAmount: number;
};

export type FunctionalAreaArchiveDto = {
  functionalAreaIds: Array<number>;
};

export type FunctionalAreaArchiveResponseDto = {
  message: string;
};

export type ViewShortFunctionalAreasDto = {
  limit: number;
  offset: number;
  searchText?: string;
};

export type ViewShortFunctionalAreasResponseDto = {
  functionalAreas: ShortFunctionalAreasDto;
  totalAmount: number;
};

export type ShortFunctionalAreasDto =
  | {
      id: number;
      name: string;
      description: string;
      startDate?: Date | null;
      endDate?: Date | null;
      isExternal: boolean;
      status?: Status;
    }[]
  | [];

export type ShortFunctionalAreaDto = {
  id: number;
  name: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isExternal: boolean;
  status?: Status;
};
export type UpdatedFunctionalArea = {
  id: number;
};
export type SortCriteria = {
  field: string;
  order: 'asc' | 'desc';
};
type FunctionalAreas = {
  name: string;
};

export type Role = {
  id: number;
  name: string;
  description: string;
  functionalAreaId: number;
  isExternal: boolean;
  startDate: Date | null;
  endDate: Date | null;
  functionalArea: FunctionalAreas;
  status: Status;
};
export type OrderByCondition =
  | Array<Record<string, Record<string, 'asc' | 'desc'>>>
  | Array<Record<string, 'asc' | 'desc'>>;

export type Status = {
  id: number;
  statusName: string;
};
