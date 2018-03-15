const startsrv = require('./src/kafka/kc.js');
const config = require('./src/config');
const winston = require('./src/log/log.js');
const DBModels = require('./src/handler/models.js');
const _ = require('lodash');
const mongoose     = require('mongoose');
const alarmplugin = require('./src/plugins/alarmfilter/index');
const moment = require('moment');
const debug = require('debug')('start');

debug(`start=====>version:${config.version},groupid:${config.kafka_cconfig1['group.id']}\
  clientid:${config.kafka_cconfig1['client.id']} \
  kafkaHost:${config.kafka_cconfig1['metadata.broker.list']},partitionnumber:${config.partitionnumber}`);

debug(`==========`);

debug(`indextopic:${config.kafka_dbtopic_index},currenttopic:${config.kafka_dbtopic_current},kcmsg:${config.kcmsg}`);

winston.initLog();
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
winston.getlog().info(`start kafkadb ok`);


startsrv(config);
