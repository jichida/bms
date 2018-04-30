const DBModels = require('../db/models.js');
const pwd = require('../util/pwd');
const moment = require('moment');
const PubSub = require('pubsub-js');
const requestIp = require('request-ip');

const preaction =(actionname,collectionname,doc,fnresult)=>{
  ////console.log(`preaction doc:${JSON.stringify(doc)}`);
  if(actionname === 'save' && collectionname === 'user'){
    //新建用户,hashpassword
    let retdoc = doc;
    retdoc.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
    let passwordsalt = pwd.getsalt();
    pwd.hashPassword(retdoc.password,passwordsalt,(err,passwordhash)=>{
      retdoc.passwordsalt = passwordsalt;
      retdoc.passwordhash = passwordhash;
      fnresult(null,true);
    });
    return;
  }
  if(actionname === 'findByIdAndUpdate' && collectionname === 'device'){
    let retdoc = doc;
    retdoc.UpdateTime = moment().format('YYYY-MM-DD HH:mm:ss');
  }
  fnresult(null,true);
};

const actionnamemap = {
  'save':'新建',
  'findByIdAndUpdate':'修改',
  'delete':'删除'
};

const collectionnamemap = {
  'systemconfig':'系统设置',
  'device':'设备',
  'devicegroup':'设备分组',
  'user':'用户',
  'role':'角色',
  'permission':'权限',
  'realtimealarm':'每日报警',
  'realtimealarmraw':'实时报警',
  'historytrack':'历史轨迹',
  'historydevice':'历史设备',
  'datadict':'数据字典'
};

const postaction =(actionname,collectionname,doc,req)=>{
  const userid = req.userid;
  const actionname_s = actionnamemap[actionname];
  const collectionname_s =  collectionnamemap[collectionname];
  if(!!actionname_s && !!collectionname_s){
    const userlog = {
      remoteip:requestIp.getClientIp(req) || '',
      creator:userid,
      created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
      logtxt:`${actionname_s} ${collectionname_s}`
    };
    PubSub.publish('userlog_data',userlog);
  }

};

exports.preaction = preaction;
exports.postaction = postaction;
