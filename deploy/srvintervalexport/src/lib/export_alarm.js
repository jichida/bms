const config = require('../config');
const DBModels = require('../handler/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
// const Iconv = require('iconv').Iconv;
// const iconv = new Iconv('UTF-8', 'GBK');
const csvwriter = require('csvwriter');
const fs = require('fs');
const _ = require('lodash');
const async = require('async');
const debug = require('debug')('srvinterval:alarm');


const getalarmfieldtotxt = (alarmfield)=>{
    const mapdict = config.mapdict;
    if(_.startsWith(alarmfield, 'AL_') || _.startsWith(alarmfield, 'F[')){
      if(_.startsWith(alarmfield, 'AL_')){
        if(!!mapdict[alarmfield]){
          return mapdict[alarmfield].showname;
        }
      }
      return alarmfield;
    }
    return undefined;
};


const bridge_alarminfo = (alarminfo)=>{
  // ////console.log(`alarminfo===>${JSON.stringify(alarminfo)}`);
  let alarmtxt = '';
  let alarminfonew = {};
  alarminfonew[`_id`] = alarminfo._id;
  alarminfonew[`DeviceId`] = alarminfo[`DeviceId`];


  let alarminfotmp = _.clone(alarminfo);
  let rest = _.omit(alarminfotmp,['_id','CurDay','DeviceId','__v','DataTime','warninglevel','Longitude','Latitude']);
  // ////console.log(`rest===>${JSON.stringify(rest)}`);
  _.map(rest,(v,key)=>{
    let keytxt = getalarmfieldtotxt(key);
    if(!!keytxt){
      alarmtxt += `${keytxt} ${v}次|`
    }
  });

  alarminfonew[`alarmtxtstat`] = alarmtxt;
  // ////console.log(`alarminfonew===>${JSON.stringify(alarminfonew)}`);
  return alarminfonew;
}

const startexport_do = (exportdir,curday,retlist,callbackfn) =>{
  const filepath = `${exportdir}/Alarm${curday}.csv`;

  debug(`start filepath--->${filepath}`);
  const res = fs.createWriteStream(filepath,{
    autoClose: false
  });
  const csvfields = 'DeviceId,ALARM,Province,City,County';
  // res.write(iconv.convert(csvfields));
  // res.write(iconv.convert('\n'));
  res.write(csvfields);
  res.write('\n');

  if(retlist.length === 0){
    res.end('');
    callbackfn(filepath);
    return;
  }

  let result = 0;
  for(let i = 0 ;i < retlist.length ; i ++){
    const newdoc = {
      DeviceId:item.DeviceId,
      ALARM:item.alarmtxtstat,
      Province:item.Provice,
      City:item.City,
      County:item.Area
    };
    csvwriter(newdoc, {header: false, fields: csvfields}, (err, csv)=> {
      if (!err && !!csv ) {
         res.write(csv);
       }
       if(i === retlist.length - 1){
         res.end('');
         callbackfn(filepath);
       }
     });
  }

}

const addlocationstring= (alarmlist,config_mapdevicecity,callbackfn)=>{
  let retalarmlist = [];
  for(let i = 0 ;i < alarmlist.length; i ++){
    let info = alarmlist[i];
    info.Provice = _.get(config_mapdevicecity,`${info.DeviceId}.province`,'未知');
    info.City = _.get(config_mapdevicecity,`${info.DeviceId}.city`,'未知');
    info.Area = _.get(config_mapdevicecity,`${info.DeviceId}.district`,'未知');
    retalarmlist.push(info);
  }
  callbackfn(retalarmlist);
}



const startexport_export = (config_mapdevicecity,callbackfn)=>{
  const momentprev = moment();//今日
  const curday = momentprev.format('YYYYMMDD');
  const CurDay = momentprev.format('YYYY-MM-DD');
  const exportdir = config.exportdir;

  const getAlarmlist = (callbackfn)=>{
    debug(`start getDevicelist===>`)
    const alarmModel = DBModels.RealtimeAlarmModel;
    alarmModel.find({
      CurDay,
    }).lean().exec((err,result)=>{
      rlst = [];
      if(!err && !!result){
        _.map(result,(item)=>{
          rlst.push(bridge_alarminfo(item));
        });
      }
      debug(`[获取所有设备个数]===>${rlst.length}`)
      callbackfn(rlst);
    });
  }

  getAlarmlist((alarmlist)=>{
    addlocationstring(alarmlist,config_mapdevicecity,(retlist)=>{
      startexport_do(exportdir,curday,retlist,callbackfn);
    });
  });
}

module.exports = startexport_export;
