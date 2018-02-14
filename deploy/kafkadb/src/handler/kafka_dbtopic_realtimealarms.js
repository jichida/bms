const mongoose  = require('mongoose');
const DBModels = require('./models.js');
const _ = require('lodash');
const config = require('../config.js');
const alarmplugin = require('../plugins/alarmfilter/index');
const moment = require('moment');
const dbh = require('../handler/index.js');


const save_alarm = (devicedata,callbackfn)=>{
  const LastRealtimeAlarm = _.get(devicedata,'LastRealtimeAlarm');
  const LastHistoryTrack = _.get(devicedata,'LastHistoryTrack');
  if(!!LastRealtimeAlarm){//含有历史设备数据
    LastRealtimeAlarm.DeviceId = devicedata.DeviceId;
    alarmplugin.dofilter(devicedata.DeviceId,LastRealtimeAlarm,(err,result_alarm)=>{
      // console.log(`result_alarm==>${JSON.stringify(result_alarm)}`);
      if(!err && !!result_alarm){
        //含有报警信息
        let updated_data = {
          $inc: result_alarm.inc_data,
          CurDay:result_alarm.CurDay,
          DeviceId:result_alarm.DeviceId,
          DataTime:LastRealtimeAlarm.DataTime,
          warninglevel:result_alarm.warninglevel,
          NodeID:config.NodeID,
          SN64:devicedata.SN64,
          UpdateTime:moment().format('YYYY-MM-DD HH:mm:ss'),
          organizationid:mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
          Provice:devicedata.Provice,
          City:devicedata.City,
          Area:devicedata.Area,
        };
        if(!!LastHistoryTrack){
          updated_data.Longitude = LastHistoryTrack.Longitude;
          updated_data.Latitude = LastHistoryTrack.Latitude;
        }

        updated_data.warninglevel = devicedata.warninglevel;

        const dbRealtimeAlarmModel =  DBModels.RealtimeAlarmModel;
        dbRealtimeAlarmModel.findOneAndUpdate(
          {DeviceId:result_alarm.DeviceId,CurDay:result_alarm.CurDay},
          updated_data,
          {upsert:true,new: true},
          (err, result)=> {
            const handlerfn = dbh.gettopichandler(config.kafka_pushalaramtopic_app);
            if(!err && !!result && !!handlerfn){
              if(!!devicedata.warninglevel){
                if(devicedata.warninglevel !== ''){
                  handlerfn(result.toJSON(),(err,data)=>{
                    if(!!err){
                      console.log(`【kafka_dbtopic_realtimealarms handlerfn:${JSON.stringify(data)}`);
                      console.log(err);
                    }
                    console.log(`【kafka_dbtopic_realtimealarms saved`);
                    callbackfn(err,result);
                  });
                  return;
                }
              }
            }
            console.log(`【kafka_dbtopic_realtimealarms returned1`);
            callbackfn(err,result);
          });
        return;
      }//if(!err && !!result_alarm){
      console.log(`【kafka_dbtopic_realtimealarms returned2`);
      callbackfn();
    });//alarmplugin.dofilter
    return;
  }
  console.log(`【kafka_dbtopic_realtimealarms returned3`);
  callbackfn();
}

const kafka_dbtopic_realtimealarms = (devicedata,callbackfn)=>{
  console.log(`【kafka_dbtopic_realtimealarms,${config.NodeID}】接收成功${devicedata.SN64},${devicedata.DeviceId}`);
  save_alarm(devicedata,callbackfn);
}


module.exports = kafka_dbtopic_realtimealarms;
