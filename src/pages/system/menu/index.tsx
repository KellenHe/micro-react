import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Tooltip, message, Popconfirm } from 'antd';
import Icon from '@ant-design/icons';
import { PlusOutlined } from '@ant-design/icons';
import { useRequest, useAccess, Access } from 'umi';
import { queryMenu, addMenu, updateMenu, deleteMenu } from '../services';
import { iconMap } from '@/shared/components/iconMap';
import CreateForm from './components/createForm';

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加');
  try {
    await addMenu({
      menuIcon: fields.iconMap,
      menuUrl: fields.link,
      ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields 参数
 */
const handleUpdate = async (fields: any) => {
  const hide = message.loading('正在修改');
  try {
    await updateMenu({ ...fields });
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

/**
 * 删除节点
 * @param fields 参数
 */
const handleDelete = async (fields: any) => {
  const hide = message.loading('正在删除');
  try {
    await deleteMenu({ ...fields });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

const defaultFormValue: any = { authorityMenuTyped: 'catalog', menuOrder: 999 };

const MenuManagement: React.FC<{}> = () => {
  const access = useAccess();
  const [isUpdate, handleIsUpdate] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({...defaultFormValue});
  const actionRef = useRef<ActionType>();
  let columns: ProColumns<any>[] = [
    {
      title: '菜单标题',
      dataIndex: 'title'
    },
    {
      title: '图标',
      dataIndex: 'icon',
      hideInSearch: true,
      render: (_, record) => (
        <>
          <Icon component={iconMap[record.icon]} />
        </>
      )
    },
    {
      title: '排序',
      dataIndex: 'menuOrder',
      hideInSearch: true,
    },
    {
      title: '权限标识',
      dataIndex: 'menuCode',
      hideInSearch: true,
    },
    {
      title: '组件路径',
      dataIndex: 'link',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Access accessible={access.canEditMenu}>
            <Tooltip title='修改'>
              <Button type='primary' onClick={() => {
                handleIsUpdate(true);
                setStepFormValues(record);
                handleModalVisible(true);
              }}>修改</Button>
            </Tooltip>
          </Access>
          <Access accessible={access.canDeleteMenu}>
            <Popconfirm
              title='是否确认删除?'
              onConfirm={() => confirm(record)}
              okText='确定'
              cancelText='取消'
            >
              <Button type='primary' danger>删除</Button>
            </Popconfirm>
          </Access>
        </>
      ),
    },
  ];

  // 没有修改和删除权限，隐藏操作列
  if (!access.canEditMenu && !access.canDeleteMenu) {
    columns = columns.filter(c => c.title !== '操作');
  }

  const confirm = async (fields: any) => {
    const success = await handleDelete(fields);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const { data } = useRequest(() => {
    return queryMenu({});
  });

  return (
    <div>
      <ProTable
        headerTitle='菜单列表'
        actionRef={actionRef}
        rowKey='key'
        toolBarRender={(action, { selectedRows }) => [
          <Access accessible={access.canAddMenu}>
            <Button type='primary' onClick={() => { handleModalVisible(true); handleIsUpdate(false); }}>
              <PlusOutlined /> 新建
            </Button>
          </Access>,
        ]}
        columns={columns}
        request={queryMenu}
        pagination={false}
      />
      {(stepFormValues && stepFormValues.title) || !isUpdate ? (
      <CreateForm
        onCancel={() => { handleModalVisible(false); setStepFormValues({...defaultFormValue}); }}
        modalVisible={createModalVisible}
        onSubmit={async (value) => {
          let success = false;
          if (isUpdate) {
            success = await handleUpdate(value);
          } else {
            success = await handleAdd(value);
          }
          if (success) {
            handleModalVisible(false);
            setStepFormValues({...defaultFormValue});
            if (actionRef.current) {
              actionRef.current.reload();
            }
            message.info('添加成功，请重新登录刷新菜单！');
          }
        }}
        values={stepFormValues}
        menuList={data}>
      </CreateForm>
      ) : null}
    </div>
  );
};

export default MenuManagement;
