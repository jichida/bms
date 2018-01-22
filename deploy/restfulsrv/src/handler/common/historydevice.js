const config = require('../../config.js');
const DBModels = require('../../db/models.js');
const mongoose  = require('mongoose');
const winston = require('../../log/log.js');
const _ = require('lodash');
const moment = require('moment');
const getdevicesids = require('../getdevicesids');
const get = _.get;

exports.uireport_searchhistorydevice =  (actiondata,ctx,callback)=>{
  // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
  const historydeviceModel = DBModels.HistoryDeviceModel;
  const query = actiondata.query || {};
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds})=>{
    if(!query.DeviceId){
      query.DeviceId = {'$in':deviceIds};
    }

    historydeviceModel.paginate(query,actiondata.options,(err,result)=>{
      if(!err){
        result = JSON.parse(JSON.stringify(result));
        let docs = [];
        _.map(result.docs,(record)=>{
          docs.push(record);
        });

        callback({
          cmd:'uireport_searchhistorydevice_result',
          payload:{result}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:err.message,type:'uireport_searchhistorydevice'}
        });
      }
    });
  });
}

// '采集时间',
// '保存时间',
// '箱体测量电压(V)',
// '箱体累加电压(V)',
// '箱体电流(A)',
// '真实SOC(%)',
// '最高单体电压(V)',
// '最低单体电压(V)',
// '最高单体电压CSC号',
// '最高单体电芯位置',
// '最低单体电压CSC号',
// '最低单体电压电芯位置',
// '最高单体温度',
// '最低单体温度',
// '平均单体温度',
// '最高温度CSC号',
// '最低温度CSC号',
// '显示用SOC',
// '平均单体电压',
// '报警状态',
const bridge_historydeviceinfo = (item)=>{
  let itemnew = {};
  itemnew[`key`] = get(item,'_id','');
  itemnew[`车辆ID`] = get(item,'DeviceId','');
  itemnew[`采集时间`] = get(item,'DeviceId','');
  itemnew[`保存时间`] = get(item,'DeviceId','');
  itemnew[`箱体测量电压(V)`] = get(item,'DeviceId','');
  itemnew[`箱体累加电压(V)`] = get(item,'DeviceId','');
  itemnew[`箱体电流(A)`] = get(item,'DeviceId','');
  itemnew[`真实SOC(%)`] = get(item,'DeviceId','');
  itemnew[`最高单体电压(V)`] = get(item,'DeviceId','');
  itemnew[`最低单体电压(V)`] = get(item,'DeviceId','');
  itemnew[`最高单体电压CSC号`] = get(item,'DeviceId','');
  itemnew[`最高单体电芯位置`] = get(item,'DeviceId','');
  itemnew[`最低单体电压CSC号`] = get(item,'DeviceId','');
  itemnew[`最低单体电压电芯位置`] = get(item,'DeviceId','');
  itemnew[`最高单体温度`] = get(item,'DeviceId','');
  itemnew[`最低单体温度`] = get(item,'DeviceId','');
  itemnew[`平均单体温度`] = get(item,'DeviceId','');
  itemnew[`最高温度CSC号`] = get(item,'DeviceId','');
  itemnew[`最低温度CSC号`] = get(item,'DeviceId','');
  itemnew[`显示用SOC`] = get(item,'DeviceId','');
  itemnew[`平均单体电压`] = get(item,'DeviceId','');
  itemnew[`报警状态`] = get(item,'DeviceId','');

  return deviceinfonew;
};

exports.bridge_historydeviceinfo =  bridge_historydeviceinfo;
