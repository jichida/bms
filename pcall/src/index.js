import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Root from './env/root';
import store,{sagaMiddleware} from './env/store';
import rootSaga from './sagas';
// import registerServiceWorker from './registerServiceWorker';
import injectTapEventPlugin from 'react-tap-event-plugin';
// import { postNotifyFromJPush } from './env/jpush';
// import { registerandroid } from './env/android';
import { setLanguage, } from 'redux-polyglot';
import lan from './i18n';


moment.locale('zh-cn');

injectTapEventPlugin();
sagaMiddleware.run(rootSaga);
ReactDOM.render(
    <Root />,
    document.getElementById('root')
);

store.dispatch(setLanguage('cn', lan['cn']));
// store.dispatch(setLanguage('en', lan['en']));
//
// const p = getP(store.getState(), { polyglotScope: 'warningbox' });
// const alarmtxtstat = 'BPM故障 115次|F[250] 115次|支路内SOC差值过大报警三级 113次|F[46] 113次|AL_TROUBLE_CODE_51_181 104次|F[181] 104次|AL_TROUBLE_CODE_51_214 106次|F[214] 106次|AL_TROUBLE_CODE_51_228 97次|F[228] 97次|AL_TROUBLE_CODE_51_242 95次|F[242] 95次|AL_TROUBLE_CODE_51_225 102次|F[225] 102次|AL_TROUBLE_CODE_51_183 19次|F[183] 19次|AL_TROUBLE_CODE_51_216 1次|F[216] 1次|AL_TROUBLE_CODE_51_219 46次|F[219] 46次|AL_TROUBLE_CODE_51_109 20次|F[109] 20次|AL_TROUBLE_CODE_51_230 25次|F[230] 25次|AL_TROUBLE_CODE_51_154 次|F[154] 1次|';
// const matchedstring = `BPM故障 `;
// const index = alarmtxtstat.indexOf(matchedstring);
// console.log(index)
// registerandroid();
// postNotifyFromJPush(store.dispatch);
// registerServiceWorker();
