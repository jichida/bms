const Kafka = require('node-rdkafka');

const consumer = new Kafka.KafkaConsumer({
  // 'debug': 'all',
  'group.id': 'kafkagrouptest',
  'metadata.broker.list': '192.168.1.20:9092,192.168.1.114:9092,192.168.1.136:9092',
  'client.id':'c1',
  'partition.assignment.strategy':'roundrobin',
  'enable.auto.commit': true
}, {
  'auto.offset.reset':'largest'
});

const topicName = 'bms.index';

//logging debug messages, if debug is enabled
consumer.on('event.log', function(log) {
  console.log(log);
});

//logging all errors
consumer.on('event.error', function(err) {
  console.error(`---uncaughtException err`);
  console.error(err);
  console.error(err.stack);
  console.error(`uncaughtException err---`);
});

//counter to commit offsets every numMessages are received
var counter = 0;
var numMessages = 5;

consumer.on('ready', function(arg) {
  console.log('consumer ready.' + JSON.stringify(arg));

  consumer.subscribe([topicName]);
  //start consuming messages
  consumer.consume();
}).on('data', function(m) {
  // console.log(`get data====>${JSON.stringify(m)}`);
  const value = m.value.toString();
  let jsondata;
  try{
    jsondata = JSON.parse(value);
  }
  catch(e){

  }
  console.log(`partition:${m.partition},offset:${m.offset},value:${jsondata.SN64}`);
  // counter++;

  // size: 4063,
  // key: null,
  // topic: 'bms.index',
  // offset: 533551,
  // partition: 0,
  // timestamp: 0

  //
  // //committing offsets every numMessages
  // if (counter % numMessages === 0) {
  //   console.log('calling commit');
  // consumer.commit(m);
  // }
  //
  // // Output the actual message contents
  // console.log(JSON.stringify(m));
  // console.log(m.value.toString());

});

consumer.on('disconnected', function(arg) {
  console.log('consumer disconnected. ' + JSON.stringify(arg));
});

//starting the consumer
consumer.connect();

process.once('SIGINT', ()=> {
  consumer.disconnect();
});
