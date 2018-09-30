const moment = require('moment');
const _ = require('lodash');
const config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  mongos:process.env.mongos==='true'?true:false,
  redisdevicesetname:process.env.redisdevicesetname||`bmsrdbset`,
  redisdevicequeuename:process.env.redisdevicequeuename||`bmsrdbq`,
  srvredis:{
    host:process.env.srvredis_host||'192.168.2.19',
    port: process.env.srvredis_port|| 6379,
  },
  logdir:process.env.logdir ||'../../dist/log',
  curday:process.env.curday || moment().subtract(1, 'days').format('YYYY-MM-DD'),
  isnow:process.env.isnow || true,
  DeviceId:process.env.DeviceId,
  exportFlag:process.env.exportFlag || 'all',
  exportdir:process.env.exportdir ||'../../dist/exportdir',
  istest:process.env.istest==='true'?true:false,
  batchcount:parseInt(_.get(process.env,'batchcount','500')),
  version:'1.2.6(build0930)',
  mapdict:{},
  srvsftp:{
      host: process.env.srvsftp_host||'192.168.2.14',
      port: process.env.srvsftp_port||'22',
      username: process.env.srvsftp_username||'catlftp',
      password: process.env.srvsftp_password||'%c?D:8Bv'
  },

};



module.exports = config;
