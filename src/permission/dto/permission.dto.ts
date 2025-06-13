import { Prisma } from '@prisma/client';

export type EditPermissionDto = {
  name: string;
  description: string;
  permissionGroupIds?: number[];
  roleIds?: number[];
  clientIds?: number[];
  statusId?: number;
  startDate?: Date | null | string;
  endDate: Date | null | string;
  menuIds?: number[];
  subMenuIds?: number[];
  updatedBy: number;
};

export type PermissionResponseDto = {
  id: number;
};
export type ValidPermissionGroupIds = {
  id: number;
}[];
export type AddPermissionBodyData = {
  startDate: Date;
  endDate: Date;
  name: string;
  permissionGroupIds?: number[];
  menuIds?: number[];
  subMenuIds?: number[];
  roleIds?: number[];
  clientIds?: number[];
  description: string;
  createdBy: number;
  updatedBy: number;
  cloneId?: number;
  type?: string;
};
export type AddPermissionCreatedData = {
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
export type PermissionData = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  description: string;
  status: Status;
  isArchived?: boolean;
  permissionGroupPermission: PermissionGroupPermission[];
  clientPermissions: ClientPermission[];
  rolePermission: RolePermission[];
  permissionMenu: MenuPermission[];
};
export type MenuPermission = {
  menu: Menu;
};
export type Menu = {
  id: number;
  name: string;
  parentMenuId: number | null;
};
export type RolePermission = {
  role: Role;
};
export type Role = {
  id: number;
  name: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
};
export type ClientPermission = {
  client: Client;
};
export type Client = {
  id: number;
  name: string;
  description: string | null;
  startDate: Date | null;
  endDate: Date | null;
};
export type PermissionGroupPermission = {
  permissionGroup: PermissionGroup;
};
export type PermissionGroup = {
  id: number;
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
};
export type ViewPermissionResponse = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  status: Status;
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  description: string;
  permissionGroups: PermissionGroup[];
  clients: Client[];
  roles: Role[];
  menus: Menu[];
  subMenus: Menu[];
};
export type ListPermissionBodyDto = {
  filter?: {
    isArchived?: number;
    status?: number[];
  };
  sortBy?: {
    field: string;
    order: string;
  };
  offset: number;
  limit: number;
  startDate?: Date;
  endDate?: Date;
  searchText?: string;
  startOfTodayDate: Date;
  endOfTodayDate: Date;
};
export type ListPermissionDto = {
  id: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  startDate: Date | null;
  endDate: Date | null;
  name: string;
  description: string;
}[];

export type ListPermissionResponseDataDto = {
  totalAmount: number;
  permissions: ListPermissionDto;
};

export type Permission = { id: number };

export type ViewShortPermissionsDto = {
  limit: number;
  offset: number;
  searchText?: string;
};

export type ShortPermissionsDto =
  | {
      id: number;
      name: string;
      description: string;
      startDate?: Date | null;
      endDate?: Date | null;
      status?: {
        id: number;
        statusName: string;
      };
    }[]
  | [];

export type ShortPermissionObjectDto = {
  id: number;
  name: string;
  description: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isActive?: boolean;
};

export type ViewShortPermissionsResponseDto = {
  permissions: ShortPermissionsDto;
  totalAmount: number;
};

export type PermissionList = {
  id: number;
  cloneId: number;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  startDate: Date;
  endDate: Date;
  name: string;
  description: string;
  archivedAt: Date;
  createdByProfile?: {
    firstName: string;
    lastName: string;
  };
  updatedByProfile?: {
    firstName: string;
    lastName: string;
  };
  status: {
    statusName: string;
    id: number;
  };
}[];

export type ListPermissionResponse = {
  totalAmount: number;
  permissions: PermissionList;
};

export type ArchivePermissionRequestDto = {
  permissionIds: Array<number>;
};

export type ArchivePermissionResponseDto = {
  status: number;
  message: string;
};

export type ArchivePermissionCheckDto = {
  id: number;
  archivedAt: Date | null;
}[];

export type SubMenuDto = {
  id: number;
  name: string;
};

export type MenuDto = {
  id: number;
  name: string;
  subMenus: SubMenuDto[];
};

export type OrderByCondition = Array<Prisma.permissionOrderByWithRelationInput>;

interface Status {
  statusName: string;
  id: number;
}
