import { createReducer } from 'redux-act';
import{
  querydevice_result,
  ui_selcurdevice,
  querydeviceinfo_result
} from '../actions';
import _ from 'lodash';

const initial = {
  device:{
    mapseldeviceid:undefined,
    mapdeviceidlist:[],
    datatree:[],
    deviceidlist:[],
    devices: {
    },
  }
};

const device = createReducer({
  [ui_selcurdevice]:(state,payload)=>{
    const mapseldeviceid = payload.DeviceId;
    return {...state,mapseldeviceid};
  },
  [querydeviceinfo_result]:(state,payload)=>{
    const devicerecord = payload;
    let devices = {...state.devices};
    devices[devicerecord.DeviceId] = devicerecord;
    return {...state,devices};
  },
  [querydevice_result]:(state,payload)=>{
    const {list} = payload;
    let deviceidlist = [];
    let devices = {};
    _.map(list,(devicerecord)=>{
      deviceidlist.push(devicerecord.DeviceId);
      devices[devicerecord.DeviceId] = devicerecord;
    });

    const Province = _.groupBy(list,'LastHistoryTrack.Province');
    console.log(Province);
    let devicedatatree = {};
    _.map(Province,(psz,pkey)=>{
      if(pkey === 'undefined' || !pkey){
        pkey = '其他';
      }
      if(!!pkey){
        devicedatatree[pkey] = {};
      }

      let City = _.groupBy(psz,'LastHistoryTrack.City');
      _.map(City,(csz,ckey)=>{
        if(ckey === 'undefined' || !ckey){
          ckey = '其他';
        }
        let vsz = [];
        _.map(csz,(v,k)=>{
          vsz.push(v.DeviceId);
        });
        devicedatatree[pkey][ckey] = vsz;

      });
    });
    console.log(devicedatatree);
    let datatreesz = [];
    _.map(devicedatatree,(psz,pname)=>{
      // console.log(`pname:${pname},psz:${JSON.stringify(psz)}`)
      let children = [];
      _.map(psz,(csz,cname)=>{
        let objnamesz = [];
        _.map(csz,(deviceid)=>{
          objnamesz.push({name:deviceid});
        })
        children.push({
          name:cname,
          children:objnamesz
        });
      });
      datatreesz.push({
        name:pname,
        children
      });
    });
    let datatree =
      {
          name: '所有设备',
          toggled: true,
          children:datatreesz
      }
    return {...state,deviceidlist,devices,datatree};
  },
}, initial.device);

export default device;
