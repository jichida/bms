const moment = require('moment');
const winston = require('../log/log.js');
const getProducer  = require('./rkafka/p.js');
const config = require('../config');
const _ = require('lodash');
const debug = require('debug')('dbh:kp');

const globalconfig = config.kafka_pconfig1 || {
    'metadata.broker.list': '192.168.1.20:9092,192.168.1.114:9092,192.168.1.136:9092',
};
const pconfig = config.kafka_pconfig2 || {

};


const startproducer = (callbackfn)=>{
  //console.log(`startproducer>>>>>>>>`);
  getProducer(globalconfig,pconfig,(err)=> {
    winston.getlog().warn(`getProducer err`);
    winston.getlog().warn(err);
  }).then((producer)=>{
    const sendtokafka = (payload,topic,callbackfn)=>{
      const stringdata = JSON.stringify(payload);
      let partitionindex = 0;
      if(payload.length > 0){
        partitionindex = _.get(payload[0],'recvpartition',0);
      }
      debug(`startproducer:${payload.length},key:${partitionindex}`);
      producer.produce(topic, -1 , new Buffer(stringdata),partitionindex);
      callbackfn(null,true);
    }
    callbackfn(sendtokafka);
  });
}


module.exports = startproducer;
