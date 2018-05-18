const DBModels = require('../db/models.js');
const PubSub = require('pubsub-js');
const _ = require('lodash');
const requestIp = require('request-ip');
const moment  = require('moment');
const async = require('async');
const middlewareauth = require('./middlewareauth.js');
const debug = require('debug')('srvapp:gw');
require('es6-promise').polyfill();
require('isomorphic-fetch');

const startuploader = (app)=>{
  const gwget = (req,res)=>{
      const jsonbody = req.body;
      debug(`gwget===>DeviceId==>${jsonbody.DeviceId}`);

      const url = `http://222.66.141.6:8000/DemoService/DeviceConfigQuery/${jsonbody.DeviceId}`;
      return fetch(url).then((res)=>{
        return res.json();
      }).then((json)=> {
        debug(`get json===>${JSON.stringify(json)}`);
        if(json.length > 0){
          const jsondata = json[0];
          const dbDevice = DBModels.DeviceModel;
          dbDevice.findOneAndUpdate({DeviceId:jsonbody.DeviceId},{$set:{GWSetting:jsondata}},{new:true,upsert:true}).lean().exec((err,result)=>{
            res.status(200)
                   .json({
              result:'OK',
              data:{
                    issuccess:true,
                }
            });
          });
        }
        else{
          res.status(200)
                 .json({
            result:'error',
            message:'错误'
          });
        }

      }).catch((e)=>{
        console.log(e);
        res.status(200)
               .json({
          result:'error',
          message:'错误'
        });
      });
  };
  app.post('/gwget',middlewareauth,gwget);

  app.post('/gwset',middlewareauth,(req,res)=>{
      const jsonbody = req.body;
      const DeviceId = _.get(jsonbody,'DeviceId');
      const DataInterval  = _.get(jsonbody,'DataInterval');
      const SendInterval  = _.get(jsonbody,'SendInterval');
      debug(`gwset===>${DeviceId}===>${DataInterval}===>${SendInterval}`);
      if(!DeviceId || !DataInterval || !SendInterval){
        res.status(200)
               .json({
          result:'error',
        });
        return;
      }
      const postdata = {
        DeviceId,
        DataInterval,
        SendInterval
      }
      debug(`gwset===>postdata===>${JSON.stringify(postdata)}`);
      const url = `http://222.66.141.6:8000/DemoService/DeviceConfigSet/"DeviceId":"${postdata.DeviceId}","DataInterval":${postdata.DataInterval},"SendInterval":${postdata.SendInterval}`;
      debug(`url===>${url}`);
      return fetch(url).then((res)=>{
        console.log(res);
        console.log(res);
        return res.json();
      }).then((json)=> {
        console.log(json);
        gwget(req,res);
      }).catch((e)=>{
        console.log(e);
        res.status(200)
               .json({
          result:'error',
        });
      });
  });
};

  module.exports= startuploader;
