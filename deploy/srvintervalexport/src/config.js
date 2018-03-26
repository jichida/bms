const config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  mongos:process.env.mongos==='true'?true:false,
  logdir:process.env.logdir ||'../../dist/log',
  exportdir:process.env.exportdir ||'../../dist/exportdir',
  version:'1.0.0'
};



module.exports = config;
