declare namespace API {
  export interface CurrentUser {
    avatar?: string;
    username?: string;
    nickName?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userId?: string;
    access?: 'user' | 'guest' | 'admin';
    permissions: string[];
    unreadCount?: number;
  }

  export interface MenuDataItem {
    id?: number;
    parentId?: string;
    authorityMenuTyped?: string;
    icon?: string;
    link?: string;
    key?: string;
    title?: string;
    children?: MenuDataItem[];
  }
}
