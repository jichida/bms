const DBModels = require('../models.js');
const _ = require('lodash');
const debug_alarm = require('debug')('dbh:alarm');
const async = require('async');

const dbh_alarm =(datas,callbackfn)=>{
  const dbModel = DBModels.RealtimeAlarmModel;
  debug_alarm(`start dbh_alarm,datas:${datas.length}`);
  // const asyncfnsz = [];
  // _.map(datas,(devicedata)=>{
  //   asyncfnsz.push(
  //     (callbackfn)=>{
  //       dbModel.findOneAndUpdate({
  //       		DeviceId:devicedata["$set"].DeviceId,
  //           CurDay:devicedata["$set"].CurDay,
  //        },{$set:devicedata},{upsert:true},callbackfn);
  //     }
  //   );
  // });
  // async.parallel(asyncfnsz,(err,result)=>{
  //     debug_alarm(`stop dbh_alarm`);
  //     callbackfn(err,result);
  // });
  const bulk = dbModel.collection.initializeUnorderedBulkOp();
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
        debug_alarm(`stop dbh_alarm`);
        callbackfn(err,result);
      });
    }
    else{
      debug_alarm(`dbh_device err,bulk is null`);
      callbackfn();
    }
};

module.exports = dbh_alarm;
