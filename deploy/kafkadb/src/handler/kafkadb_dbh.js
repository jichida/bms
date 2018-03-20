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
  debug(`获取allresult个数:${allresult['alarm'].length}`);

  dbh_alarm(allresult['alarm'],(err,result)=>{
    debug(`获取result个数:${result.length}`);
    if(!err && !!result){
      let devicealarmstat = {};
      const listalarm = result;
      _.map(listalarm,(alarm)=>{
        if(alarm.warninglevel !== ''){
          devicealarmstat[`${alarm.DeviceId}_${alarm.DataTime}`] = alarmutil.getalarmtxt(alarm);
        }
      });
      debug(`所有设备统计信息:${JSON.stringify(devicealarmstat)}`);
      //<-------处理所有的allresult
      _.map(allresult['device'],(o)=>{
        const LastRealtimeAlarm_DataTime = _.get(o,'LastRealtimeAlarm.DataTime','');
        const devicekey = `${o.DeviceId}_${LastRealtimeAlarm_DataTime}`;
        debug(`check--->:${devicekey},warninglevel:${o.warninglevel},result-->${JSON.stringify(devicealarmstat[devicekey])}`);

        if(!!devicealarmstat[devicekey]){
          o.alarmtxtstat = devicealarmstat[devicekey];
        }

      });
      _.map(allresult['historydevice'],(o)=>{
        if(!!devicealarmstat[`${o.DeviceId}_${o.DataTime}`]){
          o.alarmtxtstat = devicealarmstat[`${o.DeviceId}_${o.DataTime}`];
        }
      });
      _.map(allresult['alarmraw'],(o)=>{
        if(!!devicealarmstat[`${o.DeviceId}_${o.DataTime}`]){
          o.alarmtxtstat = devicealarmstat[`${o.DeviceId}_${o.DataTime}`];
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
