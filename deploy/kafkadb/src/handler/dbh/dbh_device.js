const DBModels = require('../models.js');
const _ = require('lodash');
const debug_device = require('debug')('dbh:device');
const async = require('async');

const dbh_device =(datas,callbackfn)=>{
  if(datas.length === 0){
    debug_device(`dbh_alarm data is empty`);
    return;
  }
  const dbModel = DBModels.DeviceModel;
  debug_device(`start dbh_device,datas:${datas.length}`);
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
  const bulk = dbModel.collection.initializeUnorderedBulkOp();
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
      callbackfn(err,result);
    });
  }
  else{
    debug_device(`dbh_device err,bulk is null`);
    callbackfn();
  }
};

module.exports = dbh_device;
