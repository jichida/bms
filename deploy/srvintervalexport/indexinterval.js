const config = require('./src/config');
const winston = require('./src/log/log.js');
const _ = require('lodash');
const job = require('./src/srvsys');
const schedule = require('node-schedule');
// const startsrv = require('./src/test');//《------
const moment = require('moment');
const debug = require('debug')('srvinterval:start');

debug(`start=====>version:${config.version}`);

winston.initLog();
process.setMaxListeners(0);

winston.getlog().info(`==程序启动${config.version}===`);

const getnextjob = (callbackfn)=>{
  job.start_croneveryhours((dir)=>{
    debug(`job.start_croneveryhours-->${dir}`);
    callbackfn(dir);
  });
}

const intervaljob = ()=>{
  getnextjob((dir)=>{
    setTimeout(()=>{
      intervaljob();
    },60000);
  });
}

intervaljob();

//
// schedule.scheduleJob('30 * * * *', ()=>{
//     //每小时30分开始工作
//     job.start_croneveryhours((dir)=>{
//       debug(`job.start_croneveryhours-->${dir}`);
//     });
// });

process.on('unhandledRejection', (err) => {
  winston.getlog().info(`unhandledRejection:${JSON.stringify(err)}`);
})

process.on('unhandledException', (err) => {
  winston.getlog().info(`unhandledException:${JSON.stringify(err)}`);
})


winston.getlog().info(`===执行到末尾===`);
