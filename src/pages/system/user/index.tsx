import React, { useState, useRef } from 'react';
import { Row, Col, Tree, Card, message, Button, Tooltip, Popconfirm } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { addUser, updateUser, queryDep, queryUsers, deleteUser } from '../services';
import { useRequest, useAccess, Access } from 'umi';
import CreateForm, { FormValueType } from './components/CreateForm';
import { TableListItem, Departments } from '../data';
import styles from '../style.less';
import moment from 'moment';

/**
 * 添加用户
 * @param fields 表格
 */
const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在添加');
  try {
    await addUser({ ...fields });
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
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在修改');
  try {
    await updateUser({ ...fields });
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
const handleDelete = async (fields: FormValueType) => {
  const hide = message.loading('正在删除');
  try {
    await deleteUser({ ...fields });
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

const UserManagement: React.FC<{}> = () => {
  const access = useAccess();
  const [isUpdate, handleIsUpdate] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const [selectedDepKeys, setSelectedDepKeys] = useState<any[]>([]);
  const actionRef = useRef<ActionType>();
  let columns: ProColumns<TableListItem>[] = [
    {
      title: '关键字',
      dataIndex: 'keyword',
      hideInTable: true,
      hideInDescriptions: true,
    },
    {
      title: '用户名',
      dataIndex: 'username',
      hideInSearch: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      hideInSearch: true,
    },
    // {
    //   title: '性别',
    //   dataIndex: 'sex',
    //   renderText: (val: number) => (val === 1 ? '男' : '女'),
    //   hideInSearch: true,
    // },
    {
      title: '电话',
      dataIndex: 'mobile',
      hideInSearch: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      hideInSearch: true,
    },
    {
      title: '部门',
      dataIndex: 'departments',
      hideInSearch: true,
      renderText: (val: Departments[]) => val?.map(dep => dep.departmentName).join(','),
    },
    // {
    //   title: '状态',
    //   dataIndex: 'status',
    //   valueEnum: {
    //     active: { text: '激活', status: '1' },
    //     disabled: { text: '禁用', status: '0' }
    //   },
    //   render: (_, row) => <Switch checked={row.status === '1' ? true : false} />,
    // },
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
      render: (_, record) => (
        <div>
          <Access accessible={access.canEditUser}>
            <Tooltip title='修改'>
              <Button type='primary' onClick={() => {
                handleIsUpdate(true);
                setStepFormValues({
                  departmentIds: record.departments?.map(dep => dep.id),
                  roleIds: record.roles?.map(role => role.id),
                  ...record
                });
                handleModalVisible(true);
              }}>修改</Button>
            </Tooltip>
          </Access>
          <Access accessible={access.canDeleteUser}>
            <Popconfirm
              title='是否确认删除?'
              onConfirm={async () => { confirm(record); }}
              okText='确定'
              cancelText='取消'
            >
              <Button type='primary' danger>删除</Button>
            </Popconfirm>
          </Access>
        </div>
      ),
    },
  ];

  // 没有部门权限，隐藏部门列
  if (!access.canViewDep) {
    columns = columns.filter(c => c.title !== '部门');
  }
  // 没有修改和删除权限，隐藏操作列
  if (!access.canEditUser && !access.canDeleteUser) {
    columns = columns.filter(c => c.title !== '操作');
  }

  const confirm = async (fields: FormValueType) => {
    const success = await handleDelete(fields);
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log('selected', selectedKeys, info);
    setSelectedDepKeys(selectedKeys);
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  let treeData;
  if (access.canViewDep) {
    const { data } = useRequest(() => {
      return queryDep({});
    });
    treeData = data;
  }

  return (
    <Row style={{ margin: '0 -24px' }}>
      <Access accessible={access.canViewDep}>
        <Col flex='280px'>
          <Card title='部门' style={{ marginBottom: '0px' }} className={styles.siderBarFull}>
            <Tree
              onSelect={onSelect}
              treeData={treeData}
            />
          </Card>
        </Col>
      </Access>
      <Col flex='1' style={{ minWidth: 0 }}>
        <div className='p-lg'>
          <ProTable<TableListItem>
            headerTitle='用户列表'
            actionRef={actionRef}
            search={{
              span: { xs: 24, sm: 24, md: 8, lg: 8, xl: 8, xxl: 8 }
            }}
            rowKey='id'
            toolBarRender={() => [
              <Access accessible={access.canAddUser}>
                <Button type='primary' onClick={() => { handleModalVisible(true); handleIsUpdate(false); }}>
                  新建
                </Button>
              </Access>,
            ]}
            request={(params: any) => {
              params.departmentIds = selectedDepKeys;
              return queryUsers(params);
            }}
            columns={columns}
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
              onCancel={() => { handleModalVisible(false); setStepFormValues({}); }}
              modalVisible={createModalVisible}
              values={stepFormValues}
              treeData={treeData}
              isUpdate={isUpdate}>
            </CreateForm>
          ) : null}
        </div>
      </Col>
    </Row>
  );
};

export default UserManagement;
