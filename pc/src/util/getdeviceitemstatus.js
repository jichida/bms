import get from 'lodash.get';
import moment from 'moment';
const getdevicestatus_isonline = (deviceitem)=>{
  let isonline = false;
  let gpstime = get(deviceitem,'LastHistoryTrack.GPSTime');
  if(!!gpstime){
    // a.diff(b, 'days')
    const diffmin = moment().diff(moment(gpstime),'minutes');
    console.log(`diffmin==>${diffmin}`);
    isonline = diffmin < 20;
  }
  return isonline;
}

const getdevicestatus_alaramlevel = (deviceitem)=>{
  let warninglevel = get(deviceitem,'warninglevel','');
  // const deviceidr = parseInt(deviceitem.DeviceId)%3;
  // if(deviceidr %3 === 0){
  //   warninglevel = '高';
  // }
  // else if(deviceidr %3 === 1){
  //   warninglevel = '中';
  // }
  // else{
  //   warninglevel = '低';
  // }
  return warninglevel;
}

export {getdevicestatus_isonline,getdevicestatus_alaramlevel};
