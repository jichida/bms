const winston = require('../log/log.js');
const _ =  require('lodash');
const config = require('../config.js');
const realtimealarm = require('./common/realtimealarm');
const debug = require('debug')('srvapp:pcpush');


const pushusermessage = (socket,ctx,DeviceId,data)=>{
  debug(`开始推送了,注意啊----->${JSON.stringify(data)}`);

  let recordnew = realtimealarm.bridge_alarminfo(data);
  debug(`recordnew===>${JSON.stringify(recordnew)}`);
  // {"key":"5a1bfa0f46a68b00019fd34b","车辆ID":"1639101505","报警时间":"2017-11-17 22:20:42","报警信息":"故障代码 179次|"}
  socket.emit('serverpush_alarm',recordnew);


  // if(ctx.usertype === 'app'){
  //   // _id
  //   // messagetype:String,//all,app
  //   // touserid:String,
  //   // messagetitle:String,
  //   // messagecontent:String,
  //   //推送到app,调用接口|serverpush_alarm
  //   const messagenotify = {
  //     _id:recordnew.key,
  //     messagetype:'msg',
  //     touserid:ctx.userid.toString(),
  //     messagetitle:`车辆:${recordnew['车辆ID']}于${recordnew['报警时间']}报警,报警信息:${recordnew['报警信息']}`,
  //     messagecontent:`车辆:${recordnew['车辆ID']}于${recordnew['报警时间']}报警,报警信息:${recordnew['报警信息']}`
  //   };
  //   winston.getlog().info(`开始推送消息:${JSON.stringify(messagenotify)}`);
  //   smspush.sendnotifymessage(messagenotify,(err,result)=>{
  //     winston.getlog().info(`推送消息结束:${JSON.stringify(err)},result:${JSON.stringify(result)}`);
  //     console.log(err);
  //     console.log(result);
  //   });
  // }
}

const usersubfn  = (socket,ctx)=>{
  ctx.userDeviceSubscriber = ( msg, data )=>{
      debug('->用户订阅请求,用户信息:'+JSON.stringify(ctx));
      debug('->用户订阅消息:'+msg);

      const topicsz = msg.split('.');

      if(_.startsWith(msg,config.pushalaramtopic) && topicsz.length === 2){
          const DeviceId = topicsz[1];
          pushusermessage(socket,ctx,DeviceId,data);
      }

  };//for eachuser
};


module.exports = usersubfn;
