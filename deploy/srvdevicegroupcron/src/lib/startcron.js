const async = require("async");
const _ = require('lodash');
const DBModels = require('../handler/models');
const debug = require('debug')('srvdevicegroupcron:startcron');
const winston = require('../log/log.js');
const getalldefault_devicegroups = require('./getallcities');
const getallarea_start = require('./getarea_all');
const startcron_updatedevicegroup = require('./startcron_updatedevicegroup');
const startcron_updateunlocateddevicegroup =  require('./startcron_updateunlocateddevicegroup');


const startcron = (devicelist,callbackfnindex)=>{
  let fnsz = [];
  fnsz.push((callbackfn)=>{
    getallarea_start(devicelist,(allret)=>{
      startcron_updatedevicegroup(()=>{
        winston.getlog().info(`注意:startcron_updatedevicegroup finished`);
        callbackfn(null,true);
      });
    });
  })

  fnsz.push((callbackfn)=>{
    startcron_updateunlocateddevicegroup(()=>{
      winston.getlog().info(`注意:startcron_updateunlocateddevicegroup finished`);
      callbackfn(null,true);
    });
  });

  async.series(fnsz,(err,result)=>{
    winston.getlog().info(`注意:startcron finished`);
    callbackfnindex(err,result);
  });
}

module.exports = startcron;
