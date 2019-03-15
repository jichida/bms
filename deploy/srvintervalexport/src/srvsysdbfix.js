const _ = require('lodash');
const debug = require('debug')('srvinterval:test');
const winston = require('./log/log.js');
const async = require('async');
const shell = require('shelljs');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const sftptosrv =  require('./ftps/index.js');
const config = require('./config');
const moment = require('moment');

const zipdir = (exportdir,callbackfn)=>{
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
}

const start_cron = (callbackfn)=>{
  //判断zip文件是否存在
  const moments = moment();//今日
  const momentprev = moment().subtract(1, 'days');//昨天
  // const curday = moments.format('YYYYMMDD');
  // const CurDay = momentprev.format('YYYY-MM-DD');
  const exportdir = `${config.exportdir}/${momentprev.format('YYYYMMDD')}`;
  const exportdirname = path.dirname(`${exportdir}.zip`);
  const isexists = fs.existsSync(exportdirname);

  winston.getlog().info(`判断文件是否存在:${exportdirname},isexists:${isexists}`);
  if(!isexists){
    //继续压缩一次
    zipdir(exportdir,callbackfn);
  }
  else{
    callbackfn(null,true);
  }

}

exports.start_cron = start_cron;
