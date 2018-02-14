const dbh = require('../handler/index.js');
const getConsumer = require('./rkafka/c.js');
const _ = require('lodash');
const async = require('async');
const moment = require('moment');

const numMessages = 1000;

const processbatchmsgs = (msgs,callbackfn)=>{
  let asyncfnsz = [];
  _.map(msgs,(msg)=>{
    asyncfnsz.push((callbackfn)=>{
        let msgnew = _.clone(msg);
        dbh.handletopic(msgnew,(err,result)=>{
          callbackfn(err,result);
        });
    });
  });

  async.parallel(asyncfnsz,(err,result)=>{
    callbackfn(err,result);
  });

}

const startsrv = (config)=>{
    const globalconfig = config.kafka_cconfig1;
    const cconfig =  config.kafka_cconfig2;

    const topics = [];
    topics.push(config.kafka_dbtopic_index);

    getConsumer(globalconfig,cconfig,topics,
    (err,consumer)=> {
      console.error(`Consumer${process.pid} ---uncaughtException err`);
      console.error(err);
      console.error(err.stack);
      console.error(`uncaughtException err---`);
      consumer.disconnect();
      throw err;
    }).then((consumer)=>{
      const processRecords =(data, cb)=> {
        if (data.length == 0) {
          return setImmediate(cb);
        }

        // do work
        processbatchmsgs(data,(err,result)=>{
          setImmediate(cb);
        });
      }

      const consumeNum =(numMsg)=>{
        console.log(`consumeNum--->${numMsg}----->${moment().format('HH:mm:ss')}`);
        consumer.consume(numMsg, (err, data) => {
          if (!!err) {
            console.error(err);
            return;
          }

          processRecords(data, () => {
            consumeNum(numMsg);
          });
        });
      };

      consumeNum(numMessages);
      // (msg,consumer)=> {
      //   counter++;
      //   // console.log(`get data====>${JSON.stringify(m)}`);
      //   let msgnew = _.clone(msg);
      //   dbh.handletopic(msgnew,(err,result)=>{
      //     //committing offsets every numMessages
      //      console.log(`handletopic====>${counter}`);
      //      if (counter % numMessages === 0) {
      //        console.log(`${counter}calling commit>>>>>>>>>>>>`);
      //        consumer.commit(msg);
      //      }
      //   });
      // },
       process.on('SIGINT', () => {
          consumer.disconnect();
      });
    });
};

module.exports = startsrv;
