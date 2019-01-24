export default {
  powersearch:{

  },
  warningbox:{
    title:'新消息'
  },
  addressbox:{

  },
  showmessage:{

  },
  showdevice:{
    RealtimeAlarm:{
      'SN':'数据包序号',
      'BAT_U_Out_HVS':'箱体测量电压(外侧)',
      'BAT_U_TOT_HVS':'箱体累加电压',
      'BAT_I_HVS':'箱体电流',
      'BAT_SOC_HVS':'真实SOC',
      'BAT_SOH_HVS':'SOH',
      'BAT_Ucell_Max':'最高单体电压',
      'BAT_Ucell_Min':'最低单体电压',
      'BAT_Ucell_Max_CSC':'最高单体电压所在CSC号',
      'BAT_Ucell_Max_CELL':'最高单体电压所在电芯位置',
      'BAT_Ucell_Min_CSC':'最低单体电压所在CSC号',
      'BAT_Ucell_Min_CELL':'最低单体电压所在电芯位置',
      'BAT_T_Max':'最高单体温度',
      'BAT_T_Min':'最低单体温度',
      'BAT_T_Avg':'平均单体温度',
      'BAT_T_Max_CSC':'最高温度所在CSC号',
      'BAT_T_Min_CSC':'最低温度所在CSC号',
      'BAT_User_SOC_HVS':'显示用SOC',
      'BAT_Ucell_Avg':'平均单体电压',
      'ALARM_H':'最高报警值',
      'ALARM_L':'最低报警值',
      'ALARM':'报警文本',
      'ALIV_ST_SW_HVS':'生命信号',
      'ST_AC_SW_HVS':'空调继电器状态',
      'ST_Aux_SW_HVS':'附件继电器状态',
      'ST_Main_Neg_SW_HVS':'主负继电器状态',
      'ST_Pre_SW_HVS':'预充电继电器状态',
      'ST_Main_Pos_SW_HVS':'主正继电器状态',
      'ST_Chg_SW_HVS':'充电继电器状态',
      'ST_Fan_SW_HVS':'风扇控制继电器状态',
      'ST_Heater_SW_HVS':'加热继电器状态',
      'BAT_U_HVS':'继电器内侧电压',
      'BAT_Allow_Discharge_I':'允许放电电流',
      'BAT_Allow_Charge_I':'允许充电电流',
      'BAT_ISO_R_Pos':'正极绝缘阻抗',
      'BAT_ISO_R_Neg':'负极绝缘阻抗',
      'KeyOnVoltage':'KeyOn信号电压',
      'PowerVoltage':'BMU供电电压',
      'ChargeACVoltage':'交流充电供电电压',
      'ChargeDCVoltage':'直流充电供电电压',
      'CC2Voltage':'CC2检测电压',
      'ChargedCapacity':'本次充电容量',
      'TotalWorkCycle':'总充放电循环次数',
      'CSC_Power_Current':'BMU采的CSC功耗电流',
      'BAT_MAX_SOC_HVS':'单体最大SOC',
      'BAT_MIN_SOC_HVS':'单体最小SOC',
      'BAT_WEI_SOC_HVS':'系统权重SOC',
      'BAT_Chg_AmperReq':'充电需求电流',
      'BPM_24V_Uout':'BPM24V，Uout电压采样',
      'ST_NegHeater_SW_HVS':'加热2继电器状态',
      'ST_WirelessChg_SW':'无线充电继电器状态',
      'ST_SpearChg_SW_2':'双枪充电继电器2',
      'ST_PowerGridChg_SW':'集电网充电继电器',
      'CC2Voltage_2':'CC2检测电压2',
      'ALARM_Text':'报警信息',	 	//string	 	报警信息，报警信息格式见BMS Alarm Text	BMS Alarm Text
      'Diagnostic_Text':'辅助诊断代码(155)',//	辅助诊断代码(155)	string	 	辅助诊断代码
    },
    LastHistoryTrack:{
      'GPSStatus':'是否定位',//A: 定位; V: 不定位;
      'GPSTime':'定位的UTC时间',
      'MessageTime':'',//{ type: Date, default:new Date()},//way接收到数据的本地时间，格式：yyyy-MM-dd HH:mm:ss
      'Longitude':'经度',//{ type: Schema.Types.Number,default: 0 },//经度
      'Latitude':'纬度',//{ type: Schema.Types.Number,default: 0 },//纬度
      'Speed':'速度',//{ type: Schema.Types.Number,default: 0 },//速度
      'Course':'航向',//{ type: Schema.Types.Number,default: 0 },//航向
      'DeviceStatus':'车辆状态',//String,//车辆状态
      'LAC':'蜂窝',//{ type: Schema.Types.Number,default: 0 },//	30065	uint16	蜂窝 Location Area Code
      'CellId':'',//{ type: Schema.Types.Number,default: 0 },//	53033	uint16	蜂窝 Cell Id
      'ADC1':'主板温度',//{ type: Schema.Types.Number,default: 0 },//	37.8	 	主板温度，单位：摄氏度
      'Altitude':'海拔',//{ type: Schema.Types.Number,default: 0 },//	59	 	海拔，单位：米。
      'SN':'Position数据包序号',//{ type: Schema.Types.Number,default: 0 },//	1	uint16	Position数据包序号，循环自增
      'Province':'省',//String,//	海南省	string	省
      'City':'市',//String,//	海口市	string	市
      'County':'县',//String,//	 	string	县
    },
  }
};
