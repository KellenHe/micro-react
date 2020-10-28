import { Effect, Reducer } from 'umi';
import { DictTypeItem } from './data';
import { queryDictByType } from './services';

export interface ModelState {
  jobStatus?: any;
}

export interface ModelType {
  namespace: 'ops';
  state: ModelState;
  effects: {
    queryJobStatus: Effect;
  };
  reducers: {
    jobStatus: Reducer<ModelState>;
  };
}

/**
 * 状态枚举转换
 * @param fields 参数
 */
const statusEnum = (statusList: DictTypeItem[]) => {
  const valueEnum = {};
  for (const status of statusList) {
    valueEnum[status.value] = {
      text: status.label
    };
  }
  return valueEnum;
}

const Model: ModelType = {
  namespace: 'ops',

  state: {
    jobStatus: [],
  },

  effects: {
    *queryJobStatus(_, { call, put }) {
      const response = yield call(queryDictByType, 'quartz_job_status');
      yield put({
        type: 'jobStatus',
        payload: response
      });
    },
  },

  reducers: {
    jobStatus(state, { payload }) {
      return {
        ...state,
        jobStatus: statusEnum(payload.data)
      };
    },
  }
};

export default Model;
