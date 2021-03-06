const start = require('./src/lib/export_history_shell');

start.startexport_do(`1808202984`,`/catlcluster/exportdir2`,'2018-09-29',()=>{

});

//---MONGO_URL=mongodb://192.168.2.18:12017,192.168.2.13:12017,192.168.2.14:12017,192.168.2.15:12017/bmscatl node utest.js

//result:
/*
mongoexport --uri=mongodb://192.168.2.18:12017,192.168.2.13:12017,192.168.2.14:12017,192.168.2.15:12017/bmscatl --type=csv -c historydevices --out /catlcluster/exportdir2/20180929_1808202984.csv --fields=DeviceId,DataTime,SaveTime,BAT_U_OUT_HVS,BAT_U_TOT_HVS,BAT_I_HVS,BAT_SOC_HVS,BAT_SOH_HVS,BAT_UCELL_MAX,BAT_UCELL_MIN,BAT_UCELL_MAX_CSC,BAT_UCELL_MAX_CELL,BAT_UCELL_MIN_CSC,BAT_UCELL_MIN_CELL,BAT_T_MAX,BAT_T_MIN,BAT_T_AVG,BAT_T_MAX_CSC,BAT_T_MIN_CSC,BAT_USER_SOC_HVS,BAT_UCELL_AVG,ALARM,ALIV_ST_SW_HVS,ST_AC_SW_HVS,ST_AUX_SW_HVS,ST_MAIN_NEG_SW_HVS,ST_PRE_SW_HVS,ST_MAIN_POS_SW_HVS,ST_CHG_SW_HVS,ST_FAN_SW_HVS,ST_HEATER_SW_HVS,BAT_U_HVS,BAT_ALLOW_DISCHARGE_I,BAT_ALLOW_CHARGE_I,BAT_ISO_R_POS,BAT_ISO_R_NEG,KEYONVOLTAGE,POWERVOLTAGE,CHARGEACVOLTAGE,CHARGEDCVOLTAGE,CC2VOLTAGE,CHARGEDCAPACITY,TOTALWORKCYCLE,CSC_POWER_CURRENT,BAT_MAX_SOC_HVS,BAT_MIN_SOC_HVS,BAT_WEI_SOC_HVS,BAT_CHG_AMPERREQ,BPM_24V_UOUT,ST_NEGHEATER_SW_HVS,ST_WIRELESSCHG_SW,ST_SPEARCHG_SW_2,ST_POWERGRIDCHG_SW,CC2VOLTAGE_2,DIAG_H,DIAG_L --query='{"DeviceId":"1808202984","TimeKey":"180929"}'


mongoexport --uri=mongodb://192.168.2.18:12017,192.168.2.13:12017,192.168.2.14:12017,192.168.2.15:12017/bmscatl --type=csv -c historydevices --out "/catlcluster/exportdir2/20180929(7)/20180929_1727100822.csv" --fields=DeviceId,DataTime,UpdateTime,BAT_U_OUT_HVS,BAT_U_TOT_HVS,BAT_I_HVS,BAT_SOC_HVS,BAT_SOH_HVS,BAT_UCELL_MAX,BAT_UCELL_MIN,BAT_UCELL_MAX_CSC,BAT_UCELL_MAX_CELL,BAT_UCELL_MIN_CSC,BAT_UCELL_MIN_CELL,BAT_T_MAX,BAT_T_MIN,BAT_T_AVG,BAT_T_MAX_CSC,BAT_T_MIN_CSC,BAT_USER_SOC_HVS,BAT_UCELL_AVG,alarmtxtstat,ALIV_ST_SW_HVS,ST_AC_SW_HVS,ST_AUX_SW_HVS,ST_MAIN_NEG_SW_HVS,ST_PRE_SW_HVS,ST_MAIN_POS_SW_HVS,ST_CHG_SW_HVS,ST_FAN_SW_HVS,ST_HEATER_SW_HVS,BAT_U_HVS,BAT_ALLOW_DISCHARGE_I,BAT_ALLOW_CHARGE_I,BAT_ISO_R_POS,BAT_ISO_R_NEG,KEYONVOLTAGE,POWERVOLTAGE,CHARGEACVOLTAGE,CHARGEDCVOLTAGE,CC2VOLTAGE,CHARGEDCAPACITY,TOTALWORKCYCLE,CSC_POWER_CURRENT,BAT_MAX_SOC_HVS,BAT_MIN_SOC_HVS,BAT_WEI_SOC_HVS,BAT_CHG_AMPERREQ,BPM_24V_UOUT,ST_NEGHEATER_SW_HVS,ST_WIRELESSCHG_SW,ST_SPEARCHG_SW_2,ST_POWERGRIDCHG_SW,CC2VOLTAGE_2,DIAG_H,DIAG_L --query='{"DeviceId":"1727100822","TimeKey":"180929"}'

 sed -i "1s/.*/DeviceId,DataTime,SaveTime,BAT_U_OUT_HVS,BAT_U_TOT_HVS,BAT_I_HVS,BAT_SOC_HVS,BAT_SOH_HVS,BAT_UCELL_MAX,BAT_UCELL_MIN,BAT_UCELL_MAX_CSC,BAT_UCELL_MAX_CELL,BAT_UCELL_MIN_CSC,BAT_UCELL_MIN_CELL,BAT_T_MAX,BAT_T_MIN,BAT_T_AVG,BAT_T_MAX_CSC,BAT_T_MIN_CSC,BAT_USER_SOC_HVS,BAT_UCELL_AVG,ALARM,ALIV_ST_SW_HVS,ST_AC_SW_HVS,ST_AUX_SW_HVS,ST_MAIN_NEG_SW_HVS,ST_PRE_SW_HVS,ST_MAIN_POS_SW_HVS,ST_CHG_SW_HVS,ST_FAN_SW_HVS,ST_HEATER_SW_HVS,BAT_U_HVS,BAT_ALLOW_DISCHARGE_I,BAT_ALLOW_CHARGE_I,BAT_ISO_R_POS,BAT_ISO_R_NEG,KEYONVOLTAGE,POWERVOLTAGE,CHARGEACVOLTAGE,CHARGEDCVOLTAGE,CC2VOLTAGE,CHARGEDCAPACITY,TOTALWORKCYCLE,CSC_POWER_CURRENT,BAT_MAX_SOC_HVS,BAT_MIN_SOC_HVS,BAT_WEI_SOC_HVS,BAT_CHG_AMPERREQ,BPM_24V_UOUT,ST_NEGHEATER_SW_HVS,ST_WIRELESSCHG_SW,ST_SPEARCHG_SW_2,ST_POWERGRIDCHG_SW,CC2VOLTAGE_2,DIAG_H,DIAG_L/" "/catlcluster/exportdir2/20180929(7)/20180929_1727100822.csv"

db.users.aggregate([{$project:{id:"$user_id"}}])


sed -i '1itask goes here' todo.txt
*/
