const config = require('../../config.js');
let DBModels = require('../../db/models.js');
let mongoose  = require('mongoose');
const winston = require('../../log/log.js');
const _ = require('lodash');

exports.queryhistorytrack = (actiondata,ctx,callback)=>{
  console.log(`queryhistorytrack==>${JSON.stringify(actiondata)}`);
  //let HistoryTrackModel =mongoose.model('historytrack',  HistoryTrackSchema);
  let historytrackModel = DBModels.HistoryTrackModel;
  let query = actiondata.query || {};
  let fields = actiondata.fields || {
    'DeviceId':1,
    'Latitude':1,
    'Longitude':1,
    'GPSTime':1,
  };
  let queryexec = historytrackModel.find(query).sort({ GPSTime: 1 }).select(fields);
  queryexec.exec((err,list)=>{
    if(!err){
      let validdata = [];
      _.map(list,(data)=>{
        if(data.Latitude !== 0 && data.Longitude !== 0){
          validdata.push(data);
        }
      });

      if(validdata.length > 0){
        callback({
          cmd:'queryhistorytrack_result',
          payload:{list:validdata}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:`该时间段没有回放数据`,type:'queryhistorytrack'}
        });
      }
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'queryhistorytrack'}
      });
    }
  });
}
