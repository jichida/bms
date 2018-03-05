const parseKafkaMsgs = require('../kafkadb_data.js');
const onHandleToDB = require('../kafkadb_dbh.js');
const debug = require('debug')('dbh:topicindex');

const processbatchmsgs = (msgs,callbackfnmsg)=>{
  debug(`消息开始----->`);
  parseKafkaMsgs(msgs,(allresult)=>{
    debug(`消息结束----->`);
    onHandleToDB(allresult,()=>{
      debug(`数据库操作结束----->`);
      callbackfnmsg();
    });
  });
};

module.exports = processbatchmsgs;
