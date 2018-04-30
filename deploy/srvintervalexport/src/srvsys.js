const getdevice_location = require('./lib/getdevice_location');
const export_position = require('./lib/export_position');
const export_alarm = require('./lib/export_alarm');
const export_history = require('./lib/export_history');
const _ = require('lodash');
const debug = require('debug')('srvinterval:test');
const winston = require('./log/log.js');
const async = require('async');
const schedule = require('node-schedule');
const zipdir = require('zip-dir');
const fse = require('fs-extra');
const config = require('./config');

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

const cron_0 = (callbackfn)=>{
  winston.getlog().info(`零点开始执行`);
  let fnsz = [];
  fnsz.push((callbackfn)=>{
    export_position((positionfilepath)=>{
      winston.getlog().info(`导出位置记录完毕:${positionfilepath}`);
      // {"_id":"5aab1f84b8495bf6d0bc893a","DeviceId":"1602010031","LastRealtimeAlarm":{"DataTime":"2018-03-27 05:37:40"},"LastHistoryTrack":{"GPSTime":"2018-03-27 05:39:09","Longitude":121.59474,"Latitude":31.266263},"alarmtxtstat":"F[104] 252次|加热继电器故障 614次|F[155] 282次|F[118] 16次|F[140] 33次|F[166] 27次|F[164] 1次|F[167] 3次|","Provice":"上海市","City":"未知","Area":"浦东新区"}
      callbackfn(null,positionfilepath);
    });
  });

  fnsz.push((callbackfn)=>{
    export_history((exportdir)=>{
      winston.getlog().info(`导出历史记录完毕:${exportdir}`);
      // {"_id":"5aab1f84b8495bf6d0bc893a","DeviceId":"1602010031","LastRealtimeAlarm":{"DataTime":"2018-03-27 05:37:40"},"LastHistoryTrack":{"GPSTime":"2018-03-27 05:39:09","Longitude":121.59474,"Latitude":31.266263},"alarmtxtstat":"F[104] 252次|加热继电器故障 614次|F[155] 282次|F[118] 16次|F[140] 33次|F[166] 27次|F[164] 1次|F[167] 3次|","Provice":"上海市","City":"未知","Area":"浦东新区"}
      callbackfn(null,exportdir);
    });
  });

  async.series(fnsz,(err,result)=>{
    callbackfn(err,result);
  });
}

const cron_18 = (callbackfn)=>{
  winston.getlog().info(`18点开始执行`);
  export_alarm((alarmfilepath)=>{
    winston.getlog().info(`导出报警记录完毕:${alarmfilepath}`);
    callbackfn(alarmfilepath);
  });
}

const job=()=>{
  debug(`start job ...`);

  cron_0((err,result)=>{
    const positionfilepath = result[0];
    const exportdir = result[1];
    winston.getlog().info(`开始压缩文件夹:${exportdir}`);
    zipdir(exportdir, { saveTo: `${exportdir}.zip` }, function (err, buffer) {
      winston.getlog().info(`压缩完毕:${exportdir}.zip`);
    });
  });
  cron_18((alarmfilepath)=>{
    winston.getlog().info(`拷贝文件:${alarmfilepath}`);
    fs.copy(alarmfilepath,`${config.exportdir}/LastestAlarm.csv`)
    .then(()=>{
      winston.getlog().info(`拷贝文件到:${config.exportdir}/LastestAlarm.csv`);
    })
    .catch((err)=>{
      winston.getlog().info(`拷贝文件失败`);
    })
  });





  schedule.scheduleJob('0 0 * * *', ()=>{
    //每天0点开始工作
    cron_0((err,result)=>{
      const positionfilepath = result[0];
      const exportdir = result[1];
      winston.getlog().info(`开始压缩文件夹:${exportdir}`);
      zipdir(exportdir, { saveTo: `${exportdir}.zip` }, function (err, buffer) {
        winston.getlog().info(`压缩完毕:${exportdir}.zip`);
      });
    });
  });

  schedule.scheduleJob('0 18 * * *', ()=>{
    //每天18点开始工作
    cron_18((alarmfilepath)=>{
      winston.getlog().info(`拷贝文件:${alarmfilepath}`);
      fs.copy(alarmfilepath,`${config.exportdir}/LastestAlarm.csv`)
      .then(()=>{
        winston.getlog().info(`拷贝文件到:${config.exportdir}/LastestAlarm.csv`);
      })
      .catch((err)=>{
        winston.getlog().info(`拷贝文件失败`);
      })
    });
  });
};


module.exports = job;
