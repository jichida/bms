const DBModels = require('../models.js');
const _ = require('lodash');
const debug_historytrack = require('debug')('dbh:historytrack');
const async = require('async');
const config = require('../../config.js');
const winston = require('../../log/log.js');

const dbh_historytrack =(datasin,callbackfn)=>{
  if(datasin.length === 0){
    debug_historytrack(`debug_historytrack data is empty`);
    callbackfn(null,true);
    return;
  }
  let datas = datasin;
  debug_historytrack(`datas start:${datasin.length}`);
  if(config.istest){
    winston.getlog().error(`开始更新历史轨迹:${datas.length}`);
  }
  //先排序,后去重
  // datasin = _.sortBy(datasin, [(o)=>{
  //   const key = `${o.DeviceId}_${o.GPSTime}`;
  //   return key;
  // }]);
  //
  // datasin = _.sortedUniqBy(datasin,(o)=>{
  //   const key = `${o.DeviceId}_${o.GPSTime}`;
  //   return key;
  // });
  //
  // debug_historytrack(`datas end:${datasin.length}`);
  //
  // let datas = [];
  // _.map(datasin,(o)=>{
  //   if(!config.globalhistorytracktable[o.DeviceId]){
  //     //找不到
  //     datas.push(o);
  //     config.globalhistorytracktable[o.DeviceId] = o.GPSTime;
  //   }
  //   else{
  //     if(config.globalhistorytracktable[o.DeviceId] !== o.GPSTime){
  //       datas.push(o);
  //       config.globalhistorytracktable[o.DeviceId] = o.GPSTime;
  //     }
  //   }
  // });
  //
  //
  // if(datas.length < datasin.length){
  //   debug_historytrack(`去重有效,datas:${datas.length},datasin:${datasin.length}`);
  // }
  // if(datas.length === 0){
  //   debug_historytrack(`debug_historytrack data is empty`);
  //   callbackfn(null,true);
  //   return;
  // }

  const dbModel = DBModels.HistoryTrackModel;
  debug_historytrack(`start dbh_historytrack,datas:${datas.length}`);
  // const asyncfnsz = [];
  // _.map(datas,(devicedata)=>{
  //   asyncfnsz.push(
  //     (callbackfn)=>{
  //       dbModel.findOneAndUpdate({
  //             GUID:devicedata.GUID,
  //             DeviceId:devicedata.DeviceId,
  //             TimeKey:devicedata.TimeKey,
  //        },{$set:devicedata},{upsert:true},callbackfn);
  //     }
  //   );
  // });
  // async.parallel(asyncfnsz,(err,result)=>{
  //     debug_historytrack(`stop dbh_historytrack`);
  //     callbackfn(err,result);
  // });
  const bulk = dbModel.collection.initializeUnorderedBulkOp();
  if(!!bulk){
    _.map(datas,(devicedata)=>{
      bulk.insert(devicedata);
      // bulk.find({
      //     GUID:devicedata.GUID,
      //     DeviceId:devicedata.DeviceId,
      //     TimeKey:devicedata.TimeKey,
      //   })
      //   .upsert()
      //   .updateOne({
      //     $set:devicedata
      //   });
    });
    bulk.execute((err,result)=>{
      if(!!err){
        if(datas.length > 0){
          winston.getlog().error(`更新历史轨迹错误:${JSON.stringify(datas[0])}`);
        }
      }
      debug_historytrack(`stop dbh_historytrack`);
      if(config.istest){
        winston.getlog().error(`历史轨迹更新完毕:${datas.length}`);
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

module.exports = dbh_historytrack;
