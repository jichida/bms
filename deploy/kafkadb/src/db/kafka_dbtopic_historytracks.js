const mongoose  = require('mongoose');
const DBModels = require('./models.js');
const _ = require('lodash');
const config = require('../config.js');
const moment = require('moment');

const save_lasthistorytrack = (devicedata,callbackfn)=>{
  const LastHistoryTrack = devicedata.LastHistoryTrack;
  if(!!LastHistoryTrack){
    LastHistoryTrack.DeviceId = devicedata.DeviceId;
    LastHistoryTrack.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
    LastHistoryTrack.NodeID = config.NodeID;
    LastHistoryTrack.SN64 = devicedata.SN64;
    LastHistoryTrack.Provice = devicedata.Provice;
    LastHistoryTrack.City = devicedata.City;
    LastHistoryTrack.Area = devicedata.Area;
    LastHistoryTrack.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    const entity = new DBModels.HistoryTrackModel(LastHistoryTrack);
    entity.save((err,result)=>{
      callbackfn(err,result);
    });
    return;
  }
  callbackfn();
}


const kafka_dbtopic_historytracks = (devicedata,callbackfn)=>{
  console.log(`【kafka_dbtopic_historytracks】接收成功${devicedata.SN64},${config.NodeID},${devicedata.DeviceId}`);
  save_lasthistorytrack(devicedata,callbackfn);
}


module.exports = kafka_dbtopic_historytracks;
