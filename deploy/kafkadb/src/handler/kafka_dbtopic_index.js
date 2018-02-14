const mongoose  = require('mongoose');
const async = require('async');
const DBModels = require('./models.js');
const _ = require('lodash');
const alarmplugin = require('../plugins/alarmfilter/index');
const moment = require('moment');
const alarm = require('./getalarmtxt');
const config = require('../config.js');
const utilposition = require('./util_position');
const dbh = require('../handler/index.js');


const getpoint = (v)=>{
  if(!v){
    return [0,0];
  }
  return [v.Longitude,v.Latitude];
}


const kafka_dbtopic_index = (data,callbackfn)=>{


  const LastRealtimeAlarm = _.clone(data.BMSData);
  const LastHistoryTrack = _.clone(data.Position);

  const devicedata = _.omit(data,['BMSData','Position']);

//==============
  // console.log(`【kafka_dbtopic_index,${config.NodeID}】接收成功${devicedata.SN64},${devicedata.DeviceId}`);

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
      let newdevicedata = _.merge(devicedata,retobj);

      newdevicedata.indexrecvpartition = data.recvpartition;
      newdevicedata.indexrecvoffset = data.recvoffset;


      const asyncfnsz = [
        (callbackfn)=>{
          const handlerfn = dbh.gettopichandler(config.kafka_dbtopic_devices);
          handlerfn(newdevicedata,(err,data)=>{
            if(!!err){
              console.log(`kafka_dbtopic_devices sendtokafka:${JSON.stringify(newdevicedata)}`);
              console.log(err);
            }
          });
        },
        (callbackfn)=>{
          const handlerfn = dbh.gettopichandler(config.kafka_dbtopic_historydevices);
          handlerfn(newdevicedata,(err,data)=>{
            if(!!err){
              console.log(`kafka_dbtopic_historydevices:${JSON.stringify(newdevicedata)}`);
              console.log(err);
            }
          });
        },
        (callbackfn)=>{
          const handlerfn = dbh.gettopichandler(config.kafka_dbtopic_historytracks);
          handlerfn(newdevicedata,(err,data)=>{
            if(!!err){
              console.log(`kafka_dbtopic_historytracks:${JSON.stringify(newdevicedata)}`);
              console.log(err);
            }
          });
        },
        (callbackfn)=>{
          const handlerfn = dbh.gettopichandler(config.kafka_dbtopic_realtimealarms);
          handlerfn(newdevicedata,(err,data)=>{
            if(!!err){
              console.log(`kafka_dbtopic_realtimealarms:${JSON.stringify(newdevicedata)}`);
              console.log(err);
            }
          });
        },
        (callbackfn)=>{
          const handlerfn = dbh.gettopichandler(config.kafka_dbtopic_realtimealarmraws);
          handlerfn(newdevicedata,(err,data)=>{
            if(!!err){
              console.log(`kafka_dbtopic_realtimealarmraws:${JSON.stringify(newdevicedata)}`);
              console.log(err);
            }
          });
        }
      ];

      async.parallel(asyncfnsz,(err,result)=>{
        callbackfn(err,result);
      });
      return;


    });//utilposition.getpostion_frompos
  });//alarmplugin.matchalarm

  callbackfn();
};


module.exports = kafka_dbtopic_index;
