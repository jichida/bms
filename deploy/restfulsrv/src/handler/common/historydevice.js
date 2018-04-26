const config = require('../../config.js');
const DBModels = require('../../db/models.js');
const mongoose  = require('mongoose');
const winston = require('../../log/log.js');
const _ = require('lodash');
const moment = require('moment');
const getdevicesids = require('../getdevicesids');
const debug = require('debug')('srvapp:historydevice');

const get = _.get;

exports.uireport_searchhistorydevice =  (actiondata,ctx,callback)=>{
  // PC端获取数据--->{"cmd":"searchbatteryalarm","data":{"query":{"queryalarm":{"warninglevel":0}}}}
  const historydeviceModel = DBModels.HistoryDeviceModel;
  const query = actiondata.query || {};
  getdevicesids(ctx.userid,({devicegroupIds,deviceIds,isall})=>{
    if(!query.DeviceId && !isall){
      query.DeviceId = {'$in':deviceIds};
    }
    // //console.log(query);
    debug(`uireport_searchhistorydevice start--->`);
    actiondata.options = actiondata.options || {};
    actiondata.options.lean = true;
    historydeviceModel.paginate(query,actiondata.options,(err,result)=>{
      debug(`uireport_searchhistorydevice end--->`);
      if(!err){
        // result = JSON.parse(JSON.stringify(result));
        let docs = [];
        _.map(result.docs,(record)=>{
          docs.push(record);
        });

        callback({
          cmd:'uireport_searchhistorydevice_result',
          payload:{result}
        });
      }
      else{
        callback({
          cmd:'common_err',
          payload:{errmsg:err.message,type:'uireport_searchhistorydevice'}
        });
      }
    });
  });
}

// '采集时间',
// '保存时间',
// '箱体测量电压(V)',
// '箱体累加电压(V)',
// '箱体电流(A)',
// '真实SOC(%)',
// '最高单体电压(V)',
// '最低单体电压(V)',
// '最高单体电压CSC号',
// '最高单体电芯位置',
// '最低单体电压CSC号',
// '最低单体电压电芯位置',
// '最高单体温度',
// '最低单体温度',
// '平均单体温度',
// '最高温度CSC号',
// '最低温度CSC号',
// '显示用SOC',
// '平均单体电压',
// '报警信息',
const bridge_historydeviceinfo = (item)=>{
  let itemnew = {};
  itemnew[`key`] = get(item,'_id','');
  itemnew[`kafka偏移量`] = get(item,'recvoffset','');
  itemnew[`车辆ID`] = get(item,'DeviceId','');
  itemnew[`采集时间`] = get(item,'DataTime','');
  itemnew[`保存时间`] = get(item,'UpdateTime','');
  itemnew[`箱体测量电压(V)`] = get(item,'ChargeACVoltage','');
  itemnew[`箱体累加电压(V)`] = get(item,'BAT_U_TOT_HVS','');
  itemnew[`箱体电流(A)`] = get(item,'BAT_I_HVS','');
  itemnew[`真实SOC(%)`] = get(item,'BAT_SOC_HVS','');
  itemnew[`最高单体电压(V)`] = get(item,'BAT_Ucell_Max','');
  itemnew[`最低单体电压(V)`] = get(item,'BAT_Ucell_Min','');
  itemnew[`最高单体电压CSC号`] = get(item,'BAT_Ucell_Max_CSC','');
  itemnew[`最高单体电芯位置`] = get(item,'BAT_Ucell_Max_CELL','');
  itemnew[`最低单体电压CSC号`] = get(item,'BAT_Ucell_Min_CSC','');
  itemnew[`最低单体电压电芯位置`] = get(item,'BAT_Ucell_Min_CELL','');
  itemnew[`最高单体温度`] = get(item,'BAT_T_Max','');
  itemnew[`最低单体温度`] = get(item,'BAT_T_Min','');
  itemnew[`平均单体温度`] = get(item,'BAT_T_Avg','');
  itemnew[`最高温度CSC号`] = get(item,'BAT_T_Max_CSC','');
  itemnew[`最低温度CSC号`] = get(item,'BAT_T_Min_CSC','');
  itemnew[`显示用SOC`] = get(item,'BAT_User_SOC_HVS','');
  itemnew[`平均单体电压`] = get(item,'BAT_Ucell_Avg','');
  itemnew[`报警信息`] = get(item,'alarmtxtstat','');
  return itemnew;
};

const bridge_historydeviceinfo_export = (item)=>{
  let itemnew = {};
  itemnew[`key`] = get(item,'_id','');
  itemnew[`RDBID`] = get(item,'DeviceId','');
  itemnew[`采集时间`] = get(item,'DataTime','');
  itemnew[`保存时间`] = get(item,'UpdateTime','');
  itemnew[`箱体测量电压(V)`] = get(item,'ChargeACVoltage','');
  itemnew[`箱体累加电压(V)`] = get(item,'BAT_U_TOT_HVS','');
  itemnew[`箱体电流(A)`] = get(item,'BAT_I_HVS','');
  itemnew[`真实SOC(%)`] = get(item,'BAT_SOC_HVS','');
  itemnew[`SOH(%)`] = get(item,'BAT_SOH_HVS','');
  itemnew[`最高单体电压(V)`] = get(item,'BAT_Ucell_Max','');
  itemnew[`最低单体电压(V)`] = get(item,'BAT_Ucell_Min','');
  itemnew[`最高单体电压CSC号`] = get(item,'BAT_Ucell_Max_CSC','');
  itemnew[`最高单体电压电芯位置`] = get(item,'BAT_Ucell_Max_CELL','');
  itemnew[`最低单体电压CSC号`] = get(item,'BAT_Ucell_Min_CSC','');
  itemnew[`最低单体电压电芯位置`] = get(item,'BAT_Ucell_Min_CELL','');
  itemnew[`最高单体温度(℃)`] = get(item,'BAT_T_Max','');
  itemnew[`最低单体温度(℃)`] = get(item,'BAT_T_Min','');
  itemnew[`平均单体温度(℃)`] = get(item,'BAT_T_Avg','');
  itemnew[`最高温度CSC号`] = get(item,'BAT_T_Max_CSC','');
  itemnew[`最低温度CSC号`] = get(item,'BAT_T_Min_CSC','');
  itemnew[`显示用SOC`] = get(item,'BAT_User_SOC_HVS','');
  itemnew[`平均单体电压`] = get(item,'BAT_Ucell_Avg','');
  itemnew[`报警状态`] = get(item,'alarmtxtstat','');
  itemnew[`生命信号`] = get(item,'ALIV_ST_SW_HVS','');
  itemnew[`空调继电器状态`] = get(item,'ST_AC_SW_HVS','');
  itemnew[`附件继电器状态`] = get(item,'ST_Aux_SW_HVS','');
  itemnew[`主负继电器状态`] = get(item,'ST_Main_Neg_SW_HVS','');
  itemnew[`预充电继电器状态`] = get(item,'ST_Pre_SW_HVS','');
  itemnew[`主正继电器状态`] = get(item,'ST_Main_Pos_SW_HVS','');
  itemnew[`充电继电器状态`] = get(item,'ST_Chg_SW_HVS','');
  itemnew[`风扇控制继电器状态`] = get(item,'ST_Fan_SW_HVS','');
  itemnew[`加热继电器状态`] = get(item,'ST_Heater_SW_HVS','');
  itemnew[`继电器内侧电压(V)`] = get(item,'BAT_U_HVS','');
  itemnew[`允许放电电流(A)`] = get(item,'BAT_Allow_DisCharge_I','');
  itemnew[`允许充电电流(A)`] = get(item,'BAT_Allow_Charge_I','');
  itemnew[`正极绝缘阻抗(kohm)`] = get(item,'BAT_ISO_R_Pos','');
  itemnew[`负极绝缘阻抗(kohm)`] = get(item,'BAT_ISO_R_Neg','');
  itemnew[`KeyOn信号电压(V)`] = get(item,'KeyOnVoltage','');
  itemnew[`BMU供电电压(V)`] = get(item,'PowerVoltage','');
  itemnew[`交流充电供电电压(V)`] = get(item,'ChargeACVoltage','');
  itemnew[`直流充电供电电压(V)`] = get(item,'ChargeDCVoltage','');
  itemnew[`CC2检测电压(V)`] = get(item,'CC2Voltage','');
  itemnew[`本次充电容量(Ah)`] = get(item,'ChargedCapacity','');
  itemnew[`总充放电循环次数`] = get(item,'TotalWorkCycle','');
  itemnew[`BMU采的CSC功耗电流(mA)`] = get(item,'CSC_Power_Current','');
  itemnew[`单体最大SOC(%)`] = get(item,'BAT_MAX_SOC_HVS','');
  itemnew[`单体最小SOC(%)`] = get(item,'BAT_MIN_SOC_HVS','');
  itemnew[`系统权重SOC(%)`] = get(item,'BAT_WEI_SOC_HVS','');
  itemnew[`充电需求电流(A)`] = get(item,'BAT_Chg_AmperReq_eBus60','');
  itemnew[`BPM24V Uout电压采样(V)`] = get(item,'BPM_24V_Uout','');
  itemnew[`加热2继电器状态`] = get(item,'ST_NegHeater_SW_HVS','');
  itemnew[`无线充电继电器状态`] = get(item,'ST_WirelessChg_SW','');
  itemnew[`双枪充电继电器2`] = get(item,'ST_SpearChg_SW_2','');
  itemnew[`集电网充电继电器`] = get(item,'ST_PowerGridChg_SW','');
  itemnew[`CC2检测电压2(V)`] = get(item,'CC2Voltage_2','');
  return itemnew;
};

const deviceinfoquerychart =  (actiondata,ctx,callback)=>{
  const getdeviceinfo = (actiondata,callbackfn)=>{
    const deviceModel = DBModels.DeviceModel;
    const query = actiondata.query || {};
    const fields = actiondata.fields || {};
    ////console.log(`fields-->${JSON.stringify(fields)}`);
    const queryexec = deviceModel.findOne(query).select(fields).lean();
    queryexec.exec((err,result)=>{
      if(!err && !!result){
        callbackfn(result);
      }
      else{
        callbackfn();
      }
    });
  }

  const getdeviceinfoquerychartresult = ({DeviceId,DataTime},callbackfn)=>{
    const momentmin = moment(DataTime).subtract(10,'hours').format('YYYY-MM-DD HH:mm:ss');
    const historydeviceModel = DBModels.HistoryDeviceModel;
    historydeviceModel.aggregate([
        {
            $match:
            {
                DeviceId:DeviceId,
                DataTime:{
                  $gte: momentmin
                }
            }
        },
        {
            $group:
            {
                _id:
                {
                    ticktime:
                    {
                        $substrBytes: [ "$DataTime", 0, 16 ]
                    }
                },
                tickv:
                {
                    $avg: "$BAT_U_HVS"
                },
                ticka:
                {
                    $avg: "$BAT_I_HVS"
                },
                ticks:
                {
                    $avg: "$BAT_User_SOC_HVS"
                },

            }
        },
        {
            $sort: {
                "_id.ticktime": 1
            }
        }
    ],(err,result)=>{
      let listret = {
        ticktime:[],
        tickv:[],
        ticka:[],
        ticks:[],
      };
      if(!err && !!result){
          _.map(result,(v)=>{
            listret.ticktime.push(v._id.ticktime);
            listret.tickv.push(v.tickv);
            listret.ticka.push(v.ticka);
            listret.ticks.push(v.ticks);
          });
      }
      callbackfn(listret);
    });
  };


  getdeviceinfo(actiondata,(deviceinfo)=>{
    if(!!deviceinfo){
      getdeviceinfoquerychartresult({
        DeviceId:actiondata.query.DeviceId,
        DataTime:_.get(deviceinfo,'LastRealtimeAlarm.DataTime',moment().format('YYYY-MM-DD HH:mm:ss'))
      },(listret)=>{
        const temperature = _.get(deviceinfo,'LastRealtimeAlarm.BAT_T_Avg',0);
        const soc = _.get(deviceinfo,'LastRealtimeAlarm.BAT_User_SOC_HVS',0);
        const resultnew = _.merge({
          temperature,
          soc,
        },listret);

        callback({
          cmd:'deviceinfoquerychart_result',
          payload:{
            DeviceId:actiondata.query.DeviceId,
            resultdata:resultnew
          }
        });
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:'找不到指定的设备',type:'deviceinfoquerychart'}
      });
    }
  });
};

exports.bridge_historydeviceinfo =  bridge_historydeviceinfo;
exports.bridge_historydeviceinfo_export = bridge_historydeviceinfo_export;
exports.deviceinfoquerychart =  deviceinfoquerychart;
