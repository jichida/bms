const _ = require('lodash');
const DBModels = require('../src/handler/models.js');
const debug = require('debug')('srvstat:test');
const winston = require('./log/log.js');
const async = require('async');
const config = require('./config');
const moment = require('moment');
let idmap = {};

const getDBCount = (dbModel,idstring,callbackfn)=>{
  dbModel.count({},(err,result)=>{
    if(!!idmap[idstring]){
      const inccount = result - idmap[idstring].totalcount;
      idmap[idstring]={
        curhour:moment().format('YYYY-MM-DD HH:mm'),
        totalcount:result,
        inccount
      }
    }
    else{
      idmap[idstring]={
        curhour:moment().format('YYYY-MM-DD HH:mm'),
        totalcount:result,
        inccount:0
      }
    }
    const perseccond = idmap[idstring].inccount / 3600;
    winston.getlog().info(`【${idmap[idstring].curhour}】【${idstring}】,新增:【${idmap[idstring].inccount}】,每秒入库【${perseccond.toFixed(1)}】,总个数【${result}】`);
    callbackfn(null,{
      idstring,
      count:result
    });
  });
}

const cron_0 = (callbackfn)=>{
  winston.getlog().info(`整点开始执行`);
  let fnsz = [];
  fnsz.push((callbackfn)=>{
    getDBCount(DBModels.DeviceModel,'设备',callbackfn);
  });

  fnsz.push((callbackfn)=>{
    getDBCount(DBModels.HistoryDeviceModel,'历史设备',callbackfn);
  });

  fnsz.push((callbackfn)=>{
    getDBCount(DBModels.RealtimeAlarmRawModel,'报警明细',callbackfn);
  });

  fnsz.push((callbackfn)=>{
    getDBCount(DBModels.RealtimeAlarmModel,'报警统计',callbackfn);
  });

  fnsz.push((callbackfn)=>{
    getDBCount(DBModels.HistoryTrackModel,'历史轨迹',callbackfn);
  });


  async.series(fnsz,(err,result)=>{
    callbackfn(err,result);
  });
};


const start_cron0 = ()=>{
  cron_0((err,result)=>{
    debug(`start_cron0 result====>:${JSON.stringify(result)}`);

  });
};


exports.start_cron0 = start_cron0;
