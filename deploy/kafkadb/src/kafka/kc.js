const dbh = require('../handler/index.js');
const getConsumer = require('./rkafka/c.js');
const _ = require('lodash');
const async = require('async');
const moment = require('moment');
const uuid = require('uuid');
const parseKafkaMsgs = require('../handler/kafkadb_data.js');
const onHandleToDB = require('../handler/kafkadb_dbh.js');
const debug = require('debug')('kc');
const numMessages = 100;

const processbatchmsgs = (msgs,callbackfnmsg)=>{
  const msgid = uuid.v4();
  debug(`消息开始${msgid}----->`);
  parseKafkaMsgs(msgs,(allresult)=>{
    debug(`消息结束${msgid}----->`);
    // onHandleToDB(allresult,()=>{
      // debug(`数据库操作结束${msgid}----->`);
      callbackfnmsg();
    // });
  });

  // let asyncfnsz = [];
  // _.map(msgs,(msg)=>{
  //   asyncfnsz.push((callbackfn)=>{
  //       let msgnew = _.clone(msg);
  //       dbh.handletopic(msgnew,(err,result)=>{
  //         callbackfn(err,result);
  //       });
  //   });
  // });
  //
  // const cid = uuid.v4();
  // console.log(`开始处理${cid}----->${moment().format('HH:mm:ss')}`);
  // async.parallel(asyncfnsz,(err,result)=>{
  //   console.log(`结束处理${cid}----->${moment().format('HH:mm:ss')}`);
  //   callbackfnmsg(err,result);
  // });

}

const startsrv = (config)=>{
    const globalconfig = config.kafka_cconfig1;
    const cconfig =  config.kafka_cconfig2;

    const topics = [];
    topics.push(config.kafka_dbtopic_index);

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
        console.error(`Consumer--${process.pid} ---uncaughtException err`);
        console.error(err);
        console.error(err.stack);
        console.error(`uncaughtException err---`);
      }
      // consumer.disconnect();
      // throw err;
    }).then((consumer)=>{
      const processRecords =(data, cb)=> {
        debug(`processRecords--->${data.length}`);
        if (data.length == 0) {
          return setImmediate(cb);
        }
        // do work
        processbatchmsgs(data,(err,result)=>{
          consumer.commit();
          setImmediate(cb);
        });
      }

      const consumeNum =(numMsg)=>{
        debug(`consumeNum--->${numMsg}----->`);
        consumer.consume(numMsg, (err, data) => {
          if (!!err) {
            if(debug.enabled){
              console.error(err);
            }
            return;
          }

          processRecords(data, () => {
            consumeNum(numMsg);
          });
        });
      };

      consumeNum(numMessages);

       process.on('SIGINT', () => {
          consumer.disconnect();
      });
    });
};

module.exports = startsrv;
