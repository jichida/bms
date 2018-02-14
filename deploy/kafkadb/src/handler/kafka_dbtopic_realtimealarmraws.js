
const mongoose  = require('mongoose');
const DBModels = require('./models.js');
const _ = require('lodash');
const config = require('../config.js');
const moment = require('moment');

const save_alarmraw = (devicedata,callbackfn)=>{
  let  result_alarm_raw = _.get(devicedata,'LastRealtimeAlarm.Alarm');
  if(!!result_alarm_raw){
    //含有报警信息
    result_alarm_raw.DeviceId = devicedata.DeviceId;
    result_alarm_raw.DataTime = devicedata.LastRealtimeAlarm.DataTime;

    if(!!devicedata.LastHistoryTrack){
      result_alarm_raw.Longitude = devicedata.LastHistoryTrack.Longitude;
      result_alarm_raw.Latitude = devicedata.LastHistoryTrack.Latitude;
    }
    result_alarm_raw.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
    result_alarm_raw.NodeID = config.NodeID;
    result_alarm_raw.SN64 = devicedata.SN64;
    result_alarm_raw.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    result_alarm_raw.Provice = devicedata.Provice;
    result_alarm_raw.City = devicedata.City;
    result_alarm_raw.Area = devicedata.Area;
    result_alarm_raw.warninglevel = devicedata.warninglevel;
    // alarmplugin.matchalarm(result_alarm_raw,(resultalarmmatch)=>{
    //   result_alarm_raw.resultalarmmatch = resultalarmmatch;
    //   if(resultalarmmatch.length > 0){
    //     result_alarm_raw.warninglevel = resultalarmmatch[0].warninglevel;
    //     result_alarm_raw.alarmtxt = resultalarmmatch[0].alarmtxt;
    //   }
      const entity = new DBModels.RealtimeAlarmRawModel(result_alarm_raw);
      entity.save((err,result)=>{
        console.log(`kafka_dbtopic_realtimealarmraws saved`);
        callbackfn(err,result);
      });
    // });
    return;
  }
  console.log(`kafka_dbtopic_realtimealarmraws return`);
  callbackfn();
};

const kafka_dbtopic_realtimealarmraws = (devicedata,callbackfn)=>{
  console.log(`【kafka_dbtopic_realtimealarmraws,${config.NodeID}】接收成功${devicedata.SN64},${devicedata.DeviceId}`);
  save_alarmraw(devicedata,callbackfn);
}


module.exports = kafka_dbtopic_realtimealarmraws;
