const DBModels = require('../models.js');
const _ = require('lodash');
const debug_historydevice = require('debug')('dbh:historydevice');
const async = require('async');
const config = require('../../config.js');

const dbh_historydevice =(datasin,callbackfn)=>{
  if(datasin.length === 0){
    debug_historydevice(`dbh_historydevice data is empty`);
    callbackfn(null,true);
    return;
  }

  debug_historydevice(`datas start:${datasin.length}`);
  datasin = _.uniqBy(datasin, (o)=>{
    return `${o.DeviceId}_${o.DataTime}`;
  });

  debug_historydevice(`${datasin.length} cur start,globalhistorydevicetable:${JSON.stringify(config.globalhistorydevicetable)}`);

  let datas = [];
  _.map(datasin,(o)=>{
    if(!config.globalhistorydevicetable[o.DeviceId]){
      //找不到
      datas.push(o);
      config.globalhistorydevicetable[o.DeviceId] = o.DataTime;
    }
    else{
      if(config.globalhistorydevicetable[o.DeviceId] !== o.DataTime){
        datas.push(o);
        config.globalhistorydevicetable[o.DeviceId] = o.DataTime;
      }
    }
  });

  debug_historydevice(`cur end,globalhistorydevicetable:${JSON.stringify(config.globalhistorydevicetable)}`);

  // datas = _.uniqBy(datas, (o)=>{
  //   return `${o.DeviceId}_${o.DataTime}`;
  // });

  if(datas.length < datasin.length){
    debug_historydevice(`去重有效,datas:${datas.length},datasin:${datasin.length}`);
  }
  if(datas.length === 0){
    debug_historydevice(`debug_historydevice data is empty`);
    callbackfn(null,true);
    return;
  }

  const dbModel = DBModels.HistoryDeviceModel;
  debug_historydevice(`start dbh_historydevice,datas:${datas.length}`);
  // const asyncfnsz = [];
  // _.map(datas,(devicedata)=>{
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
  //     debug_historydevice(`stop dbh_historydevice`);
  //     callbackfn(err,result);
  // });

  // bulkInsertOps = [];
  // _.map(datas,(devicedata)=>{
  //   bulkInsertOps.push({
  //       insertOne :
  //       {
  //          "document" :devicedata
  //       }
  //   })
  // });
  // dbModel.bulkWrite(bulkInsertOps, {ordered: false},callbackfn);
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
        console.error(`dbh_historydevice err`);
        console.error(err);
        console.error(err.stack);
      }
      debug_historydevice(`stop dbh_historydevice`);
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

module.exports = dbh_historydevice;
