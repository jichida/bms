const export_position = require('./lib/export_position');
const export_alarm = require('./lib/export_alarm');
const export_history = require('./lib/export_history');
const export_device_ext = require('./lib/export_device_ext');
const _ = require('lodash');
const debug = require('debug')('srvinterval:test');
const winston = require('./log/log.js');
const async = require('async');
const zipdir = require('zip-dir');
const fse = require('fs-extra');
const path = require('path');
const sftptosrv =  require('./ftps/index.js');
const config = require('./config');
const getDeviceCities = require('./lib/getdevicecities')

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
    getDeviceCities((config_mapdevicecity)=>{
      export_position(config_mapdevicecity,(positionfilepath)=>{
        winston.getlog().info(`导出位置记录完毕:${positionfilepath}`);
        // {"_id":"5aab1f84b8495bf6d0bc893a","DeviceId":"1602010031","LastRealtimeAlarm":{"DataTime":"2018-03-27 05:37:40"},"LastHistoryTrack":{"GPSTime":"2018-03-27 05:39:09","Longitude":121.59474,"Latitude":31.266263},"alarmtxtstat":"F[104] 252次|加热继电器故障 614次|F[155] 282次|F[118] 16次|F[140] 33次|F[166] 27次|F[164] 1次|F[167] 3次|","Provice":"上海市","City":"未知","Area":"浦东新区"}
        callbackfn(null,positionfilepath);
      });
    });
  });

  fnsz.push((callbackfn)=>{
    export_device_ext((deviceextfilepath)=>{
      winston.getlog().info(`导出客档信息完毕:${deviceextfilepath}`);
      // {"_id":"5aab1f84b8495bf6d0bc893a","DeviceId":"1602010031","LastRealtimeAlarm":{"DataTime":"2018-03-27 05:37:40"},"LastHistoryTrack":{"GPSTime":"2018-03-27 05:39:09","Longitude":121.59474,"Latitude":31.266263},"alarmtxtstat":"F[104] 252次|加热继电器故障 614次|F[155] 282次|F[118] 16次|F[140] 33次|F[166] 27次|F[164] 1次|F[167] 3次|","Provice":"上海市","City":"未知","Area":"浦东新区"}
      callbackfn(null,deviceextfilepath);
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
  getDeviceCities((config_mapdevicecity)=>{
    export_alarm(config_mapdevicecity,(alarmfilepath)=>{
      winston.getlog().info(`导出报警记录完毕:${alarmfilepath}`);
      callbackfn(alarmfilepath);
    });
  });
}


  const start_cron0 = ()=>{
    cron_0((err,result)=>{
      debug(`start_cron0 result====>:${JSON.stringify(result)}`);
      const positionfilepath = result[0];
      const deviceextfilepath = result[1];
      const exportdir = result[2];

      debug(`开始压缩文件夹:${exportdir}`);
      winston.getlog().info(`开始压缩文件夹:${exportdir}`);

      zipdir(exportdir, { saveTo: `${exportdir}.zip` }, function (err, buffer) {
        debug(`压缩完毕:${exportdir}.zip`);
        winston.getlog().info(`压缩完毕:${exportdir}.zip`);

        const filename3 = path.basename(`${exportdir}.zip`);
        winston.getlog().info(`上传ftp文件:${config.exportdir},文件:${filename3}`);

        sftptosrv(`${config.exportdir}`,filename3 ,(err,result)=>{
          winston.getlog().info(`上传文件:${config.exportdir}/${filename3}到ftp服务器`);
          debug(`上传文件:${config.exportdir}/${filename3}到ftp服务器`);
        });
      });

      const filename1 = path.basename(positionfilepath);
      winston.getlog().info(`上传ftp文件:${config.exportdir},文件:${filename1}`);
      sftptosrv(`${config.exportdir}`,filename1,(err,result)=>{
        debug(`上传文件:${config.exportdir}/${filename1}到ftp服务器`);
        winston.getlog().info(`上传文件:${config.exportdir}/${filename1}到ftp服务器`);
      });

      const filename2 = path.basename(deviceextfilepath);
      winston.getlog().info(`上传ftp文件:${config.exportdir},文件:${filename2}`);
      sftptosrv(`${config.exportdir}`,filename2 ,(err,result)=>{
        debug(`上传文件:${config.exportdir}/${filename2}到ftp服务器`);
        winston.getlog().info(`上传文件:${config.exportdir}/${filename2}到ftp服务器`);
      });
    });
  }

  const start_cron18 = ()=>{
    cron_18((alarmfilepath)=>{
      debug(`拷贝文件:${alarmfilepath}`);
      winston.getlog().info(`拷贝文件:${alarmfilepath}`);

      const alarmfilename =  path.basename(alarmfilepath);
      winston.getlog().info(`上传ftp文件:${config.exportdir},文件:${alarmfilename}`);
      sftptosrv(`${config.exportdir}`,alarmfilename,(err,result)=>{
        debug(`上传文件:${config.exportdir}/${alarmfilename}到ftp服务器`);
        winston.getlog().info(`上传文件:${config.exportdir}/${alarmfilename}到ftp服务器`);
      });

      const filenamelastestalfname = 'LastestAlarm.csv';
      fse.copy(alarmfilepath,`${config.exportdir}/${filenamelastestalfname}`)
      .then(()=>{
        debug(`拷贝文件到:${config.exportdir}/${filenamelastestalfname}`);
        winston.getlog().info(`拷贝文件到:${config.exportdir}/${filenamelastestalfname}`);
        winston.getlog().info(`上传ftp文件:${config.exportdir},文件:${filenamelastestalfname}`);
        sftptosrv(`${config.exportdir}`,filenamelastestalfname,(err,result)=>{
          debug(`上传文件:${config.exportdir}/${filenamelastestalfname}到ftp服务器`);
          winston.getlog().info(`上传文件:${config.exportdir}/${filenamelastestalfname}到ftp服务器`);
        });
      })
      .catch((err)=>{
        winston.getlog().info(`拷贝文件失败`);
      })
    });
  }







exports.start_cron0 = start_cron0;
exports.start_cron18 = start_cron18;
