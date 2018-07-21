const fp = require('files-path');
const _ = require('lodash');
const readline = require('linebyline');
const winston = require('./src/log/log.js');
const fs = require('fs');
const async = require('async');
const moment = require('moment');
const config = require('./src/config.js');

winston.initLog();

const files = fp.sync({
  basePath: config.basePath,
  path: config.path,
});
console.log(files);

winston.getlog().info(`==程序启动${config.version}===`);
const parseLine =(line)=>{
  console.log(`get line data-->${line}`)
  let isequal = -1;
  let moment_datetime = '';
  let moment_recvtime = '';
  const sz = line.split(',');
  if(sz.length > 0){
    try{
       console.log(`sz--->${sz[1]},${sz[2]}`)
       moment_datetime = moment(sz[1]).format('YYYY-MM-DD');
       moment_recvtime = moment(sz[2]).format('YYYY-MM-DD');
       isequal = moment_datetime === moment_recvtime?0:1;
       console.log(`moment_datetime:${moment_datetime},moment_recvtime:${moment_recvtime},isequal:${isequal}`)
    }
    catch(e){
      console.log(e);
    }
  }
  return {
    equal:isequal,
    moment_datetime,
    moment_recvtime
  };
}

let resultdevice = {};
let devicelist = [];
let fnsz = [];
_.map(files,(fileinfo)=>{
  fnsz.push((callbackfn)=>{
      const rl = readline(fileinfo.fullName,{
        retainBuffer: true //tell readline to retain buffer
      });
      resultdevice[fileinfo.name] = {
        count_total:0,
        count_crossday:0
      };
      let i = 0;
      rl.on("line",(line,linecount)=> {
           if(i > 0){
              const {equal,moment_datetime,moment_recvtime} = parseLine(line.toString());
              console.log(`equal:${equal}`)
              if(equal === 1 && i === 1){
                devicelist.push(fileinfo.name);
                console.log(`${moment_recvtime}收到${moment_datetime}记录--->${devicelist.length},文件名:${fileinfo.name}`);
                winston.getlog().info(`${moment_datetime}收到{moment_datetime}记录--->${devicelist.length},文件名:${fileinfo.name}`);
              }
              resultdevice[fileinfo.name] = {
                count_total:resultdevice[fileinfo.name].count_total+1,
                count_crossday:resultdevice[fileinfo.name].count_crossday+equal,
                count_line:i
              }
           }
           i++;
      });
      rl.on("end",()=>{
         callbackfn(null,true);
      });
  });
});

async.parallelLimit(fnsz,10,(err,result)=>{
  let count_total = 0;
  let count_crossday = 0;
  _.map(resultdevice,(statinfo)=>{
    count_total = count_total + statinfo.count_total;
    count_crossday = count_crossday + statinfo.count_crossday;
    console.log(`合计--->${count_total},跨天记录:${count_crossday}`);
  });
  winston.getlog().info(`合计--->${count_total},跨天记录:${count_crossday},跨天文件:${devicelist.length}`);

  console.log(`合计--->${devicelist.length},跨天记录:${JSON.stringify(devicelist)}`);
  console.log(`合计--->${count_total},跨天记录:${count_crossday}`);
});
