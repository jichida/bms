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



const getdevicestat_warninglevel = ()=>{
  const deviceModel = DBModels.DeviceModel;
  deviceModel.aggregate([
       {$match:query},
       {$group: {
           _id: '$last_warninglevel',
           count: { $sum: 1 },
       }
     }]).exec((err, list)=> {
       debug(list);
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
               $cond: { if: { $gte: [ "$LastRealtimeAlarm.DataTime", "2019-01-23 09:00:00" ] }, then: true, else: false }
             }
         }
     },
     {$group: {
         _id: '$isonline',
         count: { $sum: 1 },
     }
   }])
*/

const getdevicestat_online = (query,callbackfn)=>{
  const deviceModel = DBModels.DeviceModel;
  deviceModel.aggregate([
       {$match:query},
       {
         $project:
           {
             isonline:
               {
                 $cond: { if: { $gte: [ "$LastRealtimeAlarm.DataTime", "2019-01-23 09:00:00" ] }, then: true, else: false }
               }
           }
       },
       {$group: {
           _id: '$isonline',
           count: { $sum: 1 },
       }
     }]).exec((err, list)=> {
       // debug(list);
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
    const addressnew = Math.floor(address/1000);
    const retv = addressnew*1000;
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
const getdevicestat_provincelist = ()=>{
  const query = {};
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
              getdevicestat_online({_id:{$in:newrc.deviceids}},(err,{
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
           debug(result);
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

const getdevicestat_citylist = (provinceinfo)=>{
  const query = {province:provinceinfo.name};
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
              getdevicestat_online({_id:{$in:newrc.deviceids}},(err,{
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
           debug(result);
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

const getdevicestat_cityinfo = (cityinfo)=>{
  const query = {citycode:cityinfo.citycode};
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
    debug(result);
  });
  // deviceModel.aggregate([
  //      {$match:query},
  //      {$group: {
  //        _id: '$citycode',
  //        deviceids: { $addToSet: "$deviceid" },
  //        adcode:{ $first: "$targetadcode" },
  //        name:{ $first: "$city" },
  //        count: { $sum: 1 },
  //      }
  //    }]).exec((err, list)=> {
  //      debug(list);
  //      //[ { _id: '0941', deviceids: [], count: 128264 } ]
  //      let listnewrc = [];
  //      if(!err && !!list){
  //        let fnsz = [];
  //        for(let i = 0 ;i < list.length;i++){
  //          const newrc = list[i];
  //          if(!!newrc){
  //            listnewrc.push(newrc);
  //          }
  //        }
  //
  //        for(let i = 0 ;i < listnewrc.length;i++){
  //          // debug(listnewrc);
  //          const newrc = listnewrc[i];
  //          fnsz.push((callbackfn)=>{
  //             getdevicestat_online({_id:{$in:newrc.deviceids}},(err,{
  //               count_online,count_offline})=>{
  //               callbackfn(err,{
  //                 citycode:newrc._id,
  //                 name:newrc.name,
  //                 adcode:`${newrc.adcode}`,
  //                 count_total:newrc.deviceids.length,
  //                 count_online,
  //                 count_offline
  //               });
  //             })
  //          });
  //        }
  //
  //        debug(moment().format('YYYY-MM-DD HH:mm:ss'));
  //        async.parallel(fnsz,(err,result)=>{
  //          debug(moment().format('YYYY-MM-DD HH:mm:ss'));
  //          debug(result);
  //        });
  //     }
  //  });
}

exports.getdevicestat_provincelist = getdevicestat_provincelist;
exports.getdevicestat_citylist = getdevicestat_citylist;
exports.getdevicestat_cityinfo = getdevicestat_cityinfo;
