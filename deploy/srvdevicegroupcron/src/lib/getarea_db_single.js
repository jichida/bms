//返回区的上级
const _ = require('lodash');
const PubSub = require('pubsub-js');
const moment = require('moment');

const getAddress = (adcode)=>{
  let address = adcode;
  if(typeof address === 'string'){
    address = parseInt(address);
  }
  const addressnew = Math.floor(address/100);
  const retv = addressnew*100;
  return parseInt(retv);
}

const getarea_db_single = (GeoModel,v,callback)=>{
  //考虑到有些省下级是区，所以筛选区的上级
  GeoModel.findOne({citycode:{$type:2},
                  geometry:
                 {$geoIntersects:
                     {$geometry:{ "type" : "Point",
                          "coordinates" : [v.Longitude,v.Latitude] }
                      }
                  }
             }).lean().exec((err,ret)=>{
     if(!err && !!ret){
       const province = _.get(ret,'provincename');
       const city = _.get(ret,'name');
       const citycode = _.get(ret,'citycode');
       const adcode = _.get(ret,'adcode');
       const targetadcode = getAddress(adcode);
       PubSub.publish('getdevicecity',{
         deviceid:v._id,
         province,
         city,
         citycode,
         adcode,
         targetadcode:`${targetadcode}`,
         updatetime:moment().format('YYYY-MM-DD HH:mm:ss')
       })

       callback({_id:v._id,
         adcode:ret.adcode,
         citycode:ret.citycode,
         province:ret.province,
         city : ret.name,
         getflag:'fromdb'});
     }
     else{
       callback({_id:v._id});
     }
   });
}

module.exports = getarea_db_single;
