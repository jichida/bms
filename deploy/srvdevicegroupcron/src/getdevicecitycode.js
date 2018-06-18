const PubSub = require('pubsub-js');
const DBModels = require('./handler/models.js');
const mongoose = require('mongoose');
const _ = require("lodash");
const debug = require('debug')('srvdevicegroupcron:getdevicecitycode');

const userDeviceSubscriber = ( msg, data )=>{
    debug('->用户订阅请求,用户信息:'+JSON.stringify(data));
    debug('->用户订阅消息:'+msg);
    const {
      deviceid,
      citycode,
      province,
      city,
      district,
      adcode,
      targetadcode,
      updatetime
    } = data;
    const devicemongoid = mongoose.Types.ObjectId(deviceid);
    const dbModel = DBModels.DeviceCityModel;

    if(_.get(data,'city','').length === 0){
      _.set(data,'city',data.province);
    }
    dbModel.findOneAndUpdate({deviceid:devicemongoid}, {$set:data},{new: true,upsert:true},(err,result)=>{
        debug(`result--->${deviceid}-->${targetadcode}`);
    });
};//for eachuser

const startSrv = ()=>{
  PubSub.subscribe('getdevicecity',userDeviceSubscriber);
}

module.exports = startSrv;
