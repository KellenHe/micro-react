import { useContext } from 'react';
import { notification, ConfigProvider } from 'antd';
import { history, RequestConfig } from 'umi';
import { ResponseError } from 'umi-request';
import { queryCurrent, queryMenu } from './services/user';

export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  menus?: API.MenuDataItem[];
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/passport/login') {
    try {
      const results = await queryCurrent();
      const menuResults = await queryMenu();
      return {
        currentUser: results.data,
        menus: menuResults.data
      };
    } catch (error) {
      if (!(window as any).__POWERED_BY_QIANKUN__) {
        history.push('/passport/login');
      } else {
        (window as any).ngRouter.navigate(['/passport/login']);
      }
    }
  }
  return {
  };
}

const codeMessage: any = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

const localToken = localStorage.getItem('_token') || '';
const token: any = localToken ? JSON.parse(localToken) : {};

/**
 * 请求拦截器,添加前缀
 * @param url 请求的url
 */
const requestInterceptor = (url: any) => {
  let newUrl = url;
  if (!url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('/assets')) {
    newUrl = '/api' + url;
  }
  return {
    url: newUrl
  };
};

export const request: RequestConfig = {
  errorHandler,
  headers: {
    Authorization: `${token.token_type} ${token.token}`
  },
  requestInterceptors: [requestInterceptor]
};
