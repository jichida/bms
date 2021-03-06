const DBModels = require('../../db/models.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('../../config.js');
const winston = require('../../log/log.js');
const pwd = require('../../util/pwd.js');
const uuid = require('uuid');
const _ = require('lodash');
const moment = require('moment');
const PubSub = require('pubsub-js');
const srvsystem = require('../../srvsystem.js');
const fulldeviceext = require('../fullcommon/deviceext');
const debug = require('debug')('srvapp:userlogin');

const userloginsuccess =(user,callback,ctx)=>{
    //主动推送一些数据什么的
  const userlog = {
    remoteip:ctx.remoteip || '',
    creator:user._id,
    created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
    logtxt:`用户登录`
  };
  PubSub.publish('userlog_data',userlog);
};

const subscriberuser = (user,ctx)=>{
  PubSub.unsubscribe( ctx.userDeviceSubscriber );
  PubSub.subscribe(`${config.pushdevicetopic}.${ctx.userid}.${ctx.connectid}`,ctx.userDeviceSubscriber);
  if(ctx.usertype === 'fullpc' ){
    PubSub.subscribe(`mapcitystat`,ctx.userDeviceSubscriber);
  }
}

let getdatafromuser =(user)=>{
  return {
    username: user.username,
    userid:user._id,
    devicecollections:user.devicecollections || [],
    alarmsettings:{
      warninglevels:_.get(user,'alarmsettings.warninglevels',''),
      devicegroups:_.get(user,'alarmsettings.devicegroups',''),
      // warninglevel:_.get(user,'alarmsettings.warninglevel',''),
      // subscriberdeviceids:_.get(user,'alarmsettings.subscriberdeviceids',[]),
    }
  };
};

let setloginsuccess = (ctx,user,callback)=>{
   ctx.username = user.username;
   ctx.userid = user._id;//for test only
   if(typeof ctx.userid === "string"){
      ctx.userid = mongoose.Types.ObjectId(ctx.userid);
   }
  //  ctx.alarmsettings = _.get(user,'alarmsettings',{
  //    warninglevel:'',
  //    subscriberdeviceids:[]
  //  });
   let loginuserexptime = config.loginuserexptime;
   if(ctx.usertype === 'pc'){
     loginuserexptime = config.loginuserexptime_pc;
   }
   else if(ctx.usertype === 'app'){
     loginuserexptime = config.loginuserexptime_app;
   }
   else if(ctx.usertype === 'admin'){
     loginuserexptime = config.loginuserexptime_admin;
   }
   let userdata = getdatafromuser(user);
   userdata.token =  jwt.sign({
          exp: Math.floor(Date.now() / 1000) + loginuserexptime,
          _id:user._id,
        },config.secretkey, {});
    userdata.loginsuccess =  true;

    subscriberuser(user,ctx);

    callback({
      cmd:'login_result',
      payload:userdata
    });

    if(ctx.usertype === 'fullpc' || ctx.usertype === 'fullapp'){
      setImmediate(()=>{
        fulldeviceext.pushdeviceext({},ctx,(result)=>{
          debug(`----send push deviceext----`);
          ctx.socket.emit(result.cmd,result.payload);
        });
      });
    }
};


exports.savealarmsettings = (actiondata,ctx,callback)=>{
  const alarmsettings = actiondata;
  const userModel = DBModels.UserModel;
  userModel.findByIdAndUpdate(ctx.userid,{$set:{alarmsettings}},{new: true}).lean().exec((err,usernew)=>{
    if(!err && !!usernew){
        callback({
          cmd:'savealarmsettings_result',
          payload:{alarmsettings:usernew.alarmsettings}
        });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:`保存报警设置失败`,type:'savealarmsettings'}
      });
    }
  });
};


exports.loginuser = (actiondata,ctx,callback)=>{
  let oneUser = actiondata;
  let dbModel = DBModels.UserModel;
  dbModel.findOne({ username: oneUser.username })
    .populate([
      {
        path:'roleid',
        model: 'role',
        populate:[
        {
          path:'permissions', select:'_id name', model: 'permission'
        },
      ]
    }]).lean().exec((err, user)=> {
    if (!!err) {
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'login'}
      });
      return;
    }
    if (!user) {
      callback({
        cmd:'common_err',
        payload:{errmsg:'用户名或密码错误',type:'login'}
      });
      return;
    }
    ////console.log(user);
    pwd.hashPassword(oneUser.password, user.passwordsalt, (err, passwordHash)=> {
      if(!err && !!passwordHash){
        if (passwordHash === user.passwordhash) {
          const permissions = _.get(user,'roleid.permissions',[]);
          const findresult = _.find(permissions,(p)=>{
            if(ctx.usertype === 'pc' && p._id.toString() === '5a03b66013e7410cd0ef3093'){
              return true;
            }
            if(ctx.usertype === 'pcall' && p._id.toString() === '5a03b66013e7410cd0ef3093'){
              return true;
            }
            if(ctx.usertype === 'app' && p._id.toString() === '5a03b66e13e7410cd0ef3094'){
              return true;
            }
            //<<--------这里有改动，需特别注意============
            if(ctx.usertype === 'fullpc' && p._id.toString() === '5a03b61f13e7410cd0ef3091'){
              return true;
            }
            if(ctx.usertype === 'fullapp' && p._id.toString() === '5a03b65113e7410cd0ef3092'){
              return true;
            }
            return false;
          });
          if(!!findresult){
            userloginsuccess(user,callback,ctx);
            setloginsuccess(ctx,user,callback);
            return;
          }
          callback({
            cmd:'common_err',
            payload:{errmsg:'该用户无权限登录此平台',type:'login'}
          });
          return;
        }
      }
      callback({
        cmd:'common_err',
        payload:{errmsg:'用户名或密码错误',type:'login'}
      });
    });
  });
}

exports.loginwithtoken = (actiondata,ctx,callback)=>{
  try {
      let decodeduser = jwt.verify(actiondata.token, config.secretkey);
      ////console.log("decode user===>" + JSON.stringify(decodeduser));
      let userid = decodeduser._id;
      let userModel = DBModels.UserModel;
      userModel.findByIdAndUpdate(userid,{updated_at:moment().format('YYYY-MM-DD HH:mm:ss')},{new: true}).lean().exec((err,result)=>{
        if(!err && !!result){
          setloginsuccess(ctx,result,callback);
        }
        else{
          callback({
            cmd:'common_err',
            payload:{errmsg:'找不到该用户',type:'login'}
          });
        }
      });

    //  PubSub.publish(userid, {msg:'allriders',data:'bbbb',topic:'name'});
  } catch (e) {
    ////console.log("invalied token===>" + JSON.stringify(actiondata.token));
    ////console.log("invalied token===>" + JSON.stringify(e));
    callback({
      cmd:'common_err',
      payload:{errmsg:`登录超时,请重新登录`,type:'login'}
    });
  }

}


//==============================
exports.logout = (actiondata,ctx,callback)=>{
  srvsystem.loginuser_remove(ctx.userid,ctx.connectid);
  delete ctx.userid;
  ctx.userid = null;
  callback({
    cmd:'logout_result',
    payload:{}
  });
};

exports.changepwd = (actiondata,ctx,callback)=>{

  const dbModel = DBModels.UserModel;
  dbModel.findOne({ username: ctx.username }).lean().exec((err, user)=> {
    if (!!err) {
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'changepwd'}
      });
      return;
    }
    if (!user) {
      callback({
        cmd:'common_err',
        payload:{errmsg:'旧密码错误',type:'changepwd'}
      });
      return;
    }
    pwd.hashPassword(actiondata.password, user.passwordsalt, (err, passwordHash)=> {

        if (passwordHash === user.passwordhash) {
            const salt = uuid.v4();
            pwd.hashPassword(actiondata.passwordA,salt,(err,hashedpassword)=>{
              const newUser = {
                passwordhash:hashedpassword,
                passwordsalt:salt
              };
              //<------开始更新密码
              dbModel.findByIdAndUpdate(user._id,{$set:newUser},{new: true}).lean().exec((err,result)=>{
                if(!err && !!result){
                  callback({
                    cmd:'changepwd_result',
                    payload:{result:true}
                  });
                }
                else{
                  callback({
                    cmd:'common_err',
                    payload:{errmsg:'找不到该用户',type:'changepwd'}
                  });
                }
              });
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:'旧密码错误',type:'changepwd'}
        });
      }
  });
  });

};
