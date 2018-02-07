const startsrv = require('./src/kafka/kafkaconsumergroup.js');
const srvdb = require('./src/kafka/srvdbinsert.js');
const config = require('./src/config');
// const logdata = require('./src/log/logdata.js');
// const logbms = require('./src/log/logbms.js');
const moment = require('moment');

const onError =(error)=> {
  console.error(error);
  console.error(error.stack);
}

// logdata.initLog();
// logbms.initLog();

const curtime = moment().format('YYYY-MM-DD-HHmmss')
console.log(`开始启动:${curtime},host:${config.consumerOptions.host},groupId:${config.consumerOptions.groupId},topic:${JSON.stringify(config.consumertopics)},NodeID:${config.NodeID}`);
// logdata.getlog().info(`开始启动:${curtime}`);
// logbms.getlog().info(`开始启动:${curtime}`);

startsrv(config,srvdb.onMessage,onError);
