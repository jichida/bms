const DBModels = require('../models.js');
const _ = require('lodash');
const debug_device = require('debug')('dbh:device');
const async = require('async');
const config = require('../../config.js');
const winston = require('../../log/log.js');

const dbh_device =(datasin,callbackfn)=>{
  if(datasin.length === 0){
    debug_device(`dbh_device data is empty`);
    callbackfn(null,true);
    return;
  }
  let datas = datasin;
  // //先排序,后去重
  // datasin = _.sortBy(datasin, [(o)=>{
  //   const LastRealtimeAlarm_DataTime = _.get(o,'LastRealtimeAlarm.DataTime','');
  //   const LastHistoryTrack_GPSTime = _.get(o,'LastHistoryTrack.GPSTime','');
  //   const key = `${o.DeviceId}_${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
  //   return key;
  // }]);
  //
  // datasin = _.sortedUniqBy(datasin,(o)=>{
  //   const LastRealtimeAlarm_DataTime = _.get(o,'LastRealtimeAlarm.DataTime','');
  //   const LastHistoryTrack_GPSTime = _.get(o,'LastHistoryTrack.GPSTime','');
  //   const key = `${o.DeviceId}_${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
  //   return key;
  // });
  //
  // let datas = [];
  // _.map(datasin,(o)=>{
  //   const LastRealtimeAlarm_DataTime = _.get(o,'LastRealtimeAlarm.DataTime','');
  //   const LastHistoryTrack_GPSTime = _.get(o,'LastHistoryTrack.GPSTime','');
  //   if(!config.globaldevicetable[o.DeviceId]){
  //     //找不到
  //     datas.push(o);
  //     config.globaldevicetable[o.DeviceId] = `${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
  //   }
  //   else{
  //     if(config.globaldevicetable[o.DeviceId] !== `${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`){
  //       datas.push(o);
  //       config.globaldevicetable[o.DeviceId] = `${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
  //     }
  //   }
  // });
  //
  // // datas = _.uniqBy(datas, (o)=>{
  // //   const LastRealtimeAlarm_DataTime = _.get(o,'LastRealtimeAlarm.DataTime','');
  // //   const LastHistoryTrack_GPSTime = _.get(o,'LastHistoryTrack.GPSTime','');
  // //   return `${o.DeviceId}_${LastRealtimeAlarm_DataTime}_${LastHistoryTrack_GPSTime}`;
  // // });
  //
  // if(datas.length < datasin.length){
  //   debug_device(`去重有效,datas:${datas.length},datasin:${datasin.length}`);
  // }
  // if(datas.length === 0){
  //   if(datasin.length > 0){
  //     debug_device(`--->${JSON.stringify(datasin[0])}`);
  //   }
  //   debug_device(`dbh_device data is empty`);
  //   callbackfn(null,true);
  //   return;
  // }
  if(config.istest){
    winston.getlog().error(`开始更新设备:${datas.length}`);
  }
  const dbModel = DBModels.DeviceModel;
  // debug_device(`start dbh_device,datas:${datas.length}`);
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
  const bulk = dbModel.collection.initializeOrderedBulkOp();
  if(!!bulk){
    _.map(datas,(devicedata)=>{
      //注：如果无报警,则清空报警字段,避免替换最后一次报警的值
      if(devicedata.warninglevel !== ''){
        devicedata.last_alarmtime = _.get(devicedata,'LastRealtimeAlarm.DataTime','');
        devicedata.last_warninglevel = devicedata.warninglevel;
        devicedata.last_alarmtxtstat = devicedata.alarmtxtstat;
      }
      //新增一个有效的最后经纬度
      if(_.get(devicedata,'LastHistoryTrack.Longitude',0) !== 0){
        devicedata.last_GPSTime = _.get(devicedata,'LastHistoryTrack.GPSTime','');
        devicedata.last_Longitude = _.get(devicedata,'LastHistoryTrack.Longitude',0);
        devicedata.last_Latitude = _.get(devicedata,'LastHistoryTrack.Latitude',0);
      }

      if(!devicedata.DeviceId){
        console.log(`这是一个无效的设备,这条数据会导致数据库报错:${JSON.stringify(devicedata)}`);
        winston.getlog().error(`这是一个无效的设备,这条数据会导致数据库报错:${JSON.stringify(devicedata)}`);
      }
      else{
        bulk.find({
            DeviceId:devicedata.DeviceId
          })
          .upsert()
          .updateOne({
            $set:devicedata
          });
      }
    });
    bulk.execute((err,result)=>{
      if(!!err){
        if(datas.length > 0){
          winston.getlog().error(`更新设备错误:${JSON.stringify(datas[0])}`);
        }
      }
      debug_device(`stop dbh_device`);
      callbackfn(null,true);
    });
  }
  else{
    debug_device(`dbh_device err,bulk is null`);
    callbackfn(null,true);
  }
};

module.exports = dbh_device;
