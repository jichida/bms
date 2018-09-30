// const sftptosrv =  require('./ftps/index.js');
// const debug = require('debug')('srvinterval:test');
// const config = require('./config.js');
//
// const job=()=>{
//   sftptosrv(`/root/bms/deploy/dist/exportdir`,`Alarm20180425.csv`,(err,result)=>{
//   });
// };
//
// job();
// const job = require('../src/srvsys');
// const winston = require('../src/log/log.js');
//
// winston.initLog();
// job.start_croneveryhours((dir)=>{
//   console.log(`job.start_croneveryhours-->${dir}`)
// });
const shelldelcmd = `for file in \`ls ./\`; do size=\`du $file | awk '{print \$1}'\`; [ $size -lt 1 ] && rm $file; done`;
console.log(shelldelcmd);
