import { fork } from 'redux-saga/effects';
import {flowmain} from './flowmain';
import {createsagacallbackflow} from './sagacallback';

import {wsrecvsagaflow} from './wsrecvsaga';
import {jpushflow} from './jpushflow';

import {createloadingflow} from './loading';
import {createmapmainflow} from './mapmain';
import {socketflow} from './socketflow';

export default function* rootSaga() {
  try{
    yield fork(socketflow);
    yield fork(createmapmainflow);
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
