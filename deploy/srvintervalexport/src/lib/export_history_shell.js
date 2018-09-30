const config = require('../config');
const DBModels = require('../handler/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
const startexport = require('../handler/startexport');
const winston = require('../log/log.js');
const _ = require('lodash');
const fs = require('fs');
const async = require('async');
const debug = require('debug')('srvinterval:history');

const startexport_do = (DeviceId,exportdir,curday,callbackfn) =>{
  const curdays = moment(curday).format('YYYYMMDD');
  const TimeKey = moment(curday).format('YYMMDD');
  const dbModel = DBModels.HistoryDeviceModel;
  const filename = `${exportdir}/${curdays}_${DeviceId}.csv`;
  const fields = null;
  const csvfields = 'DeviceId,DataTime,SaveTime,BAT_U_OUT_HVS,BAT_U_TOT_HVS,BAT_I_HVS,\
BAT_SOC_HVS,BAT_SOH_HVS,BAT_UCELL_MAX,BAT_UCELL_MIN,BAT_UCELL_MAX_CSC,\
BAT_UCELL_MAX_CELL,BAT_UCELL_MIN_CSC,BAT_UCELL_MIN_CELL,BAT_T_MAX,BAT_T_MIN,\
BAT_T_AVG,BAT_T_MAX_CSC,BAT_T_MIN_CSC,BAT_USER_SOC_HVS,BAT_UCELL_AVG,ALARM,ALIV_ST_SW_HVS,\
ST_AC_SW_HVS,ST_AUX_SW_HVS,ST_MAIN_NEG_SW_HVS,ST_PRE_SW_HVS,ST_MAIN_POS_SW_HVS,ST_CHG_SW_HVS,\
ST_FAN_SW_HVS,ST_HEATER_SW_HVS,BAT_U_HVS,BAT_ALLOW_DISCHARGE_I,BAT_ALLOW_CHARGE_I,BAT_ISO_R_POS,\
BAT_ISO_R_NEG,KEYONVOLTAGE,POWERVOLTAGE,CHARGEACVOLTAGE,CHARGEDCVOLTAGE,CC2VOLTAGE,CHARGEDCAPACITY,\
TOTALWORKCYCLE,CSC_POWER_CURRENT,BAT_MAX_SOC_HVS,BAT_MIN_SOC_HVS,BAT_WEI_SOC_HVS,BAT_CHG_AMPERREQ,\
BPM_24V_UOUT,ST_NEGHEATER_SW_HVS,ST_WIRELESSCHG_SW,ST_SPEARCHG_SW_2,ST_POWERGRIDCHG_SW,CC2VOLTAGE_2,DIAG_H,DIAG_L';

  const fn_convert = (doc,callbackfn)=>{
    doc['ALARM'] = doc['alarmtxtstat'];
    doc['SaveTime'] = doc['UpdateTime'];
    callbackfn(doc);
  }
  const query = {
    DeviceId,
    TimeKey,//
  };

  let exportcmd = `mongoexport --uri=${config.mongodburl} --type=csv -c historydevices --out ${filename} `
  exportcmd += `--fields=${csvfields} --query='${JSON.stringify(query)}'`;

  shell.exec(exportcmd,(code, stdout, stderr)=>{
    winston.getlog().info(`导出${filename}成功!`);
    callbackfn(null,true);
  });
  // ./realtimealarmhourkafkas.csv --type=csv --fields=_id,DeviceId,CurDayHour,Longitude,Latitude,citycode,adcode,FirstAlarmTime,DataTime,warninglevel,Alarm,idsend,NodeID,create_at --query='{"DataTime":{$gte:"2018-07-05 21:00:00",$lt:"2018-07-06 09:00:00"}}' --sort='{ "idsend" :1}'


  // mongoexport --host=192.168.2.17 --port 27007 -d bmscatl -c datadicts --out ./datadicts.json
  // startexport({filename,dbModel,sort:{DataTime:1},fields:null,csvfields,fn_convert,query},callbackfn);
}

const startexport_batch = (devicelist,exportdir,curday,callbackfn)=>{
  const fnsz = [];
  _.map(devicelist,(item)=>{
    fnsz.push((callbackfn)=>{
      startexport_do(item.DeviceId,exportdir,curday,callbackfn);
    });
  });
  async.parallelLimit(fnsz,config.batchcount,(err,result)=>{
    callbackfn(devicelist);
  });
}

const startexport_export = (devicelist,callbackfn)=>{
  const moments = moment().subtract(1, 'days');
  const curday = moments.format('YYYY-MM-DD');
  const exportdirbase = `${config.exportdir}/${moments.format('YYYYMMDD')}`;
  let exportdir = exportdirbase;
  let i = 1;
  try{
    while(fs.existsSync(exportdir)){
      exportdir = `${exportdirbase}(${i})`;
      i++;
    }
    fs.mkdirSync(exportdir);
  }
  catch(e){
    winston.getlog().info(`--->${JSON.stringify(e)}`);
  }

   let success_list = [];
   winston.getlog().info(`新建一个目录${exportdir},${i}`);
   startexport_batch(devicelist,exportdir,curday,(retlist)=>{
    success_list = _.concat(success_list, retlist);
    debug(`导出历史数据结果->success_list-->${success_list.length},本次新增:${retlist.length}`)
    callbackfn(exportdir);
  });
}

const start = (callbackfn)=>{
  const getDevicelist = (callbackfn)=>{
    debug(`start getDevicelist===>`)
    const deviceModel = DBModels.DeviceModel;
    deviceModel.find({
    },{
      'DeviceId':1,
      }).lean().exec((err,result)=>{
      rlst = [];
      if(!err && !!result){
        _.map(result,(item)=>{
          rlst.push(item);
        });

      }
      debug(`[获取所有设备个数]===>${rlst.length}`)
      callbackfn(rlst);
    });
  }

  getDevicelist((devicelist)=>{
    startexport_export(devicelist,callbackfn);
  });
}

exports.startexport_do = startexport_do;
// module.exports = start;
