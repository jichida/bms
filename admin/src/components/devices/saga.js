import { put, takeEvery,takeLatest,call } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { showNotification } from 'admin-on-rest';
import {
    UPLOADEXCEL,
    UPLOADEXCEL_LOADING,

    UPLOADEXCEL_FAILURE,
    UPLOADEXCEL_SUCCESS,

} from './action';
import { fetchJson } from '../../util/fetch.js';
import config from '../../env/config';
import {excelupload} from '../../util/excelupload';

const uploadandimportexcel=({event,resource})=>{
  return new Promise((resolve,reject)=>{
    const usertoken = localStorage.getItem('admintoken');
    excelupload({e:event,resource,usertoken},(issuc,result)=>{
      if(issuc){
        resolve(result);
      }
      else{
        resolve(result);
      }

    });
  });
};

export default function* uploadExcelSaga() {

  yield takeLatest(UPLOADEXCEL, function* (action) {
    const {payload} = action;
    try{
      yield put({type:UPLOADEXCEL_LOADING,payload:{}});
      const result = yield call(uploadandimportexcel,payload);
      console.log(result);
      yield put({type:UPLOADEXCEL_SUCCESS,payload:{}});

      if(!!result.resultstring){
        alert(result.resultstring);
      }

    }
    catch(e){
      console.log(e);
      yield put({type:UPLOADEXCEL_FAILURE,payload:{}});
    }
  });

}
