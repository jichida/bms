const dbh = require('../handler/index.js');
const getConsumer = require('./rkafka/c.js');
const _ = require('lodash');
let counter = 0;
const numMessages = 10;
const startsrv = (config)=>{
    const globalconfig = config.kafka_cconfig1 || {
        'group.id': 'kafkagrouptest',
        'metadata.broker.list': '192.168.1.20:9092,192.168.1.114:9092,192.168.1.136:9092',
        'client.id':'c1',
        'partition.assignment.strategy':'roundrobin',
        'enable.auto.commit': true
    };
    const cconfig =  config.kafka_cconfig2 || {
      'auto.offset.reset':'largest'
    };

    const topics = [];
    topics.push(config.kafka_dbtopic_index);
    topics.push(config.kafka_dbtopic_devices);
    topics.push(config.kafka_dbtopic_historydevices);
    topics.push(config.kafka_dbtopic_historytracks);
    topics.push(config.kafka_dbtopic_realtimealarms);
    topics.push(config.kafka_dbtopic_realtimealarmraws);
    topics.push(config.kafka_pushalaramtopic_app);

    globalconfig['client.id'] = `c${process.pid}_${config.NodeID}`;

    getConsumer(globalconfig,cconfig,topics,
    (msg,consumer)=> {
      counter++;
      // console.log(`get data====>${JSON.stringify(m)}`);
      let msgnew = _.clone(msg);
      dbh(msgnew,(err,result)=>{
        //committing offsets every numMessages
         if (counter % numMessages === 0) {
           console.log(`${counter}calling commit>>>>>>>>>>>>`);
           consumer.commit(msg);
         }
      });
    },
    (err,consumer)=> {
      console.error(`Consumer${process.pid} ---uncaughtException err`);
      console.error(err);
      console.error(err.stack);
      console.error(`uncaughtException err---`);
      consumer.disconnect();
      throw error;
    }).then((consumer)=>{
       process.on('SIGINT', () => {
          consumer.disconnect();
      });
    });
};

module.exports = startsrv;
