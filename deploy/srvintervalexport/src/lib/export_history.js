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
const batchcount = 500;
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
    //TimeKey,//
    DataTime:{
      $gte:`${curday} 00:00:00`,
      $lte:`${curday} 23:59:59`,
    }
  };
  startexport({filename,dbModel,sort:{DataTime:1},fields:null,csvfields,fn_convert,query},callbackfn);
}

const startexport_batch = (devicelist,exportdir,curday,callbackfn)=>{
  const fnsz = [];
  _.map(devicelist,(item)=>{
    fnsz.push((callbackfn)=>{
      startexport_do(item.DeviceId,exportdir,curday,callbackfn);
    });
  });
  async.parallel(fnsz,(err,result)=>{
    callbackfn(devicelist);
  });
}

const startexport_export = (devicelist,callbackfn)=>{
  const moments = moment().subtract(1, 'days');
  const curday = moments.format('YYYY-MM-DD');
  const exportdir = `${config.exportdir}/${moments.format('YYYYMMDD')}`;
  try{
    fs.mkdirSync(exportdir);
  }
  catch(e){

  }

  winston.getlog().info(`新建一个目录${exportdir}`);

  let success_list = [];
  const fnsz = [];
  for(let i = 0 ;i < devicelist.length; i += batchcount){
    const lend = i+batchcount > devicelist.length?devicelist.length:i+batchcount;
    const target_devicelist = devicelist.slice(i, lend);
    fnsz.push((callbackfn)=>{
      startexport_batch(target_devicelist,exportdir,curday,(retlist)=>{
        success_list = _.concat(success_list, retlist);
        debug(`导出历史数据结果->success_list-->${success_list.length},本次新增:${retlist.length}`)
        callbackfn(null,true);
      });
    });

  }

  async.series(fnsz,(err,result)=>{
    winston.getlog().info(`导出结果【历史数据】,成功【${success_list.length}】`);
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

module.exports = start;
