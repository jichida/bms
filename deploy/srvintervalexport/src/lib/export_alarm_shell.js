const config = require('../config');
const DBModels = require('../handler/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
const startexport = require('../handler/startexport');
const winston = require('../log/log.js');
const _ = require('lodash');
const fs = require('fs');
const async = require('async');
const shell = require('shelljs');
const debug = require('debug')('srvinterval:alarm');


const startexport_do = (DeviceId,exportdir,curday,callbackfn) =>{
  const curdays = moment(curday).format('YYYYMMDD');
  const TimeKey = moment(curday).format('YYMMDD');
  const dbModel = DBModels.HistoryDeviceModel;
  const filename = `${exportdir}/${curdays}_${DeviceId}.csv`;
  const fields = null;
  const csvfields_query = 'DeviceId,DataTime,alarmtxtstat';

  const csvfields = 'DeviceId,DataTime,ALARM';

  // const fn_convert = (doc,callbackfn)=>{
  //   doc['ALARM'] = doc['alarmtxtstat'];
  //   doc['SaveTime'] = doc['UpdateTime'];
  //   callbackfn(doc);
  // }
  const query = {
    DeviceId,
    TimeKey,//
  };
  const sort = {DataTime:1};
  let exportcmd = `mongoexport --uri=${config.mongodburl} --type=csv -c realtimealarmraws --out "${filename}" `
  exportcmd += `--fields=${csvfields_query} --query='${JSON.stringify(query)}' --sort='${JSON.stringify(sort)}'`;

  debug(`exportcmd:\n${exportcmd}`)

  shell.exec(exportcmd,(code, stdout, stderr)=>{
    winston.getlog().info(`导出${filename}成功!`);

    const replacecmd = `sed -i "1s/.*/${csvfields}/" "${filename}"`;
    shell.exec(replacecmd,(code, stdout, stderr)=>{
      debug(`replacecmd:\n${replacecmd}`)

      const stats = fs.statSync(`${filename}`);
      const fileSizeInBytes = stats.size
      if(fileSizeInBytes < 1000){
        //小于1k 删除
        //delete file
        debug(`文件${filename}小于1k(${fileSizeInBytes})删除!`);
        fs.unlinkSync(filename);
        winston.getlog().info(`文件${filename}小于1k(${fileSizeInBytes})删除!`);

      }


      callbackfn(null,true);
    });

  });
  // ./realtimealarmhourkafkas.csv --type=csv --fields=_id,DeviceId,CurDayHour,Longitude,Latitude,citycode,adcode,FirstAlarmTime,DataTime,warninglevel,Alarm,idsend,NodeID,create_at --query='{"DataTime":{$gte:"2018-07-05 21:00:00",$lt:"2018-07-06 09:00:00"}}' --sort='{ "idsend" :1}'


  // mongoexport --host=192.168.2.17 --port 27007 -d bmscatl -c datadicts --out ./datadicts.json
  // startexport({filename,dbModel,sort:{DataTime:1},fields:null,csvfields,fn_convert,query},callbackfn);
}

const startexport_batch = (devicelist,exportdir,curday,callbackfn)=>{
  const fnsz = [];
  _.map(devicelist,(item)=>{
    fnsz.push((callbackfn)=>{
      startexport_do(item.DeviceId,exportdir,curday,callbackfn);
    });
  });
  async.parallelLimit(fnsz,config.batchcount,(err,result)=>{
    callbackfn(devicelist);
  });
}

const startexport_export = (curdays,devicelist,callbackfn)=>{
  const moments = moment(curdays);
  const curday = moments.format('YYYY-MM-DD');
  const exportdirbase = `${config.exportdir}/${moments.format('YYYYMMDD')}`;
  let exportdir = exportdirbase;
  let i = 1;
  try{
    while(fs.existsSync(exportdir)){
      exportdir = `${exportdirbase}(${i})`;
      i++;
    }
    fs.mkdirSync(exportdir);
  }
  catch(e){
    winston.getlog().info(`--->${JSON.stringify(e)}`);
  }

   let success_list = [];
   winston.getlog().info(`新建一个目录${exportdir},${i}`);
   startexport_batch(devicelist,exportdir,curday,(retlist)=>{
    success_list = _.concat(success_list, retlist);
    debug(`导出历史数据结果->success_list-->${success_list.length},本次新增:${retlist.length}`)
    callbackfn(exportdir);
  });
}

const start = (curday,callbackfn)=>{
  const getDevicelist = (callbackfn)=>{
    debug(`start getDevicelist===>`)
    const deviceModel = DBModels.DeviceModel;
    deviceModel.find({
    },{
      'DeviceId':1,
      }).lean().exec((err,result)=>{
      rlst = [];
      if(!err && !!result){
        _.map(result,(item)=>{
          rlst.push(item);
        });

      }
      debug(`[获取所有设备个数]===>${rlst.length}`)
      callbackfn(rlst);
    });
  }

  getDevicelist((devicelist)=>{
    startexport_export(curday,devicelist,callbackfn);
  });
}

// exports.startexport_do = startexport_do;
module.exports = start;
