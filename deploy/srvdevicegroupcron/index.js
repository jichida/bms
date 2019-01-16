const config = require('./src/config');
const winston = require('./src/log/log.js');
const startjob = require('./src/srvsys');
const mongoose     = require('mongoose');
const debug = require('debug')('srvdevicegroupcron:app');
const getdevicecitycode = require('./src/getdevicecitycode');
const schedule = require('node-schedule');
debug(`start=====>version:${config.version}`);

debug(`==========`);

winston.initLog();
//连接数据库
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodburl,{
    mongos:config.mongos,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE
});

debug(`startjob==========`);
winston.getlog().info(`开始执行:${config.version}`);
getdevicecitycode();

startjob(()=>{
  winston.getlog().info(`执行完毕`);
});



schedule.scheduleJob('0 0 * * *', ()=>{
  //每天0点开始工作
  winston.getlog().info(`凌晨开始执行:${config.version}`);
  startjob(()=>{
    winston.getlog().info(`执行完毕`);
  });
});
