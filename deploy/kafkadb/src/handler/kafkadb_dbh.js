const DBModels = require('./models.js');
const async = require('async');
const _ = require('lodash');
const config = require('../config.js');
const debug = require('debug')('dbh');

const dbh_device =(datas,callbackfn)=>{
  const dbModel = DBModels.DeviceModel;
  debug(`start dbh_device`);
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
      debug(`stop dbh_device`);
      callbackfn(err,result);
    });
  }
  else{
    console.error(`dbh_device err,bulk is null`);
    callbackfn();
  }
};

const dbh_historydevice =(datas,callbackfn)=>{
  const dbModel = DBModels.HistoryDeviceModel;
  debug(`start dbh_historydevice`);
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
        console.error(`dbh_historydevice err`);
        console.error(err);
        console.error(err.stack);
      }
      debug(`stop dbh_historydevice`);
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

const dbh_historytrack =(datas,callbackfn)=>{
  const dbModel = DBModels.HistoryTrackModel;
  debug(`start dbh_historytrack`);
  const bulk = dbModel.collection.initializeOrderedBulkOp();
  if(!!bulk){
    _.map(datas,(devicedata)=>{
      bulk.find({
          GUID:devicedata.GUID,
          DeviceId:devicedata.DeviceId,
          GPSTime:devicedata.GPSTime,
        })
        .upsert()
        .updateOne({
          $set:devicedata
        });
    });
    bulk.execute((err,result)=>{
      if(!!err){
        console.error(`dbh_historytrack err`);
        console.error(err);
        console.error(err.stack);
      }
      debug(`stop dbh_historytrack`);
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

const dbh_alarmraw =(datas,callbackfn)=>{
  const dbModel = DBModels.RealtimeAlarmRawModel;
  debug(`start dbh_alarmraw`);
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
      debug(`stop dbh_alarmraw`);
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

const dbh_alarm =(datas,callbackfn)=>{
  const dbModel = DBModels.RealtimeAlarmModel;
  debug(`start dbh_alarm`);
  const bulk = dbModel.collection.initializeOrderedBulkOp();
  if(!!bulk){
      _.map(datas,(devicedata)=>{
        bulk.find({
        		DeviceId:devicedata["$set"].DeviceId,
            CurDay:devicedata["$set"].CurDay,
        	})
          .upsert()
          .updateOne(devicedata);
      });
      bulk.execute((err,result)=>{
        if(!!err){
          console.error(`dbh_alarm err`);
          console.error(err);
          console.error(err.stack);
        }
        debug(`stop dbh_alarm`);
        callbackfn(err,result);
      });
    }
    else{
      console.error(`dbh_device err,bulk is null`);
      callbackfn();
    }
};

const onHandleToDB = (allresult,callbackfn)=>{
  let fnsz = [];
  fnsz.push((callbackfn)=>{
    dbh_device(allresult['device'],callbackfn);
  });
  fnsz.push((callbackfn)=>{
    dbh_historydevice(allresult['historydevice'],callbackfn);
  });
  fnsz.push((callbackfn)=>{
    dbh_historytrack(allresult['historytrack'],callbackfn);
  });
  fnsz.push((callbackfn)=>{
    dbh_alarm(allresult['alarm'],callbackfn);
  });
  fnsz.push((callbackfn)=>{
    dbh_alarmraw(allresult['alarmraw'],callbackfn);
  });
  debug(`start onHandleToDB`);
  async.parallel(fnsz,(err,result)=>{
    debug(`stop onHandleToDB`);
    callbackfn(err,result);
  });
};

module.exports = onHandleToDB;
