const systemconfig = require('../common/systemconfig');
const userlogin = require('../common/userlogin');
const device = require('../common/device.js');
const historydevice = require('../common/historydevice.js');
const realtimealarm = require('../common/realtimealarm.js');
const moment = require('moment');
const historytrack = require('../common/historytrack');
const userrelate = require('../common/userrelate');
const debug = require('debug')('srvapp:handler');
//司机端
const actiondatahandler = {
  'getsystemconfig':systemconfig.getsystemconfig,
  'loginwithtoken':userlogin.loginwithtoken,
  'logout':userlogin.logout,
  'login':userlogin.loginuser,
  //正式版本中下面的删除
};

const authhandler = {
  'savealarmsettings':userlogin.savealarmsettings,
  'changepwd':userlogin.changepwd,
  'querydevice':device.querydevice,
  'querydevicegroup':device.querydevicegroup,
  // 'queryrealtimealarm':realtimealarm.queryrealtimealarm,
  'deviceinfoquerychart':historydevice.deviceinfoquerychart,
  'querydeviceinfo':device.querydeviceinfo,
  'querydeviceinfo_list':device.querydeviceinfo_list,
  // 'searchbattery':device.searchbattery,
  'queryhistorytrack':historytrack.queryhistorytrack,
  'serverpush_devicegeo_sz':device.serverpush_devicegeo_sz,
  'collectdevice':userrelate.collectdevice,
  // 'searchbatteryalarm':realtimealarm.searchbatteryalarm,
  // 'searchbatteryalarmsingle':realtimealarm.searchbatteryalarmsingle,
  'uireport_searchdevice':device.uireport_searchdevice,
  'uireport_searchcararchives':device.uireport_searchcararchives,
  'uireport_searchalarm':realtimealarm.uireport_searchalarm,
  'uireport_searchalarmdetail':realtimealarm.uireport_searchalarmdetail,
  'uireport_searchposition':historytrack.uireport_searchposition,
  'uireport_searchhistorydevice':historydevice.uireport_searchhistorydevice,
  'serverpush_alarm_sz':realtimealarm.serverpush_alarm_sz,
};

module.exports = (socket,actiondata,ctx)=>{
  debug("app端获取数据--->" + JSON.stringify(actiondata));
  try{
      if(ctx.usertype !== 'app'){
        debug("不是正确的客户端--->" + actiondata.cmd);
        socket.emit('common_err',{errmsg:'无效的app客户端'});
        return;
      }
      if(!!actiondatahandler[actiondata.cmd]){
        actiondatahandler[actiondata.cmd](actiondata.data,ctx,(result)=>{
          // debug("服务端回复--->" + JSON.stringify(result));
          socket.emit(result.cmd,result.payload);
        });
      }
      else{
        if(!!authhandler[actiondata.cmd]){
          if(!ctx['userid']){
            debug("需要登录--->" + actiondata.cmd);
            socket.emit('common_err',{errmsg:'请先重新登录'});
          }
          else{
            authhandler[actiondata.cmd](actiondata.data,ctx,(result)=>{
              socket.emit(result.cmd,result.payload);
            });
          }
        }
        else{
          debug("未找到处理函数--->" + actiondata.cmd);
          socket.emit('common_err',{errmsg:`未找到处理函数${actiondata.cmd}`});
        }
      }
    }
    catch(e){
      debug("服务端内部错误--->" + e);
      socket.emit('common_err',{errmsg:`服务端内部错误:${JSON.stringify(e)}`});
    }
}
