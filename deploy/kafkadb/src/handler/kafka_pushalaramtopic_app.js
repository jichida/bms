const mongoose  = require('mongoose');
const DBModels = require('./models.js');
const config = require('../config.js');
const sendtokafka = require('../kafka/sendtokafka');
const smspush = require('./smspush/push');
const getuserpushdeviceid = require('./getuserpushdeviceid.js');
const alarm = require('./getalarmtxt');
const _ = require('lodash');

const kafka_pushalaramtopic_app = (devicedata,callbackfn)=>{
  const DeviceId = devicedata.DeviceId;
  const payload = devicedata;
  // //console.log(`重新publish出去:${DeviceId},数据:${payload}`);
  //console.log(`kafka_pushalaramtopic_app,${config.NodeID}】接收成功${devicedata.SN64},${devicedata.DeviceId}`);
  // PubSub.publish(`${config.kafka_pushalaramtopic}.${DeviceId}`, payload);

  getuserpushdeviceid(DeviceId,(userlist)=>{
    // //console.log(`所有用户id:${JSON.stringify(userlist)}`);

    let recordnew = alarm.bridge_alarminfo(payload);
    _.map(userlist,(userid)=>{
      // _id
      // messagetype:String,//all,app
      // touserid:String,
      // messagetitle:String,
      // messagecontent:String,
      //推送到app,调用接口|serverpush_alarm
      const msgpayload = {
        _id:recordnew.key,
        DeviceId:DeviceId,
        messagetype:'msg',
      }
      const messagenotify = {
        msgpayload,
        touserid:userid,
        messagetitle:`车辆:${recordnew['车辆ID']}于${recordnew['报警时间']}报警,报警信息:${recordnew['报警信息']}`,
        messagecontent:`车辆:${recordnew['车辆ID']}于${recordnew['报警时间']}报警,报警信息:${recordnew['报警信息']}`
      };
      // winston.getlog().info(`开始推送消息:${JSON.stringify(messagenotify)}`);
      smspush.sendnotifymessage(messagenotify,(err,result)=>{
        // winston.getlog().info(`推送消息结束:${JSON.stringify(err)},result:${JSON.stringify(result)}`);
        //console.log(err);
        // //console.log(result);
      });
    });

    if(userlist.length > 0){
      //有用户订阅,重新广播出去
      const sendto = sendtokafka.getsendtokafka();
      if(!!sendto){
        sendto(data,config.kafka_pushalaramtopic_pc,(err,data)=>{
          if(!!err){
            //console.log(err);
          }
          //console.log(`kafka_pushalaramtopic_app sended`);
          callbackfn(err,data);
        });
        return;
      }
    }
    //console.log(`kafka_pushalaramtopic_app returned`);
    callbackfn();
  });
}


module.exports = kafka_pushalaramtopic_app;
