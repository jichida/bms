const getConsumer = require('./rkafka/c.js');
const config = require('../config');
const winston = require('../log/log.js');
const debug = require('debug')('dbh:kc');
const moment = require('moment');
const schedule = require('node-schedule');

const topicindex = require('../handler/pkafkamsg/topicindex');
const tophistorydevices = require('../handler/pkafkamsg/tophistorydevices');
const topichistorytracks = require('../handler/pkafkamsg/topichistorytracks');
const topicrealtimealarmraws = require('../handler/pkafkamsg/topicrealtimealarmraws');

const numMessages = config.kcmsg;

const handlermap = {};
handlermap[config.kafka_dbtopic_index] = topicindex;
handlermap[config.kafka_dbtopic_realtimealarmraws] = topicrealtimealarmraws;
handlermap[config.kafka_dbtopic_historydevices] = tophistorydevices;
handlermap[config.kafka_dbtopic_historytracks] = topichistorytracks;

let lastkafkacommittime = moment().format('YYYY-MM-DD HH:mm:ss');
debug(`----${config.version}`);

const getdelaymsec = (numMsg)=>{
  const curtime = moment().format('YYYY-MM-DD HH:mm:ss');
  let delaymsec = 0;
  let leftnum = numMessages;
  if(numMsg > 0){
    leftnum = numMessages - numMsg;//剩余个数
    delaymsec = leftnum > 0 ? leftnum*10:0;
  }
  lastkafkacommittime = curtime;
  // debug(`当前时间:${curtime},剩余:${leftnum},延时:${delaymsec}毫秒`);
  return delaymsec;
}

let checktime;
schedule.scheduleJob('*/10 * * * *', ()=>{
  //每10分钟检查一次
  debug(`10分钟到了,上次递交时间:${lastkafkacommittime}`);
  if(!!checktime){
    if(checktime === lastkafkacommittime){
      debug(`上次检查时间:${checktime},上次递交时间:${lastkafkacommittime},相同则退出`);
      winston.getlog().warn(`10分钟不动了,可能出错,强制退出,${lastkafkacommittime}`);
      process.exit(1);
    }
  }
  checktime = lastkafkacommittime;

});


const processbatchmsgs = (data,callbackfn)=>{
  const handlemsg = handlermap[config.kafka_dbtopic_current];
  if(!!handlemsg){
    handlemsg(data,callbackfn);
  }
  else{
    debug(`未找到当前订阅消息处理函数-->${config.kafka_dbtopic_current}`)
    callbackfn();
  }

}

const startsrv = (config)=>{
    const globalconfig = config.kafka_cconfig1;
    const cconfig =  config.kafka_cconfig2;

    const topics = [];
    topics.push(config.kafka_dbtopic_current);

    // globalconfig['offset_commit_cb'] = (err, topicPartitions)=> {
    //   if (!!err) {
    //     console.error(err);
    //   } else {
    //     // Commit went through. Let's log the topic partitions
    //     console.log(topicPartitions);
    //   }
    // };

    getConsumer(globalconfig,cconfig,topics,
    (err,consumer)=> {
      if(debug.enabled){
        winston.getlog().warn(`getConsumer err`);
        winston.getlog().warn(err);
      }
      // consumer.disconnect();
      // throw err;
    }).then((consumer)=>{
      const processRecords =(data, cb)=> {
        // debug(`processRecords--->${data.length}`);
        if (data.length === 0) {
           setImmediate(cb);
        }
        else{
          // do work
          processbatchmsgs(data,(err,result)=>{
            debug(`processRecords--->${data.length}-->finished!`);
            consumer.commit();
            setImmediate(cb);
          });
        }
      }

      const consumeNum =(numMsg)=>{
        // debug(`consumeNum--->${numMsg}----->`);
        consumer.consume(numMsg, (err, data) => {
          if (!!err) {
            if(debug.enabled){
              console.error(err);
            }
            winston.getlog().warn(`consume err`);
            winston.getlog().warn(err);
            return;
          }

          processRecords(data, () => {
            const delaymsec = getdelaymsec(data.length);
            setTimeout(()=>{
              consumeNum(numMsg);
            },delaymsec);

          });
        });
      };

      consumeNum(numMessages);

      //  process.on('SIGINT', () => {
      //     consumer.disconnect();
      // });
    });
};

module.exports = startsrv;
