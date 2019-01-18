const DBModels = require('../db/models.js');
const PubSub = require('pubsub-js');
const mongoose = require('mongoose');
const _ = require('lodash');
const requestIp = require('request-ip');
const moment  = require('moment');
const async = require('async');
const middlewareauth = require('./middlewareauth.js');
const debug = require('debug')('srvapp:uploadexcel');
const winston = require('../log/log.js');

 PubSub.subscribe('setimportstatus', ( msg, data )=>{
   debug(data);
   const query = data.query;
   const updatedData = data.updatedData;
   const dbModel = DBModels.ImportStatusModel;
   dbModel.findOneAndUpdate(query,updatedData,{new:true,upsert:true}).lean().exec((err,result)=>{
   });
 });


const handle_deviceextimport = (importid,exceljson,userid,remoteip,callbackfnresult)=>{
  let deviceids_success = [];
  let deviceids_notfound = [];
  let asyncfnsz = [];
  _.map(exceljson,(devicedata,index)=>{
    //db.deviceexts.update({type:'ESV'},{$set:{type:'CONTAINERTRUCK'}},{multi:true});
    //db.deviceexts.update({type:'ESS'},{$set:{type:'ENERGYTRUCK'}},{multi:true});
    // EBUS->BUS
    // ECAR->CAR
    // ESV-> ??物流车 ->
    // ESS-> ??储能柜 ->
    //"type" : "BUS",
    if(devicedata.type === 'EBUS'){
      devicedata.type = 'BUS';
    }
    if(devicedata.type === 'ECAR'){
      devicedata.type = 'CAR';
    }
    if(devicedata.type === 'ESV'){
      devicedata.type = 'CONTAINERTRUCK';
    }
    if(devicedata.type === 'ESS'){
      devicedata.type = 'ENERGYTRUCK';
    }
    if(index === 0){
      winston.getlog().info(`获取一条数据,:${JSON.stringify(devicedata)}`)
    }
    const DeviceId = devicedata[`DeviceId`];
    const batterysystemflownumber = devicedata[`batterysystemflownumber`];
    const fn = (callbackfn)=>{
      const dbDeviceExt = DBModels.DeviceExtModel;
      if(!!DeviceId && DeviceId !== ''){
        dbDeviceExt.findOneAndUpdate({DeviceId},{$set:devicedata},{new:true,upsert:true}).lean().exec((err,result)=>{
          deviceids_success.push(DeviceId);

          const dbDevice = DBModels.DeviceModel;
          dbDevice.findOneAndUpdate({DeviceId},{$set:{deviceextid:result._id}},{new:true,upsert:true}).lean().exec((err,result)=>{
            PubSub.publish('setimportstatus',{
              query:{_id:importid},
              updatedData : {
                '$inc':{
                  current:1,
                  success:1,
                }
              }
            });
            callbackfn(err,result);
          });

        });
      }
      else{
        dbDeviceExt.findOneAndUpdate({batterysystemflownumber},{$set:devicedata},{new:true,upsert:true}).lean().exec((err,result)=>{
          deviceids_success.push(batterysystemflownumber);
          PubSub.publish('setimportstatus',{
            query:{_id:importid},
            updatedData : {
              '$inc':{
                current:1,
                success:1,
                emptyid:1
              }
            }
          });
          callbackfn(err,result);
        });
      }
    }
    asyncfnsz.push(fn);
  });


  async.parallelLimit(asyncfnsz,100,(err,resultlist)=>{
    if(!err){
      const resultstring = `成功导入${deviceids_success.length}条`;
      const userlog = {
        remoteip,
        creator:userid,
        created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        logtxt:`导入客档信息,结果${resultstring}`
      };
      PubSub.publish('userlog_data',userlog);
      PubSub.publish('setimportstatus',{
        query:{_id:importid},
        updatedData : {
          '$set':{
            status:'finished',
          }
        }
      });

      winston.getlog().info(`--->导入成功,:${resultstring}`)
      callbackfnresult(null,{
        result:'OK',
        data:{
              issuccess:true,
              successlist:deviceids_success,
              failedlist:deviceids_notfound,
          }
      });
    }
    else{
      PubSub.publish('setimportstatus',{
        query:{_id:importid},
        updatedData : {
          '$set':{
            status:'error',
          }
        }
      });
      winston.getlog().info(`--->导入错误,${JSON.stringify(err)}`);
      callbackfnresult(null,{
        result:'error',
        message:'导入错误'
      });
    }
  });
}

const dodeviceextimport = (req,res)=>{
  const exceljson = req.body;
  const userid = req.userid;
  const remoteip = requestIp.getClientIp(req) || '';
  // res.status(200)
  //        .json(上传成功);
  const importid = new mongoose.mongo.ObjectID();
  debug(`importid-->${importid}`);
  PubSub.publish('setimportstatus',{
    query:{_id:importid},
    updatedData : {
      '$setOnInsert':{
        status:'start',
        total:exceljson.length,
        current:0,
        success:0,
        access:0,
      }
    }
  });
  handle_deviceextimport(importid,exceljson,userid,remoteip,(err,jsonresult)=>{
    winston.getlog().info(`--->导入完毕`)
  });

  res.status(200)
         .json({
           result:'OK',
           data:{
                 issuccess:true,
                 id:importid,
             }
         });
}

const getDevice = (callbackfn)=>{
  const deviceModel = DBModels.DeviceModel;
  deviceModel.find({},{
    'DeviceId':1,
  }).lean().exec((err,result)=>{
    rlst = [];
    if(!err && !!result){
      _.map(result,(item)=>{
        rlst.push(item.DeviceId);
      });
    }
    callbackfn(rlst);
  });
}

const startuploader = (app)=>{
  app.post('/deviceextimport2',middlewareauth,(req,res)=>{
    //check deviceids
    debug(`start deviceextimport`)
    winston.getlog().info(`--->deviceextimport 开始导入`)
    getDevice((deviceids)=>{
      debug(`getDevice--->${deviceids.length}`)
      //check provinces
      const provincenames =[
        '北京','上海','天津','重庆','河北',
        '山西','内蒙古','黑龙江','吉林','辽宁','陕西','甘肃','青海',
        '新疆','宁夏','山东','河南','江苏','浙江','安徽','江西','福建',
        '台湾','湖北','湖南','广东','广西','海南','四川','云南','贵州',
        '西藏','香港','澳门'
      ];
      const exceljson = req.body;
      let issuccess = true;
      let errmessage = '';
      for(let i = 0 ;i < exceljson.length; i++){
        const devicedata = exceljson[i];
        const DeviceId = devicedata[`DeviceId`];
        const province = devicedata[`province`];
        // if(!!DeviceId && DeviceId !== ''){
        //   if(_.indexOf(deviceids, DeviceId) === -1){
        //     errmessage = `${DeviceId}不存在,${i}条记录`;
        //     issuccess = false;
        //     break;
        //   }
        // }
        if(_.indexOf(provincenames, province) === -1){
          issuccess = false;
          errmessage = `【${DeviceId}】【${province}】非法,只能是:'北京','上海','天津','重庆','河北',\
'山西','内蒙古','黑龙江','吉林','辽宁','陕西','甘肃','青海',\
'新疆','宁夏','山东','河南','江苏','浙江','安徽','江西','福建',\
'台湾','湖北','湖南','广东','广西','海南','四川','云南','贵州',\
'西藏','香港','澳门' 之一`;
          errmessage+=JSON.stringify(devicedata)
          break;
        }
      }

      if(issuccess){
        dodeviceextimport(req,res);
      }
      else{
        res.status(200)
               .json({
          result:'error',
          message:`导入错误,原因:${errmessage}`,
        });
        winston.getlog().info(`导入错误,原因:${errmessage}`)
      }
    });
  });

  const getimportstatus  = (req,res)=>{
    const query = {_id:req.params.id};
    const dbModel = DBModels.ImportStatusModel;
    dbModel.findOneAndUpdate(query,{'$inc':{access:1}},{new:true,upsert:true}).lean().exec((err,result)=>{
      if(!err){
        res.status(200)
               .json({
          result:'OK',
          data:result
        });
      }
      else{
        debug(err);
        res.status(200)
               .json({
           result:'error',
           message:`获取状态错误`,
        });
      }
    });
  }

  app.post('/getdeviceextimportstatus/:id',getimportstatus);
  app.get('/getdeviceextimportstatus/:id',getimportstatus);

};

  module.exports= startuploader;
