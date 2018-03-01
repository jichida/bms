const dbh_historydevice = require('../dbh/dbh_historydevice');
const debug = require('debug')('dbh:msg');
const domessages =(msg,callbackfn)=>{
  debug(`msg->${JSON.stringify(msg)}`);
  let payload = msg.value.toString();
  if(typeof payload === 'string'){
    try{
      payload = JSON.parse(payload);
    }
    catch(e){
      //console.log(`parse json eror ${JSON.stringify(e)}`);
    }
  }
  dbh_historydevice(payload,callbackfn);
};
module.exports = domessages;
