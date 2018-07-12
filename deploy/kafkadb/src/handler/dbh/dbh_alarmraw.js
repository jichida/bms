const DBModels = require('../models.js');
const _ = require('lodash');
const debug_alarmraw = require('debug')('dbh:alarmraw');
const async = require('async');
const config = require('../../config.js');
const winston = require('../../log/log.js');

const dbh_alarmraw =(datasin,callbackfn)=>{
  if(datasin.length === 0){
    debug_alarmraw(`dbh_alarmraw data is empty`);
    callbackfn(null,true);
    return;
  }
  let datas = datasin;
  //先排序,后去重
  // datasin = _.sortBy(datasin, [(o)=>{
  //   const key = `${o.DeviceId}_${o.DataTime}`;
  //   return key;
  // }]);
  //
  // datasin = _.sortedUniqBy(datasin,(o)=>{
  //   const key = `${o.DeviceId}_${o.DataTime}`;
  //   return key;
  // });
  //
  // //去重
  // let datas = [];
  // _.map(datasin,(o)=>{
  //   if(!config.globalalarmrawdevicetable[o.DeviceId]){
  //     //找不到
  //     datas.push(o);
  //     config.globalalarmrawdevicetable[o.DeviceId] = o.DataTime;
  //   }
  //   else{
  //     if(config.globalalarmrawdevicetable[o.DeviceId] !== o.DataTime){
  //       datas.push(o);
  //       config.globalalarmrawdevicetable[o.DeviceId] = o.DataTime;
  //     }
  //   }
  // });
  //
  // // datas = _.uniqBy(datas, (o)=>{
  // //   return `${o.DeviceId}_${o.DataTime}`;
  // // });
  //
  // if(datas.length < datasin.length){
  //   // debug_alarmraw(`去重有效,datas:${JSON.stringify(datas)},datasin:${JSON.stringify(datasin)}`);
  //   debug_alarmraw(`去重有效,datas:${datas.length},datasin:${datasin.length}`);
  // }
  //
  // if(datas.length === 0){
  //   debug_alarmraw(`debug_alarmraw data is empty`);
  //   callbackfn(null,true);
  //   return;
  // }
  //
  if(config.istest){
    winston.getlog().error(`开始插入报警明细:${datas.length}`);
  }

  const dbModel = DBModels.RealtimeAlarmRawModel;
  debug_alarmraw(`start dbh_alarmraw,datas:${datas.length}`);
  // const asyncfnsz = [];
  //  _.map(datas,(devicedata)=>{
  //   asyncfnsz.push(
  //     (callbackfn)=>{
  //       dbModel.findOneAndUpdate({
  //             GUID:devicedata.GUID,
  //             DeviceId:devicedata.DeviceId,
  //             TimeKey:devicedata.TimeKey
  //        },{$set:devicedata},{upsert:true},callbackfn);
  //     }
  //   );
  // });
  // async.parallel(asyncfnsz,(err,result)=>{
  //     debug_alarmraw(`stop dbh_alarmraw`);
  //     callbackfn(err,result);
  // });

  const bulk = dbModel.collection.initializeUnorderedBulkOp();
  if(!!bulk){
    _.map(datas,(devicedata)=>{
      bulk.insert(devicedata);
      // bulk.find({
      //     GUID:devicedata.GUID,
      //     DeviceId:devicedata.DeviceId,
      //     TimeKey:devicedata.TimeKey
      //   })
      //   .upsert()
      //   .updateOne({
      //     $set:devicedata
      //   });
    });
    bulk.execute((err,result)=>{
      if(!!err){
        console.error(`dbh_alarmraw err`);
        console.error(err);
        console.error(err.stack);
      }
      debug_alarmraw(`stop dbh_alarmraw`);
      if(config.istest){
        winston.getlog().error(`插入报警明细完毕:${datas.length}`);
      }
      callbackfn(null,true);
    });
  }
  else{
    console.error(`dbh_device err,bulk is null`);
    callbackfn(null,true);
  }
  // dbModel.insertMany(datas, (err, result)=>{
  //   callbackfn(err,result);
  // });
};

module.exports = dbh_alarmraw;
