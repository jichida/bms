const DBModels = require('../../db/models.js');
const _ = require('lodash');
const moment = require('moment');

let alarmrule_systemconfig = {

}

exports.initplugin = ()=>{
  const systemconfigModel = DBModels.SystemConfigModel;
  systemconfigModel.findOne({ organizationid: organizationid }, (err, systemconfig)=> {
    if(!err && !!systemconfig){
      alarmrule_systemconfig = systemconfig;
    }
  });

}

exports.dofilter= (DeviceId,alarmdata,callback)=>{
  //输入alarmdata,输出：经过处理的alarmdata
  // "AL_Trouble_Code" : 181
  //1级：黄色；2级：橙色；3级：红色
  console.log(`DeviceId==>${JSON.stringify(DeviceId)}`);
  console.log(`alarmdata==>${JSON.stringify(alarmdata)}`);

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
    const CurDay = moment().format('YYYY-MM-DD');
    callback(null,{
      DeviceId,
      CurDay,
      inc_data,
    });
    return;
  }
  callback('无报警数据',null);

}
