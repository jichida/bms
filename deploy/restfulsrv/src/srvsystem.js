/**
 * Created by wangxiaoqing on 2017/3/25.
 */
const dbinit = require('./db/dbinit');
const config = require('./config');
const DBModels = require('./db/models.js');
const PubSub = require('pubsub-js');
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');
const debug = require('debug')('srvapp:pcpush');
const getdevicesids = require('./handler/getdevicesids');

const FastSet = require("collections/fast-set");
const userset = new FastSet();
let lasttime = moment().format('YYYY-MM-DD HH:mm:ss');

const loginuser_add = (userid)=>{
  userset.add(userid);
}

const loginuser_remove = (userid)=>{
  userset.delete(userid);
}

const getSystemLog = ()=>{
  PubSub.subscribe('userlog_data', ( msg, data )=>{
    console.log(`userlog_data===>${msg},${JSON.stringify(data)}`);

    data.creator = mongoose.Types.ObjectId(data.creator);
    data.organizationid = mongoose.Types.ObjectId('599af5dc5f943819f10509e6');
    const dbModel = DBModels.UserLogModel;
    const userlog = new dbModel(data);
    userlog.save(data,(err,result)=>{

    });
  });
}

const checkDevice = (lasttime,callbackfn)=>{
  debug(`start check device:${lasttime}`);

  const deviceModel = DBModels.DeviceModel;
  const fields = {
    'DeviceId':1,
    'LastHistoryTrack.Latitude':1,
    'LastHistoryTrack.Longitude':1,
    'LastHistoryTrack.GPSTime':1,
    'warninglevel':1,
    'LastRealtimeAlarm.DataTime':1,
    'alarmtxtstat':1,
    'UpdateTime':1
  };
  deviceModel.find({
    UpdateTime:{
      $gte:lasttime
    }
  }).select(fields).sort({UpdateTime:1}).lean().exec(callbackfn);
}

const do_updatealldevices = (alldevicelist)=>{
  debug(`获取所有设备:${alldevicelist.length}`)
  userset.map((userid)=>{
    getdevicesids(userid,({deviceIds,isall})=>{
      //设置订阅设备消息
      if(isall){
        debug(`推送给用户:${userid}==>${alldevicelist.length}`);
        PubSub.publish(`${config.pushdevicetopic}.${userid}`,alldevicelist);
      }
      else{
        let devicelist = [];
        _.map(deviceIds,(DeviceId)=>{
          const item = _.find(alldevicelist, (deviceitem)=>{
             return deviceitem.DeviceId === DeviceId;
           }
         );
         if(!!item){
           devicelist.push(item);
         }
        });
        debug(`推送给用户:${userid}==>${alldevicelist.length}`);
        PubSub.publish(`${config.pushdevicetopic}.${userid}`,devicelist);
      }
    });
  });
}

const intervalCheckDevice =()=>{

  setInterval(()=>{
      checkDevice(lasttime,(err,result)=>{
        if(!err && !!result){
          _.map(result,(device)=>{
            lasttime = device.UpdateTime;
            // PubSub.publish(`${config.pushdevicetopic}.${device.DeviceId}`,device);
            // debug(`push device:${device.DeviceId} device`);
          });
          do_updatealldevices(result);//处理所有的DeviceId
        }
      });
  }, 5000);
};
// const mongoose = require('mongoose');
// const winston = require('./log/log.js');

// const _ = require('lodash');
// const schedule = require('node-schedule');
// const pwd = require('./util/pwd.js');

//
// const createadmin = ()=>{
//   // let userModel = mongoose.model('UserAdmin', DBModels.UserAdminSchema);
//   // userModel.findOne({username: 'admin'}, (err, adminuser)=> {
//   //   if(!err && !adminuser) {
//   //       let passwordsalt = pwd.getsalt();
//   //       pwd.hashPassword('admin',passwordsalt,(err,passwordhash)=>{
//   //         if(!err){
//   //           adminuser = {
//   //             username:'admin',
//   //             passwordsalt,
//   //             passwordhash
//   //           };
//   //           let entity = new userModel(adminuser);
//   //           entity.save((err)=> {
//   //           });
//   //         }
//   //       });
//   //   }
//   // });
// };


// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)


const job=()=>{

    // createadmin();
    dbinit();

    getSystemLog();

    intervalCheckDevice();

    // schedule.scheduleJob('0 0 * * *', ()=>{
      //每天0点更新优惠券过期信息
    //   setmycouponsexpired();
    // });
    //
    // schedule.scheduleJob('*/5 * * * *', ()=>{
    //   ////console.log('每隔5分钟执行这里!');
    //   updatesystemconfig();
    // });
};

exports.job = job;
exports.loginuser_add = loginuser_add;
exports.loginuser_remove  = loginuser_add;
