import {takeEvery,put,fork,call} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  querydevicegroup_request,
  querydevicegroup_result,
  querydevice_request,
  querydevice_result,
  queryhistorytrack_request,
  queryhistorytrack_result,
  notify_socket_connected,
  md_login_result,
  getsystemconfig_request,
  getsystemconfig_result,

  searchbatteryalarm_request,
  searchbatteryalarm_result,
  searchbatteryalarmsingle_request,
  searchbatteryalarmsingle_result,
  searchbattery_request,
  searchbattery_result
} from '../actions';
import jsondata from './bmsdata.json';
import jsondatatrack from './1602010008.json';
import jsondataalarm from './json-BMS2.json';
import _ from 'lodash';
//获取地理位置信息，封装为promise
export function* testdataflow(){//仅执行一次
  yield takeEvery(`${getsystemconfig_request}`, function*(action) {
     yield put(getsystemconfig_result({

     }));
  });

  yield takeEvery(`${querydevice_request}`, function*(action) {
     yield put(querydevice_result({list:jsondata}));
  });

  yield takeEvery(`${searchbattery_request}`, function*(action) {
    const {payload:{query}} = action;
    const list = _.sampleSize(jsondata, 20);
    yield put(searchbattery_result({list}));
  });


  yield takeEvery(`${searchbatteryalarm_request}`, function*(action) {
    const {payload:{query}} = action;
    const list = [];
    list.push(jsondataalarm);
    yield put(searchbatteryalarm_result({list}));
  });

  yield takeEvery(`${searchbatteryalarmsingle_request}`, function*(action) {
    const {payload:{query}} = action;
    const list = [];
    list.push(jsondataalarm);
    yield put(searchbatteryalarmsingle_result({list}));
  });



   yield takeEvery(`${querydevicegroup_request}`, function*(action) {
      // yield put(querydevicegroup_result({list:jsondata}));
      let groups = [];
      for(let i = 0;i < 200;i++){
        groups.push({
          _id:`${i}`,
          name:`分组${i}`
        });
      }
      yield put(querydevicegroup_result({list:groups}));
   });

   yield fork(function*(){
     while(!window.amapmain){
       yield call(delay,500);
     }
     yield put(notify_socket_connected(true));

     yield call(delay,2000);

     yield put(md_login_result({
       loginsuccess:true
     }));
   });

   yield takeEvery(`${queryhistorytrack_request}`, function*(action) {
      yield put(queryhistorytrack_result({list:jsondatatrack}));
   });
}

export const getgroupnamebydevice = (deviceinfo)=>{
  let groupinfo = {
    _id:'0',
    name:`未分组`
  };
  if(typeof deviceinfo.DeviceId === 'string'){
    let devid = parseInt(deviceinfo.DeviceId);
    groupinfo = {
      _id:`${devid%200}`,
      name:`分组${devid%200}`
    }
  }
  return groupinfo;
}
