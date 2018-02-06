const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;
// const uuid = require('uuid');
// const cid = uuid.v4();
const config = require('../config');

const startsrv = (config,onMessage,onError)=>{
  let consumerOptions = config.consumerOptions;
  consumerOptions.id = `cid_${config.NodeID}`;

  const topics = [];
  if(config.ismaster){
    topics.push(config.kafka_maintopic);
    consumerOptions.groupId = 'bmsgroupmaster';
  }
  else{
    topics.push(config.kafka_dbtopic_index);
    topics.push(config.kafka_dbtopic_devices);
    topics.push(config.kafka_dbtopic_historydevices);
    topics.push(config.kafka_dbtopic_historytracks);
    topics.push(config.kafka_dbtopic_realtimealarms);
    topics.push(config.kafka_dbtopic_realtimealarmraws);
  }


  const consumerGroup = new ConsumerGroup(consumerOptions, topics);
  consumerGroup.on('error', onError);
  consumerGroup.on('message', onMessage);

  console.log(`等待消息${config.NodeID}`);

  process.once('SIGINT', ()=> {
    async.each([consumerGroup],  (consumer, callback)=> {
      consumer.close(true, callback);
    });
  });
}

module.exports = startsrv;
