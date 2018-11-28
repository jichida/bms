/**
 * Created by wangxiaoqing on 2017/3/25.
 */
const dbinit = require('./db/dbinit');
const config = require('./config');
const DBModels = require('./db/models.js');
const winston = require('./log/log.js');
const PubSub = require('pubsub-js');
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');
const debug = require('debug')('srvapp:pcpush');
const getdevicesids = require('./handler/getdevicesids');
const catlworking = require('./handler/fullcommon/catlworking');
const schedule = require('node-schedule');
const userset = {};
let lasttime = moment().format('YYYY-MM-DD HH:mm:ss');
let lastdeviceid = '';
let lasttime_result = moment().format('YYYY-MM-DD HH:mm:ss');

const loginuser_add = (userid,connectid)=>{
  let usersetref = userset[userid] || [];
  _.remove(usersetref,(o)=>{
    return o === connectid;
  });
  usersetref.push(connectid);
  userset[userid] = usersetref;

  debug(`loginuser_add->${userid}+${connectid}:${JSON.stringify(userset[userid])}`)
}

const loginuser_remove = (userid,connectid)=>{
  let usersetref = userset[userid] || [];
   _.remove(usersetref,(o)=>{
    return o === connectid;
  });
  userset[userid] = usersetref;
  debug(`loginuser_remove->${userid}-${connectid}:${JSON.stringify(userset[userid])}`)
}

const getSystemLog = ()=>{
  PubSub.subscribe('userlog_data', ( msg, data )=>{
    //console.log(`userlog_data===>${msg},${JSON.stringify(data)}`);

    data.creator = mongoose.Types.ObjectId(data.creator);
    data.organizationid = mongoose.Types.ObjectId('599af5dc5f943819f10509e6');
    const dbModel = DBModels.UserLogModel;
    const userlog = new dbModel(data);
    userlog.save(data,(err,result)=>{

    });
  });
}

const checkDevice = (lasttime,callbackfn)=>{
  debug(`start check device:${lasttime},lastdeviceid:${lastdeviceid},lasttime_result:${lasttime_result}`);

  const deviceModel = DBModels.DeviceModel;
  const fields = {
    'DeviceId':1,
    'last_Latitude':1,
    'last_Longitude':1,
    'last_GPSTime':1,
    'warninglevel':1,
    'LastRealtimeAlarm.DataTime':1,
    'alarmtxtstat':1,
    'UpdateTime':1,
    'PackNo_BMU':1
  };
  deviceModel.find({
    UpdateTime:{
      $gte:lasttime
    }
  },fields).sort({UpdateTime:1}).lean().exec((err,result)=>{
    //MongoError: Executor error during find command: OperationFailed: Sort operation used more than the maximum 33554432 bytes of RAM. Add an index, or specify a smaller limit.
    callbackfn(err,result);
  });
}

const do_updatealldevices = (alldevicelist)=>{

  _.map(userset,(v,userid)=>{
    debug(`do_updatealldevices----->${alldevicelist.length}--->${userid}`);
    if(v.length > 0){
      getdevicesids(userid,({deviceIds,isall})=>{
        let ispublish = false;
        let publishvale = [];
        //设置订阅设备消息
        if(isall){
          if(alldevicelist.length > 0){
            publishvale = alldevicelist;
            ispublish = true;
            // PubSub.publish(`${config.pushdevicetopic}.${userid}`,alldevicelist);
          }

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

          if(devicelist.length > 0){
            publishvale = devicelist;
            ispublish = true;
            // PubSub.publish(`${config.pushdevicetopic}.${userid}`,devicelist);
          }
        }

        if(ispublish){
          _.map(v,(connectid)=>{
            debug(`推送给用户:${userid}==>${connectid}==>${publishvale.length}`);
            PubSub.publish(`${config.pushdevicetopic}.${userid}.${connectid}`,publishvale);
          });
        }
      });
    }

  });
}

const do_interval = ()=>{
  checkDevice(lasttime,(err,result)=>{
    lasttime_result = moment().format('YYYY-MM-DD HH:mm:ss');
    if(!err && !!result){
      debug(`check list----->${result.length}`);
      _.map(result,(device)=>{
        lasttime = device.UpdateTime;
        lastdeviceid = device._id;
      });
      do_updatealldevices(result);//处理所有的DeviceId
    }
    else{
      debug(err);
      debug(result);
    }
  });
}


const intervalCheckDevice =()=>{
  setInterval(()=>{
    do_interval();
  }, 30000);
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

    debug(`start get catlmysql data.....`);
    winston.getlog().info(`开始读取mysql信息`);
    catlworking.getcatlmysql((data)=>{
      debug(data);
      config.catlmysqldata = data;
      winston.getlog().info(`读取mysql信息成功`);
    });

    intervalCheckDevice();

    schedule.scheduleJob('0 0 * * *', ()=>{
      // 每天0点更新优惠券过期信息
      winston.getlog().info(`开始读取mysql信息`);
      catlworking.getcatlmysql((data)=>{
        winston.getlog().info(`读取mysql信息成功`);
        config.catlmysqldata = data;
      });
    });

    // schedule.scheduleJob('*/5 * * * *', ()=>{
    //   //////console.log('每隔5分钟执行这里!');
    //   updatesystemconfig();
    // });
};

exports.job = job;
exports.loginuser_add = loginuser_add;
exports.loginuser_remove  = loginuser_remove;
