const config = require('../../config.js');
let DBModels = require('../../db/models.js');
let mongoose  = require('mongoose');
const winston = require('../../log/log.js');

exports.queryhistorytrack = (actiondata,ctx,callback)=>{
  console.log(`queryhistorytrack==>${JSON.stringify(actiondata)}`);
  //let HistoryTrackModel =mongoose.model('historytrack',  HistoryTrackSchema);
  let historytrackModel = DBModels.HistoryTrackModel;
  let query = actiondata.query || {};
  let fields = actiondata.fields || {
    'DeviceId':1,
    'Latitude':1,
    'Longitude':1,
    'updated_at':1,
  };
  let queryexec = historytrackModel.find(query).sort({ GPSTime: 1 }).select(fields);
  queryexec.exec((err,list)=>{
    if(!err){
      callback({
        cmd:'queryhistorytrack_result',
        payload:{list}
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'queryhistorytrack'}
      });
    }
  });
}
