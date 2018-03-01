const dbh_alarmraw = require('../dbh/dbh_alarmraw');
const debug = require('debug')('dbh:msg');
const _ = require('lodash');

const getkafkamsg = (msg)=>{
  let payload = msg.value.toString();
  if(typeof payload === 'string'){
    try{
      payload = JSON.parse(payload);
    }
    catch(e){
      //console.log(`parse json eror ${JSON.stringify(e)}`);
    }
  }
  return payload;
}


const domessages =(msg,callbackfn)=>{
  let msgs = [];
  _.map(kafkamsgs,(msg)=>{
    const submsgs = getkafkamsg(msg);
    msgs = _.concat(msgs,submsgs);
  });

  debug(`msg->${JSON.stringify(msg)}`);

  dbh_alarmraw(msgs,callbackfn);
};
module.exports = domessages;
