import { clientHierarchy } from "@prisma/client";
import { hierarchyLevel } from "@prisma/client";

export type ListOrgHierarchyBodyDto = {
    sortBy?: SortBy;
    offset: number;
    limit: number;
    searchText?: string;
    filter?: {
      clientName?: string[];
      status?: number[];
    };
  };
export interface OrgHierarchyResult {
    clientHierarchyList: clientHierarchy[];
    totalAmount: number;
  }

export  type SortBy = {
  field: string;
  order: 'asc' | 'desc';
};

export type SortByCondition =
  | {
      status: {
        statusName: 'asc' | 'desc';
      };
      effectiveDate: 'asc' | 'desc';
    }
  | {
      status: {
        statusName: 'asc' | 'desc';
      };
    }
  | {
      client: {
        name: 'asc' | 'desc';
      };
    }
  | {
      [key: string]: 'asc' | 'desc' | { [key: string]: 'asc' | 'desc' };
    };

    export type AddHierarchyReqData = {
      name: string;
      description?: string | null;
      numberOfLevels: number;
      statusId: number;
      effectiveDate: string;
      endDate?: string | null;
      fieldReleaseDate?: string | null;
      createdBy: number;
      updatedBy: number;
      cloneId ?: number;
      clientId ?: number;
      hierarchyLevels: HierarchyLevel[];
      type ?: string
    };
    
    export type AddHierarchyResponseData = {
      id: number;
      name: string;
      description: string | null;
      numberOfLevels: number;
      statusId: number;
      effectiveDate: Date;
      endDate: Date | null;
      fieldReleaseDate: Date | null;
      createdBy: number;
      createdAt: Date;
      updatedBy: number;
      updatedAt: Date;
    };
    
    export type AddHierarchyJsonResponse = {
      id: number;
      clientOrgHierarchyName: string;
      createdHierarchyLevels : hierarchyLevel[]
    };
    
    export type HierarchyLevel = {
      name: string;
      allowMultipleLevelValue: boolean;
      isActive: boolean;
      levelOrder: number;
      parentHierarchyLevelId: number | null;
    };
    
    export type CreateHierarchyLevel = {
      name: string;
      id: number;
      createdBy: number;
      createdAt: Date;
      updatedBy: number;
      updatedAt: Date;
      allowMultipleLevelValue: boolean;
      isActive: boolean;
      levelOrder: number;
      clientHierarchyId: number;
      parentHierarchyLevelId: number | null;
    }[];
    
    export type CloneHierarchyReqData = {
      name: string;
      description?: string | null;
      numberOfLevels: number;
      statusId: number;
      effectiveDate: string;
      endDate?: string | null;
      fieldReleaseDate?: string | null;
      cloneId ?: number;
      clientId ?: number;
      hierarchyLevels: HierarchyLevel[];
      type ?: string;
      globalId ?: number
    };
