const config = {
  logdir:process.env.logdir||'/root/bms/deploy/dist/log',
  localdir:process.env.localdir||'/root/bms/deploy/dist/exportdir',
  srvsftp:{
      host: process.env.srvsftp_host||'192.168.2.14',
      port: process.env.srvsftp_port||'22',
      username: process.env.srvsftp_username||'catlftp',
      password: process.env.srvsftp_password||'%c?D:8Bv'
  },

};

module.exports = config;
