import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  grant_type: string;
  login_type: string;
  client_secret: string;
  client_id: string;
}

export async function fakeAccountLogin(infos: LoginParamsType) {
  return request('/oauth/token', {
    method: 'GET',
    params: infos
  });
}
