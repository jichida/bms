const kafka = require('node-rdkafka');
const debug = require('debug')('kafka');

debug(kafka.features);
debug(kafka.librdkafkaVersion);

const initConsumer =(globalconfig,cconfig,topics,onErr)=> {
  return new Promise((resolve, reject) => {
    const consumer = new kafka.KafkaConsumer(globalconfig,cconfig);

    consumer.on('ready', () => {
      debug('consumer ready.');
      consumer.subscribe(topics || ['bms.index'])
      // consumer.consume();
      resolve(consumer);
    })
    // consumer.on('data', (msg)=> {
    //   onMsg(msg,consumer);
    // });
    consumer.on('event.error', (err)=>{
        onErr(err,consumer);
        reject(err);
    });
    // consumer.on('disconnected', () => {
    //   process.exit(0)
    // });
    // consumer.on('event.log', (event)=> {
    //   //console.log(event)
    // })
    consumer.connect();
  });
}

module.exports = initConsumer;
