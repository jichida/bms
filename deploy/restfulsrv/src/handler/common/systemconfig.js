let DBModels = require('../../db/models.js');
let winston = require('../../log/log.js');

exports.getsystemconfig = (actiondata,ctx,callbackfn)=>{
    let dbModel = DBModels.SystemConfigModel;
    dbModel.findOne({},(err,systemconfig)=>{
        if(!err && !!systemconfig){
            let payload = {};
            if(ctx.usertype === 'pc'){
                payload = {
                  mappopfields:systemconfig.mappopfields
                };
            }
            else if(ctx.usertype === 'app'){
                payload = {
                  mappopfields:systemconfig.mappopfields
                };
            }
            callbackfn({
              cmd:'getsystemconfig_result',
              payload
            });
        }
        else{
          callbackfn({
            cmd:'common_err',
            payload:{errmsg:`请联系管理员设置后台系统设置信息！`,type:'getsystemconfig'}
          });
          winston.getlog().error(`请联系管理员设置后台系统设置信息！`);
        }
    });
}
