import {takeLatest,put,call,race,take} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  deviceinfoquerychart_request,
  deviceinfoquerychart_result,
} from '../actions';
import {
  uireport_searchhistorydevice_request,
  uireport_searchhistorydevice_result,
  callthen_saga
} from './pagination';

//获取地理位置信息，封装为promise
export function* deviceinfoquerychartflow(){//仅执行一次
   yield takeLatest(`${deviceinfoquerychart_request}`, function*(action) {
      try{
        const {payload:{DeviceId}} = action;
        console.log(`recv ===> ${DeviceId}`);
        const payloadquery = {
          query: {
            DeviceId,
          },
          options: {
              sort: {
                RecvTime:-1,
              },
              offset: 0,
              limit: 100,
          }
        };
        yield put(uireport_searchhistorydevice_request(payloadquery));
        const { res, timeout } = yield race({
           res: take(uireport_searchhistorydevice_result),
           timeout: call(delay, 30000)
        });
        if(!timeout && !!res){
          const resultdocs = res.payload;
          console.log(`resultdocs==>${JSON.stringify(resultdocs)}`);
          const resultdata = {
            '电压':[1,1,2,2,3],
            '电流':[4,5,6]
          };
          yield put(deviceinfoquerychart_result({DeviceId,resultdata}));
        }

      }
      catch(e){
        console.log(e);
      }

    });

}
