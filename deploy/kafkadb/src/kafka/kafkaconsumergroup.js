const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;
const dbh = require('../handler/index.js');
// const uuid = require('uuid');
// const cid = uuid.v4();
const config = require('../config');
const _ = require('lodash');

const startsrv = (config,onMessage,onError)=>{
  let consumerOptions = config.consumerOptions;

  const topics = [];

  topics.push(config.kafka_dbtopic_index);
  topics.push(config.kafka_dbtopic_devices);
  topics.push(config.kafka_dbtopic_historydevices);
  topics.push(config.kafka_dbtopic_historytracks);
  topics.push(config.kafka_dbtopic_realtimealarms);
  topics.push(config.kafka_dbtopic_realtimealarmraws);
  topics.push(config.kafka_pushalaramtopic_app);

  consumerOptions.id = `c_${config.NodeID}`;
  let consumerGroup = new ConsumerGroup(consumerOptions,topics);
  // consumerGroup.on('connect', consumerconnected(consumerOptions.id));
  consumerGroup.on('error', (error)=> {
    console.error(`---msg err`);
    console.error(error);
    console.error(error.stack);
    console.error(`msg err---`);
  });
  consumerGroup.on('message', (msg)=>{
    dbh(msg,(err,result)=>{
      consumerGroup.commit((error, data) => {
          if(!!error){
            console.error(`---commit err`);
            console.error(error);
            console.error(error.stack);
            console.error(`commit err---`);
          }
       });
    });
  });

  console.log(`等待消息${config.NodeID},id:${consumerOptions.id}`);

  process.once('SIGINT', ()=> {
    async.each([consumerGroup],  (consumer, callback)=> {
      consumer.close(true, callback);
    });
  });
}

module.exports = startsrv;
