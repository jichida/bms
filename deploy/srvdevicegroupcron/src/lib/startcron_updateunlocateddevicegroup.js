const _ = require('lodash');
const async = require("async");
const DBModels = require('../handler/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
const debug = require('debug')('srvdevicegroupcron:startcron');
const winston = require('../log/log.js');

const getallunlocateddevice = (callbackfn)=>{
  const deviceModel = DBModels.DeviceModel;
  deviceModel.find({
    $or:[
      {
        'last_GPSTime':{$exists:false},
      },
      {
        'last_Longitude':0,
      },
      {
        'last_Latitude':0
      }
    ]
  },{
    '_id':1,
  }).lean().exec((err,result)=>{
    rlst = [];
    if(!err && !!result){
      _.map(result,(item)=>{
        rlst.push({
          _id:item._id,
        })
      });

    }
    callbackfn(rlst);
  });
}
const startcron_updateunlocateddevicegroup = (callbackfn)=>{

  getallunlocateddevice((devicelist)=>{
    winston.getlog().info(`注意:getallunlocateddevice result:${devicelist.length}`);
    const updatetime = moment().format('YYYY-MM-DD HH:mm:ss');
    const dbDeviceGroupModel = DBModels.DeviceGroupModel;
    const groupobj = {
      name:'未定位分组',
      systemflag:1,
      deviceids:devicelist,
      updatetime
    }
    dbDeviceGroupModel.findOneAndUpdate({name:groupobj.name,systemflag:1}, {$set:groupobj},{new: true,upsert:true},(err,result)=>{
      callbackfn(err,result);
    });
  });

}

module.exports = startcron_updateunlocateddevicegroup;
