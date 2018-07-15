const config =  {
  srvredis:{
    host:process.env.srvredis_host||'afn.i2u.top',
    port: process.env.srvredis_port|| 6379,
  },
};



module.exports = config;
