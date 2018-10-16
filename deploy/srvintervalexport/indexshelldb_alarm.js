const config = require('./src/config');
const winston = require('./src/log/log.js');
const _ = require('lodash');
const job = require('./src/srvsysshelldb_alarm');
const mongoose     = require('mongoose');
const schedule = require('node-schedule');
const DBModels = require('./src/handler/models.js');
const moment = require('moment');
const debug = require('debug')('srvinterval:start');

debug(`indexdb--->start=====>version:${config.version},mongodburl:${config.mongodburl},仅导一次:${config.curday}`);


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

job.start_cron0(config.curday,()=>{
  winston.getlog().info(`==${config.curday}导出完毕了==`);
});

// schedule.scheduleJob('30 2 * * *', ()=>{
//     //每天2:30开始工作<---改为2:30点开始工作
//     const moments = moment().subtract(1, 'days');
//     const curday = moments.format('YYYYMMDD');
//     job.start_cron0(curday,()=>{
//       winston.getlog().info(`==${curday}导出完毕了==`);
//     });
// });
// process.on('unhandledRejection', (err) => {
//   winston.getlog().info(`unhandledRejection:${JSON.stringify(err)}`);
// })
//
// process.on('unhandledException', (err) => {
//   winston.getlog().info(`unhandledException:${JSON.stringify(err)}`);
// })




winston.getlog().info(`===执行到末尾===`);
