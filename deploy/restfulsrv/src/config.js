const config =  {
  secretkey:'bmskey',
  listenport:process.env.listenport ||5011,
  rooturl:process.env.rooturl || 'http://bms.com28.cn',
  issmsdebug:process.env.issmsdebug || false,
  mongos:process.env.mongos==='true'?true:false,
  publishdirtest:'../../../bms/test/build',
  publishdirapp:'../../../bms/app/build',
  publishdirpc:'../../../dist/pc/build',
  publishdiradmin:'../../dist/admin',
  logdir:process.env.logdir ||'../../dist/log',
  uploaddir:process.env.uploaddir ||'../../../uploader',
  uploadurl:'/uploader',
  version:'1.5.0(build0201)',
  defaultTypeUnknow:process.env.defaultTypeUnknow || 'BUS',
  expRequestMinutes:200,//2分钟之内
  maxAge:86400000,
  maxDistance:3,
  authexptime:120,//验证码有效期，2分钟
  loginuserexptime:60*60*1,//用户登录有效期,1小时
  loginuserexptime_admin:60*60*1,//用户登录有效期,1小时
  loginuserexptime_pc:60*60*2,//用户登录有效期,2小时
  loginuserexptime_app:60*60*24*30,//用户登录有效期,30天
  mongodburl:process.env.MONGO_URL || 'mongodb://bms.com28.cn:27018/bmscatl',
  mysqlconfig:{
    host: process.env.mysqlhost || '121.204.135.87',
    user: process.env.mysqluser || 'root',
    password: process.env.mysqlpassword || '%c?D:8Bv',
    database: process.env.mysqldb || 'catltest'
  },
  mapdict:{},
  pushdevicetopic:'pushdevice',
  pushdeviceexttopic:'pushdeviceext',
  defaultmappopclusterfields:[
    'TotalWorkCycle','ChargeACVoltage','BAT_I_HVS',
  ],
  defaultmappopfields:[
    'TotalWorkCycle','ChargeACVoltage','BAT_I_HVS','BAT_ISO_R_Pos','BAT_ISO_R_Neg',
    'BAT_Ucell_Max','BAT_Ucell_Min','BAT_Ucell_Avg','BAT_T_Max','BAT_T_Min','BAT_T_Avg'],
  defaultmapdetailfields:[
    {
      groupname:'基本信息',
      fieldslist:['TotalWorkCycle','ChargeACVoltage','BAT_I_HVS','BAT_ISO_R_Pos','BAT_ISO_R_Neg',]
    },
    {
      groupname:'GPS信息',
      fieldslist:['TotalWorkCycle',]
    },
    {
      groupname:'车辆状态',
      fieldslist:['ChargeACVoltage']
    },
    {
      groupname:'电池类信息',
      fieldslist:['BAT_Ucell_Max','BAT_Ucell_Min','BAT_Ucell_Avg','BAT_T_Max','BAT_T_Min','BAT_T_Min',]
    },
  ],
  listresult_grouped:{},
  catlmysqldata:{}
};



module.exports = config;
