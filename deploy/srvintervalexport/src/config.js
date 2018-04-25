const moment = require('moment');
const config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  mongos:process.env.mongos==='true'?true:false,
  logdir:process.env.logdir ||'../../dist/log',
  curday:process.env.curday || moment().subtract(1, 'days').format('YYYY-MM-DD'),
  isnow:process.env.isnow || true,
  DeviceId:process.env.DeviceId,
  exportFlag:process.env.exportFlag || 'all',
  exportdir:process.env.exportdir ||'../../dist/exportdir',
  version:'1.0.2',
  mapdict:{},
};



module.exports = config;
