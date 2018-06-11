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
const debug = require('debug')('srvinterval:position');


const startexport_do = (exportdir,curday,retlist,callbackfn) =>{
  const filepath = `${exportdir}/Position_${curday}.csv`;

  debug(`start filepath--->${filepath}`);
  const res = fs.createWriteStream(filepath,{
    autoClose: false
  });
  const csvfields = 'DeviceId,Province,City,County';
  // res.write(iconv.convert(csvfields));
  // res.write(iconv.convert('\n'));
  res.write(csvfields);
  res.write('\n');

  let result = 0;
  _.map(retlist,(item)=>{

      const newdoc = {
        DeviceId:item.DeviceId,
        Province:item.Provice,
        City:item.City,
        County:item.Area
      };

      csvwriter(newdoc, {header: false, fields: csvfields}, (err, csv)=> {
        if (!err && !!csv ) {
           res.write(csv);
         }
         result = result+1;
       });

  });

  const checkiffinished = ()=>{
    debug(`position checkiffinished-->${result},total:${retlist.length}`);

    if(retlist.length === result){
      res.end('');
      callbackfn(filepath);
      return;
    }
    setTimeout(checkiffinished, 1000 );
  }
  checkiffinished();

}

const addlocationstring= (devicelist,config_mapdevicecity,callbackfn)=>{
  let retdevicelist = [];
  for(let i = 0 ;i < devicelist.length; i ++){
    let info = devicelist[i];

    info.Provice = _.get(config_mapdevicecity,`${info.DeviceId}.province`,'未知');
    info.City = _.get(config_mapdevicecity,`${info.DeviceId}.city`,'未知');
    info.Area = _.get(config_mapdevicecity,`${info.DeviceId}.district`,'未知');
    retdevicelist.push(info);
  }
  callbackfn(retdevicelist);
}


const startexport_export = (config_mapdevicecity,callbackfn)=>{
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
      // debug(err)
      // debug(result)
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
    addlocationstring(devicelist,config_mapdevicecity,(retlist)=>{
      startexport_do(exportdir,curday,retlist,callbackfn);
    });
  });
}

module.exports = startexport_export;
