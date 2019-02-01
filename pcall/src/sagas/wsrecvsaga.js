import { put,call,takeLatest,take,l} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  common_err,
  ui_changemodeview,
  md_login_result,
  login_result,

  set_weui,


  querydevice_request,
  // querydevice_result,
  querydevicegroup_result,
  md_querydeviceinfo_result,
  querydeviceinfo_result,

  setworkorderdone_request,
  setworkorderdone_result,

  changepwd_result,

  savealarmsettings_result,

  getdevicestat_request,
  getdevicestatprovinces_request,
  queryamaptree
} from '../actions';
import { goBack } from 'react-router-redux';//https://github.com/reactjs/react-router-redux
import map from 'lodash.map';
import coordtransform from 'coordtransform';
import {getgeodata} from '../sagas/mapmain_getgeodata';
import {g_devicesdb} from './mapmain';
import config from '../env/config.js';

// import  {
//   getrandom
// } from '../test/bmsdata.js';

export function* wsrecvsagaflow() {
  yield takeLatest(`${savealarmsettings_result}`, function*(action) {
    yield put(set_weui({
      toast:{
      text:'保存成功',
      show: true,
      type:'success'
    }}));
  });

  yield takeLatest(`${setworkorderdone_request}`, function*(action) {
      yield take(`${setworkorderdone_result}`);
      yield put(goBack());
  });

  // 链接远程数据,暂时注释
  // yield takeLatest(`${querydevice_result}`, function*(action) {
  //   yield put(start_serverpush_devicegeo_sz({}));
  // });

  yield takeLatest(`${changepwd_result}`, function*(action) {
    yield put(set_weui({
      toast:{
        text:'修改密码成功',
        show: true,
        type:'success'
    }}));
    yield put(goBack());
  });



  yield takeLatest(`${common_err}`, function*(action) {
        let {payload:result} = action;

        yield put(set_weui({
          toast:{
          text:result.errmsg,
          show: true,
          type:'warning'
        }}));
  });

  yield takeLatest(`${querydevicegroup_result}`, function*(action) {
    try{
      const {payload:{list}} = action;
      //获取到分组列表
      let groupids = [];
      map(list,(group)=>{
        groupids.push(group._id);
      });
      yield put(querydevice_request({query:{}}));
    }
    catch(e){
      console.log(e);
    }

  });



}
