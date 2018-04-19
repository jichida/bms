const _ = require('lodash');
const DBModels = require('../handler/models.js');
const mongoose = require('mongoose');
const debug = require('debug')('srvdevicegroupcron:startcron');

const startcron_updatedevicegroup = (retmapgroupidtodevice)=>{
  const dbDeviceGroupModel = DBModels.DeviceGroupModel;
  _.map(retmapgroupidtodevice,(deviceidslist,groupid)=>{
    dbDeviceGroupModel.findOneAndUpdate({_id:groupid}, {$set:{
        deviceids:deviceidslist
      }},{new: true,upsert:true},(err,result)=>{
        debug(`result--->${groupid}-->${deviceidslist.length}`);
    });
  });
}

module.exports = startcron_updatedevicegroup;
