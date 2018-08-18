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
    debug(`listresult-->${listresult.length}`)
    callbackfn(listresult);
  });

};

const getgroupedresult = (listresult,callbackfn)=>{
  const groupedmaplist = _.groupBy(listresult,(o)=>{
    return o.citycode;
  });
  // debug(`groupedlist-->${JSON.stringify(groupedmaplist)}`)
  let listresult_grouped = [];//return ret list
  _.map(groupedmaplist,(vlist,k)=>{
    let resultinfo ;
    if(vlist.length > 0){//v-->list
       resultinfo = {
        citycode:_.get(vlist[0],'citycode',''),
        adcode:_.get(vlist[0],'adcode',''),
        province:_.get(vlist[0],'province',''),
        city:_.get(vlist[0],'city',''),
        BUS:0,
        CAR:0,
        ENERGYTRUCK:0,
        CONTAINERTRUCK:0
      };
    }

    // debug(`resultinfo->${JSON.stringify(resultinfo)}`)
    let typedmaplist = _.groupBy(vlist,(o)=>{
      return o.type;
    });
    // debug(`typedmaplist->${JSON.stringify(typedmaplist)}`)
    _.map(typedmaplist,(vtypelist,ktype)=>{
      if(ktype === 'UNKNOW'){
        resultinfo[config.defaultTypeUnknow] = resultinfo[config.defaultTypeUnknow]+vtypelist.length;
      }
      else{
        resultinfo[ktype] = resultinfo[ktype]+vtypelist.length;
      }
    });
    // debug(`resultinfo->${JSON.stringify(resultinfo)}`)


    listresult_grouped.push(resultinfo);
  });
  // debug(`listresult_grouped-->${JSON.stringify(listresult_grouped)}`)
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
