const config =  {
  influxdhost:'afn.i2u.top',
  influxdbname:'bmstatshtest',
  srvredis:{
    host:process.env.srvredis_host||'192.168.2.19',
    port: process.env.srvredis_port|| 6379,
  },
};



module.exports = config;
