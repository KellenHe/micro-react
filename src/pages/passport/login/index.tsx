import { Alert, message } from 'antd';
import React, { useState } from 'react';
import { useModel } from 'umi';
import { getPageQuery } from '@/utils/utils';
import { Form, Input, Button } from 'antd';
import { LoginParamsType, fakeAccountLogin } from './services';
import styles from './style.less';

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const replaceGoto = () => {
  const urlParams = new URL(window.location.href);
  const params = getPageQuery();
  let { redirect } = params as { redirect: string };
  if (redirect) {
    const redirectUrlParams = new URL(redirect);
    if (redirectUrlParams.origin === urlParams.origin) {
      redirect = redirect.substr(urlParams.origin.length);
      if (redirect.match(/^\/.*#/)) {
        redirect = redirect.substr(redirect.indexOf('#'));
      }
    } else {
      window.location.href = '/';
      return;
    }
  }
  window.location.href = urlParams.href.split(urlParams.pathname)[0] + (redirect || '/');
};

const setToken = (tokenObj: any) => {
  tokenObj.token = tokenObj.access_token;
  localStorage.setItem('_token', JSON.stringify(tokenObj));
};

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login: React.FC<{}> = () => {
  const [submitting, setSubmitting] = useState(false);

  const { refresh } = useModel('@@initialState');

  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitting(true);
    try {
      // 登录
      const bodyOb = {
        username: values.username,
        password: values.password,
        client_id: 'client',
        client_secret: 'secret',
        login_type: 'simple:web',
        grant_type: 'password',
      };
      const msg = await fakeAccountLogin(bodyOb);
      if (msg.access_token) {
        message.success('登录成功！');
        setToken(msg);
        replaceGoto();
        setTimeout(() => {
          refresh();
        }, 0);
        return;
      }
    } catch (error) {
      message.error('登录失败，请重试！');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.main}>
          <Form
            {...layout}
            name='basic'
            initialValues={{ remember: true }}
            onFinish={handleSubmit}
          >
            <Form.Item
              label='Username'
              name='username'
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type='primary' htmlType='submit' loading={submitting}>
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
