const _ = require('lodash');
const async = require("async");
const DBModels = require('../handler/models.js');
const mongoose = require('mongoose');
const debug = require('debug')('srvdevicegroupcron:startcron');

const getallunlocateddevice = (callbackfn)=>{
  const deviceModel = DBModels.DeviceModel;
  deviceModel.find({
    $or:[
      {
        'LastHistoryTrack':{$exists:false},
      },
      {
        'LastHistoryTrack.Latitude':0,
      },
      {
        'LastHistoryTrack.Longitude':0
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
    const dbDeviceGroupModel = DBModels.DeviceGroupModel;
    const groupobj = {
      name:'未定位分组',
      systemflag:1,
      deviceids:devicelist
    }
    dbDeviceGroupModel.findOneAndUpdate({name:groupobj.name,systemflag:1}, {$set:groupobj},{new: true,upsert:true},(err,result)=>{
      callbackfn(err,result);
    });
  });

}

module.exports = startcron_updateunlocateddevicegroup;
