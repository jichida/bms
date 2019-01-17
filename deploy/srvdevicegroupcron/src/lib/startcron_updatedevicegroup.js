const _ = require('lodash');
const async = require("async");
const DBModels = require('../handler/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
const debug = require('debug')('srvdevicegroupcron:startcron');
const winston = require('../log/log.js');

const getdevicecites = (callbackfn)=>{
  const dbModel =  DBModels.DeviceCityModel;
  dbModel.aggregate([
    {
  		$group: {
  			_id:'$citycode',
  			deviceids: { $addToSet: "$deviceid" },
        province: { $first: "$province" },
        city: { $first: "$city" },
  		}
  	}
  ]).exec((err, list)=> {
    callbackfn(err,list);
  });
}

const startcron_updatedevicegroup = (callback)=>{
  const dbDeviceGroupModel = DBModels.DeviceGroupModel;
  const updatetime = moment().format('YYYY-MM-DD HH:mm:ss');
  getdevicecites((err,citylist)=>{
    if(!err && !!citylist){
      winston.getlog().info(`注意:getdevicecites result:${citylist.length}`);
      let fnsz = [];
      _.map(citylist,(v)=>{
          // console.log(v);
          fnsz.push((callbackfn)=>{
            let ObjSet = {};
            const citycode = _.get(v,'_id','');
            const deviceidslist = _.get(v,'deviceids',[]);
            const province = _.get(v,'province','');
            const city = _.get(v,'city','');
            let name = `${province}`;
            if(city.length > 0){
              name = `${name}${city}`;
            }
            ObjSet[`$setOnInsert`] = {name};
            ObjSet[`$set`] ={
                deviceids:deviceidslist,
                updatetime
              };
            dbDeviceGroupModel.findOneAndUpdate({citycode},ObjSet,{new: true,upsert:true},(err,result)=>{
                callbackfn(null,true);
            });
          });

        });//map
        winston.getlog().info(`注意:startcron_updatedevicegroup start:${fnsz.length}`);
        async.parallelLimit(fnsz,10,(err,result)=>{
          winston.getlog().info(`注意:startcron_updatedevicegroup finished:${fnsz.length}`);
          callback(null,true);
        });
    }
    else{
      callback(null,true);
    }
  })
  // const dbDeviceGroupModel = DBModels.DeviceGroupModel;
  // let fnsz = [];
  // const updatetime = moment().format('YYYY-MM-DD HH:mm:ss');
  // _.map(retmapgroupidtodevice,(deviceidslist,groupid)=>{
  //   fnsz.push((callback)=>{
  //     dbDeviceGroupModel.findOneAndUpdate({_id:groupid}, {$set:{
  //         deviceids:deviceidslist,
  //         updatetime
  //       }},{new: true,upsert:true},(err,result)=>{
  //         debug(`result--->${groupid}-->${deviceidslist.length}`);
  //         callback(null,true);
  //     });
  //   });
  // });
  //
  // async.parallel(fnsz,(err,result)=>{
  //   callbackfn(err,result);
  // });
}

module.exports = startcron_updatedevicegroup;
