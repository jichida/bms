import { put,call,takeEvery,takeLatest,fork,take,race} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  common_err,

  md_login_result,
  login_result,

  set_weui,

  querydevicegroup_request,
  querydevicegroup_result,

  querydevice_request,
  querydevice_result,

  md_querydeviceinfo_result,
  querydeviceinfo_result,

  serverpush_devicegeo_sz_request,
  serverpush_devicegeo_sz_result,
  serverpush_devicegeo_sz,

  start_serverpush_devicegeo_sz,
  stop_serverpush_devicegeo_sz,

} from '../actions';
import { push,goBack,go,replace } from 'react-router-redux';//https://github.com/reactjs/react-router-redux
import _ from 'lodash';
import coordtransform from 'coordtransform';
import {getgeodata} from '../sagas/mapmain_getgeodata';
import {g_devicesdb} from './mapmain';

export function* wsrecvsagaflow() {
  yield takeLatest(`${querydevice_result}`, function*(action) {
    yield put(start_serverpush_devicegeo_sz({}));
  });


  yield takeLatest(`${start_serverpush_devicegeo_sz}`, function*(action) {
      yield fork(function*(){
        while(true){
          const { resstop, timeout } = yield race({
             resstop: take(`${stop_serverpush_devicegeo_sz}`),
             timeout: call(delay, 1000)
          });
          if(!!resstop){
            break;
          }
          //
          // console.log(`开始获取变化数据...`)
          yield put(serverpush_devicegeo_sz_request({}));
          yield race({
            resstop: take(`${serverpush_devicegeo_sz_result}`),
            timeout: call(delay, 10000)
         });
        }
      });
  });


  yield takeEvery(`${serverpush_devicegeo_sz_result}`, function*(action) {
      let {payload:result} = action;
      yield put(serverpush_devicegeo_sz(result));
  });

  yield takeEvery(`${md_login_result}`, function*(action) {
      let {payload:result} = action;
      yield put(login_result(result));
      if(result.loginsuccess){
        localStorage.setItem('bms_pc_token',result.token);
        yield put(querydevicegroup_request({}));
      }
  });


  yield takeEvery(`${common_err}`, function*(action) {
        let {payload:result} = action;

        yield put(set_weui({
          toast:{
          text:result.errmsg,
          show: true,
          type:'warning'
        }}));
  });

  yield takeEvery(`${querydevicegroup_result}`, function*(action) {
    try{
      const {payload:{list}} = action;
      //获取到分组列表
      let groupids = [];
      _.map(list,(group)=>{
        groupids.push(group._id);
      });
      yield put(querydevice_request({query:{}}));
    }
    catch(e){
      console.log(e);
    }

  });

  yield takeEvery(`${md_querydeviceinfo_result}`, function*(action) {
    let {payload:deviceinfo} = action;
    console.log(`deviceinfo==>${JSON.stringify(deviceinfo)}`);
    try{
        if(!!deviceinfo){
          let isget = true;
          const LastHistoryTrack = deviceinfo.LastHistoryTrack;
          if (!LastHistoryTrack) {
              isget = false;
          }
          else{
            if(LastHistoryTrack.Latitude === 0 || LastHistoryTrack.Longitude === 0){
              isget = false;
            }
          }
          if(isget){
            let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
            const wgs84togcj02=coordtransform.wgs84togcj02(cor[0],cor[1]);
            deviceinfo.locz = wgs84togcj02;
          }

          if(!!deviceinfo.locz){
            const addr = yield call(getgeodata,deviceinfo);
            deviceinfo = {...deviceinfo,...addr};
          }
        }
         g_devicesdb[deviceinfo.DeviceId] = deviceinfo;
         yield put(querydeviceinfo_result(deviceinfo));
       }
       catch(e){
         console.log(e);
       }

  });

}
