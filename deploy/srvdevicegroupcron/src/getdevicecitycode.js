const PubSub = require('pubsub-js');
const DBModels = require('./handler/models.js');
const mongoose = require('mongoose');
const debug = require('debug')('srvdevicegroupcron:getdevicecitycode');

const userDeviceSubscriber = ( msg, data )=>{
    debug('->用户订阅请求,用户信息:'+JSON.stringify(data));
    debug('->用户订阅消息:'+msg);
    const {
      deviceid,
      citycode,
      adcode,
      targetadcode,
      updatetime
    } = data;
    const devicemongoid = mongoose.Types.ObjectId(deviceid);
    const dbModel = DBModels.DeviceCityModel;
    dbModel.findOneAndUpdate({deviceid:devicemongoid}, {$set:data},{new: true,upsert:true},(err,result)=>{
        debug(`result--->${deviceid}-->${targetadcode}`);
    });
};//for eachuser

const startSrv = ()=>{
  PubSub.subscribe('getdevicecity',userDeviceSubscriber);
}

module.exports = startSrv;
