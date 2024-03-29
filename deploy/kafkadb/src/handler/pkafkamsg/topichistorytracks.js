const dbh_historytrack  = require('../dbh/dbh_historytrack');
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


const domessages =(kafkamsgs,callbackfn)=>{
  let msgs = [];
  _.map(kafkamsgs,(msg)=>{
    const submsgs = getkafkamsg(msg);
    msgs = _.concat(msgs,submsgs);
  });

  debug(`msgs->${msgs.length}`);

  dbh_historytrack(msgs,callbackfn);
};
module.exports = domessages;
