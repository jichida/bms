const _ = require('lodash');
const getFieldname = require('./mapalarmtroublecode');
const debug = require("debug")("alarmpush");
/*
1、从kafka中获取的数据，预先转换：
1>将AL_TROUBLE_CODE_2转成
*/
const devicedatapile = (data)=>{
  let newdata = data;
  const Alarm = _.get(data,'BMSData.Alarm');
  if(!!Alarm){
    //含有报警
    const AL_TROUBLE_CODE_2 = _.get(data,'BMSData.Alarm.AL_TROUBLE_CODE_2',[]);
    const CANType = _.get(data,'BMSData.CANType',-1);
    let newAlarm = _.clone(Alarm);
    newAlarm = _.omit(newAlarm,['AL_TROUBLE_CODE_2']);
    _.map(AL_TROUBLE_CODE_2,(errcode)=>{
      const fieldname = getFieldname(CANType,errcode);
      newAlarm[fieldname] = 1;
    });
    _.set(newdata,'BMSData.Alarm',newAlarm);
    _.set(newdata,'BMSData.Alarm.TROUBLE_CODE_LIST',AL_TROUBLE_CODE_2);//新增一个字段TROUBLE_CODE_LIST
    debug(`newdata--->${JSON.stringify(newAlarm)}`);
  }
  return newdata;
}
//
//
// const datatest = {
// 	"Version": "1.0",
// 	"GUID": "1D412350-8463-4707-AC46-5305BDE02791",
// 	"SN64": 16102,
// 	"DeviceId": "1641102346",
// 	"DeviceType": 0,
// 	"DeviceStatus": 0,
// 	"TroubleStatus": 0,
// 	"Temperature_PCB": 0.0,
// 	"BMSData": {
// 		"CANType": 0,
// 		"SN16": 29585,
// 		"DataTime": "2018-04-27 22:46:58",
// 		"RecvTime": "2018-04-27 22:57:30",
// 		"Alarm": {
// 			"AL_Under_Ucell": 2,
// 			"AL_Under_SOC": 1,
// 			"AL_dV_Ucell": 1,
// 			"AL_Err_Bal_Circuit": 1,
// 			"AL_Trouble_Code": 91,
//       "AL_TROUBLE_CODE_2":[0,10,1]
// 		},
// 		"BAT_U_Out_HVS": 358.0,
// 		"BAT_U_TOT_HVS": 357.9,
// 		"BAT_I_HVS": 0.0,
// 		"BAT_SOC_HVS": 9,
// 		"BAT_SOH_HVS": 100,
// 		"BAT_Ucell_Max": 3.447,
// 		"BAT_Ucell_Min": 3.274,
// 		"BAT_Ucell_Max_CSC": 1,
// 		"BAT_Ucell_Max_CELL": 1,
// 		"BAT_Ucell_Min_CSC": 9,
// 		"BAT_Ucell_Min_CELL": 9,
// 		"BAT_T_Max": 23,
// 		"BAT_T_Min": 22,
// 		"BAT_T_Avg": 22,
// 		"BAT_T_Max_CSC": 6,
// 		"BAT_T_Min_CSC": 1,
// 		"BAT_User_SOC_HVS": 12,
// 		"BAT_Ucell_Avg": 3.441,
// 		"ALIV_ST_SW_HVS": 2,
// 		"ST_AC_SW_HVS": 0,
// 		"ST_Aux_SW_HVS": 0,
// 		"ST_Main_Neg_SW_HVS": 1,
// 		"ST_Pre_SW_HVS": 0,
// 		"ST_Main_Pos_SW_HVS": 1,
// 		"ST_Chg_SW_HVS": 0,
// 		"ST_Fan_SW_HVS": 0,
// 		"ST_Heater_SW_HVS": 0,
// 		"BAT_U_HVS": 357.4,
// 		"BAT_Allow_Discharge_I": 0.0,
// 		"BAT_Allow_Charge_I": 320.0,
// 		"BAT_ISO_R_Pos": 11212,
// 		"BAT_ISO_R_Neg": 7133,
// 		"KeyOnVoltage": 13.8,
// 		"PowerVoltage": 13.8,
// 		"ChargeACVoltage": 0.0,
// 		"ChargeDCVoltage": 0.0,
// 		"CC2Voltage": 13.6,
// 		"ChargedCapacity": 0,
// 		"TotalWorkCycle": 0.6,
// 		"CSC_Power_Current": 0,
// 		"BAT_MAX_SOC_HVS": 14,
// 		"BAT_MIN_SOC_HVS": 9,
// 		"BAT_WEI_SOC_HVS": 9,
// 		"BAT_Chg_AmperReq": 0.0,
// 		"BPM_24V_Uout": 25.5,
// 		"ST_NegHeater_SW_HVS": 0,
// 		"ST_WirelessChg_SW": 0,
// 		"ST_SpearChg_SW_2": 0,
// 		"ST_PowerGridChg_SW": 0,
// 		"CC2Voltage_2": 0.0
// 	}
// };
//
// const datatest_result = devicedatapile(datatest);
// console.log(`newdata---->${JSON.stringify(datatest_result)}`)
module.exports = devicedatapile;
