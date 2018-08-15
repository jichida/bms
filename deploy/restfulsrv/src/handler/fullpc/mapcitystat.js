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
const getdevicecities = (callbackfn)=>{
  console.log(`start getdevicecities`)
  const deviceModel = DBModels.DeviceCityModel;
  const fields = {
    'deviceid':1,
    'citycode':1,
    'adcode':1,
    'province':1,
    'city':1,
  };
  let query = {};
  // query = {"citycode" : "0831"};
  deviceModel.find(query).select(fields).populate([
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

const getgroupedresult = (listresult,callbackfn)=>{
  const groupedlist = _.groupBy(listresult,(o)=>{
    return o.citycode;
  });

  let listresult_grouped = [];
  _.map(groupedlist,(v,k)=>{
    let typelist = _.groupBy(v,(o)=>{
      return o.type;
    });
    if(v.length > 0){
      let resultinfo = {
        citycode:_.get(v[0],'citycode',''),
        adcode:_.get(v[0],'adcode',''),
        province:_.get(v[0],'province',''),
        city:_.get(v[0],'city',''),
        BUS:0,
        CAR:0,
        ENERGYTRUCK:0,
        CONTAINERTRUCK:0
      };
      _.map(typelist,(vtype,ktype)=>{
        if(ktype === 'UNKNOW'){
          resultinfo[config.defaultTypeUnknow] = resultinfo[config.defaultTypeUnknow]+vtype.length;
        }
        else{
          resultinfo[ktype] = vtype.length;
        }
      });
      listresult_grouped.push(resultinfo);
    }
  });

  callbackfn(listresult_grouped);
}

exports.querymapstat = (actiondata,ctx,callback)=>{
  callback({
    cmd:'querymapstat_result',
    payload:config.listresult_grouped
  });
}

exports.getmapstat = (callback)=>{
    getdevicecities((listresult)=>{
      getgroupedresult(listresult,(listresult_grouped)=>{
        callback(listresult_grouped);
      });
    });
};
