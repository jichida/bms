const mongoose  = require('mongoose');
const async = require('async');
const DBModels = require('./models.js');
const _ = require('lodash');
const alarmplugin = require('../plugins/alarmfilter/index');
const moment = require('moment');
const getalarmtxt = require('./getalarmtxt');
const config = require('../config.js');
const utilposition = require('./util_position');
const sendtokafka = require('../kafka/sendtokafka');


const getpoint = (v)=>{
  if(!v){
    return [0,0];
  }
  return [v.Longitude,v.Latitude];
}


const kafka_dbtopic_index = (data,callback)=>{


  const LastRealtimeAlarm = _.clone(data.BMSData);
  const LastHistoryTrack = _.clone(data.Position);

  const devicedata = _.omit(data,['BMSData','Position']);

//==============
  console.log(`【kafka_dbtopic_index,${config.NodeID}】接收成功${devicedata.SN64},${devicedata.DeviceId}`);
  // const logresult = {
  //   SN64:devicedata.SN64,
  //   NodeID:config.NodeID,
  //   DeviceId:devicedata.DeviceId,
  // }
  // sendtokafka(logresult,config.kafka_bmslogtopic,(err,data)=>{
  //   if(!!err){
  //     console.log(`log sendtokafka:${JSON.stringify(data)}`);
  //     console.log(err);
  //   }
  // });
//==============

  if(!!LastRealtimeAlarm){
    devicedata.LastRealtimeAlarm = LastRealtimeAlarm;
  }
  if(!!LastHistoryTrack){
    devicedata.LastHistoryTrack = LastHistoryTrack;
  }
  devicedata.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');

  alarmplugin.matchalarm(_.get(devicedata,'LastRealtimeAlarm.Alarm'),(resultalarmmatch)=>{
    if(resultalarmmatch.length > 0){
      devicedata.warninglevel = resultalarmmatch[0].warninglevel;
    }

    utilposition.getpostion_frompos(getpoint(LastHistoryTrack),(retobj)=>{
      const newdevicedata = _.merge(devicedata,retobj);
      const sendto = sendtokafka.getsendtokafka();
      if(!!sendto){
        sendto(newdevicedata,config.kafka_dbtopic_devices,(err,data)=>{
          if(!!err){
            console.log(`kafka_dbtopic_devices sendtokafka:${JSON.stringify(newdevicedata)}`);
            console.log(err);
          }
        });
        sendto(newdevicedata,config.kafka_dbtopic_historydevices,(err,data)=>{
          if(!!err){
            console.log(`kafka_dbtopic_historydevices:${JSON.stringify(newdevicedata)}`);
            console.log(err);
          }
        });
        sendto(newdevicedata,config.kafka_dbtopic_historytracks,(err,data)=>{
          if(!!err){
            console.log(`kafka_dbtopic_historytracks:${JSON.stringify(newdevicedata)}`);
            console.log(err);
          }
        });
        sendto(newdevicedata,config.kafka_dbtopic_realtimealarms,(err,data)=>{
          if(!!err){
            console.log(`kafka_dbtopic_realtimealarms:${JSON.stringify(newdevicedata)}`);
            console.log(err);
          }
        });
        sendto(newdevicedata,config.kafka_dbtopic_devices,(err,data)=>{
          if(!!err){
            console.log(`kafka_dbtopic_realtimealarmraws:${JSON.stringify(newdevicedata)}`);
            console.log(err);
          }
        });
      }

      // const asyncfnsz = [
      //   (callbackfn)=>{
      //     save_device(newdevicedata,callbackfn);
      //   },
      //   (callbackfn)=>{
      //     save_alarm(newdevicedata,callbackfn);
      //   },
      //   (callbackfn)=>{
      //     save_alarmraw(newdevicedata,callbackfn);
      //   },
      //   (callbackfn)=>{
      //     save_lasthistorytrack(newdevicedata,callbackfn);
      //   },
      // ];
      // const newdoc = _.merge(doc,retobj);
      // callbackfn({
      //   '设备编号':newdoc.DeviceId,
      //   '定位时间':newdoc.GPSTime,
      //   '省':newdoc.Provice,
      //   '市':newdoc.City,
      //   '区':newdoc.Area,
      // });
      // async.parallel(asyncfnsz,(err,result)=>{
      //   let alarmtxt;
      //   if(!err && !!result){
      //     if(!!result[1]){
      //       const alarm = result[1].toJSON();
      //       alarmtxt = getalarmtxt(alarm);
      //     }
      //   }
      //   save_historydevice(devicedata,alarmtxt,(err,result)=>{
      //     if(!!err){
      //       console.log(`save_historydevice:${JSON.stringify(devicedata)}`);
      //       console.log(err);
      //     }
      //   });
      //
      //   if(!!err){
      //     console.log(`parallel:${JSON.stringify(result)}`);
      //     console.log(err);
      //   }
      // });

    });
  });


};


module.exports = kafka_dbtopic_index;
