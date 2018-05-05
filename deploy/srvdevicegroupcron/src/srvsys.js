/**
 * Created by wangxiaoqing on 2017/3/25.
 */
const config = require('./config');
const schedule = require('node-schedule');
const DBModels = require('./handler/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
const startcron = require('./lib/startcron');
const _ = require('lodash');
const coordtransform = require('coordtransform');
const debug = require('debug')('srvdevicegroupcron:index');
const winston = require('./log/log.js');

const getDevice = (callbackfn)=>{
  const deviceModel = DBModels.DeviceModel;
  deviceModel.find({
    'last_GPSTime':{$exists:true},
    'last_Longitude':{$ne:0},
  },{
    'DeviceId':1,
    'last_GPSTime':1,
    'last_Longitude':1,
    'last_Latitude':1,
  }).lean().exec((err,result)=>{
    rlst = [];
    if(!err && !!result){
      _.map(result,(item)=>{
        const cor = [item.last_Longitude,item.last_Latitude];
        const wgs84togcj02 = coordtransform.wgs84togcj02(cor[0],cor[1]);
        rlst.push({
          _id:item._id,
          Longitude:wgs84togcj02[0],
          Latitude:wgs84togcj02[1],
        })
      });

    }
    callbackfn(rlst);
  });
}


const startsrv =()=>{
  debug(`开始执行...`);
  getDevice((devicelist)=>{
    // debug(`getDevice-->${JSON.stringify(devicelist)}`);
    startcron(devicelist,(err,result)=>{
      debug(`全部执行完毕...`);
      winston.getlog().info(`全部执行完毕`);
    });
  });
}


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
    startsrv();

    schedule.scheduleJob('0 0 * * *', ()=>{
      //每天0点开始工作
      startsrv();
    });
};

module.exports = job;
