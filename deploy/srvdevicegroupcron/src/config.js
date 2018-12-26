const config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  mongos:process.env.mongos==='true'?true:false,
  logdir:process.env.logdir ||'../../dist/log',
  version:'1.0.1(build1226)'
};



module.exports = config;
