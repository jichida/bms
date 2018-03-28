/**
 * Created by wangxiaoqing on 2017/3/25.
 */
const config = require('./config');
const DBModels = require('./handler/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
const startexport = require('./handler/startexport');
const _ = require('lodash');
const bridge_historydeviceinfo = require('./handler/bridge_historydeviceinfo');
const debug = require('debug')('srvinterval');

const startexport_historydevice = (DeviceId,callbackfn)=>{
  //filename,dbModel,fields,csvfields,fn_convert,query
  const curday = config.curday;//moment().subtract(1, 'days').format('YYYY-MM-DD');
  const dbModel = DBModels.HistoryDeviceModel;
  const filename = `${curday}_${1713100888}.csv`;
  const fields = null;
  const csvfields = '采集时间,保存时间,箱体测量电压(V),箱体累加电压(V),箱体电流(A),\
真实SOC(%),最高单体电压(V),最低单体电压(V),最高单体电压CSC号,最高单体电芯位置,最低单体电压CSC号,\
最低单体电压电芯位置,最高单体温度,最低单体温度,平均单体温度,最高温度CSC号,最低温度CSC号,显示用SOC,平均单体电压,报警状态';
  const fn_convert = (doc,callbackfn)=>{
    const newdoc = bridge_historydeviceinfo(doc);
    callbackfn(newdoc);
  }
  const query = {
    DeviceId,
    DataTime:{
      $gte:`${curday} 00:00:00`,
      $lte:`${curday} 23:59:59`,
    }
  };
  startexport({filename,dbModel,fields:null,csvfields,fn_convert,query});
}

const intervalPushAlarm =()=>{
  // setInterval(()=>{
  //   checkHistoryDevice((err,result)=>{
  //     if(!err && !!result){
  //       _.map(result,(devicedata)=>{
  //         lasttime = devicedata.UpdateTime;
  //         kafka_pushalaramtopic_app(devicedata,(err,result)=>{
  //
  //         });
  //       });
  //     }
  //   });
  // }, 5000);
  if(config.exportFlag !== 'all' && !!config.DeviceId){
    debug(`仅导出:${config.DeviceId}的记录`);
    startexport_historydevice(config.DeviceId,(err,res)=>{

    });
  }

  if(config.exportFlag === 'all'){
    const deviceModel = DBModels.DeviceModel;
    const query = {};
    const fields = {
      'DeviceId':1,
    };

    debug(`device query ${JSON.stringify(query)}`);
    const queryexec = deviceModel.find(query).select(fields).lean();
    debug(`device start exec`);
    queryexec.exec((err,devicelist)=>{
      if(!err && !!devicelist){
        debug(`device start getdevicelist`);
        _.map(devicelist,(device)=>{
          debug(`导出:${device.DeviceId}的记录`);
          startexport_historydevice(device.DeviceId,(err,res)=>{

          });
        });
      }
    });
  }
};



// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)


const job=()=>{
    intervalPushAlarm();
};

module.exports = job;
