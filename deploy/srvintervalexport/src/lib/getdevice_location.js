const utilposition  = require('./util_position');
const DBModels = require('../handler/models.js');
const winston = require('../log/log.js');
const _ = require('lodash');
const async = require('async');
const debug = require('debug')('srvinterval:location');

const batchcount = 20;


const getDevice_withPos_batch = (devicelist,getpoint,callbackfn)=>{
  utilposition.getlist_pos(devicelist,getpoint,(err,newdevicelist)=>{
    callbackfn(newdevicelist);
  });
}


const getDevice_withPos = (devicelist,getpoint,callbackfn)=>{
  // getDevicelist((devicelist)=>{
    let success_list = [];
    const fnsz = [];
    for(let i = 0 ;i < devicelist.length; i += batchcount){
      const lend = i+batchcount > devicelist.length?devicelist.length:i+batchcount;
      const target_devicelist = devicelist.slice(i, lend);
      fnsz.push((callbackfn)=>{
        getDevice_withPos_batch(target_devicelist,getpoint,(retlist)=>{
          success_list = _.concat(success_list, retlist);
          debug(`获取设备数据结果->success_list-->${success_list.length},本次新增:${retlist.length}`)
          callbackfn();
        });
      });
    }
    debug(`fnsz-->${fnsz.length}`)
    async.series(fnsz,(err,result)=>{
      debug(`获取设备所有结果->success_list-->${success_list.length}`)
      if(success_list.length){
        debug(`================`)
        debug(`${JSON.stringify(success_list[0])}`)
        debug(`================`)
      }
      winston.getlog().info(`获取设备数据结果,成功【${success_list.length}】`);
      callbackfn(success_list);
    });
  // });
}

module.exports = getDevice_withPos;
