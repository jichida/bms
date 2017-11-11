import {call} from 'redux-saga/effects';
import coordtransform from 'coordtransform';
import {getgeodata} from '../../sagas/mapmain_getgeodata';

export function* getdevicelist(list_org){
  let list_new = [];
  let addr;
  for(let i = 0;i < list_org.length; i++){
    let deviceinfo_org = list_org[i];
    let deviceinfo = {...deviceinfo_org};
    if(!!deviceinfo){
      let isget = true;
      const LastHistoryTrack = deviceinfo.LastHistoryTrack;
      if (!LastHistoryTrack) {
          isget = false;
      }
      else{
        if(LastHistoryTrack.Latitude === 0 || LastHistoryTrack.Longitude === 0){
          isget = false;
        }
      }
      if(isget){
        let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
        const wgs84togcj02=coordtransform.wgs84togcj02(cor[0],cor[1]);
        deviceinfo.locz = wgs84togcj02;
      }

      if(!!deviceinfo.locz){
        if(i === 0){
          addr = yield call(getgeodata,deviceinfo);
          deviceinfo = {...deviceinfo,...addr};
        }
        else{
          deviceinfo = {...deviceinfo,...addr};
        }
      }
    }

    list_new.push(deviceinfo);
  }

  //======这里转换字段======
  return list_new;
};
