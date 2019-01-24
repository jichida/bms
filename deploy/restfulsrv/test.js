// const async = require('async');
// const _ = require('lodash');
//
//
// let fnsz = [];
// for(let i=0;i<1000;i++){
//   fnsz.push((callbackfn)=>{
//     const time = _.random(10, 5000);
//     setTimeout(()=>{
//       console.log(`index->${i},time:${time}`);
//       callbackfn(null,true);
//     },time);
//   });
// }
//
// async.series(fnsz,(err,result)=>{
//   console.log(`finished`);
// });
const srvhttp = require('./src/srvhttp.js');
const srvwebsocket = require('./src/srvws.js');
const srvsystem = require('./src/srvsystem.js');
const winston = require('./src/log/log.js');
const moment = require('moment');
const config = require('./src/config');
const mongoose     = require('mongoose');
const debug = require('debug')('srvapp:index');
const mapcitystat = require('./src/handler/fullpc/mapcitystat');
const schedule = require('node-schedule');
const PubSub = require('pubsub-js');

const devicestat = require('./src/handler/pcall/devicestat');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodburl,{
    mongos:config.mongos,

    useMongoClient: true,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE,

    readPreference: 'secondaryPreferred'

  });

winston.initLog();

let curtime = moment().format('YYYY-MM-DD HH:mm:ss');
winston.getlog().info(`${curtime}启动服务器:${config.version}`);

const interval_loaddevicecities = (callbackfn)=>{
  debug(`${curtime},version:${config.version},
    rooturl:${config.rooturl},mongodburl:${config.mongodburl},
    config.defaultTypeUnknow:${config.defaultTypeUnknow}`);
  mapcitystat.getmapstat((result)=>{
    config.listresult_grouped = result;
    callbackfn(null,true);
  });
}

interval_loaddevicecities(()=>{
  PubSub.publish('mapcitystat',{});
});

schedule.scheduleJob('0 * * * *', ()=>{
    //每小时0点开始工作
    interval_loaddevicecities(()=>{
      PubSub.publish('mapcitystat',{});
    });
});

debug(`issmsdebug:${config.issmsdebug}`);
// const getpoint = (v)=>{
//   return [v.Longitude,v.Latitude];
// }
// utilposition.getlist_pos([
//   {
//     "GPSTime" : "2017-11-17 13:24:36",
//     "Longitude" : 110.335736,
//     "Latitude" : 20.041613,
//   },
//   {
//     "GPSTime" : "2017-11-17 13:25:36",
//     "Longitude" : 110.337903,
//     "Latitude" : 20.042343,
//   },
//   {
//     "GPSTime" : "2017-11-17 13:25:36",
//     "Longitude" : 0,
//     "Latitude" : 0,
//   },
// ],getpoint,(err,resultobj)=>{
//   console.log(`获得结果:${JSON.stringify(resultobj)}`);
// });

srvsystem.job();
srvwebsocket.startsrv(srvhttp.startsrv());

process.on('uncaughtException', (err)=> {
  debug(err);
  throw err;
  winston.getlog().error(`发生异常了...${JSON.stringify(err)}`);
});


devicestat.getdevicestat_provincelist();
// devicestat.getdevicestat_citylist({ name: '甘肃省', adcode: '620000'});
