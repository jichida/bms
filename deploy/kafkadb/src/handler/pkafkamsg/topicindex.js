const parseKafkaMsgs = require('../kafkadb_data.js');
const onHandleToDB = require('../kafkadb_dbh.js');
const debug = require('debug')('dbh:topicindex');
const winston = require('../../log/log.js');
const config = require('../../config.js');

const processbatchmsgs = (msgs,callbackfnmsg)=>{
  debug(`消息开始----->`);
  if(config.istest){
    winston.getlog().error(`消息开始:${msgs.length}`);
  }
  parseKafkaMsgs(msgs,(allresult)=>{
    if(config.istest){
      winston.getlog().error(`消息结束`);
    }
    onHandleToDB(allresult,()=>{
      if(config.istest){
        winston.getlog().error(`数据库操作结束`);
      }
      debug(`数据库操作结束----->`);
      callbackfnmsg();
    });
  });
};

module.exports = processbatchmsgs;
