export interface DictTypeItem {
  label: string;
  value: string;
}

export interface Tasks {
  jobName: string;
  jobCron: string;
  jobRecharge: string;
  jobEmail: string;
  jobTyped: string;
  params: TaskParams[];
}

export interface TaskDetails {
  id: number;
  jobName: string;
  jobCron: string;
  jobCharge: string;
  jobEmail: string;
  jobTyped: string;
  jobStatus: string;
  createTime: string;
  updateTime: null;
  paramList: TaskParams[];
}

export interface TaskParams {
  jobKey: string;
  jobValue: string;
  groupId: number;
}

export interface TaskDetailParams {
  id: string;
  jobId: string;
  jobKey: string;
  jobValue: string;
  groupId: number;
}

export interface Datatable {
  id: number;
  connectAccount: string;
  connectPassword: string;
  databaseClass: string;
  databaseName: string;
  jdbcUrl: string;
  createTime: Date;
}

export interface Server {
  id: number;
  connectAccount: string;
  connectPassword: string;
  connectIp: string;
  connectPort: number;
  serverName: string;
}

export interface DictType {
  id: number;
  typeCode: string;
  typeName: string;
  typeDesc: string;
  basics: Dict[];
}

export interface Dict {
  id: number;
  parentId: number;
  dictCode: string;
  dictTyped: string;
  dictName: string;
  dictDesc: string;
}
