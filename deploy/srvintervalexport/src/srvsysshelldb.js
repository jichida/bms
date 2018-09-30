const _ = require('lodash');
const debug = require('debug')('srvinterval:test');
const winston = require('./log/log.js');
const async = require('async');
const shell = require('shelljs');
const fse = require('fs-extra');
const path = require('path');
const sftptosrv =  require('./ftps/index.js');
const config = require('./config');
const moment = require('moment');

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
  let curtime = moment().format('YYYY-MM-DD HH:mm:ss');
  winston.getlog().info(`零点开始执行-->${curtime}`);
  let fnsz = [];

  export_history((exportdir)=>{
    curtime = moment().format('YYYY-MM-DD HH:mm:ss');
    winston.getlog().info(`导出历史记录完毕:${exportdir}-->${curtime}`);
    // {"_id":"5aab1f84b8495bf6d0bc893a","DeviceId":"1602010031","LastRealtimeAlarm":{"DataTime":"2018-03-27 05:37:40"},"LastHistoryTrack":{"GPSTime":"2018-03-27 05:39:09","Longitude":121.59474,"Latitude":31.266263},"alarmtxtstat":"F[104] 252次|加热继电器故障 614次|F[155] 282次|F[118] 16次|F[140] 33次|F[166] 27次|F[164] 1次|F[167] 3次|","Provice":"上海市","City":"未知","Area":"浦东新区"}
    callbackfn(null,exportdir);
  });
}



const start_cron0 = (callbackfnall)=>{
  cron_0((err,result)=>{
    const exportdir = result;
    debug(`开始压缩文件夹:${exportdir}`);
    let curtime = moment().format('YYYY-MM-DD HH:mm:ss');
    winston.getlog().info(`开始压缩文件夹:${exportdir}-->${curtime}`);

    let fnsz = [];
    fnsz.push((callbackfn)=>{
        const exportdirname = path.dirname(`${exportdir}.zip`);
        const zipdir = path.basename(`${exportdir}`);
        // zipdir(exportdir, { saveTo: `${exportdir}.zip` },  (err, buffer)=> {
        const shellzipcmd = `zip -q -r ${zipdir}.zip ${zipdir}`;
        debug(`exportdirname:${exportdirname},zipdir:${zipdir}`);
        debug(`shellzipcmd:${shellzipcmd}`)
        shell.cd(`${exportdirname}`);
        shell.exec(shellzipcmd,(code, stdout, stderr)=>{
          const filename3 = path.basename(`${exportdir}.zip`);
          winston.getlog().info(`命令行完毕:${code}-->${stdout}-->${stderr}`);
          debug(`压缩完毕:${exportdir}.zip`);
          curtime = moment().format('YYYY-MM-DD HH:mm:ss');
          winston.getlog().info(`压缩完毕:${exportdir}.zip-->${curtime}`);

          winston.getlog().info(`上传ftp文件:${config.exportdir},文件:${filename3}`);

          sftptosrv(`${config.exportdir}`,filename3 ,(err,result)=>{
            curtime = moment().format('YYYY-MM-DD HH:mm:ss');
            winston.getlog().info(`上传文件:${config.exportdir}/${filename3}到ftp服务器-->${curtime}`);
            debug(`上传文件:${config.exportdir}/${filename3}到ftp服务器`);
            callbackfn(null,true);
          });
        });
    });

    async.parallelLimit(fnsz,3,(err,result)=>{
      winston.getlog().info(`全部上传完毕!!`);
      if(!!callbackfnall){
        callbackfnall(err,result);
      }
    });

  });
}


exports.start_cron0 = start_cron0;
