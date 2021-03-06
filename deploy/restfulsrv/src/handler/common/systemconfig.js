const DBModels = require('../../db/models.js');
const winston = require('../../log/log.js');
const _ = require('lodash');
const config = require('../../config.js');

exports.getsystemconfig = (actiondata,ctx,callbackfn)=>{
    const dbModel = DBModels.SystemConfigModel;
    dbModel.findOne({}).lean().exec((err,systemconfig)=>{
        if(!err && !!systemconfig){
            // systemconfig = systemconfig.toJSON();
            let payload = {};
            let mappopfields = systemconfig.mappopfields || config.defaultmappopfields;
            let mapdetailfields = systemconfig.mapdetailfields || config.defaultmapdetailfields;
            let mappopclusterfields = systemconfig.mappopclusterfields || config.defaultmappopclusterfields;
            let allfieldslist = [];
            allfieldslist = _.concat(allfieldslist,mappopfields);
            _.map(mapdetailfields,(v)=>{
              allfieldslist = _.concat(allfieldslist,v.fieldslist);
            });
            allfieldslist = _.uniq(allfieldslist);
            const alname = 'AL_';
            //还应该包括所有AL开头字母的信息
            const dbdictModel = DBModels.DataDictModel;
            dbdictModel.find({
              $or:[
                {name:{'$in':allfieldslist}},
                {name:{'$regex':alname, $options: "i"}}
              ]},(err,dictlist)=>{
              ////console.log(`dictlist==>${JSON.stringify(dictlist)}`)
              let mapdict = {};
              if(!err && dictlist.length > 0){
                _.map(dictlist,(v)=>{
                  mapdict[v.name] = {
                    name:v.name,
                    showname:v.showname,
                    unit:v.unit
                  }
                });
              }
              payload = {
                SettingOfflineMinutes:_.get(systemconfig,'SettingOfflineMinutes',20),
                mappopfields,
                mapdetailfields,
                mappopclusterfields,
                mapdict
              };
              ctx.SettingOfflineMinutes = _.get(systemconfig,'SettingOfflineMinutes',20);
              config.mapdict = _.merge(config.mapdict,mapdict);

              callbackfn({
                cmd:'getsystemconfig_result',
                payload
              });

            });

        }
        else{
          winston.getlog().error(`请联系管理员设置后台系统设置信息！`);
          callbackfn({
            cmd:'common_err',
            payload:{errmsg:`请联系管理员设置后台系统设置信息！`,type:'getsystemconfig'}
          });

        }
    });
}
