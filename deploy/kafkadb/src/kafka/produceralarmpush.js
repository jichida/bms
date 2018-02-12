const kafka = require('kafka-node');
const config = require('../config.js');

const Producer = kafka.Producer;
const KeyedMessage = kafka.KeyedMessage;
const Client = kafka.Client;
const client = new Client(config.consumerOptions.kafkaHost);
// const argv = require('optimist').argv;
const producer = new Producer(client, { requireAcks: 1 });
// const moment = require('moment');
const getpartition = (key)=>{
  let index = key;
  if(typeof key === 'string'){
    try{
      index = parseInt(key);
    }
    catch(e){
      index = 0;
    }
  }
  index = index%config.partitionnumber;
  return index;
}

const startproducer = (callbackfn)=>{
  // let rate = 2000;
  producer.on('ready',  ()=> {
    console.log(`kafka producer get ready!!`);
    const sendtokafka = (payload,topic,callbackfn)=>{
      payload.partitionsend = getpartition(payload.SN64);
      let payloads = [
          {
            topic: topic,
            messages: JSON.stringify(payload),
            partition: payload.partitionsend,
         },
      ];
      producer.send(payloads, (err, data)=> {
        if(!!callbackfn){
          callbackfn(err,data);
        }
      });
    }
    callbackfn(sendtokafka);
  });

  producer.on('error',  (err)=> {
    console.log(`startproducer error`);
    console.log(err);
  });

}


module.exports = startproducer;
