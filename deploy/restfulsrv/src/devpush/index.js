//监听来自kafka队列的数据
const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;
const uuid = require('uuid');
const cid = uuid.v4();

const startsrv = (config,onMessage,onError)=>{
  const consumerOptions = config.kafka_consumersettings;
  const topics =  ['push.device'];
  const consumerGroup = new ConsumerGroup(Object.assign({id: cid}, consumerOptions), topics);
  consumerGroup.on('error', onError);
  consumerGroup.on('message', onMessage);

  process.once('SIGINT', ()=> {
    async.each([consumerGroup],  (consumer, callback)=> {
      consumer.close(true, callback);
    });
  });
}

exports.startsrv = startsrv;
