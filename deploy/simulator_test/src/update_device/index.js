/**
 * Created by wangxiaoqing on 2017/3/25.
 */
const config = require('../config');
const DBModels = require('../db/models.js');
const moment = require('moment');
const _ = require('lodash');
const schedule = require('node-schedule');

const do_update_device = ()=>{

  const realtimealarmModel = DBModels.RealtimeAlarmModel;
  const query = {
    curDay:{$ne:moment().format('YYYY-MM-DD')}
  };
  console.log(`do_update_device...`);
  realtimealarmModel.find(query,null,{
    skip: 0,
    limit: 60,
    sort:{ "DataTime":1}
  },(err,list)=>{
    if(!err && !!list){
      list = JSON.parse(JSON.stringify(list));
      _.map(list,(device)=>{
        let devicenew = _.clone(device);
        devicenew.curDay = moment().format('YYYY-MM-DD');
        devicenew.DataTime = moment().subtract(1, 'second').format('YYYY-MM-DD HH:mm:ss');
        realtimealarmModel.findByIdAndUpdate(devicenew._id,devicenew,{new: true},(err, result)=> {
          console.log(`findByIdAndUpdate===>${JSON.stringify(result)}`)
        });
      });
    }
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


let job=()=>{

  do_update_device();
  schedule.scheduleJob('*/1 * * * *', ()=>{
      //console.log('每隔5分钟执行这里!');
      do_update_device();
  });
};

exports.startjob = job;
