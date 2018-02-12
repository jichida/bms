const kafka = require('kafka-node');
const config = require('../config.js');
const Producer = kafka.Producer;
const client = new kafka.KafkaClient({kafkaHost:config.consumerOptions.kafkaHost});
const producer = new Producer(client, { requireAcks: 1 });
const async = require('async');

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
  // client.loadMetadataForTopics([topic])
  // client.updateMetadatas(metadata)
  const clienconnected = (callbackfn)=>{
    client.once('connect', ()=> {
        console.log(`client connnected!!`);
        const topics = [];
        topics.push(config.kafka_dbtopic_index);
        topics.push(config.kafka_dbtopic_devices);
        topics.push(config.kafka_dbtopic_historydevices);
        topics.push(config.kafka_dbtopic_historytracks);
        topics.push(config.kafka_dbtopic_realtimealarms);
        topics.push(config.kafka_dbtopic_realtimealarmraws);
        topics.push(config.kafka_pushalaramtopic_app);

        client.loadMetadataForTopics(topics, (error, results)=> {
          console.log(`loadMetadataForTopics!! `);
          callbackfn(null,true);
        });
    });
  }

  const producerready = (callbackfn)=>{
    producer.on('ready',  ()=> {
      console.log(`kafka producer get ready!!`);
      callbackfn(null,true);
    });
  }

  let asyncfnsz = [];
  asyncfnsz.push(clienconnected);
  asyncfnsz.push(producerready);

  async.parallel(asyncfnsz,(err,result)=>{
    if(!!err){
      console.error(`---parallel err`);
      console.error(error);
      console.error(error.stack);
      console.error(`parallel err---`);
    }
    console.log(`allready--->result:${JSON(result)}`);
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
