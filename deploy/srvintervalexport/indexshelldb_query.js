const config = require('./src/config');
const winston = require('./src/log/log.js');
const _ = require('lodash');
const job = require('./src/srvsysshelldb_query');
const mongoose     = require('mongoose');
const schedule = require('node-schedule');
const DBModels = require('./src/handler/models.js');
const moment = require('moment');
const debug = require('debug')('srvinterval:start');

debug(`indexdb--->start=====>version:${config.version},mongodburl:${config.mongodburl},仅导一次:${config.startday}-${config.endday}`);


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

job.start_cron0(config.startday,config.endday,()=>{
  winston.getlog().info(`==${config.startday}-${config.endday}导出完毕了==`);
});




winston.getlog().info(`===执行到末尾===`);
