import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Tooltip, message, Popconfirm } from 'antd';
import { queryDep, addDep, updateDep, deleteDep } from '../services';
import { connect, Dispatch, useAccess, Access } from 'umi';
import { ModelState } from '../model';
import CreateForm from './components/createForm';
import { Departments } from '../data';

interface DepartmentProps {
  dispatch: Dispatch;
  system: ModelState;
}

/**
 * 添加用户
 * @param fields 表格
 */
const handleAdd = async (fields: Departments) => {
  const hide = message.loading('正在添加');
  try {
    await addDep({ ...fields });
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
const handleUpdate = async (fields: Departments) => {
  const hide = message.loading('正在修改');
  try {
    await updateDep({ ...fields });
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
const handleDelete = async (fields: Departments) => {
  const hide = message.loading('正在删除');
  try {
    await deleteDep({ ...fields });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

const DepartmentManagement: React.FC<DepartmentProps> = (props) => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [isUpdate, handleIsUpdate] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState<Partial<Departments>>();
  let columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'departmentName'
    },
    {
      title: '排序',
      dataIndex: 'departmentOrder',
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Access accessible={access.canEditDep}>
            <Tooltip title='修改'>
              <Button type='primary' onClick={() => {
                handleIsUpdate(true);
                setStepFormValues(record);
                handleModalVisible(true);
              }}>修改</Button>
            </Tooltip>
          </Access>
          <Access accessible={access.canDeleteDep}>
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
  if (!access.canEditDep && !access.canDeleteDep) {
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

  const { dispatch, system }  = props;

  useEffect(() => {
    dispatch({
      type: 'system/queryDepTree',
    });
  }, []);

  return (
    <>
      <ProTable
        headerTitle='部门列表'
        actionRef={actionRef}
        rowKey='key'
        toolBarRender={(action, { selectedRows }) => [
          <Access accessible={access.canAddDep}>
            <Button type='primary' onClick={() => { handleModalVisible(true); handleIsUpdate(false); }}>
              新建
            </Button>
          </Access>,
        ]}
        columns={columns}
        request={queryDep}
        pagination={false}
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
              dispatch({
                type: 'system/queryDepTree',
              });
            }
          }}
          onCancel={() => { handleModalVisible(false); setStepFormValues({}); }}
          modalVisible={modalVisible}
          values={stepFormValues || {}}
          isUpdate={isUpdate}
          treeDatas={system.depTreeDatas || []}>
        </CreateForm>
      ) : null}
    </>
  );
};

export default connect(
  ({system}: {system: ModelState}) => ({
    system
  }),
)(DepartmentManagement);
