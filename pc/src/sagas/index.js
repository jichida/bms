import { fork } from 'redux-saga/effects';
import {flowmain} from './flowmain';
import {createsagacallbackflow} from './sagacallback';

import {wsrecvsagaflow} from './wsrecvsaga';
import {jpushflow} from './jpushflow';

import {createloadingflow} from './loading';
import {createmapshowflow} from './map';
import {socketflow} from './socketflow';

export default function* rootSaga() {
  try{
    yield fork(socketflow);
    yield fork(createmapshowflow);
    yield fork(createloadingflow);
    yield fork(jpushflow);
    yield fork(wsrecvsagaflow);
    
    yield fork(flowmain);

    yield fork(createsagacallbackflow);
  }
  catch(e){
    console.log(e);
  }

}
