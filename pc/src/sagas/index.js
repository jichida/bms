import { fork } from 'redux-saga/effects';
import {flowmain} from './flowmain';
import {createsagacallbackflow} from './sagacallback';

import {wsrecvsagaflow} from './wsrecvsaga';
import {jpushflow} from './jpushflow';

import {createloadingflow} from './loading';
import {createmapmainflow} from './mapmain';
import {createmaptrackhistoryplaybackflow} from './mapplayback';
import {socketflow} from './socketflow';
import {testdataflow} from '../test/offlinedata';
export default function* rootSaga() {
  try{
    yield fork(socketflow);
    yield fork(createmapmainflow);
    yield fork(createmaptrackhistoryplaybackflow);
    yield fork(createloadingflow);
    // yield fork(jpushflow);
    yield fork(wsrecvsagaflow);

    // yield fork(flowmain);
    yield fork(createsagacallbackflow);

    yield fork(testdataflow);//for test only
  }
  catch(e){
    console.log(e);
  }

}
