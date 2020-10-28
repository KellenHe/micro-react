import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { addServer, deleteServer, queryServer, updateServer } from '../services';
import { useAccess, Access, Dispatch, ModelState, connect } from 'umi';
import { Tooltip, Button, Popconfirm, message } from 'antd';
import { Server } from '../data';
import CreateForm from './components/createForm';
import moment from 'moment';

interface ServerProps {
  dispatch: Dispatch;
  system: ModelState;
}

/**
 * 添加服务器
 * @param fields 参数
 */
const handleAdd = async (fields: Server) => {
  const hide = message.loading('正在添加');
  try {
    await addServer({ ...fields });
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
const handleUpdate = async (fields: Server) => {
  const hide = message.loading('正在修改');
  try {
    await updateServer({ ...fields });
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const handleDelete = async (fields: Server) => {
  const hide = message.loading('正在删除');
  try {
    await deleteServer(fields.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

const ServerManagement: React.FC<{}> = (props) => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [isUpdate, handleIsUpdate] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  let columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'serverName'
    },
    {
      title: 'IP地址',
      dataIndex: 'connectIp',
      hideInSearch: true
    },
    {
      title: '端口',
      dataIndex: 'connectPort',
      hideInSearch: true
    },
    {
      title: '账号',
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
          <Access accessible={access.canEditServer}>
            <Tooltip title='修改'>
              <Button type='primary' onClick={() => {
                handleIsUpdate(true);
                setStepFormValues(record);
                handleModalVisible(true);
              }}>修改</Button>
            </Tooltip>
          </Access>
          <Access accessible={access.canDeleteServer}>
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

  if (!access.canEditServer && !access.canDeleteServer) {
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
        headerTitle='服务器列表'
        actionRef={actionRef}
        rowKey='id'
        toolBarRender={() => [
          <Access accessible={access.canAddServer}>
            <Button type='primary' onClick={() => { handleModalVisible(true); handleIsUpdate(false); }}>
              新建
            </Button>
          </Access>
        ]}
        columns={columns}
        request={queryServer}
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
)(ServerManagement);
