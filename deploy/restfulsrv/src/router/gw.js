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
      debug(`gwget===>${JSON.stringify(jsonbody)}`);

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
      debug(`gwset===>${JSON.stringify(jsonbody)}`);
      const url = `http://222.66.141.6:8000/DemoService/DeviceConfigQuery/${jsonbody.DeviceId}`;
      return fetch(url).then((res)=>{
        return res.json();
      }).then((json)=> {
        gwget(req,res);
      }).catch((e)=>{
        res.status(200)
               .json({
          result:'error',
        });
      });
  });
};

  module.exports= startuploader;
