const config = require('../config');
const DBModels = require('../handler/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('UTF-8', 'GBK');
const csvwriter = require('csvwriter');
const fs = require('fs');
const _ = require('lodash');
const async = require('async');
const debug = require('debug')('srvinterval:alarm');
const getdevice_location = require('../lib/getdevice_location');

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
    encoding:'ascii',
    autoClose: false
  });
  const csvfields = 'DeviceId,ALARM,Province,City,County';
  res.write(iconv.convert(csvfields));
  res.write(iconv.convert('\n'));

  _.map(retlist,(item)=>{
    const newdoc = {
      DeviceId:item.DeviceId,
      ALARM:item.alarmtxtstat,
      Province:item.Provice,
      City:item.City,
      County:item.Area
    };
    csvwriter(newdoc, {header: false, fields: csvfields}, (err, csv)=> {
     if (!err && !!csv ) {
         res.write(iconv.convert(csv));
       }
     });
  });
  res.end('');
  callbackfn(null,true);
}


const startexport_export = (callbackfn)=>{
  const momentprev = moment();//今日
  const curday = momentprev.format('YYYYMMDD');
  const CurDay = momentprev.format('YYYY-MM-DD');
  const exportdir = config.exportdir;

  const getDevicelist = (callbackfn)=>{
    debug(`start getDevicelist===>`)
    const deviceModel = DBModels.RealtimeAlarmModel;
    deviceModel.find({
      CurDay,
    }).lean().exec((err,result)=>{
      debug(err)
      debug(result)
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

  const getpoint = (v)=>{
    if(!v.Longitude){
      return [0,0];
    }
    return [v.Longitude,v.Latitude];
  }

  getDevicelist((devicelist)=>{
    getdevice_location(devicelist,getpoint,(retlist)=>{
      startexport_do(exportdir,curday,retlist,callbackfn);
    });
  });
}

module.exports = startexport_export;
