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
const debug = require('debug')('srvinterval:history');


const gettimekey =(timestart,timeend)=> {
  const timekeysz = [];
  const momentstart = moment(timestart);
  const momentend = moment(timeend);
  let momenti;
  for(momenti =momentstart ;momenti <= momentend;  ){
    const timekey = momenti.format('YYMMDD');
    timekeysz.push(timekey);
    momenti = momenti.add(1, 'days');
  }
  console.log(`timekeysz--->${JSON.stringify(timekeysz)}`);
  return timekeysz;
}


const startexport_do = (DeviceId,exportdir,startDay,endDay,callbackfn) =>{
  // const curdays = moment(curday).format('YYYYMMDD');
  const TimeKeyArray = gettimekey(startDay,endDay);
  const dbModel = DBModels.HistoryDeviceModel;
  const filename = `${exportdir}/${startDay}_${endDay}_${DeviceId}.csv`;
  const fields = null;
  const csvfields_query = 'DeviceId,DataTime,UpdateTime,BAT_I_Branch1,BAT_I_Branch2,BAT_I_Branch3,BAT_I_Branch4';

 const csvfields = 'DeviceId,DataTime,SaveTime,BAT_I_Branch1,BAT_I_Branch2,BAT_I_Branch3,BAT_I_Branch4';

  // const fn_convert = (doc,callbackfn)=>{
  //   doc['ALARM'] = doc['alarmtxtstat'];
  //   doc['SaveTime'] = doc['UpdateTime'];
  //   callbackfn(doc);
  // }
  const query = {
    DeviceId,
    TimeKey:{
      $in:TimeKeyArray
    },//
  };
  const sort = {DataTime:1};
  let exportcmd = `mongoexport --uri=${config.mongodburl} --type=csv -c historydevices --out "${filename}" `
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

const startexport_batch = (devicelist,exportdir,startDay,endDay,callbackfn)=>{
  const fnsz = [];
  _.map(devicelist,(DeviceId)=>{
    fnsz.push((callbackfn)=>{
      startexport_do(DeviceId,exportdir,startDay,endDay,callbackfn);
    });
  });
  async.parallelLimit(fnsz,config.batchcount,(err,result)=>{
    callbackfn(devicelist);
  });
}

const startexport_export = (startDay,endDay,devicelist,callbackfn)=>{
  const momentsstart = moment(startDay);
  const momentsend = moment(endDay);

  const exportdirbase = `${config.exportdir}/${momentsstart.format('YYYYMMDD')}_${momentsend.format('YYYYMMDD')}`;
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
   startexport_batch(devicelist,exportdir,startDay,endDay,(retlist)=>{
    success_list = _.concat(success_list, retlist);
    debug(`导出历史数据结果->success_list-->${success_list.length},本次新增:${retlist.length}`)
    callbackfn(exportdir);
  });
}

const start = (startDay,endDay,callbackfn)=>{
  const getDevicelist = (callbackfn)=>{
    const rlst = [
'1702100383',
'1702102099',
'1702102220',
'1702101973',
'1702100773',
'1735202229',
'1735202782',
'1734202828',
'1734200114',
'1734202621',
'1719101613',
'1702100661',
'1719100088',
'1719103814',
'1719100716',
'1727101710',
'1727101699',
'1727100212',
'1727204264',
'1727101995',
'1713100931',
'1713101061',
'1713101201',
'1702101047',
'1713101104',
'1719103836',
'1719104404',
'1719104225',
'1719104594',
'1713100999',
'1713100348',
'1713100976',
'1713101126',
'1713100735',
'1702100270',
'1725103258',
'1725100873',
'1725102451',
'1725102543',
'1725103286',
'1727208545',
'1727208651',
'1727208572',
'1727209063',
'1727201119',
'1725103785',
'1724102447',
'1725102017',
'1725102086',
'1725100073',
'1735206375',
'1735203479',
'1735203162',
'1735205640',
'1735205803',
'1823213729',
'1827201346',
'1827201075',
'1823201032',
'1827203582'
    ];
    callbackfn(rlst);
    // debug(`start getDevicelist===>`)
    // const deviceModel = DBModels.DeviceModel;
    // deviceModel.find({
    // },{
    //   'DeviceId':1,
    //   }).lean().exec((err,result)=>{
    //   rlst = [];
    //   if(!err && !!result){
    //     _.map(result,(item)=>{
    //       rlst.push(item);
    //     });
    //
    //   }
    //   debug(`[获取所有设备个数]===>${rlst.length}`)
    //   callbackfn(rlst);
    // });
  }

  getDevicelist((devicelist)=>{
    startexport_export(startDay,endDay,devicelist,callbackfn);
  });
}

// exports.startexport_do = startexport_do;
module.exports = start;
