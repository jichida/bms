const DBModels = require('../models.js');
const _ = require('lodash');
const debug_historydevice = require('debug')('dbh:historydevice');
const async = require('async');

const dbh_historydevice =(datas,callbackfn)=>{
  const dbModel = DBModels.HistoryDeviceModel;
  debug_historydevice(`start dbh_historydevice,datas:${datas.length}`);
  const asyncfnsz = [];
  _.map(datas,(devicedata)=>{
    asyncfnsz.push(
      (callbackfn)=>{
        dbModel.findOneAndUpdate({
              GUID:devicedata.GUID,
              DeviceId:devicedata.DeviceId,
              DataTime:devicedata.DataTime
         },{$set:devicedata},{upsert:true},callbackfn);
      }
    );
  });
  async.parallel(asyncfnsz,(err,result)=>{
      debug_historydevice(`stop dbh_historydevice`);
      callbackfn(err,result);
  });

  // debug_historydevice(`start dbh_historydevice`);
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
  // const bulk = dbModel.collection.initializeUnorderedBulkOp();
  // if(!!bulk){
  //   _.map(datas,(devicedata)=>{
  //     bulk.insert(devicedata);
  //     // bulk.find({
  //     //     GUID:devicedata.GUID,
  //     //     DeviceId:devicedata.DeviceId,
  //     //     DataTime:devicedata.DataTime
  //     //   })
  //     //   .upsert()
  //     //   .updateOne({
  //     //     $set:devicedata
  //     //   });
  //   });
  //   bulk.execute((err,result)=>{
  //     if(!!err){
  //       console.error(`dbh_historydevice err`);
  //       console.error(err);
  //       console.error(err.stack);
  //     }
  //     debug_historydevice(`stop dbh_historydevice`);
  //     callbackfn(err,result);
  //   });
  // }
  // else{
  //   console.error(`dbh_device err,bulk is null`);
  //   callbackfn();
  // }
  // dbModel.insertMany(datas, (err, result)=>{
  //   callbackfn(err,result);
  // });
};

module.exports = dbh_historydevice;
