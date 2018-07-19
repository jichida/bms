const redis = require("redis");
const config = require('../config.js');
const debug = require('debug')('srvinterval:redis');
const winston = require('../log/log.js');
const _ = require('lodash');

const client = redis.createClient(config.srvredis);

client.on("error", (err)=> {
  debug("Error " + err);
});


const getDevicelist = (curday,callbackfn)=>{
  let rlst = [];
  const key = `${config.redisdevicesetname}.${curday}`;
  debug(`get redis set:${key}`);
  client.smembers(key,(err, result)=> {
    if(!err && !!result){
      _.map(result,(item)=>{
        rlst.push(item);
      });
    }
    debug(`[获取所有设备个数]===>${rlst.length}`)
    callbackfn(rlst);
  });
}


const getdata_lrange = ({curday,DeviceId},callbackfn)=>{
  client.lrange(`${config.redisdevicequeuename}.${curday}.${DeviceId}`, 0, -1, (error, msgs)=> {
    //
      let messages = [];
      if(!error && !!msgs){
        _.map(msgs,(msg)=>{
          const msg2 = JSON.parse(msg);
          messages.push(msg2);
        });
        //sort & == remove
        //先排序,后去重
        messages = _.sortBy(messages, [(o)=>{
          const key = `${o.DeviceId}_${o.DataTime}`;
          return key;
        }]);
        //去重
        messages = _.sortedUniqBy(messages,(o)=>{
             const key = `${o.DeviceId}_${o.DataTime}`;
             return key;
        });
      }
      callbackfn(messages);
  });
}

const getnextdata = ({curday,DeviceId},callbackfn)=>{

  client.lpop(`${config.redisdevicequeuename}.${curday}.${DeviceId}`,(err,result)=>{
      callbackfn(result);
  });
}

const getlistmsg = (msglist,{curday,DeviceId},callbackfn)=>{
  getnextdata({curday,DeviceId},(newdoc)=>{
    if(!!newdoc){
      msglist.push(newdoc);
      getlistmsg(msglist,{curday,DeviceId},callbackfn);
    }
    else{
      callbackfn(msglist);
    }
  })
}

const getdata_lpop =  ({curday,DeviceId},callbackfn)=>{
    let msglist = [];
    getlistmsg(msglist,{curday,DeviceId},(msgs)=>{
      debug(`getdata_lpop->${config.redisdevicequeuename}.${curday}.${DeviceId}->${msgs.length}`)
      let messages = [];
      if(!!msgs){
        _.map(msgs,(msg)=>{
          const msg2 = JSON.parse(msg);
          messages.push(msg2);
        });
        //sort & == remove
        //先排序,后去重
        messages = _.sortBy(messages, [(o)=>{
          const key = `${o.DeviceId}_${o.DataTime}`;
          return key;
        }]);
        //去重
        messages = _.sortedUniqBy(messages,(o)=>{
             const key = `${o.DeviceId}_${o.DataTime}`;
             return key;
        });

        if(messages.length < msgs.length){
          debug(`去重有效,当前:${messages.length},原始:${msgs.length}`)
        }
      }

      callbackfn(messages);
    });
}

exports.getDevicelist = getDevicelist;
exports.getdata_lrange = getdata_lrange;
exports.getdata_lpop = getdata_lpop;
