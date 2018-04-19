const config = require('./src/config');
const winston = require('./src/log/log.js');
const startjob = require('./src/srvsys');
const mongoose     = require('mongoose');
const debug = require('debug')('srvdevicegroupcron:app');

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
winston.getlog().info(`开始执行`);
startjob();
