const config = require('./src/config');
const winston = require('./src/log/log.js');
const DBModels = require('./src/handler/models.js');
const _ = require('lodash');
const mongoose     = require('mongoose');
const startsrv = require('./src/srvsys');
// const startsrv = require('./src/test');//《------
const moment = require('moment');
const debug = require('debug')('srvinterval:start');

debug(`start=====>version:${config.version}`);

debug(`==========>isnow:${config.isnow},curday:${config.curday}`);
debug(`==========>exportFlag:${config.exportFlag},DeviceId:${config.DeviceId}`);

winston.initLog();
process.setMaxListeners(0);

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodburl,{
    mongos:config.mongos,

    // useMongoClient: true,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE
  });

debug(`connected success!${moment().format('YYYY-MM-DD HH:mm:ss')}`);
// winston.getlog().info(`start kafkadb ok`);
const alname = 'AL_';
//还应该包括所有AL开头字母的信息
const dbdictModel = DBModels.DataDictModel;
dbdictModel.find({
    name:{'$regex':alname, $options: "i"}
  },(err,dictlist)=>{
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

  startsrv();
});


process.on('unhandledRejection', (err) => {
  winston.getlog().info(`unhandledRejection:${JSON.stringify(err)}`);
})

process.on('unhandledException', (err) => {
  winston.getlog().info(`unhandledException:${JSON.stringify(err)}`);
})
