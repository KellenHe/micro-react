import { Effect, Reducer } from 'umi';
import { queryDep, queryDictByType, queryDataRuleList } from './services';

export interface ModelState {
  depTreeDatas?: API.TreeData[];
  roleType?: any[];
  dataType?: any[];
  dataRuleExpress?: any[];
  dataRuleList?: any[];
}

export interface ModelType {
  namespace: 'system';
  state: ModelState;
  effects: {
    queryDepTree: Effect;
    queryRoleTypes: Effect;
    queryDataTypes: Effect;
    queryDataRuleExpress: Effect;
    queryDataRuleList: Effect;
  };
  reducers: {
    depTree: Reducer<ModelState>;
    roleType: Reducer<ModelState>;
    dataType: Reducer<ModelState>;
    dataRuleExpress: Reducer<ModelState>;
    dataRuleList: Reducer<ModelState>;
  };
}

const Model: ModelType = {
  namespace: 'system',

  state: {
    depTreeDatas: [],
    roleType: [],
    dataType: [],
    dataRuleExpress: [],
    dataRuleList: []
  },

  effects: {
    *queryDepTree(_, { call, put }) {
      const response = yield call(queryDep);
      yield put({
        type: 'depTree',
        payload: response
      });
    },
    *queryRoleTypes(_, { call, put }) {
      const response = yield call(queryDictByType, 'role_type');
      yield put({
        type: 'roleType',
        payload: response
      });
    },
    *queryDataTypes(_, { call, put }) {
      const response = yield call(queryDictByType, 'authority_data_type');
      yield put({
        type: 'dataType',
        payload: response
      });
    },
    *queryDataRuleExpress(_, { call, put }) {
      const response = yield call(queryDictByType, 'express_column_sql_type');
      yield put({
        type: 'dataRuleExpress',
        payload: response
      });
    },
    *queryDataRuleList({ payload }, { call, put }) {
      const response = yield call(queryDataRuleList, payload);
      yield put({
        type: 'dataRuleList',
        payload: response
      });
    }
  },

  reducers: {
    depTree(state, { payload }) {
      return {
        ...state,
        depTreeDatas: payload.data
      };
    },
    roleType(state, { payload }) {
      return {
        ...state,
        roleType: payload.data
      };
    },
    dataType(state, { payload }) {
      return {
        ...state,
        dataType: payload.data
      };
    },
    dataRuleExpress(state, { payload }) {
      return {
        ...state,
        dataRuleExpress: payload.data
      };
    },
    dataRuleList(state, { payload }) {
      return {
        ...state,
        dataRuleList: payload.data
      }
    }
  }
};

export default Model;
