const DBModels = require('../models.js');
const _ = require('lodash');
const debug_device = require('debug')('dbh:device');
const async = require('async');
const config = require('../../config.js');

const dbh_device =(datasin,callbackfn)=>{
  if(datasin.length === 0){
    debug_device(`dbh_device data is empty`);
    callbackfn(null,true);
    return;
  }

  //先排序,后去重
  datasin = _.sortBy(datasin, [(o)=>{
    const LastRealtimeAlarm_DataTime = _.get(o,'LastRealtimeAlarm.DataTime','');
    const LastHistoryTrack_GPSTime = _.get(o,'LastHistoryTrack.GPSTime','');
    const key = `${o.DeviceId}_${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
    return key;
  }]);

  datasin = _.sortedUniqBy(datasin,[(o)=>{
    const LastRealtimeAlarm_DataTime = _.get(o,'LastRealtimeAlarm.DataTime','');
    const LastHistoryTrack_GPSTime = _.get(o,'LastHistoryTrack.GPSTime','');
    const key = `${o.DeviceId}_${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
    return key;
  }]);

  let datas = [];
  _.map(datasin,(o)=>{
    const LastRealtimeAlarm_DataTime = _.get(o,'LastRealtimeAlarm.DataTime','');
    const LastHistoryTrack_GPSTime = _.get(o,'LastHistoryTrack.GPSTime','');
    if(!config.globaldevicetable[o.DeviceId]){
      //找不到
      datas.push(o);
      config.globaldevicetable[o.DeviceId] = `${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
    }
    else{
      if(config.globaldevicetable[o.DeviceId] !== `${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`){
        datas.push(o);
        config.globaldevicetable[o.DeviceId] = `${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
      }
    }
  });

  // datas = _.uniqBy(datas, (o)=>{
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
