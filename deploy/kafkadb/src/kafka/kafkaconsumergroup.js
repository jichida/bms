const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;
// const uuid = require('uuid');
// const cid = uuid.v4();
const config = require('../config');
const _ = require('lodash');

const startsrv = (config,onMessage,onError)=>{
  let consumerOptions = config.consumerOptions;
  consumerOptions.id = `cid_${config.NodeID}`;

  const topics = [];
  const consumerGroups = [];

  topics.push(config.kafka_dbtopic_index);
  topics.push(config.kafka_dbtopic_devices);
  topics.push(config.kafka_dbtopic_historydevices);
  topics.push(config.kafka_dbtopic_historytracks);
  topics.push(config.kafka_dbtopic_realtimealarms);
  topics.push(config.kafka_dbtopic_realtimealarmraws);
  topics.push(config.kafka_pushalaramtopic_app);

  let consumerGroup;
  const consumerconnected = (id)=>{
    return ()=>{
      console.log(`ConsumerGroup connnected:${id}`);
    }
  }

  consumerOptions.id = `c_${config.NodeID}`;
  consumerGroup = new ConsumerGroup(consumerOptions,topics);
  consumerGroup.on('connect', consumerconnected(consumerOptions.id));
  consumerGroup.on('error', onError);
  consumerGroup.on('message', onMessage);
  consumerGroups.push(consumerGroup);
  // _.map(topics,(topicname,index)=>{
  //   consumerOptions.id = `c${index}_${config.NodeID}`;
  //   consumerGroup = new ConsumerGroup(consumerOptions, [topicname]);
  //   consumerGroup.once('connect', consumerconnected(consumerOptions.id,topicname));
  //   consumerGroup.on('error', onError);
  //   consumerGroup.on('message', onMessage);
  //   consumerGroups.push(consumerGroup);
  // });

  console.log(`等待消息${config.NodeID},consumerGroups:${consumerGroups.length}`);

  process.once('SIGINT', ()=> {
    async.each(consumerGroups,  (consumer, callback)=> {
      consumer.close(true, callback);
    });
  });
}

module.exports = startsrv;
