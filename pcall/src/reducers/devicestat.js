import { createReducer } from 'redux-act';
import {
  getdevicestat_result,
  getdevicestatprovinces_result,
  getdevicestatcities_result,
  getdevicestatcity_result
} from '../actions';

const initial = {
  devicestat:{
    count_online:0,
    count_offline:0,
    count_all:0,
    count_yellow:0,
    count_red:0,
    count_orange:0,
  },
};

const devicestat = createReducer({
  [getdevicestat_result]: (state, payload) => {
      const {count_online,count_offline,count_all,count_yellow,count_red,count_orange} = payload;
      return {...state, count_online,count_offline,count_all,count_yellow,count_red,count_orange};
  },
}, initial.devicestat);

export default devicestat;
