const mongoose  = require('mongoose');
const DBModels = require('./models.js');
const _ = require('lodash');
const config = require('../config.js');
const moment = require('moment');

const save_historydevice = (devicedata,callbackfn)=>{
  //保存到历史记录中
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
    // alarmplugin.matchalarm(_.get(devicedata,'LastRealtimeAlarm.Alarm'),(resultalarmmatch)=>{
    //     result_device.resultalarmmatch = resultalarmmatch;
    //     if(resultalarmmatch.length > 0){
    //       result_device.warninglevel = resultalarmmatch[0].warninglevel;
    //       result_device.alarmtxt = resultalarmmatch[0].alarmtxt;
    //     }
    const entity2 = new DBModels.HistoryDeviceModel(result_device);
    entity2.save((err,result)=>{
      //console.log(`【kafka_dbtopic_historydevices saved`);
      callbackfn(err,result);
    });
    // });
    return;
  }
  //console.log(`【kafka_dbtopic_historydevices returned`);
  callbackfn();
}

const kafka_dbtopic_historydevices = (devicedata,callbackfn)=>{
  //console.log(`【kafka_dbtopic_historydevices,${config.NodeID}】接收成功${devicedata.SN64},${devicedata.DeviceId}`);
  save_historydevice(devicedata,callbackfn);
}


module.exports = kafka_dbtopic_historydevices;
