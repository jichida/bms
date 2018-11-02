const DBModels = require('../models.js');
const _ = require('lodash');
const debug_alarm = require('debug')('dbh:alarm');
const async = require('async');
const config = require('../../config.js');
const winston = require('../../log/log.js');

const dbh_alarm =(datasin,callbackfn)=>{
  if(datasin.length === 0){
    debug_alarm(`dbh_alarm data is empty`);
    callbackfn(null,[]);
    return;
  }

  // debug_alarm(`dbh_alarm->count:${datasin.length}`);
  // //先排序,后去重
  datasin = _.sortBy(datasin, [(o)=>{
    const key = `${o["$set"].DeviceId}_${o["$set"].DataTime}`;
    return key;
  }]);
  let datas = datasin;
  // debug_alarm(`after sortBy dbh_alarm->count:${datasin.length}`);
  //
  // datasin = _.sortedUniqBy(datasin,(o)=>{
  //   const key = `${o["$set"].DeviceId}_${o["$set"].DataTime}`;
  //   return key;
  // });
  // debug_alarm(`after sortedUniqBy dbh_alarm->count:${datasin.length}`);
  //
  // // debug_alarm(`cur start,globalalarmdevicetable:${JSON.stringify(config.globalalarmdevicetable)}`);
  // //去重
  // let datas = [];
  // _.map(datasin,(o)=>{
  //   const DeviceId_cur = o["$set"].DeviceId;
  //   const DataTime_cur = o["$set"].DataTime;
  //   if(!config.globalalarmdevicetable[DeviceId_cur]){
  //     //找不到
  //     datas.push(o);
  //     config.globalalarmdevicetable[DeviceId_cur] = DataTime_cur;
  //   }
  //   else{
  //     if(config.globalalarmdevicetable[DeviceId_cur] !== DataTime_cur){
  //       datas.push(o);
  //       config.globalalarmdevicetable[DeviceId_cur] = DataTime_cur;
  //     }
  //   }
  // });
  // debug_alarm(`cur end,globalalarmdevicetable:${JSON.stringify(config.globalalarmdevicetable)}`);
  //
  // if(datas.length < datasin.length){
  //   // debug_alarm(`去重有效,datas:${JSON.stringify(datas)},datasin:${JSON.stringify(datasin)}`);
  //   debug_alarm(`去重有效,datas:${datas.length},datasin:${datasin.length}`);
  // }
  //
  // if(datas.length === 0){
  //   debug_alarm(`dbh_alarm data is empty`);
  //   callbackfn(null,[]);
  //   return;
  // }
  //
  if(config.istest){
    winston.getlog().error(`开始插入报警统计:${datas.length}`);
  }
  let map_alarm_order = {};
  const dbModel = DBModels.RealtimeAlarmModel;
  debug_alarm(`start dbh_alarm,datas:${datas.length}`);
  const asyncfnsz = [];
  _.map(datas,(devicedata,index)=>{
    // devicedata.iorder = index;
    map_alarm_order[`${devicedata["$set"].DeviceId}_${devicedata["$set"].DataTime}`] = index;

    asyncfnsz.push(
      (callbackfn)=>{
        const DeviceId = devicedata["$set"].DeviceId;
        const CurDay = devicedata["$set"].CurDay;
        debug_alarm(`dbh_alarm--->DeviceId:${DeviceId},CurDay:${CurDay},devicedata:${JSON.stringify(devicedata)}`)
        dbModel.findOneAndUpdate({
        		DeviceId,
            CurDay,
         },devicedata,{upsert:true,new:true}).lean().exec((err,result)=>{
           // result.iorder = devicedata.iorder;
           if(!!err){
             winston.getlog().warn(`插入报警统计错误${DeviceId}--->`)
             winston.getlog().warn(devicedata)
             winston.getlog().warn(err);
           }
           callbackfn(err,result);
         });
      }
    );
  });
  async.series(asyncfnsz,(err,result)=>{
      if(!!err){

        if(datas.length > 0){
          winston.getlog().error(`插入报警统计错误`)
          winston.getlog().error(datas[0]);
        }
      }

      if(!err && !!result){
        //进行排序
        result = _.sortBy(result, [(o)=>{
          const key = `${o.DeviceId}_${o.DataTime}`;
          return key;
        }]);

        //add iorder & iorder2
        // if(config.istest){
          _.map(result,(o,index)=>{
            o.iorder = map_alarm_order[`${o.DeviceId}_${o.DataTime}`];
            o.iorder2 = index;
            if(config.istest){
              winston.getlog().warn(`[dbh_alarm]${o.DeviceId}->${o.DataTime}->iorder:${o.iorder}->iorder2:->${o.iorder2}`);
            }
          });
        // }

        if(datas.length !== result.length){
          debug_alarm(`dbh_alarm输入输出数据不符,${JSON.stringify(datas)}`);
          debug_alarm(`dbh_alarm输入输出数据不符,${JSON.stringify(result)}`);
          winston.getlog().warn(`dbh_alarm输入输出数据不符,${JSON.stringify(datas)}`)
          winston.getlog().warn(`dbh_alarm输入输出数据不符,${JSON.stringify(result)}`)
        }

      }


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
