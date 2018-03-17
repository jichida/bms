const DBModels = require('../../db/models.js');
const mongoose = require('mongoose');

exports.collectdevice = (actiondata,ctx,callbackfn)=>{
  //deviceId:'',collected:false/true
  const {DeviceId,collected} = actiondata;
  let deviceid = DeviceId;

  const dbModel = DBModels.UserModel;
  const userid = ctx.userid;
  const cmdUpdate = collected?{ "$push": { "devicecollections": deviceid } }:{ "$pull": { "devicecollections": deviceid } };

  dbModel.findByIdAndUpdate(userid,cmdUpdate, {new: true}).lean().exec((err,usernew)=>{
    if(!err && !!usernew){
      callbackfn({
        cmd:'collectdevice_result',
        payload:{devicecollections:usernew.devicecollections}
      });
    }
    else{
      callbackfn({
        cmd:'common_err',
        payload:{errmsg:`${collected?'收藏':'取消收藏'}错误`,type:'collectdevice'}
      });
    }
  });

}
