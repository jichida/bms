const DBModels = require('../models.js');
const _ = require('lodash');
const debug_alarmraw = require('debug')('dbh:alarmraw');
const async = require('async');

const dbh_alarmraw =(datas,callbackfn)=>{
  if(datas.length === 0){
    debug_alarmraw(`dbh_alarmraw data is empty`);
    callbackfn(null,true);
    return;
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
