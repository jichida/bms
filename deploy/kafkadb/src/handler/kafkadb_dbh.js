const async = require('async');
const _ = require('lodash');
const debug = require('debug')('dbh:handler');
const dbh_alarm = require('./dbh/dbh_alarm');
const dbh_device = require('./dbh/dbh_device');
const config = require('../config');
const winston = require('../log/log.js');
const alarmutil = require('./getalarmtxt');
// const sendtokafka = require('../kafka/sendtokafka');
//
const dbh_alarmraw = require('./dbh/dbh_alarmraw');
const dbh_historydevice = require('./dbh/dbh_historydevice');
const dbh_historytrack  = require('./dbh/dbh_historytrack');

const getrealtime_devicealarmstat = (DeviceId,DataTime,devicealarmstat)=>{
  const devicekey = `${DeviceId}_${DataTime}`;
  let alarmtxtstat;
  if(!!devicealarmstat[devicekey]){
    alarmtxtstat = devicealarmstat[devicekey];
  }
  else{
    alarmtxtstat = _.get(config,`gloabaldevicealarmstat_realtime.${DeviceId}.devicealarmstat`,'');
  }
  return alarmtxtstat;
}

const onHandleToDB_alarm = (allresult,callbackfn)=>{
  debug(`获取allresult个数:${allresult['alarm'].length}`);

  dbh_alarm(allresult['alarm'],(err,result)=>{
    debug(`获取result个数:${result.length}`);
    if(!err && !!result){
      //result为报警信息返回结果,不确定result是否排序
      let devicealarmstat = {};
      let iordermap = {};

      const listalarm = result;
      _.map(listalarm,(alarm)=>{
        //alarm数据库中返回的记录
        config.gloabaldevicealarmstat_realtime[alarm.DeviceId] = {
          warninglevel:alarm.warninglevel,
          devicealarmstat:alarmutil.getalarmtxt(alarm)
        };

        devicealarmstat[`${alarm.DeviceId}_${alarm.DataTime}`] = alarmutil.getalarmtxt(alarm);
        iordermap[`${alarm.DeviceId}_${alarm.DataTime}`] = alarm.iorder;
      });
      //<-------处理所有的allresult
      _.map(allresult['device'],(o)=>{
        const LastRealtimeAlarm_DataTime = _.get(o,'LastRealtimeAlarm.DataTime','');

        o.alarmtxtstat = getrealtime_devicealarmstat(o.DeviceId,LastRealtimeAlarm_DataTime,devicealarmstat);
        // debug(`check--->:${devicekey},warninglevel:${o.warninglevel},result-->${JSON.stringify(devicealarmstat[devicekey])}`);

      });
      _.map(allresult['historydevice'],(o)=>{

        o.alarmtxtstat = getrealtime_devicealarmstat(o.DeviceId,o.DataTime,devicealarmstat);
        o.iorder = iordermap[`${o.DeviceId}_${o.DataTime}`];
        if(!o.iorder){
          debug(`historydevice错误,为何无法获得iorder:${JSON.stringify(o)},listalarm:${JSON.stringify(listalarm)}`);
          winston.getlog().error(`historydevice错误,为何无法获得iorder:${JSON.stringify(o)},listalarm:${JSON.stringify(listalarm)}`)
        }
      });
      _.map(allresult['alarmraw'],(o)=>{
        o.alarmtxtstat = getrealtime_devicealarmstat(o.DeviceId,o.DataTime,devicealarmstat);
        o.iorder = iordermap[`${o.DeviceId}_${o.DataTime}`];
        if(!o.iorder){
          debug(`alarmraw错误,为何无法获得iorder:${JSON.stringify(o)},listalarm:${JSON.stringify(listalarm)}`);
          winston.getlog().error(`alarmraw错误,为何无法获得iorder:${JSON.stringify(o)},listalarm:${JSON.stringify(listalarm)}`)
        }
      });
    }
    else{
      debug(err);
    }
    // debug(`所有设备最终结果:${JSON.stringify(allresult['device'])}`);
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
