export type SortOrder = 'ask' | 'desc' | 'ASC' | 'DESC';

export type PaginationOptions = {
  offset: number;
  limit: number;
};

export type PostBodySortOptions<FieldT = string> = {
  sortBy: {
    field: FieldT;
    order: SortOrder;
  };
};

export type FilterOptions = {
  filter?: {
    startDate?: string;
    endDate?: string;
    roles?: number[] | undefined;
    functionalAreas?: number[] | undefined;
    statusId?: number[];
    stateId?: number[];
    cityId?: number[];
    isArchived?: number;
    isExternal?: boolean;
  };
};
