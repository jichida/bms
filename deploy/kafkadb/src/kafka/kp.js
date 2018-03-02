const moment = require('moment');
const getProducer  = require('./rkafka/p.js');
const config = require('../config');
const _ = require('lodash');

const globalconfig = config.kafka_pconfig1 || {
    'metadata.broker.list': '192.168.1.20:9092,192.168.1.114:9092,192.168.1.136:9092',
};
const pconfig = config.kafka_pconfig2 || {

};


const startproducer = (callbackfn)=>{
  //console.log(`startproducer>>>>>>>>`);
  getProducer(globalconfig,pconfig,(err)=> {
    console.error(`Product---uncaughtException err`);
    console.error(err);
    console.error(err.stack);
    console.error(`uncaughtException err---`);
  }).then((producer)=>{
    const sendtokafka = (payload,topic,callbackfn)=>{
      const stringdata = JSON.stringify(payload);
      let partitionindex = -1;
      if(payload.length > 0){
        partitionindex = _.get(payload[0],'recvpartition',-1);
      }
      producer.produce(topic, partitionindex , new Buffer(stringdata));
      callbackfn(null,true);
    }
    callbackfn(sendtokafka);
  });
}


module.exports = startproducer;
