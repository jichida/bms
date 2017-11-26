import { fork } from 'redux-saga/effects';
import systemconfigsaga from './components/systemconfig/saga';

export default function* rootSaga() {
  try{
    yield fork(systemconfigsaga);
  }
  catch(e){
      console.log(e);
  }
}
