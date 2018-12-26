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
      startcron_updatedevicegroup(callbackfn);
    });
  })


  startcron_updateunlocateddevicegroup(()=>{
    callbackfn(null,true);
  });

  fnsz.push((callbackfn)=>{
    async.series(fnsz,(err,result)=>{
      callbackfnindex(err,result);
    });
  });
}

module.exports = startcron;
