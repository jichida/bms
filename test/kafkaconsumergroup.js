const async = require('async');
const ConsumerGroup = require('kafka-node').ConsumerGroup;
const uuid = require('uuid');
const cid = uuid.v4();
const consumerOptions = {
  host: '127.0.0.1:2181',
  groupId: 'BMSRecvGroup',
  sessionTimeout: 15000,
  protocol: ['roundrobin'],
  fromOffset: 'earliest' // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
};

const topics = ['BMS.bms', 'BMS.position'];

const consumerGroup = new ConsumerGroup(Object.assign({id: cid}, consumerOptions), topics);
consumerGroup.on('error', onError);
consumerGroup.on('message', onMessage);


function onError (error) {
  console.error(error);
  console.error(error.stack);
}

function onMessage (message) {
  console.log('(%s)%s read msg Topic="%s" Partition=%s Offset=%d',cid, this.client.clientId, message.topic, message.partition, message.offset);
  console.log(`获取到消息:${JSON.stringify(message)}`);
}

process.once('SIGINT', ()=> {
  async.each([consumerGroup],  (consumer, callback)=> {
    consumer.close(true, callback);
  });
});
