const DBModels = require('../models.js');
const _ = require('lodash');
const debug_historytrack = require('debug')('dbh:historytrack');
const async = require('async');
const config = requre('../../config.js');

const dbh_historytrack =(datasin,callbackfn)=>{
  if(datasin.length === 0){
    debug_historytrack(`debug_historytrack data is empty`);
    callbackfn(null,true);
    return;
  }

  let datas = [];
  _.map(datasin,(o)=>{
    if(!config.globalhistorytracktable[o.DeviceId]){
      //找不到
      datas.push(o);
      config.globalhistorytracktable[o.DeviceId] = o.GPSTime;
    }
    else{
      if(config.globalhistorytracktable[o.DeviceId] !== o.GPSTime){
        datas.push(o);
        config.globalhistorytracktable[o.DeviceId] = o.GPSTime;
      }
    }
  });
  // const datas = _.uniqBy(datasin, (o)=>{
  //   return `${o.DeviceId}_${o.GPSTime}`;
  // });

  if(datas.length < datasin.length){
    debug_historytrack(`去重有效,datas:${datas.length},datasin:${datasin.length}`);
  }
  if(datas.length === 0){
    debug_historytrack(`debug_historytrack data is empty`);
    callbackfn(null,true);
    return;
  }

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
        console.error(`dbh_historytrack err`);
        console.error(err);
        console.error(err.stack);
      }
      debug_historytrack(`stop dbh_historytrack`);
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
