import { request } from 'umi';
import { TableListParams, RoleTableListItem, Departments } from './data.d';

export function queryDepTree() {
  return request('/department/basic/tree/-1');
}

export function queryDep(params: any) {
  return request('/department/basic/list', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export function addDep(params: Departments) {
  return request('/department/basic', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export function updateDep(params: Departments) {
  return request('/department/basic', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

export function deleteDep(params: Departments) {
  return request(`/department/basic/${params.id}`, {
    method: 'DELETE',
  });
}

export async function addUser(params: TableListParams) {
  return request('/user/basic', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateUser(params: TableListParams) {
  return request('/user/basic', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function queryUsers(params: any) {
  const msg = await request(`/user/basic/list?page=${params.current - 1}&size=${params.pageSize}`, {
    method: 'POST',
    data: {
      ...params
    }
  });

  return {
    ...msg,
    total: msg.page.totalCount
  };
}

export async function deleteUser(params: TableListParams) {
  return request(`/user/basic/${params.id}`, {
    method: 'DELETE',
  });
}

export async function queryMenu(params: any) {
  return request('/authority/menu/list', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function queryMenuList(params: any) {
  return request('/authority/menu/list/menu', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function updateMenu(params: any) {
  return request('/authority/menu', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

export async function addMenu(params: any) {
  return request('/authority/menu', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function deleteMenu(params: any) {
  return request(`/authority/menu/${params.id}`, {
    method: 'DELETE',
  });
}

export async function queryRoles(params: any) {
  const msg = await request(`/role/basic/list?page=${params.current - 1}&size=${params.pageSize}`, {
    method: 'POST',
    data: {
      ...params
    }
  });

  return {
    ...msg,
    total: msg.page.totalCount
  };
}

export async function addRole(params: any) {
  return request('/role/basic', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function updateRole(params: RoleTableListItem) {
  return request('/role/basic', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

export async function deleteRole(id: number) {
  return request(`/role/basic/${id}`, {
    method: 'DELETE',
  });
}

export async function queryDictByType(type: string) {
  return request(`/system/dict/basic/list/type/${type}`);
}

export async function queryDataRuleList(authorityDataTyped: string) {
  return request(`/authority/rule/config/list/${authorityDataTyped}`);
}

export async function addAuthorityData(params: any) {
  return request('/authority/rule/config', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function updateAuthorityData(params: any) {
  return request('/authority/rule/config', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

export async function deleteAuthorityData(id: number) {
  return request(`/authority/rule/config/${id}`, {
    method: 'DELETE'
  });
}

export async function queryAuthorityData(params: any) {
  const msg = await request(`/authority/rule/config/list?page=${params.current - 1}&size=${params.pageSize}`, {
    method: 'POST',
    data: {
      ...params
    }
  });

  return {
    ...msg,
    total: msg.page.totalCount
  }
}

export async function searchAuthorityData(keyword: string) {
  return request(`/api/authority/rule/config/search/${keyword}`, {
    method: 'GET'
  });
}

export async function getAuthorityDataDetail(id: number) {
  return request(`/authority/rule/config/detail/${id}`, {
    method: 'GET'
  });
}

