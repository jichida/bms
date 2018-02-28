 const startsrv = require('./src/kafka/kc.js');
const config = require('./src/config');
const DBModels = require('./src/handler/models.js');
const _ = require('lodash');
const mongoose     = require('mongoose');
const alarmplugin = require('./src/plugins/alarmfilter/index');
const moment = require('moment');
const debug = require('debug')('start');

debug(`start=====>version:${config.version},\
  clientid:${config.kafka_cconfig1['client.id']} \
  kafkaHost:${config.kafka_cconfig1['metadata.broker.list']},partitionnumber:${config.partitionnumber}`);

process.setMaxListeners(0);

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodburl,{
    mongos:config.mongos,

    useMongoClient: true,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE
  });


const alname = 'AL_';
//还应该包括所有AL开头字母的信息
const dbdictModel = DBModels.DataDictModel;
dbdictModel.find({
    name:{'$regex':alname, $options: "i"}
  },(err,dictlist)=>{

  // console.log(err)
  // console.log(`dictlist==>${JSON.stringify(dictlist)}`)
  let mapdict = {};
  if(!err && dictlist.length > 0){
    _.map(dictlist,(v)=>{
      mapdict[v.name] = {
        name:v.name,
        showname:v.showname,
        unit:v.unit
      }
    });
  }
  config.mapdict = _.merge(config.mapdict,mapdict);
  // console.log(config.mapdict);
});

debug(`connected success!${moment().format('YYYY-MM-DD HH:mm:ss')}`);

// process.on('uncaughtException', (error) => {
//   debug(`---uncaughtException err`);
//   console.error(error);
//   console.error(error.stack);
//   console.error(`uncaughtException err---`);
//   // throw error;
//   process.exit(1);
// });


startsrv(config);
