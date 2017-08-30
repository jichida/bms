import {takeEvery,put,fork,call,select} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  querydevicegroup_request,
  querydevicegroup_result,
  querydevice_request,
  querydevice_result,
  queryhistorytrack_request,
  queryhistorytrack_result,
  notify_socket_connected,
  login_request,
  md_login_result,
  getsystemconfig_request,
  getsystemconfig_result,

  searchbatteryalarm_request,
  searchbatteryalarm_result,
  searchbatteryalarmsingle_request,
  searchbatteryalarmsingle_result,
  searchbattery_request,
  searchbattery_result,

  querydeviceinfo_request,
  querydeviceinfo_result,
  md_querydeviceinfo_result,

  serverpush_devicegeo,
  serverpush_devicegeo_sz,
  serverpush_devicealarm,

  serverpush_devicegeo_sz_request,
  serverpush_devicegeo_sz_result,
  start_serverpush_devicegeo_sz
} from '../actions';
import jsondatareadonly from '../test/bmsdata.json';
import jsondatatrack from '../test/1602010008.json';
import jsondataalarm from '../test/json-BMS2.json';
import {getRandomLocation} from '../env/geo';
import coordtransform from 'coordtransform';
import {g_devicesdb} from './mapmain';
import _ from 'lodash';
import {getgeodata} from '../sagas/mapmain_getgeodata';
//获取地理位置信息，封装为promise
let jsondata = _.filter(jsondatareadonly,(item) => {
  let thisdata = false;
  if(!!item.LastHistoryTrack){
    if(!!item.LastHistoryTrack.Latitude){
      if(item.LastHistoryTrack.Latitude > 0){
        thisdata = true;
      }
    }
  }
  return thisdata;
});

//模拟10万+
for(let i = 0;i < 0; i++){
  _.map(jsondatareadonly,(itemonly) => {
    const item = {...itemonly};
    if(!!item.LastHistoryTrack){
      if(!!item.LastHistoryTrack.Latitude){
        if(item.LastHistoryTrack.Latitude > 0){
          let locationsz = getRandomLocation(item.LastHistoryTrack.Latitude,item.LastHistoryTrack.Longitude,300);
          item.LastHistoryTrack.Latitude = item.LastHistoryTrack.Latitude;
          item.LastHistoryTrack.Longitude  = item.LastHistoryTrack.Longitude;
          item.DeviceId = `${i}${item.DeviceId}`;
          jsondata.push(item);
        }
      }
    }
  });
}

// jsondata = _.sampleSize(jsondata, 100000);

export function* apiflow(){//仅执行一次
  yield takeEvery(`${querydeviceinfo_request}`, function*(action) {
    const {payload:{query:{DeviceId}}} = action;
    // const getdevices = (state)=>{return state.device};
    // const {g_devicesdb} = yield select(getdevices);
    let deviceinfo = g_devicesdb[DeviceId];

     yield put(md_querydeviceinfo_result(deviceinfo));
  });

  yield takeEvery(`${getsystemconfig_request}`, function*(action) {
     yield put(getsystemconfig_result({

     }));
  });

  yield takeEvery(`${login_request}`, function*(action) {
    const {payload} = action;
    const {username,password} = payload;
    if(password === '123456'){
      yield put(md_login_result({
        loginsuccess:true,
        username:username,
        token:'',
      }));
    }
    else{
      yield put(md_login_result({
        loginsuccess:false,
      }));
    }

  });

  yield takeEvery(`${querydevice_request}`, function*(action) {
     yield put(querydevice_result({list:jsondata}));

    //  yield put(start_serverpush_devicegeo_sz({}));
  });

  yield takeEvery(`${searchbattery_request}`, function*(action) {
    const {payload:{query}} = action;
    const list = _.sampleSize(jsondata, 20);
    yield put(searchbattery_result({list}));
  });


  yield takeEvery(`${searchbatteryalarm_request}`, function*(action) {
    const {payload:{query}} = action;
    const list = [];
    const listdevice = _.sampleSize(jsondata, 20);
    let iddate = new Date();
    _.map(listdevice,(device,index)=>{
      let alarm = {...jsondataalarm};
      alarm.DeviceId = device.DeviceId;
      alarm._id = iddate.getTime() + index;
      list.push(alarm);
    });
    yield put(searchbatteryalarm_result({list}));
  });

  yield takeEvery(`${searchbatteryalarmsingle_request}`, function*(action) {
    const {payload:{query}} = action;
    const list = [];
    let iddate = new Date();
    for(let i = 0;i < 20 ;i++){
      let alarm = {...jsondataalarm};
      alarm._id = iddate.getTime() + i;
      list.push(alarm);
    }
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

    //  yield put(md_login_result({
    //    loginsuccess:true
    //  }));
   });

   yield takeEvery(`${queryhistorytrack_request}`, function*(action) {
      yield put(queryhistorytrack_result({list:jsondatatrack}));
   });

  //  模拟服务端推送消息
  yield takeEvery(`${serverpush_devicegeo_sz_request}`, function*(action) {
    const list = _.sampleSize(jsondata, 1);
    let items = [];
    for(let i = 0;i < list.length; i++){
      let item = {...list[i]};
      let locationsz = getRandomLocation(item.LastHistoryTrack.Latitude,item.LastHistoryTrack.Longitude,10*1000);
      item.LastHistoryTrack.Latitude = locationsz[1];
      item.LastHistoryTrack.Longitude  =  locationsz[0];
      let cor = [item.LastHistoryTrack.Longitude,item.LastHistoryTrack.Latitude];
      const wgs84togcj02=coordtransform.wgs84togcj02(cor[0],cor[1]);
      item.locz = wgs84togcj02;
      items.push(item);
    };
    yield put(serverpush_devicegeo_sz_result({list:items}));
  });


  // let enable_serverpush_device = false;
  // if(enable_serverpush_device){
  //   yield fork(function*(){
  //     yield call(delay,10000);
  //     while(true){
  //       const list = _.sampleSize(jsondata, 10000);
  //       let items = [];
  //       for(let i = 0;i < list.length; i++){
  //         let item = {...list[i]};
  //         let locationsz = getRandomLocation(item.LastHistoryTrack.Latitude,item.LastHistoryTrack.Longitude,10*1000);
  //         item.LastHistoryTrack.Latitude = locationsz[1];
  //         item.LastHistoryTrack.Longitude  =  locationsz[0];
  //         let cor = [item.LastHistoryTrack.Longitude,item.LastHistoryTrack.Latitude];
  //         const wgs84togcj02=coordtransform.wgs84togcj02(cor[0],cor[1]);
  //         item.locz = wgs84togcj02;
  //         items.push(item);
  //       };
  //       yield put(serverpush_devicegeo_sz({list:items}));
  //       yield call(delay,1000);
  //     }
  //   });
  // }
  //
  // let enable_serverpush_alarm = false;
  // if(enable_serverpush_alarm){
  //   yield fork(function*(){
  //     yield call(delay,10000);
  //     while(true){
  //       //产生模拟数据
  //       //发送模拟数据
  //     }
  //   });
  // }
  //serverpush_devicealarm

}
