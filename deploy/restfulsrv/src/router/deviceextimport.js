const DBModels = require('../db/models.js');
const PubSub = require('pubsub-js');
const _ = require('lodash');
const requestIp = require('request-ip');
const moment  = require('moment');
const async = require('async');
const middlewareauth = require('./middlewareauth.js');
const debug = require('debug')('srvapp:uploadexcel');

const dodeviceextimport = (req,res)=>{
  const exceljson = req.body;
  const userid = req.userid;
  let deviceids_success = [];
  let deviceids_notfound = [];
  let asyncfnsz = [];
  _.map(exceljson,(devicedata)=>{
    const DeviceId = devicedata[`DeviceId`];
    const batterysystemflownumber = devicedata[`batterysystemflownumber`];
    const fn = (callbackfn)=>{
      const dbDeviceExt = DBModels.DeviceExtModel;
      if(!!DeviceId && DeviceId !== ''){
        dbDeviceExt.findOneAndUpdate({DeviceId},{$set:devicedata},{new:true,upsert:true}).lean().exec((err,result)=>{
          deviceids_success.push(DeviceId);

          const dbDevice = DBModels.DeviceModel;
          dbDevice.findOneAndUpdate({DeviceId},{$set:{deviceextid:result._id}},{new:true,upsert:true}).lean().exec((err,result)=>{
            callbackfn(err,result);
          });

        });
      }
      else{
        dbDeviceExt.findOneAndUpdate({batterysystemflownumber},{$set:devicedata},{new:true,upsert:true}).lean().exec((err,result)=>{
          deviceids_success.push(batterysystemflownumber);
          callbackfn(err,result);
        });
      }
    }
    asyncfnsz.push(fn);
  });


  async.parallel(asyncfnsz,(err,resultlist)=>{
    if(!err){
      const resultstring = `成功导入${deviceids_success.length}条`;
      const userlog = {
        remoteip:requestIp.getClientIp(req) || '',
        creator:userid,
        created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        logtxt:`导入客档信息,结果${resultstring}`
      };
      PubSub.publish('userlog_data',userlog);

      res.status(200)
             .json({
        result:'OK',
        data:{
              issuccess:true,
              successlist:deviceids_success,
              failedlist:deviceids_notfound,
          }
      });
    }
    else{
      res.status(200)
             .json({
        result:'error',
        message:'导入错误'
      });
    }
  });

}

const getDevice = (callbackfn)=>{
  const deviceModel = DBModels.DeviceModel;
  deviceModel.find({},{
    'DeviceId':1,
  }).lean().exec((err,result)=>{
    rlst = [];
    if(!err && !!result){
      _.map(result,(item)=>{
        rlst.push(item.DeviceId);
      });
    }
    callbackfn(rlst);
  });
}

const startuploader = (app)=>{
  app.post('/deviceextimport',middlewareauth,(req,res)=>{
    //check deviceids
    debug(`start deviceextimport`)
    getDevice((deviceids)=>{
      debug(`getDevice--->${deviceids.length}`)
      //check provinces
      const provincenames =[
        '北京','上海','天津','重庆','河北',
        '山西','内蒙古','黑龙江','吉林','辽宁','陕西','甘肃','青海',
        '新疆','宁夏','山东','河南','江苏','浙江','安徽','江西','福建',
        '台湾','湖北','湖南','广东','广西','海南','四川','云南','贵州',
        '西藏','香港','澳门'
      ];
      const exceljson = req.body;
      let issuccess = true;
      let errmessage = '';
      for(let i = 0 ;i < exceljson.length; i++){
        const devicedata = exceljson[i];
        const DeviceId = devicedata[`DeviceId`];
        const province = devicedata[`province`];
        if(!!DeviceId && DeviceId !== ''){
          if(_.indexOf(deviceids, DeviceId) === -1){
            errmessage = `${DeviceId}不存在,${i}条记录`;
            issuccess = false;
            break;
          }
        }
        if(_.indexOf(provincenames, province) === -1){
          issuccess = false;
          errmessage = `【${province}】非法,只能是:'北京','上海','天津','重庆','河北',\
'山西','内蒙古','黑龙江','吉林','辽宁','陕西','甘肃','青海',\
'新疆','宁夏','山东','河南','江苏','浙江','安徽','江西','福建',\
'台湾','湖北','湖南','广东','广西','海南','四川','云南','贵州',\
'西藏','香港','澳门' 之一`;
          break;
        }
      }

      if(issuccess){
        dodeviceextimport(req,res);
      }
      else{
        res.status(200)
               .json({
          result:'error',
          message:`导入错误,原因:${errmessage}`,
        });
      }
    });
  });

};

  module.exports= startuploader;
