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
  const csvfields = 'DeviceId,DataTime,SaveTime,BAT_U_Out_HVS,BAT_U_TOT_HVS,BAT_I_HVS,\
  BAT_SOC_HVS,BAT_SOH_HVS,BAT_Ucell_Max,BAT_Ucell_Min,BAT_Ucell_Max_CSC,\
  BAT_Ucell_Max_CELL,BAT_Ucell_Min_CSC,BAT_Ucell_Min_CELL,BAT_T_Max,BAT_T_Min,\
  BAT_T_Avg,BAT_T_Max_CSC,BAT_T_Min_CSC,BAT_User_SOC_HVS,BAT_Ucell_Avg,ALARM,ALIV_ST_SW_HVS,\
  ST_AC_SW_HVS,ST_Aux_SW_HVS,ST_Main_Neg_SW_HVS,ST_Pre_SW_HVS,ST_Main_Pos_SW_HVS,ST_Chg_SW_HVS,\
  ST_Fan_SW_HVS,ST_Heater_SW_HVS,BAT_U_HVS,BAT_Allow_Discharge_I,BAT_Allow_Charge_I,BAT_ISO_R_Pos,\
  BAT_ISO_R_Neg,KeyOnVoltage,PowerVoltage,ChargeACVoltage,ChargeDCVoltage,CC2Voltage,ChargedCapacity,\
  TotalWorkCycle,CSC_Power_Current,BAT_MAX_SOC_HVS,BAT_MIN_SOC_HVS,BAT_WEI_SOC_HVS,BAT_Chg_AmperReq,\
  BPM_24V_Uout,ST_NegHeater_SW_HVS,ST_WirelessChg_SW,ST_SpearChg_SW_2,ST_PowerGridChg_SW,CC2Voltage_2,DIAG_H,DIAG_L,UpdateTime,ALARM';

  const fn_convert = (doc,callbackfn)=>{
    doc['ALARM']=doc['alarmtxtstat'];
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
  fs.mkdirSync(exportdir);
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
    callback(success_list);
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
