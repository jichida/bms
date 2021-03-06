const mongoose     = require('mongoose');
const _  = require('lodash');
const jwt = require('jsonwebtoken');
const moment  = require('moment');
const requestIp = require('request-ip');
const config = require('../../config.js');
const pwd = require('../../util/pwd.js');
const DBModels = require('../../db/models.js');
const PubSub = require('pubsub-js');

const adminauth = (req,res)=>{
  const actiondata =   req.body;
  ////console.log("actiondata=>" + JSON.stringify(actiondata));
  const organizationid = mongoose.Types.ObjectId(req.params.organizationid);
  ////console.log(`--organizationid=>${organizationid}`);

  const userModel = DBModels.UserModel;
  // userModel.findOne({ username: actiondata.username,adminflag:1 },
  userModel.findOne({ username: actiondata.username })
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
      //console.log(err);
      res.status(200).json({
        loginsuccess:false,
        err:'服务器内部错误'
      });
      return;
    }
    if (!user) {
      res.status(200).json({
        loginsuccess:false,
        err:'该用户不存在'
      });
      return;
    }
    // if(!user.organizationid){
    //   res.status(200).json({
    //     loginsuccess:false,
    //     err:'用户尚未分配'
    //   });
    //   return;
    // }
    pwd.checkPassword(user.passwordhash,user.passwordsalt,actiondata.password,(err,isloginsuccess)=>{
      if(!err && isloginsuccess){
        let adminflag = user.adminflag;
        if(adminflag === 1){
          //超级用户
        }
        else{
          //普通后台用户
          const permissions = _.get(user,'roleid.permissions',[]);
          const findresult = _.find(permissions,(p)=>{
            return  p._id.toString() === '5a03b61113e7410cd0ef3090';
          });
          if(!findresult){
            res.status(200).json({
              loginsuccess:false,
              err:'用户无权限登录后台'
            });
            return;
          }
        }
        let token = jwt.sign({
              exp: Math.floor(Date.now() / 1000) +config.loginuserexptime_admin || config.loginuserexptime,
              _id:user._id,
              usertype:adminflag === 1?'admin':'user',
              groupid:user.groupid,
              // organizationid:user.organizationid,
            },config.secretkey, {});

        const userlog = {
          remoteip:requestIp.getClientIp(req) || '',
          creator:user._id,
          created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
          logtxt:`用户登录`
        };
        PubSub.publish('userlog_data',userlog);

        res.status(200).json({
          loginsuccess:true,
          token:token
        });
      }
      else{
        res.status(200).json({
          loginsuccess:false,
          err:'用户名或密码错误'
        });
      }
    });
  });
}

module.exports= adminauth;
