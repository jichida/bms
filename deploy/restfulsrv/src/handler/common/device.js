const config = require('../../config.js');
const DBModels = require('../../db/models.js');
const mongoose  = require('mongoose');
const winston = require('../../log/log.js');
const coordtransform = require('coordtransform');
const _ = require('lodash');
const moment = require('moment');
const getdevicesids = require('../getdevicesids');
const debug = require('debug')('srvapp:device');
const srvsystem = require('../../srvsystem.js');
//
// const getRandomLocation =  (latitude, longitude, radiusInMeters)=>{
//
//     var getRandomCoordinates =  (radius, uniform)=> {
//         // Generate two random numbers
//         var a = Math.random(),
//             b = Math.random();
//
//         // Flip for more uniformity.
//         if (uniform) {
//             if (b < a) {
//                 var c = b;
//                 b = a;
//                 a = c;
//             }
//         }
//
//         // It's all triangles.
//         return [
//             b * radius * Math.cos(2 * Math.PI * a / b),
//             b * radius * Math.sin(2 * Math.PI * a / b)
//         ];
//     };
//
//     var randomCoordinates = getRandomCoordinates(radiusInMeters, true);
//
//     // Earths radius in meters via WGS 84 model.
//     var earth = 6378137;
//
//     // Offsets in meters.
//     var northOffset = randomCoordinates[0],
//         eastOffset = randomCoordinates[1];
//
//     // Offset coordinates in radians.
//     var offsetLatitude = northOffset / earth,
//         offsetLongitude = eastOffset / (earth * Math.cos(Math.PI * (latitude / 180)));
//
//     // Offset position in decimal degrees.
//     let result = {
//         latitude: latitude + (offsetLatitude * (180 / Math.PI)),
//         longitude: longitude + (offsetLongitude * (180 / Math.PI))
//     }
//     return [result.longitude,result.latitude];
// };

const getalarmfromdevice = (device)=>{
  let alarminfo = {
    "key" : _.get(device,'DeviceId',''),
    "车辆ID" : _.get(device,'DeviceId',''),
    "报警时间" : _.get(device,'LastRealtimeAlarm.DataTime',''),
    "报警等级" : _.get(device,'warninglevel',''),
    "报警信息" : _.get(device,'alarmtxtstat',''),
  };
  return alarminfo;
}
exports.uireport_searchdevice =  (actiondata,ctx,callback)=>{
  // "key" : "",
  // "车辆ID" : "",
  // "报警时间" : "",
  // "报警等级" : "",
  // "报警信息" : "绝缘故障",
  // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
  const deviceModel = DBModels.DeviceModel;
  let query = actiondata.query || {};
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds,isall})=>{
    if(!query.DeviceId && !isall){
      query.DeviceId = {'$in':deviceIds};
    }
    actiondata.options = actiondata.options || {};
    actiondata.options.lean = true;
    deviceModel.paginate(query,actiondata.options,(err,result)=>{
      if(!err){
        // result = JSON.parse(JSON.stringify(result));
        let docs = [];
        _.map(result.docs,(record)=>{
          docs.push(getalarmfromdevice(record));
        });
        result.docs = docs;
        callback({
          cmd:'uireport_searchdevice_result',
          payload:{result}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:err.message,type:'uireport_searchdevice'}
        });
      }
    });
  });
}

exports.querydevicegroup= (actiondata,ctx,callback)=>{
  let devicegroupModel = DBModels.DeviceGroupModel;
  let query = actiondata.query || {};
  debug(`querydevicegroup start getdevicesids`);
  const devicesfields =   actiondata.devicesfields ||
  'DeviceId last_Latitude last_Longitude last_GPSTime warninglevel LastRealtimeAlarm.DataTime alarmtxtstat';
  //   'DeviceId':1,
  //   'last_Latitude':1,
  //   'last_Longitude':1,
  //   'last_GPSTime':1,
  //   'warninglevel':1,
  //   'LastRealtimeAlarm.DataTime':1,
  //   'alarmtxtstat':1
  // };

  getdevicesids(ctx.userid,({devicegroupIds,deviceIds,isall})=>{
    if(!query._id && !isall){
      query._id = {'$in':devicegroupIds};
    }
    if(!query.systemflag){
      query.systemflag = 0;
    }
    debug(`querydevicegroup start exec`);
    devicegroupModel.find(query).populate([
        {path:'deviceids', select:devicesfields, model: 'device'},
    ]).lean().exec((err,list)=>{
      if(!err){
        debug(`querydevicegroup get list:${list.length}`);
        //for test only
        callback({
          cmd:'querydevicegroup_result',
          payload:{list}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:err.message,type:'querydevicegroup'}
        });
      }
    });
  });

}

exports.querydevice = (actiondata,ctx,callback)=>{
  const deviceModel = DBModels.DeviceModel;
  let query = actiondata.query || {};
  const fields = actiondata.fields || {
    'DeviceId':1,
    'last_Latitude':1,
    'last_Longitude':1,
    'last_GPSTime':1,
    'warninglevel':1,
    'LastRealtimeAlarm.DataTime':1,
    'alarmtxtstat':1,
    'PackNo_BMU':1
  };
  debug(`device start getdevicesids`);
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds,isall})=>{
    if(!query.DeviceId && !isall){
      query.DeviceId = {'$in':deviceIds};
    }
    // debug(`device query ${JSON.stringify(query)}`);
    const queryexec = deviceModel.find(query).select(fields).lean();
    debug(`device start exec`);
    queryexec.exec((err,list)=>{
      if(!err){
        // debug(`device count:${list.length}`);
        debug(`querydevice loginuser_add:${ctx.userid},${ctx.connectid}`);
        srvsystem.loginuser_add(ctx.userid,ctx.connectid);//开始监听
        callback({
          cmd:'querydevice_result',
          payload:{list}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:err.message,type:'querydevice'}
        });
      }
    });
  });
}

exports.querydeviceinfo =  (actiondata,ctx,callback)=>{
  let deviceModel = DBModels.DeviceModel;
  let query = actiondata.query || {};
  let fields = actiondata.fields || {};
  ////console.log(`fields-->${JSON.stringify(fields)}`);
  let queryexec = deviceModel.findOne(query,fields).populate([
    {
      path: 'deviceextid',
      model: 'deviceext',
    }]).lean();
  queryexec.exec((err,result)=>{
    if(!err && !!result){
      callback({
        cmd:'querydeviceinfo_result',
        payload:result
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'querydeviceinfo'}
      });
    }
  });
}

exports.querydeviceinfo_list = (actiondata,ctx,callback)=>{
  let deviceModel = DBModels.DeviceModel;
  let query = actiondata.query || {};
  let queryexec = deviceModel.find(query).lean();
  queryexec.exec((err,list)=>{
    if(!err){
      callback({
        cmd:'querydeviceinfo_list_result',
        payload:{list}
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'querydeviceinfo_list'}
      });
    }
  });
}

//获取的是设备完整信息
// exports.searchbattery = (actiondata,ctx,callback)=>{
//   let deviceModel = DBModels.DeviceModel;
//   let query = actiondata.query || {};
//   let fields = actiondata.fields || {
//     'DeviceId':1,
//     'last_Latitude':1,
//     'last_Longitude':1,
//     'last_GPSTime':1,
//     'LastRealtimeAlarm.warninglevel':1,
//   };
//
//   deviceModel.aggregate({$sample: {size: 50}}).exec((err,list)=>{
//     if(!err){
//       if(list.length > 0){
//         ////console.log(`-->${JSON.stringify(list[0])}`);
//       }
//       callback({
//         cmd:'searchbattery_result',
//         payload:{list}
//       });
//     }
//     else{
//       callback({
//         cmd:'common_err',
//         payload:{errmsg:err.message,type:'searchbattery_result'}
//       });
//     }
//   });

  //<-----处理query条件
  // let r = Math.random()*10000;
  // query = {};
  // ////console.log(`fields-->${JSON.stringify(fields)}`);
  // let queryexec = deviceModel.find(query).select(fields).limit(50).skip(r);
  // queryexec.exec((err,list)=>{
  //   if(!err){
  //     if(list.length > 0){
  //       ////console.log(`-->${JSON.stringify(list[0])}`);
  //     }
  //     callback({
  //       cmd:'searchbattery_result',
  //       payload:{list}
  //     });
  //   }
  //   else{
  //     callback({
  //       cmd:'common_err',
  //       payload:{errmsg:err.message,type:'searchbattery_result'}
  //     });
  //   }
  // });
// }

//模拟动态数据
exports.serverpush_devicegeo_sz  = (actiondata,ctx,callback)=>{
  let deviceModel = DBModels.DeviceModel;
  let query = actiondata.query || {};
  let fields = actiondata.fields || {
    'DeviceId':1,
    'last_Latitude':1,
    'last_Longitude':1,
    'last_GPSTime':1,
    'warninglevel':1
  };
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds,isall})=>{
      if(!query.DeviceId && !isall){
        query.DeviceId = {'$in':deviceIds};
      }
      if(!query.LastHistoryTrack){
        query.LastHistoryTrack = {$exists : true};
      }
      deviceModel.aggregate([
        {
          $match: query
        },
        {
          "$project": {
            'DeviceId':1,
            'last_Latitude':1,
            'last_Longitude':1,
            'last_GPSTime':1,
            'warninglevel':1
          }
        },]
      ).exec((err,list)=>{
        if(!err){
          let items = [];
          for(let i = 0;i < list.length; i++){
            let item = list[i];
            if(!!item.LastHistoryTrack){
              if(item.last_Latitude !== 0){
                // let locationsz = getRandomLocation(item.last_Latitude,item.last_Longitude,10*1000);
                // item.last_Latitude = locationsz[1];
                // item.last_Longitude  =  locationsz[0];
                let cor = [item.last_Longitude,item.last_Latitude];
                const wgs84togcj02=coordtransform.wgs84togcj02(cor[0],cor[1]);
                item.locz = wgs84togcj02;
                items.push({
                  'DeviceId':item.DeviceId,
                  'warninglevel':item.warninglevel || '',
                  'LastHistoryTrack':{
                    Latitude:item.last_Latitude,
                    Longitude:item.last_Longitude,
                    GPSTime:item.last_GPSTime,
                  },
                  'locz':wgs84togcj02,
                });
              }
            }
          };

          if(list.length > 0){
            ////console.log(`-->${JSON.stringify(list[0])},变化个数==>${items.length}`);
          }
          callback({
            cmd:'serverpush_devicegeo_sz_result',
            payload:{list:items}
          });
        }
        else{
          callback({
            cmd:'common_err',
            payload:{errmsg:err.message,type:'serverpush_devicegeo_sz_result'}
          });
        }
      });
    });
};

exports.uireport_searchcararchives = (actiondata,ctx,callback)=>{
  // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
  const deviceModel = DBModels.DeviceExtModel;
  const query = actiondata.query || {};
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds,isall})=>{
    if(!query.DeviceId && !isall){
      query.DeviceId = {'$in':deviceIds};
    }
    // //console.log(query);
    actiondata.options = actiondata.options || {};
    actiondata.options.lean = true;
    deviceModel.paginate(query,actiondata.options,(err,result)=>{
      if(!err){
        // result = JSON.parse(JSON.stringify(result));
        let docs = [];
        _.map(result.docs,(record)=>{
          docs.push(record);
        });

        callback({
          cmd:'uireport_searchcararchives_result',
          payload:{result}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:err.message,type:'uireport_searchcararchives'}
        });
      }
    });
  });
}
//保存设备数据
// exports.savedevice = (actiondata,ctx,callback)=>{
//   actiondata.updated_at = new Date();
//   let curdatatime = moment().format('YYYY-MM-DD HH:mm:ss');
//   try{
//      curdatatime = moment(actiondata.TPData.DataTime).format('YYYY-MM-DD HH:mm:ss');
//   }
//   catch(e){
//     ////console.log(`e==>${JSON.stringify(e)}`);
//   }
//   actiondata.TPData.DataTime = curdatatime;
//   ////console.log(`savedevice==>${JSON.stringify(actiondata)}`);
//
//   const deviceModel = DBModels.DeviceModel;
//   deviceModel.findOneAndUpdate({
//       DeviceId: actiondata.DeviceId,
//   },{$set:actiondata}, {new: true, upsert: true}, (err, updateditem)=> {
//     ////console.log(`deviceModel=>err:${JSON.stringify(err)},updateditem:${JSON.stringify(updateditem)}`);
//     callback(err,updateditem);
//   });
//
//   actiondata.LastHistoryTrack.updated_at= new Date();
//   actiondata.last_GPSTime = curdatatime;
//   actiondata.LastHistoryTrack.DeviceId = actiondata.DeviceId;
//   //插入历史记录
//   const historyTrackModel = DBModels.HistoryTrackModel;
//   historyTrackModel.findOneAndUpdate({
//       DeviceId: actiondata.DeviceId,
//       GPSTime:curdatatime
//   },{$set:actiondata.LastHistoryTrack}, {new: true, upsert: true}, (err, updateditem)=> {
//     ////console.log(`historyTrackModel=>err:${JSON.stringify(err)},updateditem:${JSON.stringify(updateditem)}`);
//     callback(err,updateditem);
//   });
// };


const bridge_deviceinfo = (deviceinfo)=>{
  let deviceinfonew = {};
  deviceinfonew[`key`] = deviceinfo._id;
  deviceinfonew[`车辆ID`] = deviceinfo[`DeviceId`];
  deviceinfonew[`更新时间`] = deviceinfo[`UpdateTime`];
  deviceinfonew[`设备类型`] = deviceinfo[`DeviceType`];
  deviceinfonew[`序列号`] = deviceinfo[`SN64`];

  return deviceinfonew;
};

exports.bridge_deviceinfo =  bridge_deviceinfo;
