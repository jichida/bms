const config = require('../../config.js');
const DBModels = require('../../db/models.js');
const mongoose  = require('mongoose');
const winston = require('../../log/log.js');
const _ = require('lodash');
const moment = require('moment');
const getdevicesids = require('../getdevicesids');
const debug = require('debug')('srvapp:device');
const srvsystem = require('../../srvsystem.js');
const async = require('async');
/*
  仅对app服务
  find({
    warninglevel:{'$in':['高','中','低']}
  }).sort({
    'LastRealtimeAlarm.DataTime':-1,
  }).limit(1000).
  select({
    'DeviceId':1,
    'warninglevel':1,
    'LastRealtimeAlarm.DataTime':1,
    'alarmtxtstat':1,
  })
*/
const getmoment =()=>{
  return moment();
}

exports.querydevicealarm = (actiondata,ctx,callback)=>{

  debug(`start querydevice ----> `);

  const deviceModel = DBModels.DeviceModel;
  let query = actiondata.query || {};
  // query['warninglevel'] = {'$in':['高','中','低']};
  const fields = actiondata.fields || {
    'DeviceId':1,
    'warninglevel':1,
    'LastRealtimeAlarm.DataTime':1,
    'alarmtxtstat':1,
  };
  debug(`device start getdevicesids`);
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds,isall})=>{
    if(!query.DeviceId && !isall){
      query.DeviceId = {'$in':deviceIds};
    }
    const limitedcount = 8;
    let fnsz = [];
    fnsz.push((callbackfn)=>{
      let querydo = _.clone(query);
      querydo[`warninglevel`] = '高';
      const queryexec = deviceModel.find(querydo).sort({
        'LastRealtimeAlarm.DataTime':-1,
      }).limit(limitedcount).select(fields).lean();
      queryexec.exec((err,list)=>{
        callbackfn(null,list);
      });
    });

    fnsz.push((callbackfn)=>{
      let querydo = _.clone(query);
      querydo[`warninglevel`] = '中';
      const queryexec = deviceModel.find(querydo).sort({
        'LastRealtimeAlarm.DataTime':-1,
      }).limit(limitedcount).select(fields).lean();
      queryexec.exec((err,list)=>{
        callbackfn(null,list);
      });
    });

    fnsz.push((callbackfn)=>{
      let querydo = _.clone(query);
      querydo[`warninglevel`] = '低';
      const queryexec = deviceModel.find(querydo).sort({
        'LastRealtimeAlarm.DataTime':-1,
      }).limit(limitedcount).select(fields).lean();
      queryexec.exec((err,list)=>{
        callbackfn(null,list);
      });
    });

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
        const realtimealarmModel = DBModels.DeviceModel;
        let query = {
           'warninglevel':'高',
         };
         if(!query.DeviceId && !isall){
           query.DeviceId = {'$in':deviceIds};
         }
        realtimealarmModel.count(query,(err, list)=> {
            callbackfn(err,list);
        });
    };

    const fn_alarm1 = (callbackfn)=>{
        const realtimealarmModel = DBModels.DeviceModel;
        let query = {
           'warninglevel':'中',
         };
         if(!query.DeviceId && !isall){
           query.DeviceId = {'$in':deviceIds};
         }
        realtimealarmModel.count(query,(err, list)=> {
            callbackfn(err,list);
        });
    };

    const fn_alarm2 = (callbackfn)=>{
        const realtimealarmModel = DBModels.DeviceModel;
        let query = {
           'warninglevel':'低',
         };
         if(!query.DeviceId && !isall){
           query.DeviceId = {'$in':deviceIds};
         }
        realtimealarmModel.count(query,(err, list)=> {
            callbackfn(err,list);
        });
    };

    fnsz.push(fn_online);
    fnsz.push(fn_total);
    fnsz.push(fn_alarm0);
    fnsz.push(fn_alarm1);
    fnsz.push(fn_alarm2);

    async.parallel(fnsz,(err,result)=>{
        srvsystem.loginuser_add(ctx.userid,ctx.connectid);//开始监听
        const alarm3 = result[0];
        const alarm2 = result[1];
        const alarm1 = result[2];
        const countonline = result[3];
        const counttotal = result[4];
        const countalarm3 = result[5];
        const countalarm2 = result[6];
        const countalarm1 = result[7];
        callback({
          cmd:'querydevicealarm_result',
          payload:{
            alarm3,
            alarm2,
            alarm1,
            countonline,
            counttotal,
            countalarm3,
            countalarm2,
            countalarm1
          }
        });
    });
    // debug(`device query ${JSON.stringify(query)}`);
    // const queryexec = deviceModel.find(query).sort({
    //   'LastRealtimeAlarm.DataTime':-1,
    // }).limit(1000).select(fields).lean();
    // debug(`device start exec`);
    // queryexec.exec((err,list)=>{
    //   if(!err){
    //     // debug(`device count:${list.length}`);
    //     debug(`querydevice loginuser_add:${ctx.userid},${ctx.connectid}`);
    //     srvsystem.loginuser_add(ctx.userid,ctx.connectid);//开始监听
    //     callback({
    //       cmd:'querydevice_result',
    //       payload:{list}
    //     });
    //   }
    //   else{
    //     callback({
    //       cmd:'common_err',
    //       payload:{errmsg:err.message,type:'querydevice'}
    //     });
    //   }
    // });
  });
}
