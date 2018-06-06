const async = require('async');
const PubSub = require('pubsub-js');
const debug = require('debug')('srvdevicegroupcron:startcron');
const moment = require('moment');

require('es6-promise').polyfill();
require('isomorphic-fetch');
const _ = require('lodash');

const key = 'a3cafd2a27c606877bc0c058c03e8e39';
const getAddress = (adcode)=>{
  let address = adcode;
  if(typeof address === 'string'){
    address = parseInt(address);
  }
  const addressnew = Math.floor(address/100);
  const retv = addressnew*100;
  return parseInt(retv);
}
//http://restapi.amap.com/v3/geocode/geo?parameters
const getarea = ({_id,Longitude,Latitude},callbackfn)=>{
  const url = `http://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${Longitude},${Latitude}`;
  // //console.log(`url==>${url}`);
  // "key=" + key + "&location=" + location[0] + "," + location[1] +
  // "&poitype=商务住宅&radius=0&extensions=base&batch=false&roadlevel=0";
  fetch(url).then((res)=>{
    return res.json();
  }).then((json)=> {

    const regeocode = json.regeocode;
    debug(`${JSON.stringify(regeocode)}`);
    if(!!regeocode){
      const province = _.get(regeocode,'addressComponent.province');
      const city = _.get(regeocode,'addressComponent.city');
      const district = _.get(regeocode,'addressComponent.district');
      const citycode = _.get(regeocode,'addressComponent.citycode');
      const adcode = _.get(regeocode,'addressComponent.adcode');
      const targetadcode = getAddress(adcode);

      PubSub.publish('getdevicecity',{
        deviceid:_id,
        province,
        city,
        district,
        citycode,
        adcode,
        targetadcode:`${targetadcode}`,
        updatetime:moment().format('YYYY-MM-DD HH:mm:ss')
      })
      callbackfn({_id:_id,citycode,adcode,targetadcode,getflag:'fromamap'});
    }
    else{
      callbackfn({_id});
    }
  }).catch((e)=>{
    debug(e);
    callbackfn({_id});
  });
}


const getareasz = (devicelist,callback)=>{
  const fnsz = [];
  let success_list = [];
  let failed_list = [];

  _.map(devicelist,(deviceinfo)=>{
    fnsz.push((callbackfn)=>{
      getarea(deviceinfo,(info)=>{
        debug(`getareasz-->${JSON.stringify(info)}`)
        if(!!info.citycode){
          success_list.push(info);
        }
        else{
          failed_list.push(deviceinfo);
        }
        callbackfn(null,true);
      });
    });
  })

  async.series(fnsz,(err,result)=>{
    callback(success_list,failed_list);
  });
}

module.exports = getareasz;
