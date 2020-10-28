// https://umijs.org/config/
import { defineConfig } from 'umi';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  qiankun: {
    slave: {}
  },
  targets: {
    ie: 11,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      name: 'login',
      path: '/passport/login',
      component: './passport/login',
    },
    {
      path: '/',
      component: './layout',
      routes: [
        {
          path: '/system/user',
          name: '用户管理',
          icon: 'smile',
          component: './system/user',
        },
        {
          path: '/system/role',
          name: '角色管理',
          icon: 'smile',
          component: './system/role',
        },
        {
          path: '/system/department',
          name: 'DepartmentManagement',
          icon: 'smile',
          component: './system/department',
        },
        {
          path: '/system/menu',
          name: 'menuManagement',
          icon: 'smile',
          component: './system/menu',
        },
        {
          path: '/system/authority_data',
          name: 'AuthorityDataManagement',
          icon: 'smile',
          component: './system/authorityData',
        },
        {
          path: '/ops/task',
          name: 'TaskManagement',
          icon: 'smile',
          component: './ops/task',
        },
        {
          path: '/ops/database',
          name: 'databaseManagement',
          icon: 'smile',
          component: './ops/database'
        },
        {
          path: '/ops/server',
          name: 'serverManagement',
          icon: 'smile',
          component: './ops/server'
        },
        {
          path: '/ops/dict',
          name: 'dictManagement',
          icon: 'smile',
          component: './ops/dict'
        },
        {
          path: '/flow/config',
          name: 'ConfigManagement',
          icon: 'smile',
          component: './flow/config',
        },
        {
          path: '/',
          redirect: '/system/user',
        },
      ]
    },
    {
      component: './404',
    },
  ],
  theme: {
    'ant-prefix': 'cscs',
    'primary-color': '#0b68e6',
    'layout-header-height': '56px',
    'layout-header-background': '#fff',
    'layout-sider-background': '#1f3b72',
    'menu-dark-submenu-bg': '#0F295C',
    'menu-dark-bg': '#1F3B72',
    'menu-dark-item-active-bg': '#405C92'
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  base: '/'
});
