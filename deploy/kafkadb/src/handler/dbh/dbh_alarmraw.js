const DBModels = require('../models.js');
const _ = require('lodash');
const debug_alarmraw = require('debug')('dbh:alarmraw');

const dbh_alarmraw =(datas,callbackfn)=>{
  const dbModel = DBModels.RealtimeAlarmRawModel;
  debug_alarmraw(`start dbh_alarmraw`);
  const bulk = dbModel.collection.initializeOrderedBulkOp();
  if(!!bulk){
    _.map(datas,(devicedata)=>{
      bulk.find({
          GUID:devicedata.GUID,
          DeviceId:devicedata.DeviceId,
          DataTime:devicedata.DataTime
        })
        .upsert()
        .updateOne({
          $set:devicedata
        });
    });
    bulk.execute((err,result)=>{
      if(!!err){
        console.error(`dbh_alarmraw err`);
        console.error(err);
        console.error(err.stack);
      }
      debug_alarmraw(`stop dbh_alarmraw`);
      callbackfn(err,result);
    });
  }
  else{
    console.error(`dbh_device err,bulk is null`);
    callbackfn();
  }
  // dbModel.insertMany(datas, (err, result)=>{
  //   callbackfn(err,result);
  // });
};

module.exports = dbh_alarmraw;
