const DBModels = require('../models.js');
const _ = require('lodash');
const debug_historytrack = require('debug')('dbh:historytrack');

const dbh_historytrack =(datas,callbackfn)=>{
  const dbModel = DBModels.HistoryTrackModel;
  debug_historytrack(`start dbh_historytrack`);
  const bulk = dbModel.collection.initializeUnorderedBulkOp();
  if(!!bulk){
    _.map(datas,(devicedata)=>{
      bulk.insert(devicedata);
      // bulk.find({
      //     GUID:devicedata.GUID,
      //     DeviceId:devicedata.DeviceId,
      //     GPSTime:devicedata.GPSTime,
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

module.exports = dbh_historytrack;
