import { put, takeEvery,takeLatest } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { showNotification } from 'admin-on-rest';
import {
    SYSTEM_SAVE,
    SYSTEM_LOAD,

    SYSTEM_SAVE_FAILURE,
    SYSTEM_SAVE_SUCCESS,
} from './action';

export default function* systemsaveSaga() {
  console.log(`systemsaveSaga...`);

  yield takeEvery(SYSTEM_SAVE_SUCCESS, function* (action) {
            yield put(showNotification('resources.systemconfig.notification.save_success'));
            yield put(push('/systemconfig'));
        });

  yield takeEvery(SYSTEM_SAVE_FAILURE, function* (action) {
            const {error} = action;
            yield put(showNotification('resources.systemconfig.notification.save_error', 'warning'));
            console.error(error);
        });

  yield takeLatest(SYSTEM_LOAD, function* (action) {
          console.log(`send load`)
        });

  yield takeLatest(SYSTEM_SAVE, function* (action) {
          console.log(`send save`)
        });
}
