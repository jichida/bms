const _ = require("lodash");
const get = _.get;

const bridge_historydeviceinfo = (item)=>{
  // let itemnew = {};
  // itemnew[`key`] = get(item,'_id','');
  // itemnew[`车辆ID`] = get(item,'DeviceId','');
  // itemnew[`采集时间`] = get(item,'DataTime','');
  // itemnew[`保存时间`] = get(item,'RecvTime','');
  // itemnew[`箱体测量电压(V)`] = get(item,'ChargeACVoltage','');
  // itemnew[`箱体累加电压(V)`] = get(item,'BAT_U_TOT_HVS','');
  // itemnew[`箱体电流(A)`] = get(item,'BAT_I_HVS','');
  // itemnew[`真实SOC(%)`] = get(item,'BAT_SOC_HVS','');
  // itemnew[`最高单体电压(V)`] = get(item,'BAT_Ucell_Max','');
  // itemnew[`最低单体电压(V)`] = get(item,'BAT_Ucell_Min','');
  // itemnew[`最高单体电压CSC号`] = get(item,'BAT_Ucell_Max_CSC','');
  // itemnew[`最高单体电芯位置`] = get(item,'BAT_Ucell_Max_CELL','');
  // itemnew[`最低单体电压CSC号`] = get(item,'BAT_Ucell_Min_CSC','');
  // itemnew[`最低单体电压电芯位置`] = get(item,'BAT_Ucell_Min_CELL','');
  // itemnew[`最高单体温度`] = get(item,'BAT_T_Max','');
  // itemnew[`最低单体温度`] = get(item,'BAT_T_Min','');
  // itemnew[`平均单体温度`] = get(item,'BAT_T_Avg','');
  // itemnew[`最高温度CSC号`] = get(item,'BAT_T_Max_CSC','');
  // itemnew[`最低温度CSC号`] = get(item,'BAT_T_Min_CSC','');
  // itemnew[`显示用SOC`] = get(item,'BAT_User_SOC_HVS','');
  // itemnew[`平均单体电压`] = get(item,'BAT_Ucell_Avg','');
  // itemnew[`报警状态`] = get(item,'alarmtxt','');
  //
  // return itemnew;
  return item;
};

module.exports= bridge_historydeviceinfo;
