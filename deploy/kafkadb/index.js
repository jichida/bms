const startsrv = require('./src/kafka/kafkaconsumergroup.js');
const srvdb = require('./src/kafka/srvdbinsert.js');
const config = require('./src/config');

let mongoose     = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodburl,{
    useMongoClient: true,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE
  });

const onError =(error)=> {
  console.error(error);
  console.error(error.stack);
}

startsrv(config,srvdb.onMessage,onError);
