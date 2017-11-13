import {wsflow} from './api.ws.js';
import {takeLatest,take,takeEvery,put,fork,call,select} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  ui_index_addcollection,
  ui_index_unaddcollection,
  collectdevice_request
} from '../actions';

export function* apiflow(){//
  try{
    yield fork(wsflow);

    yield takeLatest(`${ui_index_addcollection}`, function*(action) {
      try{
        const {payload} = action;
        yield put(collectdevice_request({DeviceId:payload,collected:true}));
      }
      catch(e){
        console.log(e);
      }
    });

    yield takeLatest(`${ui_index_unaddcollection}`, function*(action) {
      try{
        const {payload} = action;
        yield put(collectdevice_request({DeviceId:payload,collected:false}));
      }
      catch(e){
        console.log(e);
      }
    });
  }
  catch(e){
    console.log(e);
  }
}
