import {takeEvery,put,fork,call} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  querydevice_request,
  querydevice_result,
  notify_socket_connected
} from '../actions';
import jsondata from './bmsdata1.json';
//获取地理位置信息，封装为promise
export function* testdataflow(){//仅执行一次
   yield takeEvery(`${querydevice_request}`, function*(action) {
      yield put(querydevice_result({list:jsondata}));
   });

   yield fork(function*(){
     while(!window.amapmain){
       yield call(delay,500);
     }
     yield put(notify_socket_connected(true));
   });

}
