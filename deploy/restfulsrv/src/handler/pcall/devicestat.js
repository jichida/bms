const config = require('../../config.js');
const DBModels = require('../../db/models.js');
const mongoose  = require('mongoose');
const winston = require('../../log/log.js');
const _ = require('lodash');
const moment = require('moment');
const debug = require('debug')('srvapp:devicestat');
const async = require('async');
//获取统计：
// 1、统计函数：
// 在线数量、非在线数量、一级报警、二级报警、三级报警数量、消息数（报警数量总和）
//1、根据last_warninglevel分组
// 2、获取省统计(list)<--仅个数
// 3、获取市统计(list) <--

/*
性能：13万记录执行0.2秒
db.getCollection('devices').aggregate([
     {$match:{}},
     {$group: {
         _id: '$last_warninglevel',
         count: { $sum: 1 },
     }
   }])
*/



const getdevicestat_warninglevel = (query,ctx,callbackfn)=>{
  const deviceModel = DBModels.DeviceModel;
  deviceModel.aggregate([
       {$match:query},
       {$group: {
           _id: '$last_warninglevel',
           count: { $sum: 1 },
       }
     }]).exec((err, list)=> {
       let count_all = 0;
       let count_yellow = 0;
       let count_red = 0;
       let count_orange = 0;

       if(!err && !!list){
         for(let i = 0;i < list.length ;i++){
           if(list[i]._id === '高'){
             count_red = list[i].count;
           }
           if(list[i]._id === '中'){
             count_orange = list[i].count;
           }
           if(list[i]._id === '低'){
             count_yellow = list[i].count;
           }
         }
       }
       count_all = count_red + count_orange + count_yellow;
       callbackfn(err,{count_all,count_red,count_orange,count_yellow});
   });
}


/*
性能：13万记录执行0.3~0.4秒
db.getCollection('devices').aggregate([
     {$match:{}},
     {
       $project:
         {
           isonline:
             {
               $cond: { if: { $gte: [ "$last_GPSTime", "2019-01-23 09:00:00" ] }, then: true, else: false }
             }
         }
     },
     {$group: {
         _id: '$isonline',
         count: { $sum: 1 },
     }
   }])
*/

const getdevicestat_online = (query,ctx,callbackfn)=>{
  const SettingOfflineMinutes = _.get(ctx,'SettingOfflineMinutes',20);
  const oldMomentString = moment().subtract(SettingOfflineMinutes,'minutes').format('YYYY-MM-DD HH:mm:ss');

  const deviceModel = DBModels.DeviceModel;
  deviceModel.aggregate([
       {$match:query},
       {
         $project:
           {
             isonline:
               {
                 $cond: { if: { $gte: [ "$last_GPSTime", oldMomentString ] }, then: true, else: false }
               }
           }
       },
       {$group: {
           _id: '$isonline',
           count: { $sum: 1 },
       }
     }]).exec((err, list)=> {
       debug(list);
       if(!err && !!list){
         let count_online = 0;
         let count_offline = 0;
         for(let i=0;i < list.length;i++){
           if(list[i]._id === false){
             count_offline = list[i].count;
           }
           if(list[i]._id === true){
             count_online = list[i].count;
           }
         }
         callbackfn(err,{
           count_online,
           count_offline
         });
       }
   });
}

/*
统计各省的数据个数（0.1s)，加上id，变成1.19秒，34条数据
db.getCollection('devicecities').aggregate([
     {$match:{}},
     {$group: {
         _id: '$province',
         deviceids: { $addToSet: "$deviceid" },
         targetadcode:{ $first: "$targetadcode" },
         count: { $sum: 1 },
     }
   }])


//0.079，20条记录
db.getCollection('devicecities').aggregate([
    {$match:{"province" : "四川省"}},
    {$group: {
        _id: '$citycode',
        count: { $sum: 1 },
    }
  }])

//

*/
const convertRecord = (rc)=>{
  const getAddress = (adcode)=>{
    let address = adcode;
    if(typeof address === 'string'){
      address = parseInt(address);
    }
    const addressnew = Math.floor(address/10000);
    const retv = addressnew*10000;
    return parseInt(retv);
  }

  if(!!rc._id && !!rc.targetadcode && rc.targetadcode !== '0'){
    return {
      name:rc._id,
      adcode:getAddress(rc.targetadcode),
      deviceids:rc.deviceids
    }
  }
}

//2s
const getdevicestat_provincelist = (query,ctx,callbackfn)=>{
  const deviceModel = DBModels.DeviceCityModel;
  deviceModel.aggregate([
       {$match:query},
       {$group: {
         _id: '$province',
         deviceids: { $addToSet: "$deviceid" },
         targetadcode:{ $first: "$targetadcode" },
         count: { $sum: 1 },
       }
     }]).exec((err, list)=> {

       //[ { _id: null, deviceids: [], targetadcode: null, count: 128264 } ]
       let listnewrc = [];
       if(!err && !!list){
         let fnsz = [];
         for(let i = 0 ;i < list.length;i++){
           const newrc = convertRecord(list[i]);
           if(!!newrc){
             listnewrc.push(newrc);
           }
         }

         for(let i = 0 ;i < listnewrc.length;i++){
           // debug(listnewrc);
           const newrc = listnewrc[i];
           fnsz.push((callbackfn)=>{
              getdevicestat_online({_id:{$in:newrc.deviceids}},ctx,(err,{
                count_online,count_offline})=>{
                callbackfn(err,{
                  name:newrc.name,
                  adcode:`${newrc.adcode}`,
                  count_total:newrc.deviceids.length,
                  count_online,
                  count_offline
                });
              })
           });
         }

         debug(moment().format('YYYY-MM-DD HH:mm:ss'));
         async.parallel(fnsz,(err,result)=>{
           debug(moment().format('YYYY-MM-DD HH:mm:ss'));
           callbackfn(err,result);
         });
      }
   });
/*
srvapp:devicestat   { name: '甘肃省',
srvapp:devicestat     adcode: '620000',
srvapp:devicestat     count_total: 1605,
srvapp:devicestat     count_online: 1262,
srvapp:devicestat     count_offline: 343 }
*/
}

const getdevicestat_citylist = (query,ctx,callbackfn)=>{
  const deviceModel = DBModels.DeviceCityModel;
  deviceModel.aggregate([
       {$match:query},
       {$group: {
         _id: '$citycode',
         deviceids: { $addToSet: "$deviceid" },
         adcode:{ $first: "$targetadcode" },
         name:{ $first: "$city" },
         count: { $sum: 1 },
       }
     }]).exec((err, list)=> {
       debug(list);
       //[ { _id: '0941', deviceids: [], count: 128264 } ]
       let listnewrc = [];
       if(!err && !!list){
         let fnsz = [];
         for(let i = 0 ;i < list.length;i++){
           const newrc = list[i];
           if(!!newrc){
             listnewrc.push(newrc);
           }
         }

         for(let i = 0 ;i < listnewrc.length;i++){
           // debug(listnewrc);
           const newrc = listnewrc[i];
           fnsz.push((callbackfn)=>{
              getdevicestat_online({_id:{$in:newrc.deviceids}},ctx,(err,{
                count_online,count_offline})=>{
                callbackfn(err,{
                  citycode:newrc._id,
                  name:newrc.name,
                  adcode:`${newrc.adcode}`,
                  count_total:newrc.deviceids.length,
                  count_online,
                  count_offline
                });
              })
           });
         }

         debug(moment().format('YYYY-MM-DD HH:mm:ss'));
         async.parallel(fnsz,(err,result)=>{
           debug(moment().format('YYYY-MM-DD HH:mm:ss'));
           callbackfn(err,result);
         });
      }
   });
}

// srvapp:devicestat   { citycode: '0931',
// srvapp:devicestat     name: '兰州市',
// srvapp:devicestat     adcode: '620100',
// srvapp:devicestat     count_total: 312,
// srvapp:devicestat     count_online: 219,
// srvapp:devicestat     count_offline: 93 },

const getdevicestat_cityinfo = (query,ctx,callbackfn)=>{
  const deviceModel = DBModels.DeviceCityModel;
  const fields = {
    'deviceid':1,
    'citycode':1,
    'adcode':1,
    'province':1,
    'city':1,
  };
  // query = {"citycode" : "0831"};
  deviceModel.find(query).select(fields).populate([
    {
      path: 'deviceid',
      model: 'device',
      select: 'DeviceId last_Latitude last_Longitude last_GPSTime ',
    }
  ]).lean().exec((err,result)=>{
    callbackfn(err,result);
  });
}

/*
0.099s
0.153s
统计各市的区的个数
db.getCollection('devicecities').aggregate([
     {$match:{"citycode" : "021"}},
     {$group: {
       _id: '$adcode',
       adcode:{ $first: "$adcode" },
       name:{ $first: "$district" },
       count: { $sum: 1 },
     }
   }])
*/
const getdevicestat_arealist = (query,ctx,callbackfn)=>{
  const deviceModel = DBModels.DeviceCityModel;
  deviceModel.aggregate([
       {$match:query},
       {$group: {
         _id: '$adcode',
         deviceids: { $addToSet: "$deviceid" },
         adcode:{ $first: "$adcode" },
         name:{ $first: "$district" },
         count: { $sum: 1 },
       }
     }]).exec((err, list)=> {
       debug(list);
       //[ {
//     "_id" : "310109",
//     "adcode" : "310109",
//     "name" : "虹口区",
//     "count" : 20.0
// } ]
       let listnewrc = [];
       if(!err && !!list){
         let fnsz = [];
         for(let i = 0 ;i < list.length;i++){
           const newrc = list[i];
           if(!!newrc){
             listnewrc.push(newrc);
           }
         }

         for(let i = 0 ;i < listnewrc.length;i++){
           // debug(listnewrc);
           const newrc = listnewrc[i];
           fnsz.push((callbackfn)=>{
              getdevicestat_online({_id:{$in:newrc.deviceids}},ctx,(err,{
                count_online,count_offline})=>{
                callbackfn(err,{
                  name:newrc.name,
                  adcode:`${newrc.adcode}`,
                  count_total:newrc.deviceids.length,
                  count_online,
                  count_offline
                });
              })
           });
         }

         debug(moment().format('YYYY-MM-DD HH:mm:ss'));
         async.parallel(fnsz,(err,result)=>{
           debug(moment().format('YYYY-MM-DD HH:mm:ss'));
           callbackfn(err,result);
         });
      }
   });
}

const getdevicestat = (actiondata,ctx,callback)=>{
  const query = actiondata.query || {};
  let fnsz = [];
  fnsz.push((callbackfn)=>{
    getdevicestat_warninglevel(query,ctx,callbackfn);
  });
  fnsz.push((callbackfn)=>{
    getdevicestat_online(query,ctx,callbackfn);
  });
  async.parallel(fnsz,(err,result)=>{
    // debug(result);
    if(!err && !!result){
      const countwarninglevel = result[0];
      const countonline = result[1];
      let r = {
        count_all:countwarninglevel.count_all,
        count_red:countwarninglevel.count_red,
        count_orange:countwarninglevel.count_orange,
        count_yellow:countwarninglevel.count_yellow,
        count_online:countonline.count_online,
        count_offline:countonline.count_offline,
      }
      callback({
        cmd:'getdevicestat_result',
        payload:r
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:'发生错误',type:'getdevicestat'}
      });
    }
  });
}

const getdevicestatprovinces = (actiondata,ctx,callback)=>{
  const query = actiondata.query || {};
  getdevicestat_provincelist(query,ctx,(err,result)=>{
    if(!err && !!result){
      callback({
        cmd:'getdevicestatprovinces_result',
        payload:result
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:'发生错误',type:'getdevicestatprovinces'}
      });
    }
  });
}

const getdevicestatcities = (actiondata,ctx,callback)=>{
  const query = {province:actiondata.provinceinfo.name};
  getdevicestat_citylist(query,ctx,(err,result)=>{
    if(!err && !!result){
      callback({
        cmd:'getdevicestatcities_result',
        payload:{
          name:actiondata.provinceinfo.name,
          adcode:actiondata.provinceinfo.adcode,
          result
        }
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:'发生错误',type:'getdevicestatcities'}
      });
    }
  });
}

const getdevicestatareas = (actiondata,ctx,callback)=>{
  const query = {
    citycode:actiondata.cityinfo.citycode
  };
  getdevicestat_arealist(query,ctx,(err,result)=>{
    if(!err && !!result){
      callback({
        cmd:'getdevicestatareas_result',
        payload:{
          provinceadcode:actiondata.cityinfo.provinceadcode,
          cityadcode:actiondata.cityinfo.adcode,
          citycode:actiondata.cityinfo.citycode,
          adcode:actiondata.cityinfo.adcode,
          result
        }
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:'发生错误',type:'getdevicestatareas'}
      });
    }
  });
}

const getdevicestatareadevices =  (actiondata,ctx,callback)=>{
  const query = {
    adcode:`${actiondata.adcode}`
  };
  getdevicestat_cityinfo(query,ctx,(err,result)=>{
    if(!err && !!result){
      callback({
        cmd:'getdevicestatareadevices_result',
        payload:{
          provinceadcode:actiondata.provinceadcode,
          cityadcode:actiondata.cityadcode,
          adcode:actiondata.adcode,
          result
        }
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:'发生错误',type:'getdevicestatareadevices'}
      });
    }
  });
}


const getdevicestatcity = (actiondata,ctx,callback)=>{
  const query = {citycode:actiondata.cityinfo.citycode};
  getdevicestat_cityinfo(query,ctx,(err,result)=>{
    if(!err && !!result){
      callback({
        cmd:'getdevicestatcity_result',
        payload:{
          provinceadcode:actiondata.provinceadcode,
          citycode:actiondata.cityinfo.citycode,
          cityadcode:actiondata.cityinfo.adcode,
          result
        }
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:'发生错误',type:'getdevicestatcity'}
      });
    }
  });
}

exports.getdevicestat = getdevicestat;
exports.getdevicestatprovinces = getdevicestatprovinces;
exports.getdevicestatcities = getdevicestatcities;
exports.getdevicestatareas = getdevicestatareas;
exports.getdevicestatcity = getdevicestatcity;
exports.getdevicestatareadevices = getdevicestatareadevices;
