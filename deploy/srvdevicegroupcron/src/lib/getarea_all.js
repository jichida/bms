const _ = require('lodash');
const async = require('async');
const DBModels = require('../handler/models.js');
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
      debug(`getarea_db_single-->${JSON.stringify(v)}`)
      getarea_db_single(DBModels.GeoModel,v,({_id,citycode,getflag})=>{
        debug(`getarea_db_single-->${_id}->${citycode}`)
        if(!!citycode){
          success_list.push({_id,citycode,getflag});
        }
        else{
          failed_list.push(v);
        }
        callbackfn(null,true);
      });
    });
  });

  debug(`getallarea_all-->${fnsz.length}`)
  async.parallel(fnsz,(err,result)=>{
    debug(`success_list-->${success_list.length}`)
    debug(`failed_list-->${failed_list.length}`)
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
    _.map(target_devicelist,(v)=>{
      /*
      _id,Longitude,Latitude
      */
      fnsz.push((callbackfn)=>{
        getamap_area_batch(target_devicelist,(retlist)=>{
          success_list = _.concat(success_list, retlist);
          debug(`getallarea_all_fromamap->success_list-->${success_list.length}`)
          callbackfn();
        });
      });
    });
  }

  debug(`getallarea_all_fromamap-->${fnsz.length}`)
  async.series(asyncfnsz,(err,result)=>{
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
