const moment = require('moment');
const getProducer  = require('./rkafka/p.js');
const count_partitionnumber = process.env.partitionnumber || 384;
const _ = require('lodash');
const topicname = process.env.IndexTopic ||'bmsdb.index';

console.log(`topicname:${topicname},count_partitionnumber:${count_partitionnumber}`);

const kafka_pconfig1 = {
  'metadata.broker.list': process.env.KAFKA_HOST || '192.168.1.20:9092,192.168.1.114:9092,192.168.1.136:9092',
};
const kafka_pconfig2 = {
};

let jsondata =
{
    "Version": "1.0",
    "DeviceId": "1713100888",
    "DeviceType": 2,
    "DeviceStatus": 0,
    "TroubleStatus": 0,
    "SN64":1,
    "Temperature_PCB": 0,
    "BMSData": {
        "CANType": 2,
        "SN16": 591,
        "DataTime": "2017-11-16 22:39:03",
        "RecvTime": "2017-11-16 22:39:03",
        "Alarm": {
            "AL_Trouble_Code": 225,
            "AL_Over_Ucell":2,
            "AL_Under_Tcell":0,
            "AL_Over_I_Dchg":1
        },
        "BAT_U_Out_HVS": 89.5,
        "BAT_U_TOT_HVS": 599.1,
        "BAT_I_HVS": -25,
        "BAT_SOC_HVS": 39,
        "BAT_SOH_HVS": 97,
        "ALIV_ST_SW_HVS": 13,
        "ST_CSC_PowerHSD": 1,
        "ST_Aux_SW_HVS": 0,
        "ST_Main_Neg_SW_HVS": 0,
        "ST_Pre_SW_HVS": 0,
        "ST_Main_Pos_SW_HVS": 0,
        "ST_Fan_SW_HVS": 0,
        "ST_Heater_SW_HVS": 0,
        "BAT_U_HVS": 598.8,
        "BAT_Allow_DisCharge_I": 350,
        "BAT_Allow_Charge_I": 350,
        "BAT_ISO_R_Pos": 18773,
        "BAT_ISO_R_Neg": 5523,
        "BAT_Ucell_Max": 3.333,
        "BAT_Ucell_Min": 3.324,
        "BAT_Ucell_Max_CSC": 1,
        "BAT_Ucell_Max_CELL": 1,
        "BAT_Ucell_Min_CSC": 3,
        "BAT_Ucell_Min_CELL": 31,
        "BAT_T_Max": 27,
        "BAT_T_Min": 21,
        "BAT_T_Avg": 24,
        "BAT_T_Max_CSC": 2,
        "BAT_T_Min_CSC": 1,
        "BAT_User_SOC_HVS": 40,
        "BAT_Ucell_Avg": 3.328,
        "KeyOnVoltage": 0.8,
        "PowerVoltage": 23.6,
        "DCDCAlarmVolt": 4.8,
        "ChargeDCVoltage": 23.6,
        "CC2Voltage": 2.4,
        "ChargedCapacity": 4,
        "CSC_Power_Current": 192,
        "BAT_MAX_SOC_HVS": 40,
        "BAT_MIN_SOC_HVS": 39,
        "BAT_WEI_SOC_HVS": 39,
        "DCChg_APositive_Volt": 23.6,
        "BAT_User_SOH_HVS": 100,
        "ST_NegHeater_SW_HVS": 0,
        "ST_PowerGridChg_SW": 1,
        "CC2Voltage_2": 4.8,
        "ST_ACC_S2": 0,
        "ST_AO_RelayLSD2": 0,
        "ST_AO_RelayLSD1": 0,
        "ACC_CC_Volt": 4.8,
        "ACC_CP_Volt": 0.4,
        "Chg_Wakeup_Volt": 0,
        "ACC_PWM_Duty": 255,
        "ACC_Plug1_Temp": 205,
        "ACC_Plug2_Temp": 205,
        "Pack_SN_BCD": 117184305306,
        "BAT_SOP_HVS": 0,
        "PP_Volt": 0,
        "U2P_BalChgCirFail_CSCNo": 0,
        "U2P_BalDischgCirFail_CSCNo": 0,
        "U2P_UcellOpenWire_CSCNo": 0,
        "Delta_SOC": 1.2,
        "Flag_Charging": 1,
        "Fast_Charging": 0,
        "Flag_acan_lost": 0,
        "CSC_No": 5,
        "Cell_No": 36,
        "Temp_No": 6,
        "DC12_24V_Volt": 23.8,
        "PantographicCCSig_Volt": 4.8,
        "BMS_Chg_Type": 1,
        "BMS_Chg_State": 5,
        "BMS_Chg_Req_DC_Mode": 2,
        "BMS_Chg_Req_Volt": 666,
        "Chgr_Out_Curr": -25.1,
        "Chgr_Out_Volt": 601,
        "Max_Chgr_Curr": 208,
        "Max_Chgr_Volt": 700,
        "DCC_Plug1_Temp": 9,
        "DCC_Plug2_Temp": 9,
        "DCC_Plug3_Temp": 205,
        "DCC_Plug4_Temp": 205,
        "B_MAN_CLOSE_HeatCool": 0,
        "B2HVAC_ER_PumpReq": 0,
        "B2HVAC_ER_HeatingReq": 0,
        "B2HVAC_ER_CoolingReq": 0,
        "t_Outlet_T": -40,
        "t_Inlet_T": -40,
        "ST_TMSWork": 0,
        "AL_TMS_TroubleCode": 0,
        "AL_TMS_TroubleLevel": 0,
        "BAT_I_Branch1": -25,
        "BAT_I_Branch2": 4553.5,
        "BAT_I_Branch3": 4553.5,
        "BAT_I_Branch4": 4553.5,
        "ST_RemoteClient": 0,
        "ST_RemoteClientFault": 0,
        "ST_DCDCWork": 0,
        "ST_SBOX_HVIL": 0,
        "ST_ProtectRelay1": 1,
        "ST_ChgPrechgRelay": 1,
        "ST_DCChgRelayPos1": 1,
        "ST_DCChgRelayPos2": 0,
        "ST_DCChgRelayNeg1": 1,
        "ST_DCChgRelayNeg2": 0,
        "ST_ProtectRelay2_K12": 0,
        "BAT_Chg_AmperReq_eBus60": 180,
        "BAT_SysChgEnergy_Accu": 1975.6,
        "BAT_SysDischgEnergy_Accu": 1925.8,
        "DCChg1_Pos_HV": 591.5,
        "DCChg2_Pos_HV": 6553.5,
        "DCChg1_Neg_HV": 591.9,
        "DCChg2_Neg_HV": 6553.5,
        "TMS_HV": 593.1,
        "MainNeg_HV": 176.4,
        "HeatPos_HV": 593.1,
        "HeatNeg_HV": 594,
        "Pantographic_Pos_HV": 6553.5,
        "Pantographic_Neg_HV": 594,
        "AttachmentUnit_HV": 0,
        "BAT_ChgEnergy_SingleTime": 0,
        "U2P_SD23_MLOWLTimes": 65535,
        "U2P_SD23_MLLastOWLCurr": 4553.5,
        "U2P_SD23_DCLOWLTimes": 65535,
        "BAT_SD23_DCLastOWLCurr": 4553.5,
        "U2P_SD24_PTLOWLTimes": 65535,
        "U2P_SD24_PTLastOWLCurr": 4553.5,
        "U2P_SD25_Tank1_CSCNo": 1,
        "U2P_SD25_Tank2_CSCNo": 2,
        "U2P_SD25_Tank3_CSCNo": 3,
        "U2P_SD25_Tank4_CSCNo": 4,
        "U2P_SD25_Tank5_CSCNo": 5,
        "U2P_SD25_Tank6_CSCNo": 0,
        "U2P_SD25_Tank7_CSCNo": 0,
        "U2P_SD25_Tank8_CSCNo": 0,
        "U2P_SD25_Tank9_CSCNo": 0,
        "U2P_SD25_Tank10_CSCNo": 0,
        "U2P_SD26_Tank11_CSCNo": 0,
        "U2P_SD26_Tank12_CSCNo": 0,
        "U2P_SD26_Tank13_CSCNo": 0,
        "U2P_SD26_Tank14_CSCNo": 0,
        "U2P_SD26_Tank15_CSCNo": 0,
        "U2P_SD26_Tank16_CSCNo": 0,
        "U2P_SD26_Tank17_CSCNo": 0,
        "U2P_SD26_Tank18_CSCNo": 0,
        "U2P_SD26_Tank19_CSCNo": 0,
        "U2P_SD26_Tank20_CSCNo": 0,
        "U2P_SD27_Tank21_CSCNo": 0,
        "U2P_SD27_Tank22_CSCNo": 0,
        "U2P_SD27_Tank23_CSCNo": 0,
        "U2P_SD27_Tank24_CSCNo": 0,
        "U2P_SD27_Tank25_CSCNo": 0,
        "U2P_SD27_Tank26_CSCNo": 0,
        "U2P_SD27_Tank27_CSCNo": 0,
        "U2P_SD27_Tank28_CSCNo": 0,
        "U2P_SD27_Tank29_CSCNo": 0,
        "U2P_SD27_Tank30_CSCNo": 0,
        "U2P_SD28_Tank31_CSCNo": 0,
        "U2P_SD28_Tank32_CSCNo": 0,
        "U2P_SD28_Tank33_CSCNo": 0,
        "U2P_SD28_Tank34_CSCNo": 0,
        "U2P_SD28_Tank35_CSCNo": 0,
        "U2P_SD28_Tank36_CSCNo": 0,
        "U2P_SD28_Tank37_CSCNo": 0,
        "U2P_SD28_Tank38_CSCNo": 0,
        "U2P_SD28_Tank39_CSCNo": 0,
        "U2P_SD28_Tank40_CSCNo": 0
    }
};



getProducer(kafka_pconfig1,kafka_pconfig2,(err)=> {
  console.error(`---uncaughtException err`);
  console.error(err);
  console.error(err.stack);
  console.error(`uncaughtException err---`);
}).then((producer)=>{
  let icount = 0;

  setInterval(()=>{
    try {
        let senddata = _.clone(jsondata);
        senddata.SN64 = icount;
        icount++;

        senddata.DataTime = moment().format('YYYY-MM-DD HH:mm:ss');
        const stringdata = JSON.stringify(senddata);

        producer.produce(topicname, -1, new Buffer(stringdata));
        console.log(`send message:p:${j},sn:${senddata.SN64}`);
      } catch (err) {
        console.error('A problem occurred when sending our message')
        console.error(err)
      }
  },0);
  // const pdataindex = [];
  // for(let i = 0 ;i <count_partitionnumber ;i++ ){
  //   pdataindex.push(0);
  // }
  //
  // console.error('start send message...');
  // for(let j=0 ;j < count_partitionnumber; j++){
  //   setInterval(()=>{
  //     try {
  //         let senddata = _.clone(jsondata);
  //         senddata.SN64 = icount;
  //         icount++;
  //         pdataindex[j] = pdataindex[j]+1;
  //         senddata.DataTime = moment().format('YYYY-MM-DD HH:mm:ss');
  //         const stringdata = JSON.stringify(senddata);
  //
  //         producer.produce(topicname, j, new Buffer(stringdata));
  //         console.log(`send message:p:${j},sn:${senddata.SN64}`);
  //       } catch (err) {
  //         console.error('A problem occurred when sending our message')
  //         console.error(err)
  //       }
  //   },0);
  // }


});
