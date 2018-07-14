const redis = require("redis");
const moment = require('moment');
const _ = require('lodash');
const debug = require('debug')('srv:index');
const PubSub = require('pubsub-js');
const config = require('../config');
const winston = require('../log/log.js');
const async = require('async');

const  client = redis.createClient(config.srvredis);
client.on("error", (err)=> {
    debug("Error " + err);
});


const pushtoredis = (topicname,HistoryDeviceDataList,callbackfn)=>{
    let fnsz = [];
    _.map(HistoryDeviceDataList,(info)=>{
      fnsz.push((callbackfn)=>{
        const curday = moment(info.DataTime).format('YYYYMMDD');
        client.sadd(`${config.redisdevicesetname}${curday}`, `${info.DeviceId}`,(err, result)=> {
          client.lpush(`${curday}${info.DeviceId}`,info,(err,result)=>{
            callbackfn(null,true);
          });
        });
    });
    async.parallelLimit(fnsz,10,(err,result)=>{
      callbackfn();
    });
}

const startsrv = (callbackfn)=>{
  const userDeviceSubscriber = ( msg, data )=>{
      pushtoredis(data.topic,data.payload,()=>{
        debug('pushtoredis ok!');
      });
  };
  debug('redis is ready!');
  PubSub.subscribe(`redismsgpush`,userDeviceSubscriber);
  callbackfn();
}


module.exports = startsrv;
