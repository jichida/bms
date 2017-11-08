let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;
let mongoosePaginate = require('mongoose-paginate');
const config = require('../config.js');
const moment = require('moment');

mongoose.Promise = global.Promise;
//系统设置
let SystemConfigSchema = new Schema({
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  mappopfields:[],//地图上显示的字读列表
});
SystemConfigSchema.plugin(mongoosePaginate);
let SystemConfigModel =mongoose.model('systemconfig',  SystemConfigSchema);

//设备
let DeviceSchema = new Schema({
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  DeviceId:String,
  LastRealtimeAlarm:{
    DataTime:{ type: Date, default:new Date()},	//2017-03-28 08:00:00	date	 	采集本地时间，格式：yyyy-MM-dd HH:mm:ss
    MessageTime:{ type: Date, default:new Date()},//	2017-03-28 08:00:00	date	 	Gateway接收到数据的本地时间，格式：yyyy-MM-dd HH:mm:ss
    SN:{ type: Schema.Types.Number,default: 0 },//CAN数据包序号，循环自增
    BAT_U_Out_HVS:{ type: Schema.Types.Number,default: 0 },//箱体测量电压(外侧)_(正值为正向电压，负值为反向电压)
    BAT_U_TOT_HVS:{ type: Schema.Types.Number,default: 0 },//箱体累加电压
    BAT_I_HVS:{ type: Schema.Types.Number,default: 0 },//箱体电流
    BAT_SOC_HVS:{ type: Schema.Types.Number,default: 0 },//真实SOC
    BAT_SOH_HVS:{ type: Schema.Types.Number,default: 0 },//SOH
    BAT_Ucell_Max:{ type: Schema.Types.Number,default: 0 },//最高单体电压
    BAT_Ucell_Min:{ type: Schema.Types.Number,default: 0 },//最低单体电压
    BAT_Ucell_Max_CSC:{ type: Schema.Types.Number,default: 0 },//最高单体电压所在CSC号
    BAT_Ucell_Max_CELL:{ type: Schema.Types.Number,default: 0 },//最高单体电压所在电芯位置
    BAT_Ucell_Min_CSC:{ type: Schema.Types.Number,default: 0 },//最低单体电压所在CSC号
    BAT_Ucell_Min_CELL:{ type: Schema.Types.Number,default: 0 },//最低单体电压所在电芯位置
    BAT_T_Max:{ type: Schema.Types.Number,default: 0 },//最高单体温度
    BAT_T_Min:{ type: Schema.Types.Number,default: 0 },//最低单体温度
    BAT_T_Avg:{ type: Schema.Types.Number,default: 0 },//平均单体温度
    BAT_T_Max_CSC:{ type: Schema.Types.Number,default: 0 },//最高温度所在CSC号
    BAT_T_Min_CSC:{ type: Schema.Types.Number,default: 0 },//最低温度所在CSC号
    BAT_User_SOC_HVS:{ type: Schema.Types.Number,default: 0 },//显示用SOC
    BAT_Ucell_Avg:{ type: Schema.Types.Number,default: 0 },//平均单体电压
    ALARM_H:{ type: Schema.Types.Number,default: 0 },
    ALARM_L:{ type: Schema.Types.Number,default: 0 },
    ALARM:String,
    ALIV_ST_SW_HVS:{ type: Schema.Types.Number,default: 0 },//生命信号,0~15循环
    ST_AC_SW_HVS:{ type: Schema.Types.Number,default: 0 },//空调继电器状态，0 "Off" 1 "On"
    ST_Aux_SW_HVS:{ type: Schema.Types.Number,default: 0 },//附件继电器状态，0 "Off" 1 "On"
    ST_Main_Neg_SW_HVS:{ type: Schema.Types.Number,default: 0 },//主负继电器状态，0 "Off" 1 "On"
    ST_Pre_SW_HVS:{ type: Schema.Types.Number,default: 0 },//预充电继电器状态，0 "Off" 1 "On"
    ST_Main_Pos_SW_HVS:{ type: Schema.Types.Number,default: 0 },//主正继电器状态，0 "Off" 1 "On"
    ST_Chg_SW_HVS:{ type: Schema.Types.Number,default: 0 },//充电继电器状态，0 "Off" 1 "On"
    ST_Fan_SW_HVS:{ type: Schema.Types.Number,default: 0 },//风扇控制继电器状态，0 "Off" 1 "On"
    ST_Heater_SW_HVS:{ type: Schema.Types.Number,default: 0 },//加热继电器状态，0 "Off" 1 "On"
    BAT_U_HVS:{ type: Schema.Types.Number,default: 0 },//继电器内侧电压_(正值为正向电压，负值为反向电压)
    BAT_Allow_Discharge_I:{ type: Schema.Types.Number,default: 0 },//允许放电电流
    BAT_Allow_Charge_I:{ type: Schema.Types.Number,default: 0 },//允许充电电流
    BAT_ISO_R_Pos:{ type: Schema.Types.Number,default: 0 },//正极绝缘阻抗
    BAT_ISO_R_Neg:{ type: Schema.Types.Number,default: 0 },//负极绝缘阻抗
    KeyOnVoltage:{ type: Schema.Types.Number,default: 0 },//KeyOn信号电压
    PowerVoltage:{ type: Schema.Types.Number,default: 0 },//BMU供电电压
    ChargeACVoltage:{ type: Schema.Types.Number,default: 0 },//交流充电供电电压
    ChargeDCVoltage:{ type: Schema.Types.Number,default: 0 },//直流充电供电电压
    CC2Voltage:{ type: Schema.Types.Number,default: 0 },//CC2检测电压
    ChargedCapacity:{ type: Schema.Types.Number,default: 0 },//本次充电容量
    TotalWorkCycle:{ type: Schema.Types.Number,default: 0 },//总充放电循环次数
    CSC_Power_Current:{ type: Schema.Types.Number,default: 0 },//BMU采的CSC功耗电流
    BAT_MAX_SOC_HVS:{ type: Schema.Types.Number,default: 0 },//单体最大SOC
    BAT_MIN_SOC_HVS:{ type: Schema.Types.Number,default: 0 },//单体最小SOC
    BAT_WEI_SOC_HVS:{ type: Schema.Types.Number,default: 0 },//系统权重SOC
    BAT_Chg_AmperReq:{ type: Schema.Types.Number,default: 0 },//充电需求电流
    BPM_24V_Uout:{ type: Schema.Types.Number,default: 0 },//BPM24V，Uout电压采样
    ST_NegHeater_SW_HVS:{ type: Schema.Types.Number,default: 0 },//加热2继电器状态
    ST_WirelessChg_SW:{ type: Schema.Types.Number,default: 0 },//无线充电继电器状态
    ST_SpearChg_SW_2:{ type: Schema.Types.Number,default: 0 },//双枪充电继电器2
    ST_PowerGridChg_SW:{ type: Schema.Types.Number,default: 0 },//集电网充电继电器
    CC2Voltage_2:{ type: Schema.Types.Number,default: 0 },//CC2检测电压2
    ALARM_Text:String,	 	//string	 	报警信息，报警信息格式见BMS Alarm Text	BMS Alarm Text
    Diagnostic_Text:String,//	辅助诊断代码(155)	string	 	辅助诊断代码
  },
  LastHistoryTrack:{
    GPSStatus:String,//A: 定位; V: 不定位;
    GPSTime:{ type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},//定位的UTC时间，格式：yyyy-MM-dd HH:mm:ss
    MessageTime:{ type: Date, default:new Date()},//way接收到数据的本地时间，格式：yyyy-MM-dd HH:mm:ss
    Longitude:{ type: Schema.Types.Number,default: 0 },//经度
    Latitude:{ type: Schema.Types.Number,default: 0 },//纬度
    Speed:{ type: Schema.Types.Number,default: 0 },//速度
    Course:{ type: Schema.Types.Number,default: 0 },//航向
    DeviceStatus:String,//设备状态
    LAC:{ type: Schema.Types.Number,default: 0 },//	30065	uint16	蜂窝 Location Area Code
    CellId:{ type: Schema.Types.Number,default: 0 },//	53033	uint16	蜂窝 Cell Id
    ADC1:{ type: Schema.Types.Number,default: 0 },//	37.8	 	主板温度，单位：摄氏度
    Altitude:{ type: Schema.Types.Number,default: 0 },//	59	 	海拔，单位：米。
    SN:{ type: Schema.Types.Number,default: 0 },//	1	uint16	Position数据包序号，循环自增
    Province:String,//	海南省	string	省
    City:String,//	海口市	string	市
    County:String,//	 	string	县
  },
  imagetype:String,
  TPData:{
    "DataTime":{type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},
    "TP1":String,
    "TP2":String,
    "TP3":String,
    "TP4":String,
    "TP5":String,
  },
  created_at: { type: Date, default:new Date()},
  updated_at:{ type: Date, default:new Date()},//插入数据库时间

});
DeviceSchema.plugin(mongoosePaginate);
let DeviceModel =mongoose.model('device',  DeviceSchema);

//设备分组
let DeviceGroupSchema = new Schema({
  name:String,
  memo:String,
  contact:String,
  deviceids:[{ type: Schema.Types.ObjectId, ref: 'device', default: [] }],
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
});
DeviceGroupSchema.plugin(mongoosePaginate);
let DeviceGroupModel =mongoose.model('devicegroup',  DeviceGroupSchema);

//用户
let UserSchema = new Schema({
  username:String,
  passwordhash: String,
  passwordsalt: String,
  created_at: { type: Date, default:new Date()},
  updated_at: Date,
  groupid:{ type: Schema.Types.ObjectId, ref: 'usergroup' },
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  roleid:{ type: Schema.Types.ObjectId, ref: 'role' },
  adminflag:{ type: Schema.Types.Number,default: 0 },
});
UserSchema.plugin(mongoosePaginate);
let UserModel =mongoose.model('user',  UserSchema);

//组织
let OrganizationSchema = new Schema({
  name:String,
  memo:String,
  contact:String,
});
OrganizationSchema.plugin(mongoosePaginate);
let OrganizationModel =mongoose.model('organization',  OrganizationSchema);

//用户分组
let UserGroupSchema = new Schema({
  name:String,
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  roleid:{ type: Schema.Types.ObjectId, ref: 'role' },
  memo:String,
  contact:String,
});
UserGroupSchema.plugin(mongoosePaginate);
let UserGroupModel =mongoose.model('usergroup',  UserGroupSchema);

//权限
let PermissionSchema = new Schema({
  keyname:String,
  type:String,//数据/功能
  name:String,
  memo:String,
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
});
PermissionSchema.plugin(mongoosePaginate);
let PermissionModel =mongoose.model('permission',  PermissionSchema);

//角色
let RoleSchema = new Schema({
  name:String,
  memo:String,
  permissions:[{ type: Schema.Types.ObjectId, ref: 'permission', default: [] }],
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
});
RoleSchema.plugin(mongoosePaginate);
let RoleModel =mongoose.model('role',  RoleSchema);

//实时告警信息
let RealtimeAlarmSchema= new Schema({
  DeviceId:String,//	1627100306	string
  DataTime:{ type: Date, default:new Date()},	//2017-03-28 08:00:00	date	 	采集本地时间，格式：yyyy-MM-dd HH:mm:ss
  MessageTime:{ type: Date, default:new Date()},//	2017-03-28 08:00:00	date	 	Gateway接收到数据的本地时间，格式：yyyy-MM-dd HH:mm:ss
  SN:{ type: Schema.Types.Number,default: 0 },//CAN数据包序号，循环自增
  BAT_U_Out_HVS:{ type: Schema.Types.Number,default: 0 },//箱体测量电压(外侧)_(正值为正向电压，负值为反向电压)
  BAT_U_TOT_HVS:{ type: Schema.Types.Number,default: 0 },//箱体累加电压
  BAT_I_HVS:{ type: Schema.Types.Number,default: 0 },//箱体电流
  BAT_SOC_HVS:{ type: Schema.Types.Number,default: 0 },//真实SOC
  BAT_SOH_HVS:{ type: Schema.Types.Number,default: 0 },//SOH
  BAT_Ucell_Max:{ type: Schema.Types.Number,default: 0 },//最高单体电压
  BAT_Ucell_Min:{ type: Schema.Types.Number,default: 0 },//最低单体电压
  BAT_Ucell_Max_CSC:{ type: Schema.Types.Number,default: 0 },//最高单体电压所在CSC号
  BAT_Ucell_Max_CELL:{ type: Schema.Types.Number,default: 0 },//最高单体电压所在电芯位置
  BAT_Ucell_Min_CSC:{ type: Schema.Types.Number,default: 0 },//最低单体电压所在CSC号
  BAT_Ucell_Min_CELL:{ type: Schema.Types.Number,default: 0 },//最低单体电压所在电芯位置
  BAT_T_Max:{ type: Schema.Types.Number,default: 0 },//最高单体温度
  BAT_T_Min:{ type: Schema.Types.Number,default: 0 },//最低单体温度
  BAT_T_Avg:{ type: Schema.Types.Number,default: 0 },//平均单体温度
  BAT_T_Max_CSC:{ type: Schema.Types.Number,default: 0 },//最高温度所在CSC号
  BAT_T_Min_CSC:{ type: Schema.Types.Number,default: 0 },//最低温度所在CSC号
  BAT_User_SOC_HVS:{ type: Schema.Types.Number,default: 0 },//显示用SOC
  BAT_Ucell_Avg:{ type: Schema.Types.Number,default: 0 },//平均单体电压
  ALARM_H:{ type: Schema.Types.Number,default: 0 },
  ALARM_L:{ type: Schema.Types.Number,default: 0 },
  ALARM:String,
  ALIV_ST_SW_HVS:{ type: Schema.Types.Number,default: 0 },//生命信号,0~15循环
  ST_AC_SW_HVS:{ type: Schema.Types.Number,default: 0 },//空调继电器状态，0 "Off" 1 "On"
  ST_Aux_SW_HVS:{ type: Schema.Types.Number,default: 0 },//附件继电器状态，0 "Off" 1 "On"
  ST_Main_Neg_SW_HVS:{ type: Schema.Types.Number,default: 0 },//主负继电器状态，0 "Off" 1 "On"
  ST_Pre_SW_HVS:{ type: Schema.Types.Number,default: 0 },//预充电继电器状态，0 "Off" 1 "On"
  ST_Main_Pos_SW_HVS:{ type: Schema.Types.Number,default: 0 },//主正继电器状态，0 "Off" 1 "On"
  ST_Chg_SW_HVS:{ type: Schema.Types.Number,default: 0 },//充电继电器状态，0 "Off" 1 "On"
  ST_Fan_SW_HVS:{ type: Schema.Types.Number,default: 0 },//风扇控制继电器状态，0 "Off" 1 "On"
  ST_Heater_SW_HVS:{ type: Schema.Types.Number,default: 0 },//加热继电器状态，0 "Off" 1 "On"
  BAT_U_HVS:{ type: Schema.Types.Number,default: 0 },//继电器内侧电压_(正值为正向电压，负值为反向电压)
  BAT_Allow_Discharge_I:{ type: Schema.Types.Number,default: 0 },//允许放电电流
  BAT_Allow_Charge_I:{ type: Schema.Types.Number,default: 0 },//允许充电电流
  BAT_ISO_R_Pos:{ type: Schema.Types.Number,default: 0 },//正极绝缘阻抗
  BAT_ISO_R_Neg:{ type: Schema.Types.Number,default: 0 },//负极绝缘阻抗
  KeyOnVoltage:{ type: Schema.Types.Number,default: 0 },//KeyOn信号电压
  PowerVoltage:{ type: Schema.Types.Number,default: 0 },//BMU供电电压
  ChargeACVoltage:{ type: Schema.Types.Number,default: 0 },//交流充电供电电压
  ChargeDCVoltage:{ type: Schema.Types.Number,default: 0 },//直流充电供电电压
  CC2Voltage:{ type: Schema.Types.Number,default: 0 },//CC2检测电压
  ChargedCapacity:{ type: Schema.Types.Number,default: 0 },//本次充电容量
  TotalWorkCycle:{ type: Schema.Types.Number,default: 0 },//总充放电循环次数
  CSC_Power_Current:{ type: Schema.Types.Number,default: 0 },//BMU采的CSC功耗电流
  BAT_MAX_SOC_HVS:{ type: Schema.Types.Number,default: 0 },//单体最大SOC
  BAT_MIN_SOC_HVS:{ type: Schema.Types.Number,default: 0 },//单体最小SOC
  BAT_WEI_SOC_HVS:{ type: Schema.Types.Number,default: 0 },//系统权重SOC
  BAT_Chg_AmperReq:{ type: Schema.Types.Number,default: 0 },//充电需求电流
  BPM_24V_Uout:{ type: Schema.Types.Number,default: 0 },//BPM24V，Uout电压采样
  ST_NegHeater_SW_HVS:{ type: Schema.Types.Number,default: 0 },//加热2继电器状态
  ST_WirelessChg_SW:{ type: Schema.Types.Number,default: 0 },//无线充电继电器状态
  ST_SpearChg_SW_2:{ type: Schema.Types.Number,default: 0 },//双枪充电继电器2
  ST_PowerGridChg_SW:{ type: Schema.Types.Number,default: 0 },//集电网充电继电器
  CC2Voltage_2:{ type: Schema.Types.Number,default: 0 },//CC2检测电压2
  ALARM_Text:String,	 	//string	 	报警信息，报警信息格式见BMS Alarm Text	BMS Alarm Text
  Diagnostic_Text:String,//	辅助诊断代码(155)	string	 	辅助诊断代码
});
RealtimeAlarmSchema.plugin(mongoosePaginate);
let RealtimeAlarmModel =mongoose.model('realtimealarm',  RealtimeAlarmSchema);

//设备轨迹
let HistoryTrackSchema = new Schema({
  DeviceId:String,//设备id
  GPSStatus:String,//A: 定位; V: 不定位;
  GPSTime:{ type: String, default:moment().format('YYYY-MM-DD HH:mm:ss')},//定位的UTC时间，格式：yyyy-MM-dd HH:mm:ss
  MessageTime:{ type: Date, default:new Date()},//way接收到数据的本地时间，格式：yyyy-MM-dd HH:mm:ss
  Longitude:{ type: Schema.Types.Number,default: 0 },//经度
  Latitude:{ type: Schema.Types.Number,default: 0 },//纬度
  Speed:{ type: Schema.Types.Number,default: 0 },//速度
  Course:{ type: Schema.Types.Number,default: 0 },//航向
  DeviceStatus:String,//设备状态
  LAC:{ type: Schema.Types.Number,default: 0 },//	30065	uint16	蜂窝 Location Area Code
  CellId:{ type: Schema.Types.Number,default: 0 },//	53033	uint16	蜂窝 Cell Id
  ADC1:{ type: Schema.Types.Number,default: 0 },//	37.8	 	主板温度，单位：摄氏度
  Altitude:{ type: Schema.Types.Number,default: 0 },//	59	 	海拔，单位：米。
  SN:{ type: Schema.Types.Number,default: 0 },//	1	uint16	Position数据包序号，循环自增
  Province:String,//	海南省	string	省
  City:String,//	海口市	string	市
  County:String,//	 	string	县
  created_at:{ type: Date, default:new Date()},//插入数据库时间
  updated_at:{ type: Date, default:new Date()},//插入数据库时间
});
HistoryTrackSchema.plugin(mongoosePaginate);
let HistoryTrackModel =mongoose.model('historytrack',  HistoryTrackSchema);
//CAN 数据,原始数据
let CanRawDataSchema = new Schema({
  DeviceId:String,//设备id
  DataTime:{ type: Date, default:new Date()},	//2017-03-28 08:00:00	date	 	采集本地时间，格式：yyyy-MM-dd HH:mm:ss
  MessageTime:{ type: Date, default:new Date()},//	2017-03-28 08:00:00	date	 	Gateway接收到数据的本地时间，格式：yyyy-MM-dd HH:mm:ss
  SN:String,//sn
  Data:String,//
  created_at:{ type: Date, default:new Date()},//插入数据库时间
});
CanRawDataSchema.plugin(mongoosePaginate);
let CanRawDataModel =mongoose.model('canrawdata',  CanRawDataSchema);

//设备历史信息
let HistoryDeviceSchema = new Schema({
  deviceid:{ type: Schema.Types.ObjectId, ref: 'device' },
});
HistoryDeviceSchema.plugin(mongoosePaginate);
let HistoryDeviceModel =mongoose.model('historydevice',  HistoryDeviceSchema);

//登录日志
let UserLogSchema = new Schema({
    username:String,
    organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
    created_at:{ type: Date, default:new Date()},
    creator:{ type: Schema.Types.ObjectId, ref: 'user' },
    type:{type:String,default:'login'}
});
UserLogSchema.plugin(mongoosePaginate);
let UserLogModel =mongoose.model('userlog',  UserLogSchema);


UserAdminSchema = new Schema({
  username:String,
  passwordhash: String,
  passwordsalt: String,
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  created_at: { type: Date, default:new Date()},
  updated_at: Date,
});
let UserAdmin  = mongoose.model('useradmin',  UserAdminSchema);



exports.UserAdminSchema = UserAdminSchema;
exports.SystemConfigSchema = SystemConfigSchema;
exports.DeviceSchema = DeviceSchema;
exports.DeviceGroupSchema = DeviceGroupSchema;
exports.OrganizationSchema = OrganizationSchema;
exports.UserSchema = UserSchema;
exports.UserGroupSchema = UserGroupSchema;
exports.PermissionSchema = PermissionSchema;
exports.RoleSchema = RoleSchema;
exports.RealtimeAlarmSchema = RealtimeAlarmSchema;
exports.CanRawDataSchema = CanRawDataSchema;
exports.HistoryTrackSchema = HistoryTrackSchema;
exports.HistoryDeviceSchema = HistoryDeviceSchema;
exports.UserLogSchema = UserLogSchema;

exports.UserAdminModel = UserAdmin;
exports.SystemConfigModel = SystemConfigModel;
exports.DeviceModel = DeviceModel;
exports.DeviceGroupModel = DeviceGroupModel;
exports.OrganizationModel = OrganizationModel;
exports.UserModel = UserModel;
exports.UserGroupModel = UserGroupModel;
exports.PermissionModel = PermissionModel;
exports.RoleModel = RoleModel;
exports.RealtimeAlarmModel = RealtimeAlarmModel;
exports.CanRawDataModel = CanRawDataModel;
exports.HistoryTrackModel = HistoryTrackModel;
exports.HistoryDeviceModel = HistoryDeviceModel;
exports.UserLogModel = UserLogModel;
