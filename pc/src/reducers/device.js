import { createReducer } from 'redux-act';
import{
  querydevice_result
} from '../actions';

const initial = {
  device:{
    mapseldeviceid:undefined,
    mapdeviceidlist:[],
    deviceidlist:[],
    devices: {
    },
  }
};

const device = createReducer({
  [querydevice_result]:(state,payload)=>{
    let deviceidlist = [];
    let devices = {};
    return {...state,deviceidlist,devices};
  },
}, initial.device);

export default device;
