const async = require("async");
const _ = require('lodash');
const DBModels = require('../handler/models');
const debug = require('debug')('srvdevicegroupcron:startcron');

const getalldefault_devicegroups = require('./getallcities');
const getallarea_start = require('./getarea_all');
const startcron_updatedevicegroup = require('./startcron_updatedevicegroup');

const cron_devicegroup = (callbackfn)=>{
  let citycode_devicegroupid = {};

  const devicegroupModel = DBModels.DeviceGroupModel;
  const GeoModel = DBModels.GeoModel;
  debug(`cron_devicegroup-->`);
  getalldefault_devicegroups(GeoModel,(grouplist)=>{

    debug(`getalldefault_devicegroups-->${grouplist.length}`);
    let fnsz = [];

    _.map(grouplist,(dg)=>{
      fnsz.push((callback)=>{
        //新建一个全部数据的分组<name/citycode/level
        const groupobj = {
          name:dg.name,
          citycode:dg.citycode,
          systemflag:1,
        }
        devicegroupModel.findOneAndUpdate({citycode:groupobj.citycode,systemflag:1}, {$set:groupobj},{new: true,upsert:true},(err,result)=>{
          if(!err && !!result){
            citycode_devicegroupid[dg.citycode] = result._id;
          }
          callback(err,result);
        });
      });
    });

    debug(`cron_devicegroup-->${grouplist.length}`);
    async.parallel(fnsz,(err,result)=>{
      debug(`getalldefault_devicegroups-->get result`);
      callbackfn(citycode_devicegroupid);
    });
  });
}

const startcron = (devicelist)=>{
  let fnsz = [];
  fnsz.push((callbackfn)=>{
    cron_devicegroup((citycode_devicegroupid)=>{
      debug(`citycode_devicegroupid-->${JSON.stringify(citycode_devicegroupid)}`);
      callbackfn(null,citycode_devicegroupid);
    });
  })

  fnsz.push((callbackfn)=>{
    getallarea_start(devicelist,(allret)=>{
      debug(`getallarea_start-->${JSON.stringify(allret)}`);
      callbackfn(null,allret);
    });
  });

  debug(`startcron-->${JSON.stringify(devicelist.length)}`);
  async.series(fnsz,(err,result)=>{
    const citycode_devicegroupid = result[0];//dg.citycode->groupid
    const allret = result[1];//_id,citycode
    //>[{"_id":"5a0ee444b2370efa845fe59a","citycode":"0898","getflag":"fromdb"}]
    let retmapgroupidtodevice = {};
    _.map(allret,(device2citycode)=>{
      const groupid = citycode_devicegroupid[device2citycode.citycode];
      if(!!groupid){
        if(!retmapgroupidtodevice[groupid]){
          retmapgroupidtodevice[groupid] = [];
        }
        retmapgroupidtodevice[groupid].push(device2citycode._id);
      }
      else{
        debug(`【注意】citycode->${device2citycode.citycode}找不到groupid`)
      }

    });

    //---->
    startcron_updatedevicegroup(retmapgroupidtodevice);
  });
}

module.exports = startcron;
