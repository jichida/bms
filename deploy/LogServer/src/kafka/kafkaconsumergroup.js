const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;
// const uuid = require('uuid');
// const cid = uuid.v4();
const config = require('../config');

const startsrv = (config,onMessage,onError)=>{
  const consumerOptions = config.consumerOptions;
  const topics = config.consumertopics;
  const consumerGroup = new ConsumerGroup(Object.assign({id: config.NodeID}, consumerOptions), topics);
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
