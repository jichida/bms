const config = require('../config.js');
const kafka_dbtopic_index = require('./kafka_dbtopic_index.js');
const kafka_dbtopic_historydevices = require('./kafka_dbtopic_historydevices.js');
const kafka_dbtopic_devices = require('./kafka_dbtopic_devices.js');
const kafka_dbtopic_historytracks = require('./kafka_dbtopic_historytracks.js');
const kafka_dbtopic_realtimealarms = require('./kafka_dbtopic_realtimealarms.js');
const kafka_dbtopic_realtimealarmraws = require('./kafka_dbtopic_realtimealarmraws.js');

const topichandler = {};
topichandler[config.kafka_dbtopic_index] = kafka_dbtopic_index;
topichandler[config.kafka_dbtopic_devices] = kafka_dbtopic_devices;
topichandler[config.kafka_dbtopic_historydevices] = kafka_dbtopic_historydevices;
topichandler[config.kafka_dbtopic_historytracks] = kafka_dbtopic_historytracks;
topichandler[config.kafka_dbtopic_realtimealarms] = kafka_dbtopic_realtimealarms;
topichandler[config.kafka_dbtopic_realtimealarmraws] = kafka_dbtopic_realtimealarmraws;



module.exports = (msg,cb)=>{
  try{
    if(!!topichandler[msg.topic]){
      let payload = msg.value;
      if(typeof payload === 'string'){
        try{
          payload = JSON.parse(payload);
        }
        catch(e){
          console.log(`parse json eror ${JSON.stringify(e)}`);
        }
      }
      topichandler[msg.topic](payload,(err,result)=>{
        // console.log("服务端回复--->" + JSON.stringify(result));
        if(!!cb){
          cb(err,result);
        }
      });
    }
  }
  catch(e){
    console.log("服务端内部错误--->" + e);
  }
}
