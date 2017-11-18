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
      // let validdata = [];
      //注：这段代码无法理解，过滤Latitude为0的数据，为什么是undefined??
      // _.map(list,(dataitem)=>{
      //   console.log(`validdata dataitem:${JSON.stringify(dataitem)}`)
      //   console.log(`dataitem.Latitude:${dataitem.Latitude}`)
      //   if(dataitem.Latitude > 0 && dataitem.Longitude > 0 ){
      //     validdata.push(dataitem);
      //   }
      // });

      if(list.length > 0){
        callback({
          cmd:'queryhistorytrack_result',
          payload:{list}
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
