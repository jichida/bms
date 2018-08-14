const config = require('../../config.js');
const DBModels = require('../../db/models.js');
const mongoose  = require('mongoose');
const winston = require('../../log/log.js');
const _ = require('lodash');
const moment = require('moment');
const debug = require('debug')('srvapp:device');
const oldyears = moment().subtract(10,'years').format('YYYY');
const async = require('async');
debug(`10年以前是:${oldyears}`);

/*
db.getCollection('devicecities').find({},{
  'deviceid':1,
  'citycode':1,
  'adcode':1,
  'province':1,
  'city':1,
}).populate([
  {
    path: 'deviceid',
    model: 'device',
    select:'DeviceId deviceextid',
    populate: [
      {
        path: 'deviceextid',
        model: 'deviceext',
        select:'type'
      }
    ]
  }
])
*/
exports.querymapcitystat = (actiondata,ctx,callback)=>{
    const getdevicecities = (callbackfn)=>{
      console.log(`start getdevicecities`)
      const deviceModel = DBModels.DeviceCityModel;
      const fields = actiondata.fields || {
        'deviceid':1,
        'citycode':1,
        'adcode':1,
        'province':1,
        'city':1,
      };
      //{"citycode" : "0831"}
      deviceModel.find({}).select(fields).populate([
        {
          path: 'deviceid',
          model: 'device',
          select: 'deviceextid DeviceId',
          populate: [
            {
              path: 'deviceextid',
              model: 'deviceext',
              select:'type'
            }
          ]
        }
      ]).lean().exec((err,result)=>{
        let listresult = [];
        _.map(result,(info)=>{
          listresult.push({
            DeviceId:_.get(info,'deviceid.DeviceId',''),
            citycode:_.get(info,'citycode',''),
            adcode:_.get(info,'adcode',''),
            province:_.get(info,'province',''),
            city:_.get(info,'city',''),
            type:_.get(info,'deviceid.deviceextid.type','UNKNOW')
          });
        });
        callbackfn(listresult);
      });

    };

    getdevicecities((listresult)=>{
      callback(listresult);
    });
};
