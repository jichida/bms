const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;
const uuid = require('uuid');
const cid = uuid.v4();

function onMessage (message) {
  console.log(`获取到消息:${JSON.stringify(message)}`);
  // dbh(message,(err,result)=>{
  //
  // });
}

const onError =(error)=> {
  console.error(error);
  console.error(error.stack);
}

const start_kafkaconsumergroup = (config)=>{

  const consumerOptions = config.consumerOptions;
  const topics = config.consumertopics;
  const consumerGroup = new ConsumerGroup(Object.assign({id: cid}, consumerOptions), topics);
  consumerGroup.on('error', onError);
  consumerGroup.on('message', onMessage);

  process.once('SIGINT', ()=> {
    async.each([consumerGroup],  (consumer, callback)=> {
      consumer.close(true, callback);
    });
  });
}

module.exports == start_kafkaconsumergroup;
