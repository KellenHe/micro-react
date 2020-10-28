import React, { useState } from 'react';
import { Layout, Menu, ConfigProvider } from 'antd';
import logoSvg from '../../../public/logo.svg';
import logoFullSvg from '../../../public/logo-full.svg';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { useModel, Link } from 'umi';
import { iconMap } from '@/shared/components/iconMap';
import styles from './index.less';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const BasicLayout: React.FC = (props) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const deepMenus = (menus: API.MenuDataItem[]) => {
    return menus.map((menu: API.MenuDataItem) => {
      if (menu.children && menu.children?.length > 0) {
        return (
          <SubMenu key={menu.key} icon={menu.icon ? iconMap[menu.icon] : ''} title={menu.title}>
            {deepMenus(menu.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={menu.key} icon={menu.icon ? iconMap[menu.icon] : ''}>
            <Link to={menu.link || ''}>{menu.title}</Link>
          </Menu.Item>
        );
      }
    });
  }

  const renderMenus = () => {
    const { initialState } = useModel('@@initialState');
    const menus = initialState?.menus;

    return (
      <Menu theme='dark' mode='inline'>
        {deepMenus(menus || [])}
      </Menu>
    );
  }

  const renderContent = () => {
    const { children } = props;
    if (!(window as any).__POWERED_BY_QIANKUN__) {
      return (
        <Layout>
          <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className={styles.logo}>
              <a>
                <img src={logoSvg} style={ collapsed ? {maxHeight: '30px'} : {display: 'none'}} />
                <img src={logoFullSvg} style={ collapsed ? {display: 'none'} : {maxHeight: '30px'}} />
              </a>
            </div>
            {renderMenus()}
          </Sider>
          <Layout>
            <Header className="cscs-header">
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: styles.trigger,
                onClick: () => setCollapsed,
              })}
            </Header>
            <Content style={{ padding: '0px 24px' }}>
              {children}
            </Content>
          </Layout>
        </Layout>
      );
    } else {
      return (
        <>{children}</>
      );
    }
  }

  return (
    <ConfigProvider prefixCls='cscs'>
      {renderContent()}
    </ConfigProvider>
  );
}

export default BasicLayout;
