const DBModels = require('../db/models.js');
const PubSub = require('pubsub-js');
const _ = require('lodash');
const requestIp = require('request-ip');
const moment  = require('moment');
const async = require('async');
const middlewareauth = require('./middlewareauth.js');
const debug = require('debug')('srvapp:uploadexcel');

const startuploader = (app)=>{
  app.post('/deviceextimport',middlewareauth,(req,res)=>{
    const exceljson = req.body;
    const userid = req.userid;
    let deviceids_success = [];
    let deviceids_notfound = [];
  
    let asyncfnsz = [];
    _.map(exceljson,(devicedata)=>{
      const DeviceId = devicedata[`DeviceId`];
      const fn = (callbackfn)=>{
        const dbDevice = DBModels.DeviceExtModel;
        dbDevice.findOneAndUpdate({DeviceId},{$set:devicedata},{new:true,upsert:true}).lean().exec((err,result)=>{
          deviceids_success.push(DeviceId);
          callbackfn(err,result);
        });
      }
      asyncfnsz.push(fn);
    });
  
  
    async.parallel(asyncfnsz,(err,resultlist)=>{
      if(!err){
        const resultstring = `成功导入${deviceids_success.length}条`;
        const userlog = {
          remoteip:requestIp.getClientIp(req) || '',
          creator:userid,
          created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
          logtxt:`导入客档信息,结果${resultstring}`
        };
        PubSub.publish('userlog_data',userlog);
  
        res.status(200)
               .json({
          result:'OK',
          data:{
                issuccess:true,
                successlist:deviceids_success,
                failedlist:deviceids_notfound,
            }
        });
      }
      else{
        res.status(200)
               .json({
          result:'error',
          message:'导入错误'
        });
      }
    });
  });

};

  module.exports= startuploader;