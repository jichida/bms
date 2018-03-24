const winston = require('../log/log.js');
const _ =  require('lodash');
const config = require('../config.js');
const realtimealarm = require('./common/realtimealarm');
const debug = require('debug')('srvapp:pcpush');


const pushusermessage = (socket,ctx,data)=>{
  debug(`开始推送了,注意啊----->${JSON.stringify(data)}`);

  socket.emit('serverpush_device',data);

}

const usersubfn  = (socket,ctx)=>{
  ctx.userDeviceSubscriber = ( msg, data )=>{
      debug('->用户订阅请求,用户信息:'+JSON.stringify(ctx));
      debug('->用户订阅消息:'+msg);

      const topicsz = msg.split('.');

      if(_.startsWith(msg,config.pushdevicetopic) && topicsz[1] === `${ctx.userid}`){
          // const DeviceId = topicsz[1];
          pushusermessage(socket,ctx,data);
      }

  };//for eachuser
};


module.exports = usersubfn;
