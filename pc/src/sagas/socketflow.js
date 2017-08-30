import {takeEvery,put} from 'redux-saga/effects';
import {
  notify_socket_connected,
  getsystemconfig_request,
  loginwithtoken_request,
  
  querydevicegroup_request
} from '../actions';

//获取地理位置信息，封装为promise
export function* socketflow(){//仅执行一次
   yield takeEvery(`${notify_socket_connected}`, function*(action) {
      let {payload:issocketconnected} = action;
      if(issocketconnected){
        yield put(getsystemconfig_request({}));
        const token = localStorage.getItem('bms_pc_token');
        if (!!token) {
          yield put(loginwithtoken_request({token}));
        }

      }
    });

}
