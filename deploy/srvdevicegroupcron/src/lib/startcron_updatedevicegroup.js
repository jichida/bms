const _ = require('lodash');
const async = require("async");
const DBModels = require('../handler/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
const debug = require('debug')('srvdevicegroupcron:startcron');

const startcron_updatedevicegroup = (retmapgroupidtodevice,callbackfn)=>{
  const dbDeviceGroupModel = DBModels.DeviceGroupModel;
  let fnsz = [];
  const updatetime = moment().format('YYYY-MM-DD HH:mm:ss');
  _.map(retmapgroupidtodevice,(deviceidslist,groupid)=>{
    fnsz.push((callback)=>{
      dbDeviceGroupModel.findOneAndUpdate({_id:groupid}, {$set:{
          deviceids:deviceidslist,
          updatetime
        }},{new: true,upsert:true},(err,result)=>{
          debug(`result--->${groupid}-->${deviceidslist.length}`);
          callback(null,true);
      });
    });
  });

  async.parallel(fnsz,(err,result)=>{
    callbackfn(err,result);
  });
}

module.exports = startcron_updatedevicegroup;
