const config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  mongos:process.env.mongos==='true'?true:false,
  logdir:process.env.logdir ||'../../dist/log',
  jpush_appkey:process.env.jpush_appkey || '630950d8101fe73d19d64aaf',
  jpush_mastersecret:process.env.jpush_mastersecret || 'dd52bf9de919a2a53441fce3',
  version:'1.0.1'
};



module.exports = config;
