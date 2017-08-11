import { createReducer } from 'redux-act';
import {
  searchbattery_request,
  searchbatteryalarm_request,
  searchbatteryalarmsingle_request,

  searchbattery_result,
  searchbatteryalarm_result,
  searchbatteryalarmsingle_result,

  ui_selcurdevice_result,
} from '../actions';
import _ from 'lodash';

const initial = {
  searchresult:{
    curseldeviceid:undefined,
    searchresult_battery:[],
    searchresult_alaram:[],
    searchresult_alaramsingle:[],
    alarms:{}
  },
};

const searchresult = createReducer({
  [ui_selcurdevice_result]:(state,payload)=>{
    const curseldeviceid = payload.DeviceId;
    let searchresult_alaramsingle = [];
    return { ...state, curseldeviceid,searchresult_alaramsingle};
  },
  [searchbattery_request]: (state, payload) => {
    let searchresult_battery = [];
    return { ...state, searchresult_battery};
  },
  [searchbatteryalarm_request]: (state, payload) => {
    let searchresult_alaram = [];
    return { ...state, searchresult_alaram};
  },
  [searchbatteryalarmsingle_request]: (state, payload) => {
    const {querydevice:{_id:curseldeviceid}} = payload;
    let searchresult_alaramsingle = [];
    return { ...state, searchresult_alaramsingle,curseldeviceid};
  },
  [searchbattery_result]: (state, payload) => {
    let searchresult_battery = [];
    const {list} = payload;
    _.map(list,(device)=>{
      searchresult_battery.push(device.DeviceId);
    });
    return { ...state, searchresult_battery};
  },
  [searchbatteryalarm_result]: (state, payload) => {
    const {list} = payload;
    let alarms = {...state.alarms};
    let searchresult_alaram = [];
    _.map(list,(alaram)=>{
      alarms[alaram._id] = alaram;
      searchresult_alaram.push(alaram._id);
    });
    return { ...state,alarms,searchresult_alaram};
  },
  [searchbatteryalarmsingle_result]: (state, payload) => {
    const {list} = payload;
    let alarms = {...state.alarms};
    let searchresult_alaramsingle = [];
    _.map(list,(alaram)=>{
      alarms[alaram._id] = alaram;
      searchresult_alaramsingle.push(alaram._id);
    });
    return { ...state,alarms, searchresult_alaramsingle};
  },
}, initial.searchresult);

export default searchresult;
