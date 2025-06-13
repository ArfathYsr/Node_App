import { DateTime } from 'luxon';

export type CreateRoleDto = {
  name: string;
  description: string;
  functionalAreaId: number;
  startDate: Date | null;
  endDate: Date | null;
  isExternal: boolean;
  createdBy: number;
  updatedBy: number;
  statusId: number;
  permissionGroupIds?: number[];
  permissionIds?: number[];
  clientIds?: number[];
  cloneId?: number | null;
  type?: string;
  roleCategoryIds?: number[];
  roleCriteriaDatas?: {
    roleCriteriaId: number;
    roleCriteriaResponse: string;
  }[];
};

export type CreateRoleDataToDbDto = {
  createdBy: number;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  functionalAreaId: number;
  name: string;
  description: string;
  isExternal: boolean;
  statusId: number;
  permissionGroupIds?: number[];
  permissionIds?: number[];
  clientIds?: number[];
  roleCategoryIds?: number[];
  roleCriteriaDatas?: {
    roleCriteriaId: number;
    roleCriteriaResponse: string;
  }[];
};
export type CreateRoleResponseDto = {
  role: {
    id: number;
  };
};

export type RoleListDataToDbDto = {
  filter?: {
    roles?: number[];
    functionalAreas?: number[];
    statusIds?: number[];
    roleTypes?: string[];
    isArchived?: number;
  };
  sortBy: {
    field: string;
    order: string;
  };
  startDate: Date;
  endDate: Date;
  offset: number;
  limit: number;
  searchText?: string;
  startOfTodayDate: DateTime<true>;
  endOfTodayDate: DateTime<true>;
};

export type RoleDataResponseDto = {
  id: number;
  updatedAt: Date;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  functionalAreaId: number;
  name: string;
  description: string;
  isExternal: boolean;
  functionalArea?: {
    name: string;
  };
};

export type RoleListDataResponseDto = {
  roles: Array<{
    id: number;
    name: string;
    description: string;
    functionalAreaId: number;
    functionalAreaName?: string;
    isExternal: boolean;
    startDate: Date | null;
    endDate: Date | null;
    updatedAt: Date;
    updatedBy: number;
    statusId: number;
    userAmount: number;
    archivedAt: Date | null;
  }>;
  totalAmount: number;
  message?: string;
};

export type ViewRoleDto = {
  id: number;
  updatedAt: Date;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  functionalAreaId: number;
  permissionGroupName?: string | null;
  name: string;
  description: string;
  isExternal: boolean;
  functionalArea?: {
    name: string;
  };
  archivedAt: Date | null;
  statusId: number;
};

export type ViewRoleDtoWithPermissionGroup = ViewRoleDto & {
  rolePermissionGroup: {
    permissionGroup: {
      id: number;
      name: string;
      description: string;
      startDate: Date | null;
      endDate: Date | null;
    };
  }[];
  roleCategoryAlignment: {
    roleId: number;
    roleCategoryId: number;
    roleCategory: {
      id: number;
      roleCategoryName: string;
    };
  }[];
  roleCriteriaAlignment: {
    roleId: number;
    roleCriteriaId: number;
    roleCriteria: {
      id: number;
      roleCriteriaName: string;
    };
    roleCriteriaResponse: string;
  }[];
  roleClient: {
    client: {
      id: number;
      name: string;
      startDate: Date | null;
      endDate: Date | null;
      status: string;
    };
  }[];
};

export type ViewRoleDtowithpermissionAndPermissionGroup =
  ViewRoleDtoWithPermissionGroup & {
    rolePermission: {
      permission: {
        id: number;
        name: string;
        description: string;
        startDate: Date | null;
        endDate: Date | null;
      };
    }[];
  };

export type ViewRoleResponseDto =
  ViewRoleDtowithpermissionAndPermissionGroup & {
    functionalAreaName: string;
    statusId?: number;
    roleCategory: {
      roleId: number;
      roleCategoryId: number;
      roleCategory: {
        id: number;
        roleCategoryName: string;
      };
    }[];
    roleCriteria: {
      roleId: number;
      roleCriteriaId: number;
      roleCriteria: {
        id: number;
        roleCriteriaName: string;
      };
      roleCriteriaResponse: string;
    }[];
    roleClient: {
      client: {
        id: number;
        name: string;
        startDate?: Date | null;
        endDate?: Date | null;
        status: string;
      };
    }[];
  };

export type ViewRoleByIdDataResponseDto = {
  role: ViewRoleDto & {
    permissionGroups: {
      id: number;
      name: string;
      description: string;
      startDate: Date | null;
      endDate: Date | null;
    }[];
  } & {
    Permission: {
      id: number;
      name: string;
      description: string;
      startDate: Date | null;
      endDate: Date | null;
    }[];
  };
};

export type EditRoleDto = {
  name: string;
  description: string;
  functionalAreaId: number;
  permissionGroupIds?: number[];
  permissionIds: number[];
  clientIds: number[];
  startDate: string | null;
  endDate: string | null;
  isExternal: boolean;
  updatedBy: number;
  statusId: number;
  previousName?: string;
  roleCategoryIds?: number[];
  roleCriteriaDatas?: {
    roleCriteriaId: number;
    roleCriteriaResponse: string;
  }[];
};

export type EditRoleResponseDto = {
  role: {
    id: number;
  };
};

export type RoleListDataResponseRawDto = {
  id: number;
  name: string;
  description: string;
  functionalAreaId: number;
  functionalAreaName: string;
  isExternal: boolean;
  startDate: Date | null;
  endDate: Date | null;
  updatedAt: Date;
  updatedBy: number;
  isActive: boolean;
  userAmount: number;
  createdAt: Date;
  createdBy: number;
  createdByFirstName: string;
  createdByLastName: string;
  updatedByFirstName: string;
  updatedByLastName: string;
}[];

export type Role = { id: number };

export type RolePermissionGroupListDataToDbDto = {
  roleId: number;
  offset: number;
  limit: number;
  searchText?: string;
  startOfTodayDate: DateTime<true>;
  endOfTodayDate: DateTime<true>;
};

export type RolePermissionGroupListDataResponseDto = {
  permissionGroups: Array<{
    id: number;
    name: string;
    description: string;
    startDate?: Date | null;
    endDate?: Date | null;
    isActive?: boolean;
  }>;
  totalAmount: number;
};

export type RolePermissionGroupsDto =
  | {
      permissionGroup: {
        id: number;
        name: string;
        description: string;
        startDate: Date | null;
        endDate: Date | null;
      };
    }[]
  | null;

export type RoleArchiveDto = {
  roleIds: Array<number>;
  unArchive: boolean;
};

export type RoleArchiveResponseDto = {
  message: string;
};
export type RoleShortListDataToDbDto = {
  searchText?: string;
};

export type RoleShortListDataResponseDto = Array<{
  id: number;
  name: string;
}>;

export type RolePermissionResponseDto =
  | {
      permission: {
        id: number;
        name: string;
        description: string;
        startDate?: Date | null;
        endDate?: Date | null;
      };
    }[]
  | null;

export type PermissionGroupRolesResponseDto = {
  role: {
    id: number;
    name: string;
    description?: string;
    isExternal: boolean;
    statusId: number;
    startDate: Date | null;
    endDate: Date | null;
  }[];
} | null;

export type PermissionGroupRolesDto =
  | {
      role: {
        id: number;
        name: string;
        description?: string;
        statusId: number;
        isExternal: boolean;
        startDate: Date | null;
        endDate: Date | null;
      };
    }[]
  | null;

export type RolePermissionGroupIdsDto = {
  roleId: number;
  permissionGroupIds: number[];
};

export type SelectDto = {
  select: {
    id: boolean;
    name: boolean;
    description: boolean;
    startDate: boolean;
    endDate: boolean;
  };
};

export type Permission = {
  id: number;
  name: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
};

export type PermissionGroup = {
  id: number;
  name: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
};

export type Client = {
  id: number;
  name: string;
  description: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
};

export type RolePermission = {
  permission: Permission;
};

export type RolePermissionGroup = {
  permissionGroup: PermissionGroup;
};

export type RoleClient = {
  client: Client;
};

export type RoleAdditionalDataResponseDto = {
  rolePermission: RolePermission[];
  rolePermissionGroup: RolePermissionGroup[];
  roleClient: RoleClient[];
};
export type RoleCategoryDto = {
  id: number;
  roleCategoryName: string;
};

export type RoleCriteriaDto = {
  id: number;
  roleCriteriaName: string;
};
export type CreateRoleCategoryAlignmentDTO = {
  roleId: number;
  roleCategoryId: number;
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
  cloneId?: number | null;
  type?: string;
};

export type CreateRoleCriteriaAlignmentDTO = {
  roleId: number;
  roleCriteriaId: number;
  roleCriteriaResponse: string; // yes or no
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
  cloneId?: number | null;
  type?: string;
};

export type RoleCategoryCriteriaAlignment = {
  roleCategoryIds: CreateRoleCategoryAlignmentDTO[];
  roleCriteriaIds: CreateRoleCriteriaAlignmentDTO[];
  createdBy: number;
  roleId: number;
  cloneId?: number | null;
  type?: string;
};

export type EditRoleCategoryAlignmentDTO = {
  roleId: number;
  roleCategoryIds: number[];
  updatedBy: number;
  isActive: boolean;
};
export type EditRoleCriteriaAlignmentDTO = {
  roleCriteriaId: number;
  roleCriteriaResponse: string;
  updatedBy: number;
  isActive: boolean;
};
export type EditRoleCategoryCriteriaAlignment = {
  roleId: number;
  roleCategory: number[];
  roleCriteria: EditRoleCriteriaAlignmentDTO[];
  updatedBy: number;
};

export type ExistingRoleDto = {
  createdBy: number;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  cloneId: number | null;
  description: string;
  functionalAreaId: number;
  statusId: number;
  archivedAt: Date | null;
};
export type FormatPermissionDto = {
  id: number;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  // isActive: boolean;
};
export type PermissionGroupDto = {
  id: number;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
};
export type PermissionRolesDto = {
  id: number;
  name: string;
  description?: string;
  statusId: number;
  isExternal: boolean;
  startDate: Date | null;
  endDate: Date | null;
};

export type ExistingClientDto = {
  id: number;
  updatedAt: Date;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  functionalAreaId: number;
  name: string;
  description: string;
  isExternal: boolean;
  archivedAt: Date | null;
  statusId: number;
  createdAt: Date;
  createdBy: number;
  cloneId: number | null;
};

export type RoleDto = { role: { id: number } };
export type CriteriaAlignmentsDto = {
  roleId: number;
  roleCriteriaId: number;
  roleCriteriaResponse: string;
  createdBy: number;
  updatedBy: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
export type NewRoleDto = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  functionalAreaId: number;
  name: string;
  cloneId: number | null;
  description: string;
  isExternal: boolean;
  statusId: number;
  archivedAt: Date | null;
};
export type NewPermissionDto = {
  roleId: number;
  permissionId: number;
  createdBy: number;
  updatedBy: number;
};
export type UnalignedPermissionGroupsDto = {
  id: number;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
};
export type RolelistDto = {
  name: string;
  id: number;
};

interface Profile {
  firstName: string;
  lastName: string;
}

interface FunctionalArea {
  name: string;
}

interface Count {
  profileRole: number;
}

export type GetRoleListDto = {
  id: number;
  name: string;
  description: string;
  functionalAreaId: number;
  isExternal: boolean;
  startDate: Date | null;
  endDate: Date | null;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  statusId: number;
  functionalArea: FunctionalArea;
  createdByProfile: Profile;
  updatedByProfile: Profile;
  archivedAt: Date | null;
  status: Status;
  _count: Count;
};

export type UpdatedRoleListDto = {
  id: number;
  name: string;
  description: string;
  functionalAreaId: number;
  functionalAreaName?: string;
  isExternal: boolean;
  createdAt: Date;
  createdBy: number;
  createdByProfile?: { firstName: string; lastName: string };
  updatedAt: Date;
  updatedBy: number;
  updatedByProfile?: { firstName: string; lastName: string };
  startDate: Date | null;
  endDate: Date | null;
  userAmount: number;
  archivedAt: Date | null;
  statusId: number;
  statusName?: string;
};

export type RoleObjDto = {
  externalStatus: any;
  updatedByLastName: string;
  updatedByFirstName: string;
  createdByLastName: string;
  createdByFirstName: string;
  id: number;
  name: string;
  description: string;
  functionalAreaId: number;
  functionalAreaName?: string;
  isExternal: boolean;
  createdAt: Date;
  createdBy: number;
  createdByProfile?: { firstName: string; lastName: string };
  updatedAt: Date;
  updatedBy: number;
  updatedByProfile?: { firstName: string; lastName: string };
  startDate: Date | null;
  endDate: Date | null;
  userAmount: number;
  archivedAt: Date | null;
  statusId: number;
  statusName?: string;
};

export type AvailablePermissionGroupsDto = {
  id: number;
};

export type RoleCriteriaAlignmentDTO = {
  roleCriteriaId: number;
  roleCriteriaResponse: string;
};
interface Status {
  statusName: string;
}

export type RoleListCount = [{ count: number }];
