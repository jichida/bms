import {takeLatest,put,fork,call,select,take} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  ui_btnclick_deviceonline,
  ui_btnclick_deviceoffline,
  ui_btnclick_alaramall,
  ui_btnclick_alaramred,
  ui_btnclick_alaramorange,
  ui_btnclick_alaramyellow,
  ui_btnclick_devicemessage,

  ui_menuclick_settings,
  ui_menuclick_logout,

  searchbatteryalarm_request,
  searchbatteryalarm_result,

  searchbatteryalarmsingle_request,
  searchbatteryalarmsingle_result,

  logout_request,
  logout_result,

  ui_sel_tabindex
}from '../actions';
import { push,replace } from 'react-router-redux';
import moment from 'moment';

export function* uiflow(){//仅执行一次
  //app点击底部菜单
  // yield takeLatest(`${ui_sel_tabindex}`, function*(action) {
  //   const {payload} = action;
  //   console.log(`点击在线`);
  //   if(payload === 1){
  //     yield put(searchbatteryalarm_request({
  //       query:{
  //         CurDay:moment().format('YYYY-MM-DD')
  //       }
  //     }));
  //   }
  // });


  //ui_btnclick_devicemessage

  yield takeLatest(`${ui_btnclick_devicemessage}`, function*(action) {
    const {payload:{DeviceId}} = action;
    yield put(searchbatteryalarmsingle_request({
      query:{
        DeviceId
      }
    }));
    yield take(`${searchbatteryalarmsingle_result}`);
    yield put(push(`/devicemessage/${DeviceId}`));
  });

  yield takeLatest(`${ui_btnclick_deviceonline}`, function*(action) {
    console.log(`点击在线`);
  });

  yield takeLatest(`${ui_btnclick_deviceoffline}`, function*(action) {
    console.log(`点击在线`);
  });

  yield takeLatest(`${ui_btnclick_alaramall}`, function*(action) {
    yield put(searchbatteryalarm_request({}));
    console.log(`点击所有报警`);
    yield put(push('/message/all'));
  });

  yield takeLatest(`${ui_btnclick_alaramred}`, function*(action) {
    yield put(searchbatteryalarm_request({
      query:{
        queryalarm:{
          warninglevel:0
        }
      }
    }));
    console.log(`点击红色报警`);
    yield take(`${searchbatteryalarm_result}`);
    yield put(push('/message/0'));
  });

  yield takeLatest(`${ui_btnclick_alaramorange}`, function*(action) {
    yield put(searchbatteryalarm_request({
      query:{
        queryalarm:{
          warninglevel:1
        }
      }
    }));
    console.log(`点击橙色报警`);
    yield take(`${searchbatteryalarm_result}`);
    yield put(push('/message/1'));
  });

  yield takeLatest(`${ui_btnclick_alaramyellow}`, function*(action) {
    yield put(searchbatteryalarm_request({
      query:{
        queryalarm:{
          warninglevel:2
        }
      }
    }));
    console.log(`点击黄色报警`);
    yield take(`${searchbatteryalarm_result}`);
    yield put(push('/message/2'));
  });

  yield takeLatest(`${ui_menuclick_settings}`, function*(action) {
    console.log(`点击设置`);
  });

  yield takeLatest(`${ui_menuclick_logout}`, function*(action) {
    console.log(`点击注销`);
    yield put(logout_request());
    yield take(`${logout_result}`);
    yield put(replace('/login'));
  });

}
