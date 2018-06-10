const config = require('../config.js');
const debug  = require('debug')('srvapp:index');
const mongoose     = require('mongoose');
const _ = require("lodash");
const moment = require('moment');
//设备
const Schema       = mongoose.Schema;
//设备城市映射表【每天一次】
const DeviceCitySchema = new Schema({
  deviceid:{ type: Schema.Types.ObjectId, ref: 'device'},
  updatetime: { type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},
}, { strict: false });
const DeviceCityModel =mongoose.model('devicecity',  DeviceCitySchema);

// {
// 	"_id": ObjectId("5b04fbf9123ec543abfbf7c8"),
// 	"deviceid": ObjectId("5ac47e0998f08eba15813a5b"),
// 	"__v": 0,
// 	"citycode": "0831",
// 	"adcode": "511502",
// 	"targetadcode": "511500",
// 	"updatetime": "2018-06-10 00:00:01",
// 	"province": "四川省",
// 	"city": "宜宾市",
// 	"district": "翠屏区"
// }
const getDeviceCities = (callbackfn)=>{
  const dbModel = DeviceCityModel;
  dbModel.find({
    }).populate([
        {
          path:'deviceid',
          model: 'device',
          select:'DeviceId',
      }]).lean().exec((err,devicecitylist)=>{

      let mapdevicecity = {};
      if(!err && devicecitylist.length > 0){
        _.map(devicecitylist,(v)=>{
          const DeviceId = _.get(v,'deviceid.DeviceId');
          if(!!DeviceId){
            let cityname = `${v.province}`;
            if(!!v.city){
              if(v.city.length > 0){
                cityname = `${cityname}${v.city}`;
              }
              else{
                const district = _.get(v,'district');
                if(!!district){
                  cityname = `${cityname}${district}`;
                }
              }
            }
            mapdevicecity[DeviceId] = {
              citycode:v.citycode,
              targetadcode:`${v.targetadcode}`,
              updatetime:v.updatetime,
              cityname,
            	"province": _.get(v,'province','未知'),
            	"city": _.get(v,'city','未知'),
            	"district": _.get(v,'district','未知')
            }
          }
        });
      }
      const config_mapdevicecity = _.merge({},mapdevicecity);
      debug(config_mapdevicecity);
      debug(`devicecitylist--->${devicecitylist.length}`);
      callbackfn(config_mapdevicecity);
  });
}

module.exports= getDeviceCities;
