const mongoose  = require('mongoose');
const DBModels = require('./handler/models.js');
const config = require('./config.js');
const smspush = require('./smspush/push');
const winston = require('./log/log.js');
const getuserpushdeviceid = require('./getuserpushdeviceid.js');
const _ = require('lodash');
const debug = require("debug")("alarmpush");

const getwarningleveltext = (warninglevel)=>{
  const warninglevelmap = {
    '高':'三级',
    '中':'二级',
    '低':'一级'
  };
  if(!!warninglevelmap[warninglevel]){
    return warninglevelmap[warninglevel];
  }
  return warninglevel;
}

// const subString =(str, len, hasDot)=>{
// 	var newLength=0;
// 	var newStr="";
// 	var chineseRegex=/[^\x00-\xff]/g;
// 	var singleChar='';
// 	var strLength=str.replace(chineseRegex,'**').length;
// 	for(var i=0;i < strLength;i++){
// 	singleChar=str.charAt(i).toString();
// 	if(singleChar.match(chineseRegex) != null){
// 		newLength+=2;
// 	}else{
// 		newLength++;
// 	}
// 	if(newLength>len){
// 		break;
// 	}
// 	newStr+=singleChar;
// 	}
//
// 	if(hasDot && strLength>len){
// 		newStr+='...';
// 	}
// 	return newStr;
// }

const kafka_pushalaramtopic_app = (devicedata,callbackfn)=>{
  debug(`devicedata:${JSON.stringify(devicedata)}`);
  if(devicedata['warninglevel'] !== '高' && devicedata['warninglevel'] !== '中' && devicedata['warninglevel'] !== '低' ){
    debug(`报警等级为空,这条记录是:${JSON.stringify(devicedata)}`);
    callbackfn();
    return;
  }
  const DeviceId = devicedata.DeviceId;

  getuserpushdeviceid(devicedata._id,(userlist)=>{
    debug(`所有用户id:${JSON.stringify(userlist)}`);
    if(userlist.length === 0){
      callbackfn();
      return;
    }

    const recordnew = {
      '车辆ID':_.get(devicedata,'DeviceId'),
      '报警时间':_.get(devicedata,'LastRealtimeAlarm.DataTime'),
      '报警信息':_.get(devicedata,'alarmtxtstat'),
      '报警等级':getwarningleveltext(_.get(devicedata,'warninglevel'))
    };

    _.map(userlist,({userid,warninglevels})=>{
      const index = _.findIndex(warninglevels,(o)=>{
        return o === devicedata['warninglevel']
      });
      
      if(index >= 0){
        const msgpayload = {
          _id:DeviceId,
          DeviceId:DeviceId,
          messagetype:'msg',
        }
        // const msgalarm = `车辆:${recordnew['车辆ID']}于${recordnew['报警时间']}触发${recordnew['报警等级']}报警,报警信息:${recordnew['报警信息']}`,
        const msgalarm = `车辆:${recordnew['车辆ID']}于${recordnew['报警时间']}触发${recordnew['报警等级']}报警,点击查看报警信息`;
        const messagenotify = {
          msgpayload,
          touserid:userid,
          messagetitle:msgalarm,
          messagecontent:msgalarm
        };
        winston.getlog().info(`开始推送消息:${JSON.stringify(messagenotify)}`);
        // debug(`发送给用户${userid}=>${JSON.stringify(messagenotify)}`);
        smspush.sendnotifymessage(messagenotify,(err,result)=>{
          // winston.getlog().info(`推送消息结束:${JSON.stringify(err)},result:${JSON.stringify(result)}`);
          if(!err){
            debug(`发送消息结果:${JSON.stringify(result)}`);
          }
          else{
            debug(`发送消息结果 err:${JSON.stringify(err)}`);
          }
        });
      }
      else{
        debug(`找到用户:${userid},但报警条件不满足:${JSON.stringify(warninglevels)}`);
      }
    });
    callbackfn();
  });
}


module.exports = kafka_pushalaramtopic_app;
