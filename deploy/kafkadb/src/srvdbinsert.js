const dbh = require('./db/index.js');

function onMessage (message) {
  console.log('(%s)%s read msg Topic="%s" Partition=%s Offset=%d',cid, this.client.clientId, message.topic, message.partition, message.offset);
  console.log(`获取到消息:${JSON.stringify(message)}`);
  dbh(message,(err,result)=>{

  });
}


exports.onMessage = onMessage;
