import { put,call,takeEvery} from 'redux-saga/effects';
import {
  common_err,

  md_login_result,
  login_result,

  set_weui,

  querydevicegroup_request,
  querydevicegroup_result,

  querydevice_request,

  md_querydeviceinfo_result,
  querydeviceinfo_result,
} from '../actions';
import { push,goBack,go,replace } from 'react-router-redux';//https://github.com/reactjs/react-router-redux
import _ from 'lodash';
import coordtransform from 'coordtransform';
import {getgeodata} from '../sagas/mapmain_getgeodata';

export function* wsrecvsagaflow() {

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
         yield put(querydeviceinfo_result(deviceinfo));
       }
       catch(e){
         console.log(e);
       }

  });
}
