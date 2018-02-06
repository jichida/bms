const dbh = require('../handler/index.js');
const _ = require('lodash');
function onMessage (message) {
  // console.log(`获取到消息:${JSON.stringify(message)}`);
  const msg = _.clone(message);//copy,以免冲突
  dbh(msg,(err,result)=>{

  });
}


exports.onMessage = onMessage;
