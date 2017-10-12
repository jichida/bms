let config =  {
  secretkey:'bmskey',
  listenport:process.env.listenport ||5011,
  rooturl:process.env.rooturl || 'http://bms.com28.cn',
  issmsdebug:process.env.issmsdebug || false,
  publishdirtest:'../../../bms/test/build',
  publishdirapp:'../../../bms/app/build',
  publishdirpc:'../../../bms/pc/build',
  publishdiradmin:'../../../bms/admin/build',
  publishlog:'../../log',
  uploaddir:'../uploader',
  uploadurl:'/uploader',

  expRequestMinutes:200,//2分钟之内
  maxAge:86400000,
  maxDistance:3,
  authexptime:120,//验证码有效期，2分钟
  loginuserexptime:60*60*24*30,//用户登录有效期,30天
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
};



module.exports = config;
