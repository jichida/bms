import { fork } from 'redux-saga/effects';
import {flowmain} from './flowmain';
import {createsagacallbackflow} from './sagacallback';
import {getcurpositionflow} from './senddriverposition';
import {wsrecvsagaflow} from './wsrecvsaga';
import {jpushflow} from './jpushflow';
import {createnavdrawrouteflow} from './navdrawroute';
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
    yield fork(createnavdrawrouteflow);
    yield fork(flowmain);
    yield fork(getcurpositionflow);
    yield fork(createsagacallbackflow);
  }
  catch(e){
    console.log(e);
  }

}
