import React, { useState } from 'react';
import { Spin, Table } from 'antd';
import { useRequest } from 'umi';
import { queryDictByType, queryTaskDetail } from '../../services';
import { ProColumns } from '@ant-design/pro-table';
import { DictTypeItem, TaskDetailParams } from '../../data';

interface TaskDetailProps {
  id: string;
  type: string;
}

/**
 * 数据转换 group -> table
 * @param list 任务paramList
 */
const taskGroupToTable = (list: TaskDetailParams[]) => {
  const tableArr: any[] = [];
  for (const element of list) {
    if (!tableArr[element.groupId]){
      tableArr[element.groupId] = {
        groupId: element.groupId
      };
    }
    tableArr[element.groupId][element.jobKey] = element.jobValue;
  }
  return tableArr;
};

const TaskDetail: React.FC<TaskDetailProps> = (props) => {
  const [detailList, handleDetailList] = useState<any[]>([]);
  const [jobType, handleJobType] = useState<any[]>([]);

  const { id, type } = props;

  const { loading: detailLoading } = useRequest(() => {
    return queryTaskDetail(id);
  }, {
    onSuccess: (data) => {
      handleDetailList(taskGroupToTable(data.paramList));
    }
  });

  const { loading: typeLoading } = useRequest(() => {
    return queryDictByType('job_' + type + '_type');
  }, {
    cacheKey: 'jobType',
    onSuccess: (data: DictTypeItem[]) => {
      const types: ProColumns<any>[] = [];
      for (const element of data) {
        types.push({
          title: element.label,
          dataIndex: element.value
        });
      }
      handleJobType(types);
    }
  });

  if (detailLoading || typeLoading) {
    return (
      <div style={{textAlign: 'center'}}>
        <Spin />
      </div>
    );
  }

  return (
    <div style={{margin: '0 auto', width: '95%'} }>
      <Table
        columns={jobType}
        size='small'
        dataSource={detailList}
        rowKey='groupId'
        pagination={false}
      />
    </div>
  );
};

export default TaskDetail;
