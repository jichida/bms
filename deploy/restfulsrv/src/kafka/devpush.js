const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;
const uuid = require('uuid');
const cid = uuid.v4();
const PubSub = require('pubsub-js');
const config = require('../config.js');
const _ = require('lodash');
const winston = require('../log/log.js');

function onMessage (message) {
  console.log(`获取来自kafka设备消息:${JSON.stringify(message)}`);
  try{
    const data = JSON.parse(message.value);
    const DeviceId = data.DeviceId;
    const payload = data;
    console.log(`重新publish出去:${DeviceId},数据:${payload}`);

    PubSub.publish(`${config.kafka_pushalaramtopic}.${DeviceId}`, payload);

  }
  catch(e){
    console.log(e);
  }
}

const onError =(error)=> {
  console.error(error);
  console.error(error.stack);
}

const start_kafkaconsumergroup = (config)=>{

  const consumerOptions = config.kafka_consumersettings;
  const topics = [config.kafka_pushalaramtopic];
  const consumerGroup = new ConsumerGroup(Object.assign({id: cid}, consumerOptions), topics);
  consumerGroup.on('error', onError);
  consumerGroup.on('message', onMessage);

  process.once('SIGINT', ()=> {
    async.each([consumerGroup],  (consumer, callback)=> {
      consumer.close(true, callback);
    });
  });
}

module.exports = start_kafkaconsumergroup;
