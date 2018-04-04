const kafka = require('kafka-node');
const Producer = kafka.Producer;
const KeyedMessage = kafka.KeyedMessage;
const Client = kafka.Client;
const client = new Client('localhost:2181');
// const argv = require('optimist').argv;
const producer = new Producer(client, { requireAcks: 1 });
const moment = require('moment');

let jsondata_position =
{
    "DeviceId": "1639100166",
    "GPSStatus": "A",
    "GPSTime": "2017-03-28 01:13:47",
    "MessageTime": "2017-03-28 09:13:47",
    "Longitude": "110.327466",
    "Latitude": "19.980934",
    "Speed": "0",
    "Course": "0",
    "DeviceStatus": "正常",
    "LAC": "30065",
    "CellId": "53033",
    "ADC1": "378",
    "ADC2": "59",
    "SN": "154",
    "Province": "海南省",
    "City": "海口市",
    "County": ""
};

let jsondata_bms =
{
    "DeviceId": "1632101169",
    "DataTime": "2017-03-28 09:10:01",
    "MessageTime": "2017-03-28 09:22:30",
    "SN": "378",
    "BAT_U_Out_HVS": "585",
    "BAT_U_TOT_HVS": "588.2",
    "BAT_I_HVS": "152.5",
    "BAT_SOC_HVS": "79",
    "BAT_SOH_HVS": "100",
    "BAT_Ucell_Max": "3.282",
    "BAT_Ucell_Min": "3.252",
    "BAT_Ucell_Max_CSC": "9",
    "BAT_Ucell_Max_CELL": "9",
    "BAT_Ucell_Min_CSC": "5",
    "BAT_Ucell_Min_CELL": "7",
    "BAT_T_Max": "24",
    "BAT_T_Min": "20",
    "BAT_T_Avg": "21",
    "BAT_T_Max_CSC": "5",
    "BAT_T_Min_CSC": "1",
    "BAT_User_SOC_HVS": "80",
    "BAT_Ucell_Avg": "3.267",
    "ALARM_H": "0x00000000",
    "ALARM_L": "0x0002C026",
    "ALIV_ST_SW_HVS": "13",
    "ST_AC_SW_HVS": "0",
    "ST_Aux_SW_HVS": "0",
    "ST_Main_Neg_SW_HVS": "0",
    "ST_Pre_SW_HVS": "0",
    "ST_Main_Pos_SW_HVS": "1",
    "ST_Chg_SW_HVS": "0",
    "ST_Fan_SW_HVS": "0",
    "ST_Heater_SW_HVS": "0",
    "BAT_U_HVS": "584.8",
    "BAT_Allow_Discharge_I": "360",
    "BAT_Allow_Charge_I": "360",
    "BAT_ISO_R_Pos": "5000",
    "BAT_ISO_R_Neg": "5000",
    "KeyOnVoltage": "26",
    "PowerVoltage": "26.4",
    "ChargeACVoltage": "0.4",
    "ChargeDCVoltage": "0.4",
    "CC2Voltage": "26.4",
    "ChargedCapacity": "0",
    "TotalWorkCycle": "66.2",
    "CSC_Power_Current": "630",
    "BAT_MAX_SOC_HVS": "80",
    "BAT_MIN_SOC_HVS": "79",
    "BAT_WEI_SOC_HVS": "79",
    "BAT_Chg_AmperReq": "0",
    "BPM_24V_Uout": "0",
    "ST_NegHeater_SW_HVS": "0",
    "ST_WirelessChg_SW": "0",
    "ST_SpearChg_SW_2": "0",
    "ST_PowerGridChg_SW": "0",
    "CC2Voltage_2": "0"
};


let rate = 2000;
producer.on('ready',  ()=> {

  setInterval( ()=>{
    jsondata_position.GPSTime = moment().format("YYYY-MM-DD HH:mm:ss");
    jsondata_position.MessageTime = moment().format("YYYY-MM-DD HH:mm:ss");

    jsondata_bms.DataTime = moment().format("YYYY-MM-DD HH:mm:ss");
    jsondata_bms.MessageTime = moment().format("YYYY-MM-DD HH:mm:ss");

    const km_position = new KeyedMessage(jsondata_position.DeviceId, JSON.stringify(jsondata_position));
    const km_bms = new KeyedMessage(jsondata_bms.DeviceId, JSON.stringify(jsondata_bms));

    payloads = [
        { topic: 'BMS.bms', messages: km_bms },
        { topic: 'BMS.position', messages: km_position }
    ];
    producer.send(payloads, (err, data)=> {
        if(err)
          return console.error('Error sending ', err);

        console.log('Payload sent ', data);
      });
    }, rate);
});

producer.on('error',  (err)=> {
  console.log('error', err);
});
