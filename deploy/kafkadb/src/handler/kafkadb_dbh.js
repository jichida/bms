const async = require('async');
const _ = require('lodash');
const debug = require('debug')('dbh');
const dbh_alarm = require('./dbh/dbh_alarm');
const dbh_device = require('./dbh/dbh_device');
const config = require('../config');
const sendtokafka = require('../kafka/sendtokafka');
//
// const dbh_alarmraw = require('./dbh/dbh_alarmraw');
// const dbh_historydevice = require('./dbh/dbh_historydevice');
// const dbh_historytrack  = require('./dbh/dbh_historytrack');

const onHandleToDB = (allresult,callbackfn)=>{
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
  fnsz.push((callbackfn)=>{
    dbh_alarm(allresult['alarm'],callbackfn);
  });

  debug(`start onHandleToDB`);
  async.parallel(fnsz,(err,result)=>{
    debug(`stop onHandleToDB`);
    callbackfn(err,result);
  });
};

module.exports = onHandleToDB;
