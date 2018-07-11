const fp = require('files-path');
const _ = require('lodash');
const readline = require('linebyline');
const fs = require('fs');
const async = require('async');
const moment = require('moment');
const config = require('./src/config.js');

const files = fp.sync({
  basePath: config.basePath,
  path: config.path,
});
console.log(files);

const parseLine =(line)=>{
  // console.log(`get line data-->${line}`)
  let isequal;
  const sz = line.split(',');
  if(sz.length > 0){
    try{
      // console.log(`sz--->${sz[1]},${sz[2]}`)
      const moment_datetime = moment(sz[1]).format('YYYY-MM-DD');
      const moment_recvtime = moment(sz[2]).format('YYYY-MM-DD');
      isequal = moment_datetime === moment_recvtime;
    }
    catch(e){
      // console.log(`err--->${JSON.stringify(sz)}`)
    }
  }
  return isequal?0:1;
}

let resultdevice = {};
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
              const equal = parseLine(line.toString());
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
  console.log(`合计--->${count_total},跨天记录:${count_crossday}`);
});
