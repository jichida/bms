const sftptosrv =  require('./ftps/index.js');
const debug = require('debug')('srvinterval:test');
const config = require('./config.js');

const job=()=>{
  sftptosrv(`/root/bms/deploy/dist/exportdir`,`Alarm20180425.csv`,(err,result)=>{
  });
};

job();
