const config =  {
  influxdhost:process.env.influxdhost || 'afn.i2u.top',
  influxdbname:process.env.influxdbname || 'bmsstat',
  mongodburl:process.env.MONGO_URL || 'mongodb://afnkafka.i2u.top:27007/bmscatl',
  mongos:process.env.mongos==='true'?true:false,
  logdir:process.env.logdir ||'/Users/wangxiaoqing/Downloads/work/shbms/deploy/log',
  version:'1.1.0(build0720)'
};



module.exports = config;
