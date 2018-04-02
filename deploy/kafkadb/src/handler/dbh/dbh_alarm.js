const DBModels = require('../models.js');
const _ = require('lodash');
const debug_alarm = require('debug')('dbh:alarm');
const async = require('async');

let globalalarmdevicetable = {};//'deviceid'->'datatime'

const dbh_alarm =(datasin,callbackfn)=>{
  if(datasin.length === 0){
    debug_alarm(`dbh_alarm data is empty`);
    callbackfn(null,true);
    return;
  }
  //去重
  let datas = [];
  _.map(datasin,(o)=>{
    if(!globalalarmdevicetable[o.DeviceId]){
      //找不到
      datasin.push(o);
      globalalarmdevicetable[`DeviceId`] = o.DataTime;
    }
    else{
      if(globalalarmdevicetable[o.DeviceId] !== o.DataTime){
        datasin.push(o);
        globalalarmdevicetable[`DeviceId`] = o.DataTime;
      }
    }
  });
  // const datas = _.uniqBy(datasin, (o)=>{
  //   return `${o["$set"].DeviceId}_${o["$set"].DataTime}`;
  // });

  if(datas.length < datasin.length){
    // debug_alarm(`去重有效,datas:${JSON.stringify(datas)},datasin:${JSON.stringify(datasin)}`);
    debug_alarm(`去重有效,datas:${datas.length},datasin:${datasin.length}`);
  }
  //
  const dbModel = DBModels.RealtimeAlarmModel;
  debug_alarm(`start dbh_alarm,datas:${datas.length}`);
  const asyncfnsz = [];
  _.map(datas,(devicedata)=>{
    asyncfnsz.push(
      (callbackfn)=>{
        const DeviceId = devicedata["$set"].DeviceId;
        const CurDay = devicedata["$set"].CurDay;
        debug_alarm(`dbh_alarm--->DeviceId:${DeviceId},CurDay:${CurDay},devicedata:${JSON.stringify(devicedata)}`)
        dbModel.findOneAndUpdate({
        		DeviceId,
            CurDay,
         },devicedata,{upsert:true,new:true}).lean().exec(callbackfn);
      }
    );
  });
  async.series(asyncfnsz,(err,result)=>{
      debug_alarm(`stop dbh_alarm,err:${JSON.stringify(err)}`);
      // debug_alarm(`stop dbh_alarm,result:${JSON.stringify(result)}`);
      callbackfn(err,result);
  });
  // const bulk = dbModel.collection.initializeUnorderedBulkOp();
  // if(!!bulk){
  //     _.map(datas,(devicedata)=>{
  //       bulk.find({
  //       		DeviceId:devicedata["$set"].DeviceId,
  //       	})
  //         .upsert()
  //         .updateOne(devicedata);
  //     });
  //     bulk.execute((err,result)=>{
  //       if(!!err){
  //         console.error(`dbh_alarm err`);
  //         console.error(err);
  //         console.error(err.stack);
  //       }
  //       const ids =  result.getUpsertedIds();;
  //       debug_alarm(`${JSON.stringify(ids)}`);
  //       debug_alarm(`stop dbh_alarm`);
  //       callbackfn(null,true);
  //     });
  //   }
  //   else{
  //     debug_alarm(`dbh_device err,bulk is null`);
  //     callbackfn(null,true);
  //   }
};

module.exports = dbh_alarm;
