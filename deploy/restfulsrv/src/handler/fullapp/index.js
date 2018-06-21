const systemconfig = require('../common/systemconfig');
const userlogin = require('../common/userlogin');
const device = require('../common/device.js');
const deviceapp = require('./device.js');
const historydevice = require('../common/historydevice.js');
const realtimealarm = require('../common/realtimealarm.js');
const moment = require('moment');
const historytrack = require('../common/historytrack');
const userrelate = require('../common/userrelate');
const catlworking = require('../fullcommon/catlworking');
const deviceext = require('../fullcommon/deviceext');


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
  'deviceext':deviceext.deviceext,
  'getcountcar':deviceext.getcountcar,
  'getcountbus':deviceext.getcountbus,
  'getusedyearcar':deviceext.getusedyearcar,
  'getusedyearbus':deviceext.getusedyearbus,
  'getstatprovince':deviceext.getstatprovince,
  'getstatcatlproject':deviceext.getstatcatlproject,

  'catl':catlworking.catl,
  'catl_warningf':catlworking.catl_warningf,
  'catl_cycle':catlworking.catl_cycle,
  'catl_celltemperature':catlworking.catl_celltemperature,
  'catl_cyclecount':catlworking.catl_cyclecount,
  'catl_dxtemperature':catlworking.catl_dxtemperature,

  'querydevice':deviceapp.querydevice,
  'querydevicegroup':device.querydevicegroup,
  // 'queryrealtimealarm':realtimealarm.queryrealtimealarm,
  'deviceinfoquerychart':historydevice.deviceinfoquerychart,
  'querydeviceinfo':device.querydeviceinfo,
  'querydeviceinfo_list':device.querydeviceinfo_list,
  'collectdevice':userrelate.collectdevice,
  // 'searchbattery':device.searchbattery,
  'queryhistorytrack':historytrack.queryhistorytrack,
  'serverpush_devicegeo_sz':device.serverpush_devicegeo_sz,
  // 'searchbatteryalarm':realtimealarm.searchbatteryalarm,
  // 'searchbatteryalarmsingle':realtimealarm.searchbatteryalarmsingle,
  'uireport_searchcararchives':device.uireport_searchcararchives,
  'uireport_searchalarm':realtimealarm.uireport_searchalarm,
  'uireport_searchalarmdetail':realtimealarm.uireport_searchalarmdetail,
  'uireport_searchposition':historytrack.uireport_searchposition,
  'uireport_searchhistorydevice':historydevice.uireport_searchhistorydevice,
  'serverpush_alarm_sz':realtimealarm.serverpush_alarm_sz,
};

module.exports = (socket,actiondata,ctx)=>{
  debug(`PC端获取数据--->${JSON.stringify(actiondata)}`);
  ////console.log("PC端获取上下文--->" + JSON.stringify(ctx));
  ////console.log(`${actiondata.cmd}接受到时间:${moment().format("YYYY-MM-DD HH:mm:ss")}`);
  try{
      if(ctx.usertype !== 'fullapp'){
        ////console.log("不是正确的客户端--->" + actiondata.cmd);
        socket.emit('common_err',{errmsg:'无效的app客户端'});
        return;
      }
      if(!!actiondatahandler[actiondata.cmd]){
        actiondatahandler[actiondata.cmd](actiondata.data,ctx,(result)=>{
        //  ////console.log("服务端回复--->" + JSON.stringify(result));
          ////console.log(`${actiondata.cmd}回复时间:${moment().format("YYYY-MM-DD HH:mm:ss")}`);
          socket.emit(result.cmd,result.payload);
        });
      }
      else{
        if(!!authhandler[actiondata.cmd]){
          if(!ctx['userid']){
            ////console.log("需要登录--->" + actiondata.cmd);
            socket.emit('common_err',{errmsg:'请先重新登录'});
          }
          else{
            authhandler[actiondata.cmd](actiondata.data,ctx,(result)=>{
              // debug(`服务端回复--->${JSON.stringify(result)}`);
              ////console.log(`${actiondata.cmd}回复时间:${moment().format("YYYY-MM-DD HH:mm:ss")}`);
              socket.emit(result.cmd,result.payload);
            });
          }
        }
        else{
          ////console.log("未找到处理函数--->" + actiondata.cmd);
          socket.emit('common_err',{errmsg:`未找到处理函数${actiondata.cmd}`});
        }
      }
    }
    catch(e){
      console.log(e);
      socket.emit('common_err',{errmsg:`服务端内部错误`});
    }
}
