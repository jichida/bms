const moment = require('moment');
const getProducer  = require('./rkafka/p.js');
const config = require('../config');

const globalconfig = config.kafka_pconfig1 || {
    'metadata.broker.list': '192.168.1.20:9092,192.168.1.114:9092,192.168.1.136:9092',
};
const pconfig = config.kafka_pconfig2 || {

};


const startproducer = (callbackfn)=>{
  getProducer(globalconfig,pconfig,(err)=> {
    console.error(`---uncaughtException err`);
    console.error(err);
    console.error(err.stack);
    console.error(`uncaughtException err---`);
  }).then((producer)=>{
    const sendtokafka = (payload,topic,callbackfn)=>{
      const stringdata = JSON.stringify(payload);
      producer.produce(topic, -1, new Buffer(stringdata),payload.SN64);
      callbackfn(null,true);
    }
    callbackfn(sendtokafka);
  });
}


module.exports = startproducer;
