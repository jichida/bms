const moment = require('moment');
const config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://afnkafka.i2u.top:27007/bmscatl',
  mongos:process.env.mongos==='true'?true:false,
  logdir:process.env.logdir ||'/Users/wangxiaoqing/Downloads/work/shbms/deploy/log',
  version:'1.0.0'
};



module.exports = config;
