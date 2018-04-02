const DBModels = require('../models.js');
const _ = require('lodash');
const debug_device = require('debug')('dbh:device');
const async = require('async');
let globaldevicetable = {};//'deviceid'->'datatime'

const dbh_device =(datasin,callbackfn)=>{
  if(datasin.length === 0){
    debug_device(`dbh_device data is empty`);
    callbackfn(null,true);
    return;
  }

  let datas = [];
  _.map(datasin,(o)=>{
    const LastRealtimeAlarm_DataTime = _.get(o,'LastRealtimeAlarm.DataTime','');
    const LastHistoryTrack_GPSTime = _.get(o,'LastHistoryTrack.GPSTime','');
    if(!globaldevicetable[o.DeviceId]){
      //找不到
      datas.push(o);
      globaldevicetable[o.DeviceId] = `${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
    }
    else{
      if(globaldevicetable[o.DeviceId] !== `${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`){
        datas.push(o);
        globaldevicetable[o.DeviceId] = `${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
      }
    }
  });
  // const datas = _.uniqBy(datasin, (o)=>{
  //   const LastRealtimeAlarm_DataTime = _.get(o,'LastRealtimeAlarm.DataTime','');
  //   const LastHistoryTrack_GPSTime = _.get(o,'LastHistoryTrack.GPSTime','');
  //   return `${o.DeviceId}_${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
  // });

  if(datas.length < datasin.length){
    debug_device(`去重有效,datas:${datas.length},datasin:${datasin.length}`);
  }
  if(datas.length === 0){
    if(datasin.length > 0){
      debug_device(`--->${JSON.stringify(datasin[0])}`);
    }
    debug_device(`dbh_device data is empty`);
    callbackfn(null,true);
    return;
  }

  const dbModel = DBModels.DeviceModel;
  // debug_device(`start dbh_device,datas:${datas.length}`);
  // const asyncfnsz = [];
  // _.map(datas,(devicedata)=>{
  //   asyncfnsz.push(
  //     (callbackfn)=>{
  //       dbModel.findOneAndUpdate({
  //           DeviceId:devicedata.DeviceId
  //        },{$set:devicedata},{upsert:true},callbackfn);
  //     }
  //   );
  // });
  // async.parallel(asyncfnsz,(err,result)=>{
  //     debug_device(`stop dbh_device`);
  //     callbackfn(err,result);
  // });
  const bulk = dbModel.collection.initializeOrderedBulkOp();
  if(!!bulk){
    _.map(datas,(devicedata)=>{
      bulk.find({
          DeviceId:devicedata.DeviceId
        })
        .upsert()
        .updateOne({
          $set:devicedata
        });
    });
    bulk.execute((err,result)=>{
      if(!!err){
        console.error(`dbh_device err`);
        console.error(err);
        console.error(err.stack);
      }
      debug_device(`stop dbh_device`);
      callbackfn(null,true);
    });
  }
  else{
    debug_device(`dbh_device err,bulk is null`);
    callbackfn(null,true);
  }
};

module.exports = dbh_device;
