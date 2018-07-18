const config = require('../config.js');
const moment = require('moment');
const winston = require('../log/log.js');
const _ = require('lodash');
const fs = require('fs');
const async = require('async');
const startexport = require('../handler/startexport_redis');
const debug = require('debug')('srvinterval:history');


const startexport_do = (DeviceId,exportdir,curday,getdevicedatalist,callbackfn) =>{
  const filename = `${exportdir}/${curday}_${DeviceId}.csv`;
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

  getdevicedatalist({curday,DeviceId},(messages)=>{
    if(messages.length > 0){
      startexport({fn_convert,messages,filename,csvfields},()=>{
        callbackfn(null,true);
      });
    }
    else{
      debug(error);
      callbackfn(null,true);
    }
  });

}

const startexport_batch = (devicelist,exportdir,curday,getdevicedatalist,callbackfn)=>{
  const fnsz = [];
  _.map(devicelist,(DeviceId)=>{
    fnsz.push((callbackfn)=>{
      startexport_do(DeviceId,exportdir,curday,getdevicedatalist,()=>{
        callbackfn(null,true);
      });
    });
  });
  debug(`startexport_batch--->${fnsz.length},batchcount-->${config.batchcount}`);
  async.parallelLimit(fnsz,config.batchcount,(err,result)=>{
    callbackfn(devicelist);
  });
}

const startexport_export = (curday,devicelist,getdevicedatalist,callbackfn)=>{
  const exportdirbase = `${config.exportdir}/${curday}`;
  let exportdir = exportdirbase;
  let i = 1;
  try{
    while(fs.existsSync(exportdir)){
      exportdir = `${exportdirbase}_${i}`;
      i++;
    }
    fs.mkdirSync(exportdir);
  }
  catch(e){
    winston.getlog().info(`--->${JSON.stringify(e)}`);
  }

   winston.getlog().info(`新建一个目录${exportdir},${i}`);
   startexport_batch(devicelist,exportdir,curday,(retlist)=>{
    callbackfn(exportdir);
  });
}

const start = (getDevicelist,getdevicedatalist,callbackfn)=>{

  const moments = moment().subtract(1, 'days');
  const curday = moments.format('YYYYMMDD');
  debug(`start export file:${curday}`);

  getDevicelist((devicelist)=>{
    startexport_export(curday,devicelist,(exportdir)=>{
      callbackfn(exportdir)
    });
  });
}

module.exports = start;
