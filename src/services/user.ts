import { request } from 'umi';

/**
 * 查询当前登录用户的信息
 */
export async function queryCurrent() {
  return request('/user/basic/current');
}

/**
 * 查询菜单信息
 */
export async function queryMenu() {
  return request('/authority/menu/list/menu', {
    method: 'POST',
    data: {
      authorityMenuTyped: 'menu'
    }
  });
}
