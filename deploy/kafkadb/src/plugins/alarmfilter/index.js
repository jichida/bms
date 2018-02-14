const DBModels = require('../../handler/models.js');
const _ = require('lodash');
const moment = require('moment');
const mongoose     = require('mongoose');
// let alarmrule_systemconfig = {
//
// }
//
// exports.initplugin = ()=>{
//   const systemconfigModel = DBModels.SystemConfigModel;
//   systemconfigModel.findOne({ organizationid: organizationid }, (err, systemconfig)=> {
//     if(!err && !!systemconfig){
//       alarmrule_systemconfig = systemconfig;
//     }
//   });
//
// }

const getalarmrules = (systemconfig)=>{
  let alarmrules = {};
  _.map(systemconfig.warningrulelevel0,(v)=>{
    if(!!alarmrules[v.name]){
      alarmrules[v.name].push({
        rule:v,
        warninglevel:'高'
      });
    }
    else{
      alarmrules[v.name] = [{
        rule:v,
        warninglevel:'高'
      }];
    }
  });
  _.map(systemconfig.warningrulelevel1,(v)=>{
    if(!!alarmrules[v.name]){
      alarmrules[v.name].push({
        rule:v,
        warninglevel:'中'
      });
    }
    else{
      alarmrules[v.name] = [{
        rule:v,
        warninglevel:'中'
      }];
    }
  });
  _.map(systemconfig.warningrulelevel2,(v)=>{
    if(!!alarmrules[v.name]){
      alarmrules[v.name].push({
        rule:v,
        warninglevel:'低'
      });
    }
    else{
      alarmrules[v.name] = [{
        rule:v,
        warninglevel:'低'
      }];
    }
  });
  return alarmrules;
}

const getresultalarmmatch = (alarmdata,alarmrules)=>{
  let resultalarmmatch = [];
  _.map(alarmdata,(v,key)=>{
    //"AL_Trouble_Code" : 181
    if(!!alarmrules[key]){
      _.map(alarmrules[key],(valarmrules)=>{
        const rule = valarmrules.rule;
        // {
        //     "content" : "故障228代码报警",
        //     "value" : "228",
        //     "op" : "=",
        //     "name" : "AL_Trouble_Code"
        // }
        let valueint = rule.value;
        try{
          if(typeof valueint === 'string'){
            valueint = parseFloat(valueint);
          }
        }
        catch(e){

        }

        if(rule.op === '='){
          if(valueint == v){
            resultalarmmatch.push({
              warninglevel:_.get(valarmrules,'warninglevel'),
              alarmtxt:_.get(rule,'content','')
            });
          }
        }
        else if(rule.op === '>'){
          if(v > valueint){
            resultalarmmatch.push({
              warninglevel:_.get(valarmrules,'warninglevel'),
              alarmtxt:_.get(rule,'content','')
            });
          }
        }
        else if(rule.op === '<'){
          if(v < valueint){
            resultalarmmatch.push({
              warninglevel:_.get(valarmrules,'warninglevel'),
              alarmtxt:_.get(rule,'content','')
            });
          }
        }//else if
      });//_.map(alarmrules[key],(valarmrules)=>{
    };//if(!!alarmrules[key]){
  });//_.map(alarmdata,(v,key)=>{
  return resultalarmmatch;
}

const matchalarm = (alarmdata,callback)=>{
    if(!!alarmdata){
      const systemconfigModel = DBModels.SystemConfigModel;
      systemconfigModel.findOne({ organizationid: mongoose.Types.ObjectId("599af5dc5f943819f10509e6") }, (err, result)=> {
          let resultalarmmatch = [];
          if(!err && !!result){
            let systemconfig = result.toJSON();
            let alarmrules = getalarmrules(systemconfig);
            // //console.log(alarmrules);
            resultalarmmatch = getresultalarmmatch(alarmdata,alarmrules);

            // //console.log(resultalarmmatch);
            resultalarmmatch = _.sortBy(resultalarmmatch,(v)=>{
              if(v.warninglevel === '高'){
                return 0;
              }
              if(v.warninglevel === '中'){
                return 1;
              }
              if(v.warninglevel === '低'){
                return 2;
              }
              return 3;
            });

            // //console.log(resultalarmmatch);
          }
          callback(resultalarmmatch);
      });
    }
    else{
      callback([]);
    }
}

const dofilter= (DeviceId,LastRealtimeAlarm,callback)=>{
  //输入alarmdata,输出：经过处理的alarmdata
  // "AL_Trouble_Code" : 181
  //1级：黄色；2级：橙色；3级：红色
  let alarmdata = LastRealtimeAlarm.Alarm;
  // //console.log(`DeviceId==>${JSON.stringify(DeviceId)}`);
  // //console.log(`alarmdata==>${JSON.stringify(alarmdata)}`);

  if(!!alarmdata){
    let inc_data = {};
    let warninglevel = '';
    _.map(alarmdata,(v,key)=>{
      if(key === 'AL_Trouble_Code'){
        inc_data[`F[${v}]`] = 1;
      }
      else{
        if(v !== 0){
          inc_data[key] = 1;

          if(v===3){
            warninglevel = '高';
          }
          else if(v===2 && warninglevel!== '高'){
            warninglevel = '中';
          }
          else if(warninglevel!== ''){
            warninglevel = '低';
          }
        }
      }
    });
    // //console.log(`alarmdata.DataTime-->${LastRealtimeAlarm.DataTime}`);
    const CurDay = moment(LastRealtimeAlarm.DataTime).format('YYYY-MM-DD');
    callback(null,{
      DeviceId,
      CurDay,
      warninglevel,
      inc_data,
    });
    return;
  }
  callback('无报警数据',null);

}

exports.matchalarm = matchalarm;
exports.dofilter = dofilter;
