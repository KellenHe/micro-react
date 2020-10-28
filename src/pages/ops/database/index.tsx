import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { queryDatabase, addDatabase, updateDatabase, deleteDatabase } from '../services';
import { useAccess, Access, Dispatch, ModelState, connect } from 'umi';
import { Tooltip, Button, Popconfirm, message } from 'antd';
import { Datatable } from '../data';
import CreateForm from './components/createForm';
import moment from 'moment';

interface DatabaseProps {
  dispatch: Dispatch;
  system: ModelState;
}

/**
 * 添加数据库
 * @param fields 参数
 */
const handleAdd = async (fields: Datatable) => {
  const hide = message.loading('正在添加');
  try {
    await addDatabase({ ...fields });
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
 * 更新数据库
 * @param fields 参数
 */
const handleUpdate = async (fields: Datatable) => {
  const hide = message.loading('正在修改');
  try {
    await updateDatabase({ ...fields });
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const handleDelete = async (fields: Datatable) => {
  const hide = message.loading('正在删除');
  try {
    await deleteDatabase(fields.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

const DatabaseManagement: React.FC<{}> = (props) => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [isUpdate, handleIsUpdate] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  let columns: ProColumns<any>[] = [
    {
      title: '数据库名称',
      dataIndex: 'databaseName'
    },
    {
      title: '连接地址',
      dataIndex: 'jdbcUrl',
      hideInSearch: true
    },
    {
      title: '用户名',
      dataIndex: 'connectAccount',
      hideInSearch: true
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (_, row) => (row.createTime ? <span>{moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')}</span> : null),
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Access accessible={access.canEditDatabase}>
            <Tooltip title='修改'>
              <Button type='primary' onClick={() => {
                handleIsUpdate(true);
                setStepFormValues(record);
                handleModalVisible(true);
              }}>修改</Button>
            </Tooltip>
          </Access>
          <Access accessible={access.canDeleteDatabase}>
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
      )
    }
  ];

  if (!access.canEditDatabase && !access.canDeleteDatabase) {
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

  const { dispatch, system } = props;

  return (
    <>
      <ProTable
        headerTitle='数据库列表'
        actionRef={actionRef}
        rowKey='id'
        toolBarRender={() => [
          <Access accessible={access.canAddDatabase}>
            <Button type='primary' onClick={() => { handleModalVisible(true); handleIsUpdate(false); }}>
              新建
            </Button>
          </Access>
        ]}
        columns={columns}
        request={queryDatabase}
        rowSelection={{}}
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
          values={stepFormValues}
          modalVisible={createModalVisible}
          isUpdate={isUpdate}
        >
        </CreateForm>
      ) : null}
    </>
  );
};

export default connect(
  ({ system }: { system: ModelState }) => ({
    system
  }),
)(DatabaseManagement);
