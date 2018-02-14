const kafka = require('node-rdkafka');

const initConsumer =(globalconfig,cconfig,topics,onErr)=> {
  return new Promise((resolve, reject) => {
    const consumer = new kafka.KafkaConsumer(globalconfig,cconfig);

    consumer.on('ready', () => {
      //console.log('consumer ready.');
      consumer.subscribe(topics || ['bms.index'])
      // consumer.consume();
      resolve(consumer);
    })
    // consumer.on('data', (msg)=> {
    //   onMsg(msg,consumer);
    // });
    consumer.on('event.error', (err)=>{
        onErr(err,consumer);
    });
    consumer.on('disconnected', () => {
      process.exit(0)
    });
    consumer.on('event.log', (event)=> {
      //console.log(event)
    })
    consumer.connect();
  });
}

module.exports = initConsumer;
