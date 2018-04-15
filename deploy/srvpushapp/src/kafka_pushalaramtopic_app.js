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
  if(devicedata['warninglevel'] !== '高' && devicedata['warninglevel'] !== '中' && devicedata['warninglevel'] !== '低' ){
    debug(`报警等级为空,这条记录是:${JSON.stringify(devicedata)}`);
    callbackfn();
    return;
  }
  const DeviceId = devicedata.DeviceId;
  const recordnew = {
    '车辆ID':_.get(devicedata,'DeviceId'),
    '报警时间':_.get(devicedata,'LastRealtimeAlarm.DataTime'),
    '报警信息':_.get(devicedata,'alarmtxtstat'),
    '报警等级':getwarningleveltext(_.get(devicedata,'warninglevel'))
  };

  getuserpushdeviceid(DeviceId,(userlist)=>{
    debug(`所有用户id:${JSON.stringify(userlist)}`);
    if(userlist.length === 0){
      callbackfn();
      return;
    }
    _.map(userlist,(userid)=>{
      // _id
      // messagetype:String,//all,app
      // touserid:String,
      // messagetitle:String,
      // messagecontent:String,
      //推送到app,调用接口|serverpush_alarm
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
    });

    // if(userlist.length > 0){
    //   //有用户订阅,重新广播出去
    //   const sendto = sendtokafka.getsendtokafka();
    //   if(!!sendto){
    //     sendto(data,config.kafka_pushalaramtopic_pc,(err,data)=>{
    //       if(!!err){
    //         //console.log(err);
    //       }
    //       //console.log(`kafka_pushalaramtopic_app sended`);
    //       callbackfn(err,data);
    //     });
    //     return;
    //   }
    // }
    //console.log(`kafka_pushalaramtopic_app returned`);
    callbackfn();
  });
}


module.exports = kafka_pushalaramtopic_app;
