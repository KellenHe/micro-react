
export interface TableListItem {
  key: number;
  userName: string;
  alias: string;
  sex: number;
  phone: string;
  email: string;
  departments: Departments[];
  roles: Roles[];
  status: string;
  createTime: Date;
  disabled?: boolean;
}

export interface Roles {
  id: string;
  roleName: string;
  roleCode: string;
  roleTyped: string;
}

export interface Departments {
  id: string;
  departmentName: string;
  departmentOrder: string;
  parentId: string;
}

export interface TableListParams {
  status?: string;
  name?: string;
  desc?: string;
  id?: string;
  pageSize?: number;
  current?: number;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}

export interface RoleTableListItem {
  id: number;
  roleName: string;
  roleCode: string;
  roleTyped: string;
  roleDesc: string;
  menuIds: number[];
  ruleDtos: any[];
  rules: any[];
}

export interface AuthorityData {
  id: number;
  authorityDataTyped: string;
  tableName: string;
  columnName: string;
  columnDisplayName: string;
  frontColumnTyped: string;
  serviceClass: string;
  serviceMethod: string;
  serviceParams: string;
}
