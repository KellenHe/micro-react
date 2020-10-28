import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Tooltip, message, Popconfirm } from 'antd';
import { connect, Dispatch, useAccess, Access } from 'umi';
import { ModelState } from '../model';
import { queryRoles, addRole, updateRole, deleteRole } from '../services';
import CreateForm, { FormValueType } from './components/createForm';
import { RoleTableListItem } from '../data';

interface RoleProps {
  dispatch: Dispatch;
  system: ModelState;
}

/**
 * 添加用户
 * @param fields 表格
 */
const handleAdd = async (fields: RoleTableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addRole({ ...fields });
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
const handleUpdate = async (fields: RoleTableListItem) => {
  const hide = message.loading('正在修改');
  try {
    await updateRole({ ...fields });
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
const handleDelete = async (fields: RoleTableListItem) => {
  const hide = message.loading('正在删除');
  try {
    await deleteRole(fields.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

const RoleManagement: React.FC<RoleProps> = (props) => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [isUpdate, handleIsUpdate] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  let columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'roleName'
    },
    {
      title: '类型',
      dataIndex: 'roleTyped',
      hideInSearch: true
    },
    {
      title: '编码',
      dataIndex: 'roleCode',
      hideInSearch: true
    },
    {
      title: '描述',
      dataIndex: 'roleDesc',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Access accessible={access.canEditRole}>
            <Tooltip title='修改'>
              <Button type='primary' onClick={() => {
                handleIsUpdate(true);
                setStepFormValues({ ...record, menuIds: record.menus ? record.menus.map((menu: any) => menu.id) : [] });
                handleModalVisible(true);
              }}>修改</Button>
            </Tooltip>
          </Access>
          <Access accessible={access.canDeleteRole}>
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
  if (!access.canEditRole && !access.canDeleteRole) {
    columns = columns.filter(c => c.title !== '操作');
  }

  const { dispatch, system }  = props;

  useEffect(() => {
    dispatch({
      type: 'system/queryRoleTypes',
    });
    dispatch({
      type: 'system/queryDataTypes',
    });
    dispatch({
      type: 'system/queryDataRuleExpress',
    });
  }, []);

  const confirm = async (fields: any) => {
    const success = await handleDelete(fields);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  return (
    <>
      <ProTable
        headerTitle='角色列表'
        actionRef={actionRef}
        rowKey='id'
        toolBarRender={(action, { selectedRows }) => [
          <Access accessible={access.canAddRole}>
            <Button type='primary' onClick={() => { handleModalVisible(true); handleIsUpdate(false); }}>
              新建
            </Button>
          </Access>,
        ]}
        columns={columns}
        request={queryRoles}
      />
      {(stepFormValues && Object.keys(stepFormValues).length) || !isUpdate ? (
        <CreateForm
          onSubmit={async (value: any) => {
            let success = false;
            if (isUpdate) {
              success = await handleUpdate(value);
            } else {
              success = await handleAdd(value);
            }
            if (success) {
              handleModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleModalVisible(false);
            setStepFormValues({});
          }}
          modalVisible={createModalVisible}
          values={stepFormValues}
          isUpdate={isUpdate}
          roleType={system.roleType || []}
          dataType={system.dataType || []}
          dataRuleExpress={system.dataRuleExpress || []}>
        </CreateForm>
      ) : null}
    </>
  );
};

export default connect(
  ({system}: {system: ModelState}) => ({
    system
  })
)(RoleManagement);
