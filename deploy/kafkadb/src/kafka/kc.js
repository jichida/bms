const dbh = require('../handler/index.js');
const getConsumer = require('./rkafka/c.js');

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

    globalconfig['client.id'] = `c_${config.NodeID}`;

    getConsumer(globalconfig,cconfig,topics,
    (m)=> {
      // console.log(`get data====>${JSON.stringify(m)}`);
      dbh(msg,(err,result)=>{
        // consumerGroup.commit((error, data) => {
        //     if(!!error){
        //       console.error(`---commit err`);
        //       console.error(error);
        //       console.error(error.stack);
        //       console.error(`commit err---`);
        //     }
        //  });
      });
    },
    (err)=> {
      console.error(`---uncaughtException err`);
      console.error(err);
      console.error(err.stack);
      console.error(`uncaughtException err---`);
    }).then((consumer)=>{
       process.on('SIGINT', () => {
          consumer.disconnect();
        });
    });
};

module.exports = startsrv;
