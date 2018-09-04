const mongoose  = require('mongoose');
const async = require('async');
const _ = require('lodash');
const config = require('../config.js');
const moment = require('moment');
const alarmplugin = require('../plugins/alarmfilter/index');
const deviceplugin = require('../plugins/devicefilter/index');
// const utilposition = require('./util_position');
const debug = require('debug')('dbdata');
const winston = require('../log/log.js');

const getdbdata_device = (devicedata)=>{
  devicedata.NodeID = config.NodeID;
  // devicedata.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
  // callbackfn(devicedata);
  return devicedata;
}

const getdbdata_historydevice = (devicedata)=>{
  const LastRealtimeAlarm = _.get(devicedata,'LastRealtimeAlarm');
  if(!!LastRealtimeAlarm){
    if(_.get(devicedata,'LastRealtimeAlarm.BMSFlag',1) === 1){
      let result_device = _.clone(LastRealtimeAlarm);
      // result_device = _.omit(result_device,['Alarm']);保留报警便于定位问题
      // if(!!alarmtxt && alarmtxt!==''){
      //   result_device.alarmtxt = alarmtxt;
      // }
      result_device.DeviceId = devicedata.DeviceId;
      result_device.TimeKey = moment(result_device.DataTime).format('YYMMDD');
      // result_device.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
      result_device.NodeID = config.NodeID;
      result_device.SN64 = devicedata.SN64;
      result_device.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      if(!!devicedata.Provice){
        result_device.Provice = devicedata.Provice;
        result_device.City = devicedata.City;
        result_device.Area = devicedata.Area;
      }

      result_device.GUID = devicedata.GUID;
      //+以下语句便于调试
      result_device.recvpartition = devicedata.recvpartition;
      result_device.recvoffset = devicedata.recvoffset;

      result_device.warninglevel = devicedata.warninglevel;

      if(!!devicedata.LastHistoryTrack){
        result_device.Longitude = devicedata.LastHistoryTrack.Longitude;
        result_device.Latitude = devicedata.LastHistoryTrack.Latitude;
        result_device.GPSTime = devicedata.LastHistoryTrack.GPSTime;
      }
      return result_device;
    }
  }
}


const getdbdata_historytrack = (devicedata)=>{
  const LastHistoryTrack = devicedata.LastHistoryTrack;
  if(!!LastHistoryTrack){
    if(_.get(devicedata,'LastHistoryTrack.POSFlag',1) === 1){
      let result_historytrack = _.clone(LastHistoryTrack);
      result_historytrack.DeviceId = devicedata.DeviceId;
      result_historytrack.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
      result_historytrack.NodeID = config.NodeID;
      result_historytrack.SN64 = devicedata.SN64;
      result_historytrack.GUID = devicedata.GUID;
      if(!!devicedata.Provice){
        result_historytrack.Provice = devicedata.Provice;
        result_historytrack.City = devicedata.City;
        result_historytrack.Area = devicedata.Area;
      }

      //+以下语句便于调试
      result_historytrack.recvpartition = devicedata.recvpartition;
      result_historytrack.recvoffset = devicedata.recvoffset;

      result_historytrack.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      if(!!result_historytrack.GPSTime){
        result_historytrack.TimeKey = moment(result_historytrack.GPSTime).format('YYMMDD');
        return result_historytrack;
      }
    }
  }
}

const getdbdata_alarmraw = (devicedata)=>{
  // if(!devicedata.warninglevel || devicedata.warninglevel === ''){
  //   return;
  // }
  let  LastRealtimeAlarmRaw = _.get(devicedata,'LastRealtimeAlarm.Alarm');
  if(!!LastRealtimeAlarmRaw){
    if(_.get(devicedata,'LastRealtimeAlarm.BMSFlag',1) === 1){
      //含有报警信息
      let result_alarm_raw = _.clone(LastRealtimeAlarmRaw);
      result_alarm_raw.DeviceId = devicedata.DeviceId;
      result_alarm_raw.DataTime = devicedata.LastRealtimeAlarm.DataTime;
      result_alarm_raw.GUID = devicedata.GUID;
      if(!!devicedata.LastHistoryTrack){
        result_alarm_raw.Longitude = devicedata.LastHistoryTrack.Longitude;
        result_alarm_raw.Latitude = devicedata.LastHistoryTrack.Latitude;
        result_alarm_raw.GPSTime = devicedata.LastHistoryTrack.GPSTime;
      }
      result_alarm_raw.TimeKey = moment(result_alarm_raw.DataTime).format('YYMMDD');
      // result_alarm_raw.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
      result_alarm_raw.NodeID = config.NodeID;
      result_alarm_raw.SN64 = devicedata.SN64;
      result_alarm_raw.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
      if(!!devicedata.Provice){
        result_alarm_raw.Provice = devicedata.Provice;
        result_alarm_raw.City = devicedata.City;
        result_alarm_raw.Area = devicedata.Area;
      }

      result_alarm_raw.warninglevel = devicedata.warninglevel;
      //+以下语句便于调试
      result_alarm_raw.recvpartition = devicedata.recvpartition;
      result_alarm_raw.recvoffset = devicedata.recvoffset;

      return result_alarm_raw;
    }
  }
}

const getdbdata_alarm = (devicedata,callbackfn)=>{
  const LastRealtimeAlarm = _.get(devicedata,'LastRealtimeAlarm');
  const LastHistoryTrack = _.get(devicedata,'LastHistoryTrack');
  if(!!LastRealtimeAlarm){//含有历史设备数据
    if(_.get(devicedata,'LastRealtimeAlarm.BMSFlag',1) === 1){
      LastRealtimeAlarm.DeviceId = devicedata.DeviceId;
      alarmplugin.dofilter(devicedata.DeviceId,LastRealtimeAlarm,(err,result_alarm)=>{
        // console.log(`result_alarm==>${JSON.stringify(result_alarm)}`);
        if(!err && !!result_alarm){
          //含有报警信息
          let updatedset = {
            CurDay:result_alarm.CurDay,
            DeviceId:result_alarm.DeviceId,
            DataTime:LastRealtimeAlarm.DataTime,
            warninglevel:devicedata.warninglevel,//<---------注意！！！
            NodeID:config.NodeID,
            SN64:devicedata.SN64,
            UpdateTime:moment().format('YYYY-MM-DD HH:mm:ss'),
            organizationid:mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
          };
          if(!!devicedata.Provice){
            updatedset.Provice = devicedata.Provice;
            updatedset.City = devicedata.City;
            updatedset.Area = devicedata.Area;
          }

          if(!!LastHistoryTrack){
            updatedset.Longitude = LastHistoryTrack.Longitude;
            updatedset.Latitude = LastHistoryTrack.Latitude;
            updatedset.GPSTime = LastHistoryTrack.GPSTime;
          }
          let updated_data = {"$set":updatedset};
          if(!!result_alarm.inc_data){
            updated_data["$inc"] = result_alarm.inc_data;
          }
          //{ $addToSet: { tags: { $each: [ "camera", "electronics", "accessories" ] } } }
          const TROUBLE_CODE_LIST = _.get(LastRealtimeAlarm,'Alarm.TROUBLE_CODE_LIST',[]);
          updated_data["$addToSet"] = { TROUBLE_CODE_LIST: { $each: TROUBLE_CODE_LIST} } ;

          callbackfn(updated_data);
          return;
        }
        callbackfn();
      });
      return;
    }
  }
  callbackfn();
}

//这里转移两个标志"BMSFlag":0,"POSFlag":0
const getindexmsgs = (data,callbackfn)=>{
  // const getpoint = (v)=>{
  //   if(!v){
  //     return [0,0];
  //   }
  //   return [v.Longitude,v.Latitude];
  // }

  let LastRealtimeAlarm = _.clone(data.BMSData);
  let LastHistoryTrack = _.clone(data.Position);


  const devicedata = _.omit(data,['BMSData','Position']);
  devicedata.GUID = data.GUID;
  if(!!LastRealtimeAlarm){
    LastRealtimeAlarm.BMSFlag = _.get(data,'BMSFlag',1);
    devicedata.LastRealtimeAlarm = LastRealtimeAlarm;
  }
  if(!!LastHistoryTrack){
    LastHistoryTrack.POSFlag = _.get(data,'POSFlag',1);
    if(!!LastHistoryTrack.GPSTime){
      LastHistoryTrack.GPSTime = moment(LastHistoryTrack.GPSTime).add(8,'hours').format('YYYY-MM-DD HH:mm:ss');
    }
    devicedata.LastHistoryTrack = LastHistoryTrack;

  }
  devicedata.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');

  alarmplugin.matchalarm(_.get(devicedata,'LastRealtimeAlarm.Alarm'),(resultalarmmatch)=>{
    devicedata.warninglevel = '';//empty
    if(resultalarmmatch.length > 0){
      devicedata.warninglevel = resultalarmmatch[0].warninglevel;
    }

    //------取最大的warninglevel
    let level = {
      '高':3,
      '中':2,
      '低':1,
    }
    const config_warninglevel = _.get(config,`gloabaldevicealarmstat_realtime.${devicedata.DeviceId}.warninglevel`,'');
    if(_.get(level,`${config_warninglevel}`,0) > _.get(level,`${devicedata.warninglevel}`,0)){
      devicedata.warninglevel = config_warninglevel;
    }
    //------取最大的warninglevel

    // utilposition.getpostion_frompos(getpoint(LastHistoryTrack),(retobj)=>{
    //   let newdevicedata = _.merge(devicedata,retobj);
    let newdevicedata = _.clone(devicedata);
    newdevicedata.indexrecvpartition = data.recvpartition;
    newdevicedata.indexrecvoffset = data.recvoffset;

    callbackfn(newdevicedata);
    // });
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
      console.log(`在:${msg.partition},offset:${msg.offset} 存在非法数据:${payload}`);
      winston.getlog().error(`在:${msg.partition},offset:${msg.offset} 存在非法数据:${payload}`);
      return;
    }
  }
  payload.recvpartition = msg.partition;
  payload.recvoffset = msg.offset;
  //<----log====【注意：这段代码仅供查找问题用，过后删掉】
  // const DeviceId = _.get(payload,'DeviceId','');
  // if(DeviceId === '1627100566 ' || DeviceId === '1728101625' || DeviceId === '1728100906'){
  //   winston.getlog().error(`${JSON.stringify(payload)}`);
  // }
 //<----log====注意：这段代码仅供查找问题用，过后删掉】

  return payload;
}


const parseKafkaMsgs = (kafkamsgs,callbackfn)=>{
  const msgs = [];
  _.map(kafkamsgs,(msg)=>{
    let newmsg = getkafkamsg(msg);
    if(!!newmsg){
      newmsg = deviceplugin(newmsg);
      msgs.push(newmsg);
    }
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
      getindexmsgs(msg,(newdevicedata)=>{//获得warninglevel
        if(!!newdevicedata){
          const data_device = getdbdata_device(newdevicedata);
          const data_historydevice = getdbdata_historydevice(newdevicedata);
          const data_historytrack = getdbdata_historytrack(newdevicedata);
          const data_alarmraw = getdbdata_alarmraw(newdevicedata);//含有Alarm即有报警
          getdbdata_alarm(newdevicedata,(data_alarm)=>{//准备数据updatedset
               if(!!data_device){
                 resultmsglist['device'].push(data_device);
               }
               if(!!data_historydevice){
                 resultmsglist['historydevice'].push(data_historydevice);
               }
               if(!!data_historytrack){
                 resultmsglist['historytrack'].push(data_historytrack);
               }
               if(!!data_alarmraw){
                 resultmsglist['alarmraw'].push(data_alarmraw);
               }
               if(!!data_alarm){
                 resultmsglist['alarm'].push(data_alarm);
               }
               callbackfn();
          });
        }
      });
    });
  });
  debug(`start parseKafkaMsgs->${fnsz.length}`);
  async.parallel(fnsz,(err,result)=>{
    debug(`stop parseKafkaMsgs`);
    callbackfn(resultmsglist);//会导致乱序
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
module.exports = parseKafkaMsgs;
