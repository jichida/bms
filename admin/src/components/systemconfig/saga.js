import { put, takeEvery,takeLatest,call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { showNotification } from 'admin-on-rest';
import {
    SYSTEM_SAVE,
    SYSTEM_LOAD,

    SYSTEM_SAVE_FAILURE,
    SYSTEM_SAVE_SUCCESS,

    SYSTEM_LOAD_FAILURE,
    SYSTEM_LOAD_SUCCESS,
} from './action';
import { fetchJson } from '../../util/fetch.js';
import config from '../../env/config';

export default function* systemsaveSaga() {
  console.log(`systemsaveSaga...`);

  yield takeEvery(SYSTEM_SAVE_SUCCESS, function* (action) {
      yield put(showNotification('resources.systemconfig.notification.save_success'));
  });

  yield takeEvery(SYSTEM_SAVE_FAILURE, function* (action) {
      const {error} = action;
      yield put(showNotification('resources.systemconfig.notification.save_error', 'warning'));
      console.error(error);
  });

  yield takeLatest(SYSTEM_LOAD, function* (action) {
    try{
      const url = `${config.admincustomapi}/systemload`;
      const options = {
        method:'POST',
      };
      const {json} = yield call(fetchJson,url,options);
      console.log(`send load,${JSON.stringify(json)}`);
      yield put({type:SYSTEM_LOAD_SUCCESS,payload:json});
    }
    catch(e){
      yield put({type:SYSTEM_LOAD_FAILURE,payload:e});
    }

  });

  yield takeLatest(SYSTEM_SAVE, function* (action) {
      try{
        const url = `${config.admincustomapi}/systemsave`;
        const options = {
          method:'POST',
          body:JSON.stringify(action.payload)
        };
        const {json} = yield call(fetchJson,url,options);
        console.log(`send save,${JSON.stringify(json)}`);
        yield put({type:SYSTEM_SAVE_SUCCESS,payload:json});
      }
      catch(e){
        yield put({type:SYSTEM_SAVE_FAILURE,payload:e});
      }
  });
}
