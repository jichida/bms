import { put,takeEvery} from 'redux-saga/effects';
import {
  common_err,

  md_login_result,
  login_result,

  set_weui,

  querydevicegroup_request,
  querydevicegroup_result,

  querydevice_request,
} from '../actions';
import { push,goBack,go,replace } from 'react-router-redux';//https://github.com/reactjs/react-router-redux
import _ from 'lodash';

export function* wsrecvsagaflow() {

  yield takeEvery(`${md_login_result}`, function*(action) {
      let {payload:result} = action;
      yield put(login_result(result));
      if(result.loginsuccess){
        yield put(querydevicegroup_request({}));
      }
  });


  yield takeEvery(`${common_err}`, function*(action) {
        let {payload:result} = action;
        //console.log(`common_err:${JSON.stringify(result)}`);
        yield put(set_weui({
          toast:{
          text:result.errmsg,
          show: true,
          type:'warning'
        }}));
  });

  yield takeEvery(`${querydevicegroup_result}`, function*(action) {
    const {payload:{list}} = action;
    //获取到分组列表
    let groupids = [];
    _.map(list,(group)=>{
      groupids.push(group._id);
    });
    yield put(querydevice_request({query:{}}));
  });

}
