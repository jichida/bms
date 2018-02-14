const config = require('../config.js');
const kafka_dbtopic_index = require('./kafka_dbtopic_index.js');
const kafka_dbtopic_historydevices = require('./kafka_dbtopic_historydevices.js');
const kafka_dbtopic_devices = require('./kafka_dbtopic_devices.js');
const kafka_dbtopic_historytracks = require('./kafka_dbtopic_historytracks.js');
const kafka_dbtopic_realtimealarms = require('./kafka_dbtopic_realtimealarms.js');
const kafka_dbtopic_realtimealarmraws = require('./kafka_dbtopic_realtimealarmraws.js');
const kafka_pushalaramtopic_app = require('./kafka_pushalaramtopic_app.js');

const topichandler = {};
topichandler[config.kafka_pushalaramtopic_app] = kafka_pushalaramtopic_app;
topichandler[config.kafka_dbtopic_index] = kafka_dbtopic_index;
topichandler[config.kafka_dbtopic_devices] = kafka_dbtopic_devices;
topichandler[config.kafka_dbtopic_historydevices] = kafka_dbtopic_historydevices;
topichandler[config.kafka_dbtopic_historytracks] = kafka_dbtopic_historytracks;
topichandler[config.kafka_dbtopic_realtimealarms] = kafka_dbtopic_realtimealarms;
topichandler[config.kafka_dbtopic_realtimealarmraws] = kafka_dbtopic_realtimealarmraws;

const gettopichandler = (topic)=>{
  if(!!topichandler[topic]){
    return topichandler[topic];
  }
  return null;
}

const handletopic = (msg,cb)=>{
  try{
    console.log(`recvtopiname:${msg.topic},offset:${msg.offset},partition:${msg.partition}`);
    const handlerfn = gettopichandler(msg.topic);
    if(!!handlerfn){
      let payload = msg.value.toString();
      if(typeof payload === 'string'){
        try{
          payload = JSON.parse(payload);
        }
        catch(e){
          console.log(`parse json eror ${JSON.stringify(e)}`);
        }
      }
      payload.recvpartition = msg.partition;
      payload.recvoffset = msg.offset;
      handlerfn(payload,(err,result)=>{
        if(!!cb){
          cb(err,result);
        }
      });
      return;
    }
  }
  catch(e){
    console.log("服务端内部错误--->" + e);
  }
  if(!!cb){
    cb();
  }
};

exports.gettopichandler = gettopichandler;
exports.handletopic = handletopic;
