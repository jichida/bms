const mongoose  = require('mongoose');
const DBModels = require('./models.js');
const config = require('../config.js');

const save_device = (devicedata,callbackfn)=>{
  // //console.log(`start save device...${!!DBModels.DeviceModel}`);
  const dbModel = DBModels.DeviceModel;
  devicedata.NodeID = config.NodeID;
  devicedata.organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
  dbModel.findOneAndUpdate({DeviceId:devicedata.DeviceId},{$set:devicedata},{
    upsert:true,new:true
  },(err,result)=>{
    //console.log(`save_device saved`);
    callbackfn(err,result);
  });
};

const kafka_dbtopic_devices = (devicedata,callbackfn)=>{
  //console.log(`【kafka_dbtopic_devices,${config.NodeID}】接收成功${devicedata.SN64},${devicedata.DeviceId}`);
  save_device(devicedata,callbackfn);
}


module.exports = kafka_dbtopic_devices;
