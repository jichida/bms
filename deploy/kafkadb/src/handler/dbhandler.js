const mongoose  = require('mongoose');
const async = require('async');
const DBModels = require('./models.js');
const _ = require('lodash');
const alarmplugin = require('../plugins/alarmfilter/index');
const moment = require('moment');
const alarm = require('./getalarmtxt');
const config = require('../config.js');
const utilposition = require('./util_position');
const pushalarmproducer = require('../kafka/produceralarmpush');
let sendtokafka;
pushalarmproducer((fn)=>{
  sendtokafka = fn;
});

const getpoint = (v)=>{
  if(!v){
    return [0,0];
  }
  return [v.Longitude,v.Latitude];
}

const save_device = (devicedata,callbackfn)=>{
  // console.log(`start save device...${!!DBModels.DeviceModel}`);
  const dbModel = DBModels.DeviceModel;
  devicedata.NodeID = config.NodeID;
  devicedata.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
  dbModel.findOneAndUpdate({DeviceId:devicedata.DeviceId},{$set:devicedata},{
    upsert:true,new:true
  },(err,result)=>{
    callbackfn(err,result);
  });
};

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
            callbackfn(err,result);

            if(!err && !!result && !!sendtokafka){
              if(!!devicedata.warninglevel){
                if(devicedata.warninglevel !== ''){
                  sendtokafka(result.toJSON(),config.kafka_pushalaramtopic,(err,data)=>{
                    if(!!err){
                      console.log(`sendtokafka:${JSON.stringify(data)}`);
                      console.log(err);
                    }
                  });
                }
              }
            }
          });

        return;
      }
      callbackfn();
    });
    return;
  }
  callbackfn();
}

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
        callbackfn(err,result);
      });
    // });
    return;
  }
  callbackfn();
};

const save_historydevice = (devicedata,alarmtxt,callbackfn)=>{
  //保存到历史记录中
  const LastRealtimeAlarm = _.get(devicedata,'LastRealtimeAlarm');
  if(!!LastRealtimeAlarm){
    let result_device = _.clone(LastRealtimeAlarm);
    result_device = _.omit(result_device,['Alarm']);
    if(!!alarmtxt && alarmtxt!==''){
      result_device.alarmtxt = alarmtxt;
    }
    result_device.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
    result_device.NodeID = config.NodeID;
    result_device.SN64 = devicedata.SN64;
    result_device.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    result_device.Provice = devicedata.Provice;
    result_device.City = devicedata.City;
    result_device.Area = devicedata.Area;

    result_device.warninglevel = devicedata.warninglevel;
    // alarmplugin.matchalarm(_.get(devicedata,'LastRealtimeAlarm.Alarm'),(resultalarmmatch)=>{
    //     result_device.resultalarmmatch = resultalarmmatch;
    //     if(resultalarmmatch.length > 0){
    //       result_device.warninglevel = resultalarmmatch[0].warninglevel;
    //       result_device.alarmtxt = resultalarmmatch[0].alarmtxt;
    //     }
    const entity2 = new DBModels.HistoryDeviceModel(result_device);
    entity2.save((err,result)=>{
      callbackfn(err,result);
    });
    // });
    return;
  }
  callbackfn();
}

const save_lasthistorytrack = (devicedata,callbackfn)=>{
  const LastHistoryTrack = devicedata.LastHistoryTrack;
  if(!!LastHistoryTrack){
    LastHistoryTrack.DeviceId = devicedata.DeviceId;
    LastHistoryTrack.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
    LastHistoryTrack.NodeID = config.NodeID;
    LastHistoryTrack.SN64 = devicedata.SN64;
    LastHistoryTrack.Provice = devicedata.Provice;
    LastHistoryTrack.City = devicedata.City;
    LastHistoryTrack.Area = devicedata.Area;
    LastHistoryTrack.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const entity = new DBModels.HistoryTrackModel(LastHistoryTrack);
    entity.save((err,result)=>{
      callbackfn(err,result);
    });
    return;
  }
  callbackfn();
}

exports.insertdatatodb= (data,callback)=>{


  const LastRealtimeAlarm = _.clone(data.BMSData);
  const LastHistoryTrack = _.clone(data.Position);

  const devicedata = _.omit(data,['BMSData','Position']);

//==============
  console.log(`接收成功${devicedata.SN64},${config.NodeID},${devicedata.DeviceId}`);
  const logresult = {
    SN64:devicedata.SN64,
    NodeID:config.NodeID,
    DeviceId:devicedata.DeviceId,
  }
  sendtokafka(logresult,config.kafka_bmslogtopic,(err,data)=>{
    if(!!err){
      console.log(`log sendtokafka:${JSON.stringify(data)}`);
      console.log(err);
    }
  });
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
      const asyncfnsz = [
        (callbackfn)=>{
          save_device(newdevicedata,callbackfn);
        },
        (callbackfn)=>{
          save_alarm(newdevicedata,callbackfn);
        },
        (callbackfn)=>{
          save_alarmraw(newdevicedata,callbackfn);
        },
        (callbackfn)=>{
          save_lasthistorytrack(newdevicedata,callbackfn);
        },
      ];
      // const newdoc = _.merge(doc,retobj);
      // callbackfn({
      //   '设备编号':newdoc.DeviceId,
      //   '定位时间':newdoc.GPSTime,
      //   '省':newdoc.Provice,
      //   '市':newdoc.City,
      //   '区':newdoc.Area,
      // });
      async.parallel(asyncfnsz,(err,result)=>{
        let alarmtxt;
        if(!err && !!result){
          if(!!result[1]){
            const alarm = result[1].toJSON();
            alarmtxt = alarm.getalarmtxt(alarm);
          }
        }
        save_historydevice(devicedata,alarmtxt,(err,result)=>{
          if(!!err){
            console.log(`save_historydevice:${JSON.stringify(devicedata)}`);
            console.log(err);
          }
        });

        if(!!err){
          console.log(`parallel:${JSON.stringify(result)}`);
          console.log(err);
        }
      });

    });
  });


};
