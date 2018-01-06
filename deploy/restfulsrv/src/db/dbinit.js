const _ = require('lodash');
const DBModels = require('./models');
const mongoose = require('mongoose');
const pwd = require('../util/pwd.js');

const initjson = [
  {
        "_id" : mongoose.Types.ObjectId("5a03b61113e7410cd0ef3090"),
        "name" : "管理平台",
        "memo" : "管理平台",
        "organizationid" : mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
  },
  {
      "_id" : mongoose.Types.ObjectId("5a03b61f13e7410cd0ef3091"),
      "name" : "综合信息平台",
      "memo" : "综合信息平台",
      "organizationid" : mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
  },
  {
      "_id" : mongoose.Types.ObjectId("5a03b65113e7410cd0ef3092"),
      "name" : "综合信息APP",
      "memo" : "综合信息APP",
      "organizationid" : mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
  },
  {
      "_id" : mongoose.Types.ObjectId("5a03b66013e7410cd0ef3093"),
      "name" : "电池包监控平台",
      "memo" : "电池包监控平台",
      "organizationid" : mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
  },
  {
      "_id" : mongoose.Types.ObjectId("5a03b66e13e7410cd0ef3094"),
      "name" : "电池包监控APP",
      "memo" : "电池包监控APP",
      "organizationid" : mongoose.Types.ObjectId("599af5dc5f943819f10509e6"),
  },
];
const initDB = ()=>{
  const dbModel = DBModels.PermissionModel;
  _.map(initjson,(v)=>{
    dbModel.findOneAndUpdate({_id:v._id}, {$set:v},{new: true,upsert:true},(err,result)=>{
    });
  });

  //createadmin
  const passwordsalt = pwd.getsalt();
  pwd.hashPassword('admin',passwordsalt,(err,passwordhash)=>{
    if(!err){
      adminuser = {
        username:'admin',
        passwordsalt,
        passwordhash,
        adminflag:1
      };
      const userModel = DBModels.UserModel;
      userModel.findOneAndUpdate({username:adminuser.username}, {$set:adminuser},{new: true,upsert:true},(err,result)=>{
      });
    }
  });

}

module.exports= initDB;
