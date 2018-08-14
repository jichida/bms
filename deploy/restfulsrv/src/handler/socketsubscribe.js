const winston = require('../log/log.js');
const _ =  require('lodash');
const config = require('../config.js');
const realtimealarm = require('./common/realtimealarm');
const debug = require('debug')('srvapp:pcpush');
const fullappdevice = require('./fullapp/device');
const fulldeviceext = require('./fullcommon/deviceext');

const pushusermessage = (socket,ctx,data)=>{
  if(data.length > 0){
    debug(`开始推送了,注意啊----->${data.length}--->${ctx.userid}-->${ctx.connectid}`);
    socket.emit('serverpush_device',data);
  }
}

const usersubfn  = (socket,ctx)=>{
  ctx.userDeviceSubscriber = ( msg, data )=>{

      const topicsz = msg.split('.');

      if(_.startsWith(msg,config.pushdevicetopic) && topicsz[1] === `${ctx.userid}`){
          // const DeviceId = topicsz[1];
          if(ctx.usertype !== 'fullapp' && ctx.usertype !== 'fullpc'){
            pushusermessage(socket,ctx,data);
          }
          else{
            fullappdevice.querydevicealarm({},ctx,(result)=>{
              socket.emit(result.cmd,result.payload);
            });
          }
      }

      if(_.startsWith(msg,config.pushdeviceexttopic) && (ctx.usertype === 'fullpc' || ctx.usertype === 'fullapp')){
          // const DeviceId = topicsz[1];
          fulldeviceext.pushdeviceext({},ctx,(result)=>{
            socket.emit(result.cmd,result.payload);
          });
      }

  };//for eachuser
};


module.exports = usersubfn;
