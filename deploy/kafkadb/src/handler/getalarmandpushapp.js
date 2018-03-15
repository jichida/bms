const _ = require('lodash');
const kafka_pushalaramtopic_app = require('./kafka_pushalaramtopic_app');
const debug = require("debug")("alarmpush")
const getalarmandpushapp = (alarmlist,callbackfn)=>{
    alarmlist = _.filter(alarmlist, (o)=> {
       return o.warninglevel === '高' || o.warninglevel === '中' || o.warninglevel === '低';
     });
    //先对alarmlist排序[按updatetime]
    debug(`alarmlist->${JSON.stringify(alarmlist)}`);
    alarmlist = _.sortBy(alarmlist,(o)=>{
      return o.UpdateTime;
    })
    //倒序
    alarmlist = _.reverse(alarmlist);
    //再对alarmlist去重【deivceid]
    alarmlist = _.sortedUniqBy(alarmlist,(o)=>{
      return o.DeviceId;
    })
    //循环发送
    debug(`结果 alarmlist->${JSON.stringify(alarmlist)}`);
    _.map(alarmlist,(devicedata)=>{
      kafka_pushalaramtopic_app(devicedata,(err,result)=>{

      });
    })
}

module.exports = getalarmandpushapp;
