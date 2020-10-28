import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { useAccess, Access, Dispatch, ModelState, connect } from 'umi';
import { Tooltip, Button, Popconfirm, message, Tabs, Alert } from 'antd';
import { addDictType, updateDictType, deleteDictType, addDict, updateDict, deleteDict, queryDictType, queryDict } from '../services';
import { DictType, Dict } from '../data';
import CreateDictTypeForm from './components/createDictTypeForm';
import CreateDictForm from './components/createDictForm';
import moment from 'moment';

interface DictProps {
  dispatch: Dispatch;
  system: ModelState;
}

const handleAddDictType = async (fields: DictType) => {
  const hide = message.loading('正在添加');
  try {
    await addDictType({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const handleUpdateDictType = async (fields: DictType) => {
  const hide = message.loading('正在修改');
  try {
    await updateDictType({ ...fields });
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const handleDeleteDictType = async (fields: DictType) => {
  const hide = message.loading('正在删除');
  try {
    await deleteDictType(fields.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

const handleAddDict = async (fields: Dict) => {
  const hide = message.loading('正在添加');
  try {
    await addDict({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const handleUpdateDict = async (fields: Dict) => {
  const hide = message.loading('正在修改');
  try {
    await updateDict({ ...fields });
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

const handleDeleteDict = async (fields: Dict) => {
  const hide = message.loading('正在删除');
  try {
    await deleteDict(fields.id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

const { TabPane } = Tabs;

const DictManagement: React.FC<{}> = (props) => {
  const access = useAccess();
  const [isDictTypeUpdate, handleIsDictTypeUpdate] = useState<boolean>(false);
  const [isDictUpdate, handleIsDictUpdate] = useState<boolean>(false);
  const [createDictTypeModalVisible, handleDictTypeModalVisible] = useState<boolean>(false);
  const [createDictModalVisible, handleDictModalVisible] = useState<boolean>(false);
  const [dictTypeFormValues, setDictTypeFormValues] = useState({});
  const [dictFormValues, setDictFormValues] = useState({});
  const [activeKey, setActiveKey] = useState<string>('1');
  const [searchDictType, setSearchDictType] = useState<string>();
  const actionDictTypeRef = useRef<ActionType>();
  const actionDictRef = useRef<ActionType>();
  let dictTypeColumns: ProColumns<any>[] = [
    {
      title: '字典类型编码',
      dataIndex: 'typeCode',
      render: (_, record) => (
        <a onClick={() => {
          setActiveKey('2');
          setSearchDictType(String(_));
          if (actionDictRef.current) {
            actionDictRef.current.reload();
          }
        }}>{_}</a>
      )
    },
    {
      title: '字典类型名称',
      dataIndex: 'typeName',
      hideInSearch: true
    },
    {
      title: '字典类型描述',
      dataIndex: 'typeDesc',
      hideInSearch: true
    },
    {
      title: '创建时间',
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
          <Access accessible={access.canEditDict}>
            <Tooltip title='修改'>
              <Button type='primary' onClick={() => {
                handleIsDictTypeUpdate(true);
                setDictTypeFormValues(record);
                handleDictTypeModalVisible(true);
              }}>修改</Button>
            </Tooltip>
          </Access>
          <Access accessible={access.canDeleteDict}>
            <Popconfirm
              title='是否确认删除?'
              onConfirm={() => confirmDictType(record)}
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

  let dictColumns: ProColumns<any>[] = [
    {
      title: '字典类型',
      dataIndex: 'dictTypeName'
    },
    {
      title: '字典编码',
      dataIndex: 'dictCode',
      hideInSearch: true
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
      hideInSearch: true
    },
    {
      title: '字典描述',
      dataIndex: 'dictDesc',
      hideInSearch: true
    },
    {
      title: '创建时间',
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
          <Access accessible={access.canEditDict}>
            <Tooltip title='修改'>
              <Button type='primary' onClick={() => {
                handleIsDictUpdate(true);
                setDictFormValues(record);
                handleDictModalVisible(true);
              }}>修改</Button>
            </Tooltip>
          </Access>
          <Access accessible={access.canDeleteDict}>
            <Popconfirm
              title='是否确认删除?'
              onConfirm={() => confirmDict(record)}
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

  if (!access.canEditDict && !access.canDeleteDict) {
    dictTypeColumns = dictTypeColumns.filter(c => c.title !== '操作');
    dictColumns = dictColumns.filter(c => c.title !== '操作');
  }

  const confirmDictType = async (fields: any) => {
    const success = await handleDeleteDictType(fields);
    if (success) {
      if (actionDictTypeRef.current) {
        actionDictTypeRef.current.reload();
      }
    }
  };

  const confirmDict = async (fields: any) => {
    const success = await handleDeleteDict(fields);
    if (success) {
      if (actionDictRef.current) {
        actionDictRef.current.reload();
      }
    }
  };

  const { dispatch, system } = props;

  return (
    <Tabs activeKey={activeKey} onTabClick={key => setActiveKey(key)}>
      <TabPane tab='字典类型列表' key='1'>
        <ProTable
          headerTitle='字典类型列表'
          actionRef={actionDictTypeRef}
          rowKey='id'
          toolBarRender={() => [
            <Access accessible={access.canAddDict}>
              <Button type='primary' onClick={() => { handleDictTypeModalVisible(true); handleIsDictTypeUpdate(false); }}>
                新建
                </Button>
            </Access>
          ]}
          columns={dictTypeColumns}
          request={queryDictType}
          rowSelection={{}}
        />
        {(dictTypeFormValues && Object.keys(dictTypeFormValues).length) || !isDictTypeUpdate ? (
          <CreateDictTypeForm
            onSubmit={async (value: any) => {
              let success = false;
              if (isDictTypeUpdate) {
                success = await handleUpdateDictType(value);
              } else {
                success = await handleAddDictType(value);
              }
              if (success) {
                handleDictTypeModalVisible(false);
                setDictTypeFormValues({});
                if (actionDictTypeRef.current) {
                  actionDictTypeRef.current.reload();
                }
              }
            }}
            onCancel={() => {
              handleDictTypeModalVisible(false);
              setDictTypeFormValues({});
            }}
            values={dictTypeFormValues}
            modalVisible={createDictTypeModalVisible}
            isUpdate={isDictTypeUpdate}
          >
          </CreateDictTypeForm>
        ) : null}
      </TabPane>
      <TabPane tab='字典列表' key='2'>
        {searchDictType ?
          <ProTable
            headerTitle='字典列表'
            actionRef={actionDictRef}
            rowKey='id'
            toolBarRender={() => [
              <Access accessible={access.canAddDict}>
                <Button type='primary' onClick={() => { handleDictModalVisible(true); handleIsDictUpdate(false); }}>
                  新建
                  </Button>
              </Access>
            ]}
            columns={dictColumns}
            request={queryDict}
            params={{ dictTyped: searchDictType }}
            rowSelection={{}}
          /> : <Alert message='点击字典类型查看详情' type='info' />
        }

        {(dictFormValues && Object.keys(dictFormValues).length) || !isDictUpdate ? (
          <CreateDictForm
            onSubmit={async (value: any) => {
              let success = false;
              if (isDictUpdate) {
                success = await handleUpdateDict({ ...value, dictTyped: searchDictType });
              } else {
                success = await handleAddDict({ ...value, dictTyped: searchDictType });
              }
              if (success) {
                handleDictModalVisible(false);
                setDictFormValues({});
                if (actionDictRef.current) {
                  actionDictRef.current.reload();
                }
              }
            }}
            onCancel={() => {
              handleDictModalVisible(false);
              setDictFormValues({});
            }}
            values={dictFormValues}
            modalVisible={createDictModalVisible}
            isUpdate={isDictUpdate}
          >
          </CreateDictForm>
        ) : null}
      </TabPane>
    </Tabs>
  );
};

export default connect(
  ({ system }: { system: ModelState }) => ({
    system
  }),
)(DictManagement);
