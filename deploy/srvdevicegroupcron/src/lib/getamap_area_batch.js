require('es6-promise').polyfill();
require('isomorphic-fetch');
const _ = require('lodash');
const PubSub = require('pubsub-js');
const moment = require('moment');

const key = 'dadfa0897bd9c8cff9cffdf330974b55';

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
const getareasz = (devicelist,callbackfn)=>{
  let alllocations = '';
  _.map(devicelist,(v,index)=>{
    alllocations += `${v.Longitude},${v.Latitude}`;
    if(index !== devicelist.length - 1){
      alllocations += '|';
    }
  });
  let retlist = [];
  const url = `http://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${alllocations}&batch=true`;
  // console.log(`url==>${url}`);
  // "key=" + key + "&location=" + location[0] + "," + location[1] +
  // "&poitype=商务住宅&radius=0&extensions=base&batch=false&roadlevel=0";
  fetch(url).then((res)=>{
    return res.json();
  }).then((json)=> {
    const regeocodes = json.regeocodes;
    if(regeocodes.length === devicelist.length){
      _.map(devicelist,(v,index)=>{
        const province = _.get(regeocodes[index],'addressComponent.province');
        const city = _.get(regeocodes[index],'addressComponent.city');
        const district = _.get(regeocodes[index],'addressComponent.district');
        const citycode = _.get(regeocodes[index],'addressComponent.citycode');
        const adcode = _.get(regeocodes[index],'addressComponent.adcode');
        const targetadcode = getAddress(adcode);

        retlist.push({_id:v._id,citycode,adcode,targetadcode,getflag:'fromamap'});

        PubSub.publish('getdevicecity',{
          deviceid:v._id,
          province,
          city,
          district,
          citycode,
          adcode,
          targetadcode:`${targetadcode}`,
          updatetime:moment().format('YYYY-MM-DD HH:mm:ss')
        })
      });
    }
    callbackfn(retlist);
  }).catch((e)=>{
    console.log(e);
    callbackfn(retlist);
  });
}

module.exports = getareasz;
