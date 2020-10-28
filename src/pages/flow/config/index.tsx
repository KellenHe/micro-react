import React, { useState, useRef, useEffect } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Button, Tooltip, message, Popconfirm, Upload } from 'antd';
import { connect, Dispatch, useAccess, Access } from 'umi';
import moment from 'moment';
import { UploadOutlined } from '@ant-design/icons';
import CreateForm from './components/CreateForm';

export interface TableListItem {
  flowTyped: string;
  flowName: string;
  flowStatus: string;
  flowVersion: string;
  flowFile: string;
  createTime: number;
}

const ConfigManagement: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const columns: ProColumns<any>[] = [
    {
      title: '流程类型',
      dataIndex: 'flowTyped',
      valueEnum: {
        zt: {
          text: '主体信评',
        },
        zq: {
          text: '债券信评',
        },
        add: {
          text: '投资池新增',
        },
        edit: {
          text: '投资池编辑',
        },
        delete: {
          text: '投资池删除',
        },
        xe: {
          text: '限额新增',
        },
      },
    },
    {
      title: '流程名称',
      dataIndex: 'flowName',
    },
    {
      title: '流程状态',
      dataIndex: 'flowStatus',
      hideInSearch: true,
      valueEnum: {
        csh: {
          text: '初始化',
        },
        yfb: {
          text: '已发布',
        },
        yqx: {
          text: '已取消',
        }
      },
    },
    {
      title: '流程版本',
      dataIndex: 'flowVersion',
      hideInSearch: true
    },
    {
      title: '流程文件名称',
      dataIndex: 'flowFile',
      hideInSearch: true
    },
    {
      title: '创建日期',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      render: (_, row) => <span>{moment(row.createTime).format('YYYY-MM-DD')}</span>,
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, row) => (
        <div>
          <Button type='primary'>编辑</Button>
          <Upload {...props} showUploadList={false}>
            <Button type='primary' icon={<UploadOutlined />} style={{margin: '0 8px'}}>上传</Button>
          </Upload>
          <Access accessible={row.flowStatus !== 'yfb'}>
            <Button type='primary'>发布</Button>
          </Access>
          <Access accessible={row.flowStatus === 'yfb'}>
            <Button type='primary'>取消</Button>
          </Access>
          <Button type='primary'>删除</Button>
        </div>
      ),
    },
  ];

  const props = {
    name: 'file',
    action: '#',
    headers: {
      authorization: 'authorization-text',
    }
  };

  const tableListDataSource: TableListItem[] = [];

  const flowTyped = ['zt', 'zq', 'add', 'edit', 'delete', 'xe'];
  const flowStatus = ['csh', 'yfb', 'yqx'];
  for (let i = 0; i < 5; i += 1) {
    tableListDataSource.push({
      flowTyped: flowTyped[Math.floor(Math.random() * 10) % 6],
      flowName: '流程' + i,
      flowStatus: flowStatus[Math.floor(Math.random() * 10) % 3],
      flowVersion: 'version_' + i,
      flowFile: '文件' + i,
      createTime: Date.now()
    });
  }

  return (
    <>
      <ProTable
        headerTitle='流程列表'
        actionRef={actionRef}
        rowKey='id'
        toolBarRender={() => [
          <Button type='primary' onClick={() => { handleModalVisible(true); }}>
            新建
          </Button>
        ]}
        columns={columns}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          return Promise.resolve({
            data: tableListDataSource,
            success: true,
          });
        }}
      />
        <CreateForm
          onSubmit={() => {

          }}
          onCancel={() => { handleModalVisible(false); }}
          modalVisible={createModalVisible}>
        </CreateForm>
    </>
  );
};

export default ConfigManagement;
