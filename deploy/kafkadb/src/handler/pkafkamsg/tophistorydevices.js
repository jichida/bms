const dbh_historydevice = require('../dbh/dbh_historydevice');
const domessages =(msg,callbackfn)=>{
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
