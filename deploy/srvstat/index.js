const config = require('./src/config');
const winston = require('./src/log/log.js');
const DBModels = require('./src/handler/models.js');
const _ = require('lodash');
const mongoose     = require('mongoose');
const job = require('./src/srvsys');
const schedule = require('node-schedule');
// const startsrv = require('./src/test');//《------
const moment = require('moment');
const debug = require('debug')('srvstat:start');


debug(`start=====>version:${config.version}`);

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


winston.getlog().info(`==程序启动${config.version}===`);
job.start_cron0();


schedule.scheduleJob('0 * * * *', ()=>{
    //每天0点开始工作
    job.start_cron0();
});




process.on('unhandledRejection', (err) => {
  winston.getlog().info(`unhandledRejection:${JSON.stringify(err)}`);
})

process.on('unhandledException', (err) => {
  winston.getlog().info(`unhandledException:${JSON.stringify(err)}`);
})

winston.getlog().info(`===执行到末尾===`);
