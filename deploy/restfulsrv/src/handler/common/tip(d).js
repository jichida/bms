const DBModels = require('../../db/models.js');
const winston = require('../../log/log.js');
const _ = require('lodash');
const config = require('../../config.js');
const async = require('async');
const moment = require('moment');
const getdevicesids = require('../getdevicesids');

const getmoment =()=>{
  return moment();
  //return moment('2017-11-18 02:03:05');//for test
}

exports.gettipcount = (actiondata,ctx,callback)=>{
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds,isall})=>{
    ////console.log(deviceIds);
    ////console.log(devicegroupIds);
    //统计在线／离线个数

    // //console.log(`deviceIds:${JSON.stringify(deviceIds)}`);
    const fn_online = (callbackfn)=>{
      const dbModel = DBModels.SystemConfigModel;
      dbModel.findOne({}).lean().exec((err,systemconfig)=>{
          let SettingOfflineMinutes = 20;
          if(!err && !!systemconfig){
              // systemconfig = systemconfig.toJSON();
              SettingOfflineMinutes = _.get(systemconfig,'SettingOfflineMinutes',SettingOfflineMinutes);
           }
           const curtimebefore = getmoment().subtract(SettingOfflineMinutes, 'minutes').format('YYYY-MM-DD HH:mm:ss');
          //  //console.log(`curtimebefore:${curtimebefore}`);
           let query = {
             'last_Latitude': {$ne:0},
             'last_GPSTime': {$gt: curtimebefore,$exists:true}
           };
           if(!query.DeviceId && !isall){
             query.DeviceId = {'$in':deviceIds};
           }
           const deviceModel = DBModels.DeviceModel;
           deviceModel.count(query,(err, list)=> {
               callbackfn(err,list);
           });
       });
    };

    const fn_total = (callbackfn)=>{
        const deviceModel = DBModels.DeviceModel;
        let query = {};
        if(!query.DeviceId && !isall){
          query.DeviceId = {'$in':deviceIds};
        }
        deviceModel.count(query,(err, list)=> {
            callbackfn(err,list);
        });
    };

    const fn_alarm0 = (callbackfn)=>{
        const realtimealarmModel = DBModels.RealtimeAlarmModel;
        let query = {
           'warninglevel':'高',
           CurDay:getmoment().format('YYYY-MM-DD')
         };
         if(!query.DeviceId && !isall){
           query.DeviceId = {'$in':deviceIds};
         }
        realtimealarmModel.count(query,(err, list)=> {
            callbackfn(err,list);
        });
    };

    const fn_alarm1 = (callbackfn)=>{
        const realtimealarmModel = DBModels.RealtimeAlarmModel;
        let query = {
           'warninglevel':'中',
           CurDay:getmoment().format('YYYY-MM-DD')
         };
         if(!query.DeviceId && !isall){
           query.DeviceId = {'$in':deviceIds};
         }
        realtimealarmModel.count(query,(err, list)=> {
            callbackfn(err,list);
        });
    };

    const fn_alarm2 = (callbackfn)=>{
        const realtimealarmModel = DBModels.RealtimeAlarmModel;
        let query = {
           'warninglevel':'低',
           CurDay:getmoment().format('YYYY-MM-DD')
         };
         if(!query.DeviceId && !isall){
           query.DeviceId = {'$in':deviceIds};
         }
        realtimealarmModel.count(query,(err, list)=> {
            callbackfn(err,list);
        });
    };

    let asyncfnsz = [fn_online,fn_total,fn_alarm0,fn_alarm1,fn_alarm2];
    async.parallel(asyncfnsz,(err,result)=>{
      if(!err){
        const count_online = result[0];
        const count_offline = result[1]-count_online;
        const count_alarm0 = result[2];
        const count_alarm1 = result[3];
        const count_alarm2 = result[4];
        callback({
          cmd:'gettipcount_result',
          payload:{count_online,count_offline,count_alarm0,count_alarm1,count_alarm2}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:`获取个数失败`,type:'gettipcount'}
        });
      }
    });
  });
  //统计报警／高／中／低 个数

  // let query = actiondata.query || {};
  // const devicesfields = actiondata.devicesfields || 'DeviceId last_Latitude last_Longitude';
  //
  // ////console.log(`devicesfields-->${JSON.stringify(devicesfields)}`);
  // let queryexec = devicegroupModel.find(query).populate([
  //     {path:'deviceids', select:devicesfields, model: 'device'},
  // ]).exec((err,list)=>{
  //   if(!err){
  //     if(list.length > 0){
  //       ////console.log(`-->${JSON.stringify(list[0])}`);
  //     }
  //     //for test only
  //     callback({
  //       cmd:'querydevicegroup_result',
  //       payload:{list}
  //     });
  //   }
  //   else{
  //     callback({
  //       cmd:'common_err',
  //       payload:{errmsg:err.message,type:'querydevicegroup'}
  //     });
  //   }
  // });
}
