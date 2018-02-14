const mongoose  = require('mongoose');
const async = require('async');
const _ = require('lodash');
const config = require('../config.js');
const moment = require('moment');
const alarmplugin = require('../plugins/alarmfilter/index');
const utilposition = require('./util_position');

const getdbdata_device = (devicedata,callbackfn)=>{
  devicedata.NodeID = config.NodeID;
  devicedata.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
  callbackfn(devicedata);
}

const getdbdata_historydevice = (devicedata,callbackfn)=>{
  const LastRealtimeAlarm = _.get(devicedata,'LastRealtimeAlarm');
  if(!!LastRealtimeAlarm){
    let result_device = _.clone(LastRealtimeAlarm);
    result_device = _.omit(result_device,['Alarm']);
    // if(!!alarmtxt && alarmtxt!==''){
    //   result_device.alarmtxt = alarmtxt;
    // }
    result_device.DeviceId = devicedata.DeviceId;
    result_device.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
    result_device.NodeID = config.NodeID;
    result_device.SN64 = devicedata.SN64;
    result_device.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    result_device.Provice = devicedata.Provice;
    result_device.City = devicedata.City;
    result_device.Area = devicedata.Area;

    //+以下语句便于调试
    result_device.recvpartition = devicedata.recvpartition;
    result_device.recvoffset = devicedata.recvoffset;

    result_device.warninglevel = devicedata.warninglevel;
    callbackfn(result_device);
    return;
  }
  callbackfn();
}


const getdbdata_historytrack = (devicedata,callbackfn)=>{
  const LastHistoryTrack = devicedata.LastHistoryTrack;
  if(!!LastHistoryTrack){
    let result_historytrack = _.clone(LastHistoryTrack);
    result_historytrack.DeviceId = devicedata.DeviceId;
    result_historytrack.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
    result_historytrack.NodeID = config.NodeID;
    result_historytrack.SN64 = devicedata.SN64;
    result_historytrack.Provice = devicedata.Provice;
    result_historytrack.City = devicedata.City;
    result_historytrack.Area = devicedata.Area;
    result_historytrack.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    callbackfn(result_historytrack);
    return;
  }
  callbackfn();
}

const getdbdata_alarmraw = (devicedata,callbackfn)=>{
  let  LastRealtimeAlarmRaw = _.get(devicedata,'LastRealtimeAlarm.Alarm');
  if(!!LastRealtimeAlarmRaw){
    //含有报警信息
    let result_alarm_raw = _.clone(LastRealtimeAlarmRaw);
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
    callbackfn(result_alarm_raw);
    return;
  }
  callbackfn();
}

const getdbdata_alarm = (devicedata,callbackfn)=>{
  const LastRealtimeAlarm = _.get(devicedata,'LastRealtimeAlarm');
  const LastHistoryTrack = _.get(devicedata,'LastHistoryTrack');
  if(!!LastRealtimeAlarm){//含有历史设备数据
    LastRealtimeAlarm.DeviceId = devicedata.DeviceId;
    alarmplugin.dofilter(devicedata.DeviceId,LastRealtimeAlarm,(err,result_alarm)=>{
      // //console.log(`result_alarm==>${JSON.stringify(result_alarm)}`);
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
        callbackfn(updated_data);
        return;
      }
      callbackfn();
    });
    return;
  }
  callbackfn();
}

const getindexmsgs = (data,callbackfn)=>{
  const getpoint = (v)=>{
    if(!v){
      return [0,0];
    }
    return [v.Longitude,v.Latitude];
  }

  const LastRealtimeAlarm = _.clone(data.BMSData);
  const LastHistoryTrack = _.clone(data.Position);

  const devicedata = _.omit(data,['BMSData','Position']);

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

      callbackfn(newdevicedata);
    });
  });

}

const getkafkamsg = (msg)=>{
  let payload = msg.value.toString();
  if(typeof payload === 'string'){
    try{
      payload = JSON.parse(payload);
    }
    catch(e){
      //console.log(`parse json eror ${JSON.stringify(e)}`);
    }
  }
  payload.recvpartition = msg.partition;
  payload.recvoffset = msg.offset;
  return payload;
}


const parseKafkaMsgs = (kafkamsgs,callbackfn)=>{
  const msgs = [];
  _.map(kafkamsgs,(msg)=>{
    msgs.push(getkafkamsg(msg));
  });
  const resultmsglist = {
    'device':[],
    'historydevice':[],
    'historytrack':[],
    'alarmraw':[],
    'alarm':[],
  };
  const fnsz = [];
  _.map(msgs,(msg)=>{
    fnsz.push((callbackfn)=>{
      getindexmsgs(msg,(newdevicedata)=>{
         const fnszmsg = [];
         fnszmsg.push((callbackfnmsg)=>{
           getdbdata_device(newdevicedata,(result)=>{
             callbackfnmsg(null,result);
           });
         });
         fnszmsg.push((callbackfnmsg)=>{
           getdbdata_historydevice(newdevicedata,(result)=>{
             callbackfnmsg(null,result);
           });
         });
         fnszmsg.push((callbackfnmsg)=>{
           getdbdata_historytrack(newdevicedata,(result)=>{
             callbackfnmsg(null,result);
           });
         });
         fnszmsg.push((callbackfnmsg)=>{
           getdbdata_alarmraw(newdevicedata,(result)=>{
             callbackfnmsg(null,result);
           });
         });
         fnszmsg.push((callbackfnmsg)=>{
           getdbdata_alarm(newdevicedata,(result)=>{
             callbackfnmsg(null,result);
           });
         });
         async.parallel(fnszmsg,(err,result)=>{
           if(!!result[0]){
             resultmsglist['device'].push(result[0]);
           }
           if(!!result[1]){
             resultmsglist['historydevice'].push(result[1]);
           }
           if(!!result[2]){
             resultmsglist['historytrack'].push(result[2]);
           }
           if(!!result[3]){
             resultmsglist['alarmraw'].push(result[3]);
           }
           if(!!result[4]){
             resultmsglist['alarm'].push(result[4]);
           }
           callbackfn();
         });
      });
    });
  });

  async.parallel(fnsz,(err,result)=>{
    callbackfn(resultmsglist);
  });
}
//
//
// const test = ()=>{
//
//   let jsondata =
//   {
//       "Version": "1.0",
//       "DeviceId": "1713100888",
//       "DeviceType": 2,
//       "DeviceStatus": 0,
//       "TroubleStatus": 0,
//       "SN64":1,
//       "Temperature_PCB": 0,
//       "BMSData": {
//           "CANType": 2,
//           "SN16": 591,
//           "DataTime": "2017-11-16 22:39:03",
//           "RecvTime": "2017-11-16 22:39:03",
//           "Alarm": {
//               "AL_Trouble_Code": 225,
//               "AL_Over_Ucell":2,
//               "AL_Under_Tcell":0,
//               "AL_Over_I_Dchg":1
//           },
//           "BAT_U_Out_HVS": 89.5,
//         }
//     };
//
//     const msgs = [];
//     let j= 0;
//     for(let i = 0;i < 5; i++){
//       jsondata.SN64 = j;
//       j++;
//       jsondata.BMSData.DataTime = moment().format('YYYY-MM-DD HH:mm:ss');
//       msgs.push(_.clone(jsondata));
//     }
//     parseMsgs(msgs,(resultmsglist)=>{
//       console.log(resultmsglist);
//     });
// }
//


exports.parseKafkaMsgs = parseKafkaMsgs;
