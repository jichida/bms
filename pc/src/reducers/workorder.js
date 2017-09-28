import { createReducer } from 'redux-act';
import {
  //登录
    getallworkorder_result,
    queryworkorder_result,
    setworkorderdone_result,
    getworkusers_result,
    createworkorder_result,
} from '../actions';
import _ from 'lodash';

const initial = {
  workorder:{
    curallworkorder:[],
    searchresult_workorder:[],
    workorders:{},
    workusers:{},
  },
};

const workorder = createReducer({
  [createworkorder_result]:(state,payload)=>{
    let curallworkorder = [...state.curallworkorder];
    let workorders = {...state.workorders};
    curallworkorder.push(payload._id);
    workorders[payload._id] = payload;
    return { ...state, curallworkorder,workorders};
  },
  [getworkusers_result]:(state,payload)=>{
     let workusers = {};
     const {list} = payload;
     _.map(list,(item)=>{
       workusers[item._id] = item;
     });
     return { ...state, workusers};
  },
  [setworkorderdone_result]:(state,payload)=>{
    let item = payload;
    let workorders = {...state.workorders};
    workorders[item._id] = item;
    return { ...state, workorders};
  },
  [getallworkorder_result]: (state, payload) => {
    let curallworkorder =[];
    let workorders = {...state.workorders};
    const {list} = payload;
    _.map(list,(item)=>{
      curallworkorder.push(item._id);
      workorders[item._id] = item;
    });
    let searchresult_workorder = [...curallworkorder];
    return {...state,curallworkorder,searchresult_workorder,workorders};
  },
  [queryworkorder_result]: (state, payload) => {
    let searchresult_workorder =[];
    let workorders = {...state.workorders};
    const {list} = payload;
    _.map(list,(item)=>{
      searchresult_workorder.push(item._id);
      workorders[item._id] = item;
    });
    return {...state,searchresult_workorder,workorders};
  },
}, initial.workorder);

export default workorder;
