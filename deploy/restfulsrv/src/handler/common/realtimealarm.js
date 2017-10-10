const config = require('../../config.js');
let DBModels = require('../../db/models.js');
let mongoose  = require('mongoose');
const winston = require('../../log/log.js');

exports.queryrealtimealarm = (actiondata,ctx,callback)=>{
  let realtimealarmModel = DBModels.RealtimeAlarmModel;
  let query = actiondata.query || {};
  realtimealarmModel.find(query,(err,list)=>{
    if(!err){
      callback({
        cmd:'queryrealtimealarm_result',
        payload:{list}
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'queryrealtimealarm'}
      });
    }
  });
}
