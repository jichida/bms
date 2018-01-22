import { createReducer } from 'redux-act';
import {
    deviceinfoquerychart_request,
    deviceinfoquerychart_result,
    logout_result
} from '../actions';


const initial = {
    deviceinfoquerychart: {
        //全局提示
        alarmchart:{

        }
    },
};

const deviceinfoquerychart = createReducer({
    [deviceinfoquerychart_request]:(state,payload)=>{
      return {...initial.deviceinfoquerychart};
    },
    [deviceinfoquerychart_result]:(state,payload)=>{
        const {DeviceId,resultdata} = payload;
        let alarmchart = {...state.alarmchart};
        alarmchart[DeviceId] = resultdata;
        return {...state, alarmchart};
    },
    [logout_result]:(state,payload)=>{
      return {...initial.deviceinfoquerychart};
    }
}, initial.deviceinfoquerychart);

export default deviceinfoquerychart;
