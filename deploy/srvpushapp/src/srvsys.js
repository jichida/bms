/**
 * Created by wangxiaoqing on 2017/3/25.
 */
const config = require('./config');
const DBModels = require('./handler/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');
const debug = require('debug')('srvapp:pcpush');
const kafka_pushalaramtopic_app = require('./kafka_pushalaramtopic_app');

let lasttime = moment().format('YYYY-MM-DD HH:mm:ss');


const checkDevice = (lasttime,callbackfn)=>{
  debug(`start check device:${lasttime}`);

  const deviceModel = DBModels.DeviceModel;
  const fields = {
    'DeviceId':1,
    'warninglevel':1,
    'LastRealtimeAlarm.DataTime':1,
    'alarmtxtstat':1,
    'UpdateTime':1
  };
  deviceModel.find({
    UpdateTime:{
      $gte:lasttime
    },
    warninglevel:{
      $in:['高','中','低']
    }
  }).select(fields).sort({UpdateTime:1}).lean().exec(callbackfn);
}

const intervalPushAlarm =()=>{
  setInterval(()=>{
    checkDevice(lasttime,(err,result)=>{
      if(!err && !!result){
        _.map(result,(devicedata)=>{
          lasttime = devicedata.UpdateTime;
          kafka_pushalaramtopic_app(devicedata,(err,result)=>{

          });
        });
      }
    });
  }, 5000);
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
