const config = require('./src/config');
const winston = require('./src/log/log.js');
const jobfix = require('./src/srvsysdbfix');
const debug = require('debug')('srvinterval:start');

debug(`indexdb--->start=====>version:${config.version}`);

winston.initLog();
process.setMaxListeners(0);

winston.getlog().info(`开始工作`);
jobfix.start_cron(()=>{
  winston.getlog().info(`fix 完毕`);
});

process.on('unhandledRejection', (err) => {
  winston.getlog().info(`unhandledRejection:${JSON.stringify(err)}`);
})

process.on('unhandledException', (err) => {
  winston.getlog().info(`unhandledException:${JSON.stringify(err)}`);
});

winston.getlog().info(`===执行到末尾===`);
