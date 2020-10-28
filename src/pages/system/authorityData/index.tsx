import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { useAccess, Access, Dispatch, ModelState, connect } from 'umi';
import { Tooltip, Button, Popconfirm, message } from 'antd';
import { AuthorityData } from '../data';
import CreateForm from './components/createForm';
import { addAuthorityData, updateAuthorityData, deleteAuthorityData, queryAuthorityData } from '../services';
import moment from 'moment';

interface AuthorityDataProps {
  dispatch: Dispatch;
  system: ModelState;
}

/**
 * 添加数据权限
 * @param fields 参数
 */
const handleAdd = async (fields: AuthorityData) => {
  const hide = message.loading('正在添加');
  try {
    await addAuthorityData({ ...fields });
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
 * 更新数据权限
 * @param fields 参数
 */
const handleUpdate = async (fields: AuthorityData) => {
  const hide = message.loading('正在修改');
  try {
    await updateAuthorityData({ ...fields });
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const handleDelete = async (fields: AuthorityData) => {
  const hide = message.loading('正在删除');
  try {
    await deleteAuthorityData(fields.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};


const AuthorityDataManagement: React.FC<{}> = (props) => {
  const access = useAccess();
  const actionRef = useRef<ActionType>();
  const [isUpdate, handleIsUpdate] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  let columns: ProColumns<any>[] = [
    {
      title: '权限类型',
      dataIndex: 'authorityDataTypeName'
    },
    // {
    //   title: '数据库表',
    //   dataIndex: 'tableName',
    //   hideInSearch: true
    // },
    {
      title: '表展示名称',
      dataIndex: 'tableDisplayName',
      hideInSearch: true
    },
    // {
    //   title: '字段名称',
    //   dataIndex: 'columnName',
    //   hideInSearch: true
    // },
    {
      title: '字段展示名称',
      dataIndex: 'columnDisplayName',
      hideInSearch: true
    },
    {
      title: '前端类型',
      dataIndex: 'frontColumnTypeName',
      hideInSearch: true
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (_, row) => (row.createTime ? <span>{moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')}</span> : null),
      hideInSearch: true
    },
    // {
    //   title: '接口类',
    //   dataIndex: 'serviceClass',
    //   hideInSearch: true
    // },
    // {
    //   title: '接口方法',
    //   dataIndex: 'serviceMethod',
    //   hideInSearch: true
    // },
    // {
    //   title: '接口参数',
    //   dataIndex: 'serviceParams',
    //   hideInSearch: true
    // },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <Access accessible={access.canEditAuthorityData}>
            <Tooltip title='修改'>
              <Button type='primary' onClick={() => {
                handleIsUpdate(true);
                setStepFormValues(record);
                handleModalVisible(true);
              }}>修改</Button>
            </Tooltip>
          </Access>
          <Access accessible={access.canDeleteAuthorityData}>
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

  if (!access.canEditAuthorityData && !access.canDeleteAuthorityData) {
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
        headerTitle='数据权限列表'
        actionRef={actionRef}
        rowKey='id'
        toolBarRender={() => [
          <Access accessible={access.canAddAuthorityData}>
            <Button type='primary' onClick={() => { handleModalVisible(true); handleIsUpdate(false); }}>
              新建
          </Button>
          </Access>
        ]}
        columns={columns}
        request={queryAuthorityData}
        rowSelection={{}}
        expandable={{
          expandedRowRender: (record) =>
            <div style={{ paddingLeft: 70 }}>
              <div style={{ fontWeight: 'bold', display: 'inline-block', width: 70, color: '#99a9bf' }}>接口类</div>{record.serviceClass}<br />
              <div style={{ fontWeight: 'bold', display: 'inline-block', width: 70, color: '#99a9bf' }}>接口方法</div>{record.serviceMethod}<br />
              <div style={{ fontWeight: 'bold', display: 'inline-block', width: 70, color: '#99a9bf' }}>接口参数</div>{record.serviceParams}
            </div>
        }}
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
)(AuthorityDataManagement);
