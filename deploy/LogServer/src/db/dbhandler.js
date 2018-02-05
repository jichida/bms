const _ = require('lodash');
const moment = require('moment');
const config = require('../config.js');
const logdata = require('../log/logdata.js');
const logbms = require('../log/logbms.js');
let ndata = 0;
let nbms = 0;
exports.logdata= (data,callback)=>{
  const LastRealtimeAlarm = _.clone(data.BMSData);
  const LastHistoryTrack = _.clone(data.Position);
  const devicedata = _.omit(data,['BMSData','Position']);
//==============
  console.log(`接收kafka成功:${devicedata.SN64},${devicedata.DeviceId},当前:${ndata++}`);
  logdata.getlog().info(`接收kafka成功:${devicedata.SN64},${devicedata.DeviceId},当前:${ndata++}`);
};

exports.logbms= (data,callback)=>{
  console.log(`接收bms成功:${devicedata.SN64},${config.NodeID},${devicedata.DeviceId},当前:${nbms++}`);
  logbms.getlog().info(`接收bms成功:${devicedata.SN64},${config.NodeID},${devicedata.DeviceId},当前:${nbms++}`);
};
