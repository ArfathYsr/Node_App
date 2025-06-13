export type CreatePermissionGroupToDBDto = {
  createdBy: number;
  updatedBy: number;
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
};

export type CreatePermissionGroupDto = CreatePermissionGroupToDBDto & {
  permissionIds?: number[];
  roleIds?: number[];
  cloneId?: number;
  type?: string;
};

export type CreatePermissionGroupResponseDto = {
  id: number;
};

export type UpdatePermissionGroupDto = {
  createdBy: number;
  updatedBy: number;
  name: string;
  description: string;
  startDate?: Date;
  endDate?: Date;
  permissionIds?: number[];
  roleIds?: number[];
  isActive: boolean;
};

export type UpdatePermissionGroupResponseDto = {
  id: number;
};
export type ViewPermissionGroupDto = {
  id: number;
};

export type ViewPermissionGroupResponseDto =
  | {
      id: number;
      createdAt: Date;
      createdBy: number;
      updatedAt: Date;
      updatedBy: number;
      name: string;
      description: string;
      startDate?: Date | null;
      endDate?: Date | null;
      status: Status;
      permissions?: Array<{
        name: string;
        description?: string;
        startDate: Date | null;
        endDate: Date | null;
      }>;
      roles?: Array<{
        name: string;
        description?: string;
        isExternal: boolean;
        startDate: Date | null;
        endDate: Date | null;
      }>;
    }
  | null
  | undefined;

export type PermissionGroupDto = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  name: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isActive?: boolean;
  permissions?: Array<{
    name: string;
    description?: string;
    startDate: Date | null;
    endDate: Date | null;
  }>;
  roles?: Array<{
    name: string;
    description?: string;
    isExternal: boolean;
    startDate: Date | null;
    endDate: Date | null;
  }>;
} | null;

export type PermissionObjectDto = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  name: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isActive?: boolean;
};

export type PermissionGroupListDto =
  | {
      id: number;
      createdAt: Date;
      createdBy: number;
      updatedAt: Date;
      updatedBy: number;
      name: string;
      description: string;
      startDate?: Date | null;
      endDate?: Date | null;
      status: Status;
    }[]
  | [];

export type ViewPermissionGroupListDto = {
  sortBy: {
    field: string;
    order: string;
  };
  limit: number;
  offset: number;
  startDate?: Date;
  endDate?: Date;
  searchText?: string;
  startOfTodayDate: Date;
  endOfTodayDate: Date;
  filter?: {
    status?: number[];
    isArchived?: number;
  };
  status: Status;
};

export type ViewPermissionGroupListResponseDto = {
  permissionGroups: PermissionGroupListDto;
  totalAmount: number;
};

export type ViewShortPermissionGroupsDto = {
  limit?: number;
  offset?: number;
  roleId?: number;
  searchText?: string;
};

export type ShortPermissionGroupsDto =
  | {
      id: number;
      name: string;
      description: string;
      startDate?: Date | null;
      endDate?: Date | null;
      isActive?: boolean;
    }[]
  | [];

export type ShortPermissionGroupObjectDto = {
  id: number;
  name: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isActive?: boolean;
};

export type ViewShortPermissionGroupsResponseDto = {
  connectedPermissionGroups: ShortPermissionGroupsDto;
  availablePermissionGroups: {
    permissionGroups: ShortPermissionGroupsDto;
    totalAmount: number;
  };
};

export type PermissionGroup = {
  id: number;
};
export type PermissionGroupRolesDto =
  | {
      role: {
        id: number;
        name: string;
        description?: string;
        isActive: boolean;
        isExternal: boolean;
        startDate: Date | null;
        endDate: Date | null;
      };
    }[]
  | null;

export type Permission = {
  id: number;
  name?: string;
  description?: string;
  startDate: Date | null;
  endDate: Date | null;
};

export type SortCriteria = {
  field: string;
  order: 'asc' | 'desc';
};

export type OrderByCondition =
  | Array<Record<string, Record<string, 'asc' | 'desc'>>>
  | Array<Record<string, 'asc' | 'desc'>>;

export type PermissionGroupList = Array<{
  id: number;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  archivedAt: Date | null;
  createdByProfile: {
    firstName: string | null;
    lastName: string | null;
  } | null;
  updatedByProfile: {
    firstName: string | null;
    lastName: string | null;
  } | null;
  status: Status;
}>;

export type PermissionGroupListByName = Array<{
  id: number;
  name: string;
  description: string;
}>;

export type PermissionGroupIdAlignedWithRole = Array<{
  permissionGroupId: number;
}>;

export type PermissionGroupView = {
  id: number;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  isArchived?: boolean;
  createdByProfile: {
    firstName: string | null;
    lastName: string | null;
  } | null;
  updatedByProfile: {
    firstName: string | null;
    lastName: string | null;
  } | null;
  permissionGroupPermission?: Array<{
    permission: {
      id: number;
      name: string;
      description: string;
      startDate: Date | null;
      endDate: Date | null;
    };
  }>;
  rolePermissionGroup?: Array<{
    role: {
      id: number;
      name: string;
      description: string;
      isExternal: boolean;
      startDate: Date | null;
      endDate: Date | null;
    };
  }>;
  status: Status;
};

export type PermissionGroupResponse = PermissionGroupView & {
  permissions: Permission[];
};

export type UpdatedPermissionGroup = {
  id: number;
};
export type ArchivePermissionGroupRequestDto = {
  permissionGroupIds: Array<number>;
};

export type ArchivePermissionGroupResponseDto = {
  status: number;
  message: string;
};

export type ArchivePermissionGroupCheckDto = {
  id: number;
  archivedAt: Date | null;
}[];

interface Status {
  statusName: string;
  id: number;
}
