const mongoose  = require('mongoose');
const DBModels = require('./handler/models.js');
const config = require('./config.js');
const smspush = require('./smspush/push');
const winston = require('./log/log.js');
const getuserpushdeviceid = require('./getuserpushdeviceid.js');
const _ = require('lodash');
const debug = require("debug")("alarmpush");

const kafka_pushalaramtopic_app = (devicedata,callbackfn)=>{
  const DeviceId = devicedata.DeviceId;
  const recordnew = {
    '车辆ID':_.get(devicedata,'DeviceId'),
    '报警时间':_.get(devicedata,'LastRealtimeAlarm.DataTime'),
    '报警信息':_.get(devicedata,'alarmtxtstat')
  };

  getuserpushdeviceid(DeviceId,(userlist)=>{
    debug(`所有用户id:${JSON.stringify(userlist)}`);
    if(userlist.length === 0){
      callbackfn();
      return;
    }
    _.map(userlist,(userid)=>{
      // _id
      // messagetype:String,//all,app
      // touserid:String,
      // messagetitle:String,
      // messagecontent:String,
      //推送到app,调用接口|serverpush_alarm
      const msgpayload = {
        _id:DeviceId,
        DeviceId:DeviceId,
        messagetype:'msg',
      }
      const messagenotify = {
        msgpayload,
        touserid:userid,
        messagetitle:`车辆:${recordnew['车辆ID']}于${recordnew['报警时间']}报警,报警信息:${recordnew['报警信息']}`,
        messagecontent:`车辆:${recordnew['车辆ID']}于${recordnew['报警时间']}报警,报警信息:${recordnew['报警信息']}`
      };
      winston.getlog().info(`开始推送消息:${JSON.stringify(messagenotify)}`);
      // debug(`发送给用户${userid}=>${JSON.stringify(messagenotify)}`);
      smspush.sendnotifymessage(messagenotify,(err,result)=>{
        // winston.getlog().info(`推送消息结束:${JSON.stringify(err)},result:${JSON.stringify(result)}`);
        if(!err){
          debug(`发送消息结果:${JSON.stringify(result)}`);
        }
        else{
          debug(`发送消息结果 err:${JSON.stringify(err)}`);
        }
      });
    });

    // if(userlist.length > 0){
    //   //有用户订阅,重新广播出去
    //   const sendto = sendtokafka.getsendtokafka();
    //   if(!!sendto){
    //     sendto(data,config.kafka_pushalaramtopic_pc,(err,data)=>{
    //       if(!!err){
    //         //console.log(err);
    //       }
    //       //console.log(`kafka_pushalaramtopic_app sended`);
    //       callbackfn(err,data);
    //     });
    //     return;
    //   }
    // }
    //console.log(`kafka_pushalaramtopic_app returned`);
    callbackfn();
  });
}


module.exports = kafka_pushalaramtopic_app;
