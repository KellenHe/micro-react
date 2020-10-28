import { request } from 'umi';
import { Tasks } from './data';

// 查询任务列表
export async function queryTaskList(params: any) {
  const msg = await request(`/quartz/job/list?page=${params.current - 1}&size=${params.pageSize}`, {
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

// 新建任务
export async function addTask(params: Tasks) {
  return request('/quartz/job', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

// 删除任务
export async function deleteTask(id: string) {
  return request(`/quartz/job/${id}`, {
    method: 'DELETE',
  });
}

// 编辑任务
export async function updateTask(params: Tasks) {
  return request('/quartz/job', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

// 查询任务详情
export async function queryTaskDetail(id: string) {
  return request(`/quartz/job/detail/${id}`);
}

// 启动任务
export function startTask(id: string) {
  return request(`/quartz/job/start/${id}`, {
    method: 'PUT'
  });
}

// 暂停任务
export function pauseTask(id: string) {
  return request(`/quartz/job/pause/${id}`, {
    method: 'PUT'
  });
}

// 恢复任务
export function resumeTask(id: string) {
  return request(`/quartz/job/resume/${id}`, {
    method: 'PUT'
  });
}

// 执行任务
export function runTask(id: string) {
  return request(`/quartz/job/run/${id}`, {
    method: 'PUT'
  });
}

// 字典获取
export async function queryDictByType(type: string) {
  return request(`/system/dict/basic/list/type/${type}`);
}

export async function addDatabase(params: any) {
  return request('/system/database/basic', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function updateDatabase(params: any) {
  return request('/system/database/basic', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

export async function deleteDatabase(id: number) {
  return request(`/system/database/basic/${id}`, {
    method: 'DELETE'
  });
}

export async function queryDatabase(params: any) {
  const msg = await request(`/system/database/basic/list?page=${params.current - 1}&size=${params.pageSize}`, {
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

export async function searchDatabase(keyword: string) {
  return request(`/system/database/basic/search/${keyword}`, {
    method: 'GET'
  });
}

export async function getDatabaseDetail(id: number) {
  return request(`/system/database/basic/detail/${id}`, {
    method: 'GET'
  });
}

export async function testDatabase(params: any) {
  return request(`/system/database/basic/test`, {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function addServer(params: any) {
  return request('/system/server/basic', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function updateServer(params: any) {
  return request('/system/server/basic', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

export async function deleteServer(id: number) {
  return request(`/system/server/basic/${id}`, {
    method: 'DELETE'
  });
}

export async function queryServer(params: any) {
  const msg = await request(`/system/server/basic/list?page=${params.current - 1}&size=${params.pageSize}`, {
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

export async function searchServer(keyword: string) {
  return request(`/system/server/basic/search/${keyword}`, {
    method: 'GET'
  });
}

export async function getServerDetail(id: number) {
  return request(`/system/server/basic/detail/${id}`, {
    method: 'GET'
  });
}

export async function testServer(params: any) {
  return request(`/system/server/basic/test`, {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function addDictType(params: any) {
  return request('/system/dict/type', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function updateDictType(params: any) {
  return request('/system/dict/type', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

export async function deleteDictType(id: number) {
  return request(`/system/dict/type/${id}`, {
    method: 'DELETE'
  });
}

export async function queryDictType(params: any) {
  const msg = await request(`/system/dict/type/list?page=${params.current - 1}&size=${params.pageSize}`, {
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

export async function searchDictType(keyword: string) {
  return request(`/system/dict/type/search/${keyword}`, {
    method: 'GET'
  });
}

export async function getDictTypeDetail(id: number) {
  return request(`/system/dict/type/detail/${id}`, {
    method: 'GET'
  });
}

export async function addDict(params: any) {
  return request('/system/dict/basic', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function updateDict(params: any) {
  return request('/system/dict/basic', {
    method: 'PUT',
    data: {
      ...params
    }
  });
}

export async function deleteDict(id: number) {
  return request(`/system/dict/basic/${id}`, {
    method: 'DELETE'
  });
}

export async function queryDict(params: any) {
  const msg = await request(`/system/dict/basic/list?page=${params.current - 1}&size=${params.pageSize}`, {
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

export async function searchDict(keyword: string) {
  return request(`/system/dict/basic/search/${keyword}`, {
    method: 'GET'
  });
}

export async function getDictDetail(id: number) {
  return request(`/system/dict/basic/detail/${id}`, {
    method: 'GET'
  });
}

export async function deleteFile(id: number) {
  return request(`/file/basic/${id}`, {
    method: 'DELETE'
  });
}

export async function queryFile(params: any) {
  const msg = await request(`/file/basic/list?page=${params.current - 1}&size=${params.pageSize}`, {
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
