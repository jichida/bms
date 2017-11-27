const DBModels = require('../../db/models.js');
const _ = require('lodash');
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

exports.dofilter= (alarmdata,callback)=>{
  //输入alarmdata,输出：经过处理的alarmdata
}
