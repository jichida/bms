const Influx = require('influx');
const debug = require('debug')('testredis:influxdb');
const config = require('../config.js');
let influx;
const pushtofluxdb = (topicname,payload,callbackfn)=>{
  // curhour:moment().format('YYYY-MM-DD HH:mm'),
  // totalcount:result,
  // inccount:0
  influx.writePoints([
    {
      measurement: 'bmsmongodbcount',
      tags: { idstring: `${topicname}` },
      fields: {
        curhour:payload.curhour,
        totalcount: payload.totalcount,
        inccount: payload.inccount,
      },
    }
  ]).then(() => {
    return influx.query(`
      select * from bmsmongodbcount
      where idstring = ${Influx.escape.stringLit(`${topicname}`)}
      order by time desc
      limit 10
    `)
  }).then((rows) => {
    rows.forEach((row) => {
      debug(`----`)
      debug(row)
    });
  })
};

const startsrv = (callbackfn)=>{
 influx = new Influx.InfluxDB({
   host: config.influxdhost,
   database: config.influxdbname,
   schema: [
     {
       measurement: 'mongodbcountstat',
       fields: {
         curhour: Influx.FieldType.STRING,
         totalcount: Influx.FieldType.INTEGER,
         inccount: Influx.FieldType.INTEGER,
       },
       tags: [
         'idstring'
       ]
     }
   ]
  })
  influx.getDatabaseNames()
  .then(names => {
    if (!names.includes(config.influxdbname)) {
      return influx.createDatabase(config.influxdbname);
    }
  })
  .then(() => {
    const data = {
      topic:'设备',
      payload:{
        curhour:'2018-07-21 20:00',
        totalcount: 1000,
        inccount: 89,
      }
    }
    pushtofluxdb(data.topic,data.payload,()=>{
      debug('pushtofluxdb ok!');
    });
    // const userDeviceSubscriber = ( msg, data )=>{
    //     pushtofluxdb(data.topic,data.payload,()=>{
    //       debug('pushtofluxdb ok!');
    //     });
    // };
    // debug('fluxdb is ready!');
    // PubSub.subscribe(`mongodbstat`,userDeviceSubscriber);
    // callbackfn(null,true);
  });
}

module.exports = startsrv;
