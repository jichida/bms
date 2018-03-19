const async = require('async');
const _ = require('lodash');
const debug = require('debug')('dbh:handler');
const dbh_alarm = require('./dbh/dbh_alarm');
const dbh_device = require('./dbh/dbh_device');
const config = require('../config');
const alarmutil = require('./getalarmtxt');
// const sendtokafka = require('../kafka/sendtokafka');
//
const dbh_alarmraw = require('./dbh/dbh_alarmraw');
const dbh_historydevice = require('./dbh/dbh_historydevice');
const dbh_historytrack  = require('./dbh/dbh_historytrack');

const onHandleToDB_alarm = (allresult,callbackfn)=>{
  dbh_alarm(allresult['alarm'],(err,result)=>{
    let devicealarmstat = {};
    let listalarm = _.sortBy(result,(alarm)=>{
      return -`${o.DeviceId}_${o.UpdateTime}`;
    });
    //按alarm的倒序排
    debug(`按alarm的倒序排:${JSON.stringify(listalarm)}`);
    //再对alarmlist去重【deivceid]
    listalarm = _.sortedUniqBy(listalarm,(o)=>{
      return o.DeviceId;
    });
    debug(`再对alarmlist去重deivceid:${JSON.stringify(listalarm)}`);
    _.map(listalarm,(alarm)=>{
      devicealarmstat[alarm.DeviceId] = alarmutil(getalarmtxt);
    });
    debug(`所有设备统计信息:${JSON.stringify(devicealarmstat)}`);
    //<-------处理所有的allresult
    _.map(allresult['device'],(o)=>{
      if(!!devicealarmstat[o.DeviceId]){
        o.alarmtxtstat = devicealarmstat[o.DeviceId];
      }
    });
    _.map(allresult['historydevice'],(o)=>{
      if(!!devicealarmstat[o.DeviceId]){
        o.alarmtxtstat = devicealarmstat[o.DeviceId];
      }
    });
    _.map(allresult['alarmraw'],(o)=>{
      if(!!devicealarmstat[o.DeviceId]){
        o.alarmtxtstat = devicealarmstat[o.DeviceId];
      }
    });
    debug(`所有设备最终结果:${JSON.stringify(allresult['device'])}`);
    callbackfn(null,allresult);
  });
};

const onHandleToDB = (allresultin,callbackfn)=>{
  onHandleToDB_alarm(allresultin,(err,allresult)=>{
    let fnsz = [];
    fnsz.push((callbackfn)=>{
      dbh_device(allresult['device'],callbackfn);
    });
    fnsz.push((callbackfn)=>{
        // sendto(allresult['historydevice'],config.kafka_dbtopic_historydevices,callbackfn);
      dbh_historydevice(allresult['historydevice'],callbackfn);
    });
    fnsz.push((callbackfn)=>{
      // sendto(allresult['historytrack'],config.kafka_dbtopic_historytracks,callbackfn);
      dbh_historytrack(allresult['historytrack'],callbackfn);
    });
    fnsz.push((callbackfn)=>{
      // sendto(allresult['alarmraw'],config.kafka_dbtopic_realtimealarmraws,callbackfn);
      dbh_alarmraw(allresult['alarmraw'],callbackfn);
    });
    // const sendto = sendtokafka.getsendtokafka();
    // if(!!sendto){
    //     fnsz.push((callbackfn)=>{
    //         sendto(allresult['historydevice'],config.kafka_dbtopic_historydevices,callbackfn);
    //       // dbh_historydevice(allresult['historydevice'],callbackfn);
    //     });
    //     fnsz.push((callbackfn)=>{
    //       sendto(allresult['historytrack'],config.kafka_dbtopic_historytracks,callbackfn);
    //       // dbh_historytrack(allresult['historytrack'],callbackfn);
    //     });
    //     fnsz.push((callbackfn)=>{
    //       sendto(allresult['alarmraw'],config.kafka_dbtopic_realtimealarmraws,callbackfn);
    //       // dbh_alarmraw(allresult['alarmraw'],callbackfn);
    //     });
    //   //
    // }
    // fnsz.push((callbackfn)=>{
    //   dbh_alarm(allresult['alarm'],callbackfn);
    // });

    debug(`start onHandleToDB`);
    async.parallel(fnsz,(err,result)=>{
      debug(`stop onHandleToDB`);
      callbackfn(err,result);
    });
  });

};

module.exports = onHandleToDB;
