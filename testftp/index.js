const sftptosrv =  require('./src/ftps/index.js');
const config = require('./src/config.js');

const localfilename = config.localfilename;

console.log(`start....`);
sftptosrv(`${config.localdir}`,localfilename,(err,result)=>{
  console.log(`sftptosrv--->callback`);
  console.log(err);
  console.log(result);
});
