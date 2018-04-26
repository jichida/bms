const _ = require('lodash');
const async = require('async');
const DBModels = require('../handler/models.js');
const winston = require('../log/log.js');
const getarea_db_single = require('./getarea_db_single');
const getamap_area_batch = require('./getamap_area_batch');
const debug = require('debug')('srvdevicegroupcron:startcron');

const getallarea_all = (devicelist,callback)=>{
  //<-----
  let success_list = [];
  let failed_list = [];
  const fnsz = [];
  _.map(devicelist,(v)=>{
    /*
    _id,Longitude,Latitude
    */
    fnsz.push((callbackfn)=>{
      // debug(`getarea_db_single-->${JSON.stringify(v)}`)
      getarea_db_single(DBModels.GeoModel,v,({_id,citycode,getflag})=>{
        if(!!citycode){
          success_list.push({_id,citycode,getflag});
        }
        else{
          failed_list.push(v);
        }
        debug(`【根据设备ID获取城市(数据库)】数据库中获取到数据-->${_id}->${citycode}->成功${success_list.length},失败:${failed_list.length},一共${devicelist.length}`)
        callbackfn(null,true);
      });
    });
  });

  debug(`getallarea_all-->${fnsz.length}`)
  async.series(fnsz,(err,result)=>{
    debug(`【根据设备ID获取城市】成功个数-->${success_list.length}`)
    debug(`【根据设备ID获取城市】失败个数-->${failed_list.length}`)
    winston.getlog().info(`【根据设备ID获取城市】,成功【${success_list.length}】,失败【${failed_list.length}】`);
    callback({success_list,failed_list});
  });

}

const getallarea_all_fromamap = (devicelist,callback)=>{
  //将devicelist分20个一组
  let success_list = [];
  if(devicelist.length === 0){
    callback([]);
    return;
  }
  const fnsz = [];
  for(let i = 0 ;i < devicelist.length; i += 20){
    const lend = i+20 > devicelist.length?devicelist.length:i+20;
    const target_devicelist = devicelist.slice(i, lend);
    /*
    _id,Longitude,Latitude
    */
    fnsz.push((callbackfn)=>{
      getamap_area_batch(target_devicelist,(retlist)=>{
        success_list = _.concat(success_list, retlist);
        debug(`所有设备结果->success_list-->${success_list.length},本次新增:${retlist.length}`)
        callbackfn();
      });
    });

  }

  debug(`getallarea_all_fromamap-->${fnsz.length}`)
  async.series(fnsz,(err,result)=>{
    winston.getlog().info(`【根据设备ID获取城市(地图API)】,成功【${success_list.length}】`);
    callback(success_list);
  });
};


const getallarea_start = (devicelist,callback)=>{
  debug(`getallarea_start-->${devicelist.length}`)
  getallarea_all(devicelist,({success_list,failed_list})=>{
    getallarea_all_fromamap(failed_list,(ret)=>{
      let retlist = _.concat(success_list, ret);
      debug(`retlist-->${retlist.length}`)
      callback(retlist);
    });
  })
};

module.exports = getallarea_start;
