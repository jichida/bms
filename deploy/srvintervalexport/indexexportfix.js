const config = require('./src/config');
const winston = require('./src/log/log.js');
const _ = require('lodash');
const jobfix = require('./src/srvsysdbfix');
const schedule = require('node-schedule');
// const startsrv = require('./src/test');//《------
const moment = require('moment');
const debug = require('debug')('srvinterval:start');

debug(`indexdb--->start=====>version:${config.version},mongodburl:${config.mongodburl}`);

winston.initLog();
process.setMaxListeners(0);

if(config.istest){
  winston.getlog().info(`开始工作`);
  jobfix.start_cron(()=>{
    winston.getlog().info(`fix 完毕`);
  });
}

schedule.scheduleJob('0 6 * * *', ()=>{
    //每天6点开始工作
    winston.getlog().info(`开始工作`);
    jobfix.start_cron(()=>{
      winston.getlog().info(`fix 完毕`);
    });
});

process.on('unhandledRejection', (err) => {
  winston.getlog().info(`unhandledRejection:${JSON.stringify(err)}`);
})

process.on('unhandledException', (err) => {
  winston.getlog().info(`unhandledException:${JSON.stringify(err)}`);
})





winston.getlog().info(`===执行到末尾===`);
