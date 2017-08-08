import { createReducer } from 'redux-act';
import {
  searchbattery_request,
  searchbatteryalarm_request,
  searchbatteryalarmsingle_request,

  searchbattery_result,
  searchbatteryalarm_result,
  searchbatteryalarmsingle_result,

} from '../actions';

const searchresult = {
  userlogin:{
    curseldeviceid:undefined,
    searchresult_battery:[],
    searchresult_alaram:[],
    searchresult_alaramsingle:[],
    alarms:{

    }
  },
};

const searchresult = createReducer({
  [searchbattery_request]: (state, payload) => {
    let searchresult_battery = [];
    return { ...state, searchresult_battery};
  },
  [searchbatteryalarm_request]: (state, payload) => {
    let searchresult_alaram = [];
    return { ...state, searchresult_alaram};
  },
  [searchbatteryalarmsingle_request]: (state, payload) => {
    const {query:{querydevice:{_id:curseldeviceid}}} = payload;
    let searchresult_alaramsingle = [];
    return { ...state, searchresult_alaramsingle,curseldeviceid};
  },
  [searchbattery_result]: (state, payload) => {
    let searchresult_battery = [];
    return { ...state, searchresult_battery};
  },
  [searchbatteryalarm_result]: (state, payload) => {
    let searchresult_alaram = [];
    return { ...state, searchresult_alaram};
  },
  [searchbatteryalarmsingle_result]: (state, payload) => {
    let searchresult_alaramsingle = [];
    return { ...state, searchresult_alaramsingle};
  },
}, initial.searchresult);

export default searchresult;
