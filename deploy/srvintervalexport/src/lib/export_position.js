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
const debug = require('debug')('srvinterval:position');
const getdevice_location = require('../lib/getdevice_location');

const startexport_do = (exportdir,curday,retlist,callbackfn) =>{
  const filepath = `${exportdir}/Position_${curday}.csv`;

  debug(`start filepath--->${filepath}`);
  const res = fs.createWriteStream(filepath,{
    encoding:'ascii',
    autoClose: false
  });
  const csvfields = 'DeviceId,Province,City,County';
  res.write(iconv.convert(csvfields));
  res.write(iconv.convert('\n'));

  _.map(retlist,(item)=>{
    const newdoc = {
      DeviceId:item.DeviceId,
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
  const curday = moment().subtract(1, 'days').format('YYYYMMDD');
  const exportdir = config.exportdir;

  const getDevicelist = (callbackfn)=>{
    debug(`start getDevicelist===>`)
    const deviceModel = DBModels.DeviceModel;
    deviceModel.find({
    },{
      'DeviceId':1,
      'LastRealtimeAlarm.DataTime':1,
      'LastHistoryTrack.Latitude':1,
      'LastHistoryTrack.Longitude':1,
      'LastHistoryTrack.GPSTime':1,
      'alarmtxtstat':1
    }).lean().exec((err,result)=>{
      debug(err)
      debug(result)
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

  const getpoint = (v)=>{
    if(!v.LastHistoryTrack){
      return [0,0];
    }
    return [v.LastHistoryTrack.Longitude,v.LastHistoryTrack.Latitude];
  }

  getDevicelist((devicelist)=>{
    getdevice_location(devicelist,getpoint,(retlist)=>{
      startexport_do(exportdir,curday,retlist,callbackfn);
    });
  });
}

module.exports = startexport_export;
