import {call} from 'redux-saga/effects';
import coordtransform from 'coordtransform';
import {getgeodata} from '../../sagas/mapmain_getgeodata';
import {bridge_deviceinfo} from './bridgedb';

export function* getdeviceinfo(deviceinfo_org,isgetaddr){
  let addr;
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
      if(isgetaddr){
          addr = yield call(getgeodata,deviceinfo);
          deviceinfo = {...deviceinfo,...addr};
        }
        else{
          deviceinfo = {...deviceinfo,...addr};
        }
      }
    }
  return deviceinfo;
}

export function* getdevicelist(list_org){
  let list_new = [];

  for(let i = 0;i < list_org.length; i++){
    let deviceinfo_org = list_org[i];

    let deviceinfo = yield call(getdeviceinfo,deviceinfo_org,i === 0);
    list_new.push(bridge_deviceinfo(deviceinfo));
  }
  //======这里转换字段======
  return list_new;
};
