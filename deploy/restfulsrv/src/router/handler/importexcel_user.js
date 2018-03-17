const mongoose     = require('mongoose');
const _ = require('lodash');
const DBModels = require('../../db/models.js');
const xlsx = require('node-xlsx');
const async = require('async');
const pwd = require('../../util/pwd.js');
const PubSub = require('pubsub-js');
const moment = require('moment');
//<----导入乘客功能待测试
const getusers = (listusers)=>{
  let newlistusers = [];
  _.map(listusers,(user,index)=>{
    if(index > 0){
      let newuser = {};
      newuser.username = user['用户名'];
      newuser.password = user['密码'];
      newuser.truename = user['真实姓名'];
      newuser.memo = user['备注'];
      newuser.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
      newuser.update_at = newuser.created_at;
      newlistusers.push(newuser);
    }
  });

  return newlistusers;
}


const importexcel = (excelfilepath,userid,callbackfn)=>{
  console.log(`开始导入excel:${excelfilepath}`);
  const obj = xlsx.parse(excelfilepath);
  console.log(JSON.stringify(obj));
  let listusers = [];
  let resultkey = [];
  _.map(obj,(v)=>{
    _.map(v.data,(dataarray)=>{
      if(resultkey.length === 0){
        resultkey = dataarray;
      }
      else{
        let record = {};
        _.map(dataarray,(v,index)=>{
          const key = resultkey[index];
          _.set(record,key,v);
        });
        listusers.push(record);
      }
    });
  });

  console.log(listusers);
  const newlistusers = getusers(listusers);
  console.log(newlistusers);

  let asyncgetidsfnsz = [];
  _.map(newlistusers,(userinfo)=>{
    const username = _.get(userinfo,'username');
    const fn = (callbackfn)=>{
      let passwordsalt = pwd.getsalt();
      pwd.hashPassword(userinfo.password,passwordsalt,(err,passwordhash)=>{
        userinfo = _.merge(userinfo, {
          passwordsalt:passwordsalt,
          passwordhash:passwordhash
        });
        userinfo = _.omit(['password']);
        const dbModel = DBModels.UserModel;
        dbModel.findOneAndUpdate({username},{$set:userinfo},{new:true,upsert:true}).lean().exec((err,newuserinfo)=>{
          callbackfn(err,newuserinfo);
        });
      });
    }
    asyncgetidsfnsz.push(fn);
  });

  async.parallel(asyncgetidsfnsz,(err,resultlist)=>{
    if(!err){
      const resultstring = `成功导入${resultlist.length}条`;
      const userlog = {
        creator:userid,
        created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
        logtxt:`导入用户,结果${resultstring}`
      };
      PubSub.publish('userlog_data',userlog);
      callbackfn({
        result:'OK',
        resultstring,
      });
    }
    else{
      callbackfn({
        result:'Error',
        resultstring:`导入失败,失败原因:${JSON.stringify(err)}`,
      });
    }
  });

};

module.exports= importexcel;
