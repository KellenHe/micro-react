import React, { useState, useRef, useEffect } from 'react';
import { message, Button, Tooltip, Space, Popconfirm } from 'antd';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { addTask, deleteTask, pauseTask, queryTaskList, resumeTask, runTask, startTask, updateTask } from '../services';
import { ModelState } from '../model';
import { Dispatch, useAccess, Access, connect } from 'umi';
import CreateForm from './components/CreateForm';
import moment from 'moment';
import TaskDetail from './components/TaskDetail';
import { Tasks } from '../data';

interface TaskProps {
  dispatch: Dispatch;
  ops: ModelState;
}

/**
 * 添加任务
 * @param fields 表格
 */
const handleAdd = async (fields: any) => {
  const hide = message.loading('正在添加');
  try {
    await addTask({ ...fields });
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
 * 更新任务
 * @param fields 参数
 */
const handleUpdate = async (fields: any) => {
  const hide = message.loading('正在修改');
  try {
    await updateTask({ ...fields });
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
 * 删除任务
 * @param fields 参数
 */
const handleDelete = async (id: string) => {
  const hide = message.loading('正在删除');
  try {
    await deleteTask(id);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

/**
 * 启动任务
 * @param id 任务id
 */
const handleStart = async (id: string) => {
  const hide = message.loading('正在启动任务');
  try {
    await startTask(id);
    hide();
    message.success('任务开启成功');
    return true;
  } catch (error) {
    hide();
    message.error('任务开启失败请重试！');
    return false;
  }
};

/**
 * 暂停任务
 * @param id 任务id
 */
const handlePause = async (id: string) => {
  const hide = message.loading('正在暂停任务');
  try {
    await pauseTask(id);
    hide();
    message.success('任务暂停成功');
    return true;
  } catch (error) {
    hide();
    message.error('任务暂停失败请重试！');
    return false;
  }
};

/**
 * 恢复任务
 * @param id 任务id
 */
const handleResume = async (id: string) => {
  const hide = message.loading('正在恢复任务');
  try {
    await resumeTask(id);
    hide();
    message.success('任务恢复成功');
    return true;
  } catch (error) {
    hide();
    message.error('任务恢复失败请重试！');
    return false;
  }
};

/**
 * 执行任务
 * @param id 任务id
 */
const handleRun = async (id: string) => {
  const hide = message.loading('正在执行任务');
  try {
    await runTask(id);
    hide();
    message.success('任务执行成功');
    return true;
  } catch (error) {
    hide();
    message.error('任务执行失败请重试！');
    return false;
  }
};

const TaskManagement: React.FC<TaskProps> = (props) => {
  const access = useAccess();
  const [isUpdate, handleIsUpdate] = useState<boolean>(false);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();

  const { dispatch, ops }  = props;

  // 获取状态字典
  useEffect(() => {
    dispatch({
      type: 'ops/queryJobStatus',
    });
  }, []);

  let columns: ProColumns<any>[] = [
    {
      title: '任务分组',
      dataIndex: 'jobGroup',
    },
    {
      title: '任务名称',
      dataIndex: 'jobName',
    },
    {
      title: '任务负责人',
      dataIndex: 'jobCharge',
      hideInSearch: true,
    },
    {
      title: '负责人邮箱',
      dataIndex: 'jobEmail',
      hideInSearch: true,
    },
    {
      title: 'cron表达式',
      dataIndex: 'jobCron',
      hideInSearch: true,
    },
    {
      title: '任务类型',
      dataIndex: 'jobTypeName',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'jobStatus',
      valueEnum: ops.jobStatus
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
      render: (_, record) => (
        <div>
          <Access accessible={access.canEditTask}>
            <Tooltip title='修改'>
              <Button type='primary' onClick={() => {
                handleIsUpdate(true);
                setStepFormValues({
                  ...record
                });
                handleModalVisible(true);
              }}>修改</Button>
            </Tooltip>
          </Access>
          { record.jobStatus === 'init' ?
            <Access accessible={access.canStartTask}>
              <Tooltip title='启动任务'>
                <Button type='primary' onClick={async () => { confirm(record.id, record.jobStatus); }}>启动</Button>
              </Tooltip>
            </Access> :
            record.jobStatus === 'start' ?
            <Access accessible={access.canPauseTask}>
              <Tooltip title='暂停任务'>
                <Button type='primary' onClick={async () => { confirm(record.id, record.jobStatus); }}>暂停</Button>
              </Tooltip>
            </Access> :
            record.jobStatus === 'stop' ?
            <Access accessible={access.canRecoverTask}>
              <Tooltip title='恢复任务'>
                <Button type='primary' onClick={async () => { confirm(record.id, record.jobStatus); }}>恢复</Button>
              </Tooltip>
            </Access> : ''}
          { record.jobStatus === 'start' ?
            <Access accessible={access.canRunTask}>
              <Tooltip title='执行'>
                <Button type='primary' onClick={async () => { confirm(record.id, 'run'); }}>执行</Button>
              </Tooltip>
            </Access> : ''}
          <Access accessible={access.canDeleteTask}>
            <Tooltip title='删除'>
              <Popconfirm
                title='是否确认删除?'
                onConfirm={async () => { confirm(record.id, 'delete'); }}
                okText='确定'
                cancelText='取消'
              >
                <Button type='primary' danger>删除</Button>
              </Popconfirm>
            </Tooltip>
          </Access>
        </div>
      ),
    },
  ];

  // 没有修改和删除权限，隐藏操作列
  if (!access.canEditTask && !access.canDeleteTask) {
    columns = columns.filter(c => c.title !== '操作');
  }

  /**
   * 根据type类型区分请求
   * @param id 任务id
   * @param type 请求类型
   */
  const confirm = async (id: string, type: string) => {
    let success = false;
    switch (type){
      case 'delete':
        success = await handleDelete(id);
        break;
      case 'init':
        success = await handleStart(id);
        break;
      case 'start':
        success = await handlePause(id);
        break;
      case 'stop':
        success = await handleResume(id);
        break;
      case 'run':
        success = await handleRun(id);
        break;
    }
    if (success) {
      if (actionRef.current) {
        actionRef.current.reload();
      }
    }
  };

  const expandedRowRender = (row: any, index: number, indent: number, expanded: boolean) => {
    if (expanded){
      return (
        <TaskDetail key={'detail' + row.id} id={row.id} type={row.jobTyped}></TaskDetail>
      );
    }else{
      return (
        <></>
      );
    }
  };

  return (
    <>
      <ProTable<Tasks>
        headerTitle='任务列表'
        actionRef={actionRef}
        rowKey='id'
        toolBarRender={(action, { selectedRows }) => [
          <Access accessible={access.canAddTask}>
            <Button type='primary' onClick={() => { handleModalVisible(true); handleIsUpdate(false); }}>
              新建
            </Button>
          </Access>,
          <Access accessible={access.canViewTask}>
            <Button type='primary' disabled={ selectedRows && selectedRows.length > 0 ? false : true } onClick={() => { console.log(selectedRows); }}>
              获取日志
            </Button>
          </Access>,
          <Access accessible={access.canStartTask}>
            <Button type='primary' disabled={ selectedRows && selectedRows.length > 0 ? false : true } onClick={() => { console.log(selectedRows); }}>
              批量启动
            </Button>
          </Access>,
          <Access accessible={access.canPauseTask}>
            <Button type='primary' disabled={ selectedRows && selectedRows.length > 0 ? false : true } onClick={() => { console.log(selectedRows); }}>
              批量暂停
            </Button>
          </Access>,
          <Access accessible={access.canRecoverTask}>
            <Button type='primary' disabled={ selectedRows && selectedRows.length > 0 ? false : true } onClick={() => { console.log(selectedRows); }}>
              批量恢复
            </Button>
          </Access>,
        ]}
        request={(params: any) => {
          return queryTaskList(params);
        }}
        columns={columns}
        expandable={{ expandedRowRender,  }}
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
          isUpdate={isUpdate}>
        </CreateForm>
      ) : null}
    </>
  );
};

export default connect(
  ({ops}: {ops: ModelState}) => ({
    ops
  })
)(TaskManagement);
