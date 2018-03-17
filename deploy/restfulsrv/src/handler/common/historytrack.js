const config = require('../../config.js');
const DBModels = require('../../db/models.js');
const mongoose  = require('mongoose');
const winston = require('../../log/log.js');
const _ = require('lodash');
const moment = require('moment');
const utilposition = require('../common/util_position');
const getdevicesids = require('../getdevicesids');
const debug = require('debug')('srvapp:position');

const getpoint = (v)=>{
  return [v.Longitude,v.Latitude];
}
//app中的位置分页
exports.uireport_searchposition =  (actiondata,ctx,callback)=>{
  // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
  const historytrackModel = DBModels.HistoryTrackModel;
  let query = actiondata.query || {};
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds,isall})=>{
    if(!query.DeviceId && !isall){
      query.DeviceId = {'$in':deviceIds};
    }
    debug(`uireport_searchposition start--->${moment().format('HH:mm:ss')}`);
    actiondata.options = actiondata.options || {};
    actiondata.options.lean = true;
    historytrackModel.paginate(query,actiondata.options,(err,result)=>{
      debug(`uireport_searchposition end--->${moment().format('HH:mm:ss')}`);
      if(!err){
        // result = JSON.parse(JSON.stringify(result));
        let docs = [];
        _.map(result.docs,(record)=>{
          docs.push(record);
        });

        utilposition.getlist_pos(docs,getpoint,(err,newdocs)=>{
          result.docs = newdocs;
          callback({
            cmd:'uireport_searchposition_result',
            payload:{result}
          });
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:err.message,type:'uireport_searchposition'}
        });
      }
    });
  });
}


exports.exportposition = (actiondata,ctx,callback)=>{
  //console.log(`exportposition==>${JSON.stringify(actiondata)}`);
  //let HistoryTrackModel =mongoose.model('historytrack',  HistoryTrackSchema);
  const historytrackModel = DBModels.HistoryTrackModel;
  let query = actiondata.query || {};
  const fields = actiondata.fields ||
    'DeviceId Latitude Longitude GPSTime';
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds,isall})=>{
      if(!query.DeviceId && !isall){
        query.DeviceId = {'$in':deviceIds};
      }
      debug(`----->historytrackModel query-->${JSON.stringify(query)}`);
      const queryexec = historytrackModel.find(query).select(fields).lean();
      queryexec.exec((err,list)=>{
        debug(`----->historytrackModel find`);
        if(!err){
          if(list.length > 0){
            callback({
              cmd:'exportposition_result',
              payload:{list}
            });
          }
          else{
            callback({
              cmd:'common_err',
              payload:{errmsg:`该时间段没有回放数据`,type:'exportposition'}
            });
          }
        }
        else{
          callback({
            cmd:'common_err',
            payload:{errmsg:err.message,type:'exportposition'}
          });
        }
      });
    });
}


exports.queryhistorytrack = (actiondata,ctx,callback)=>{
  //console.log(`queryhistorytrack==>${JSON.stringify(actiondata)}`);
  //let HistoryTrackModel =mongoose.model('historytrack',  HistoryTrackSchema);
  let historytrackModel = DBModels.HistoryTrackModel;
  let query = actiondata.query || {};
  let fields = actiondata.fields || {
    'DeviceId':1,
    'Latitude':1,
    'Longitude':1,
    'GPSTime':1,
  };
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds,isall})=>{
    if(!query.DeviceId && !isall){
      query.DeviceId = {'$in':deviceIds};
    }
    let queryexec = historytrackModel.find(query).sort({ GPSTime: 1 }).select(fields).lean();
    queryexec.exec((err,list)=>{
      if(!err){
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
  });
}
