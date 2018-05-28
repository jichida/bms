import jsondatareadonly_device from '../test/bmsdata_device.json';
import map from 'lodash.map';
import filter from 'lodash.filter';
import sampleSize from 'lodash.samplesize';
import config from '../env/config';
import {groups} from './bmsdata_group.js';
import jsondatareadonly_chargingpile from '../test/bmsdata_chargingpile.json';
import moment from 'moment';
const getrandom=(min,max)=>{
  return parseInt(Math.random()*(max-min+1)+min,10);
}

let jsondataexport = filter(jsondatareadonly_device,(item) => {
  let thisdata = false;
  if(!!item.LastHistoryTrack){
    if(!!item.last_Latitude){
      if(item.last_Latitude > 0){
        thisdata = !!item.LastHistoryTrack.Province;
      }
    }
  }
  return thisdata;
});

if(config.softmode === 'pc'){
}
else{
  jsondataexport = sampleSize(jsondataexport,456);
}

let g_devicesdb = {};
let device_dw = ['自动档D','P','N','R'];
let device_cfd = ['充电','放电','静置'];

const gettest_item = (item,index)=>{

  item.imagetype = '0';
  item.groupid = groups[getrandom(0,groups.length-1)]._id;
  //车辆
  item.isonline = true;
  item.isconnected = true;
  item.isrunning = getrandom(0,100)<80?true:false;
  item.iserror = getrandom(0,10000)>9876?true:false;
  item['车牌'] = `车牌${index}`;
  item['VIN'] = `VIN${index}`;
  item['运营年限'] = `${getrandom(5,10)}`;
  item['总里程'] = `${getrandom(50000,500000)}`;
  item['容量保有率'] = `${getrandom(1,100)}`;
  item['位置'] =jsondatareadonly_chargingpile[getrandom(0,jsondatareadonly_chargingpile.length-1)].address.formattedAddress;
  let secago = getrandom(0,60*60*12);
  item['采集时间'] = moment().subtract(secago, 'seconds').format('YYYY-MM-DD HH:mm:ss');
  item['车速(km/h)'] =getrandom(0,120);
  item['驱动有效'] =getrandom(0,1)===0?'驱动有效':'驱动无效';
  item['制动有效'] =getrandom(0,1)===0?'制动有效':'制动无效';
  item['里程(km)'] =getrandom(0,120);
  item['空调温度(℃)'] =getrandom(18,28);
  item['档位'] =device_dw[getrandom(0,device_dw.length-1)];
  item['加速踏板行程值(%)'] =getrandom(0,100);
  item['制动踏板行程值(%)'] =getrandom(0,100);
  item['充放电状态'] =device_cfd[getrandom(0,device_cfd.length-1)];
  item['驱动电机控制器温度(℃)'] =getrandom(25,60);
  item['驱动电机转速(r/min)'] =getrandom(0,5000);
  item['驱动电机温度(℃)'] =getrandom(25,60);
  // item['电机控制器输入电压'] =//'=总电压-（10~20）getrandom(25,60);
  item['电机控制器直流母线电流'] =getrandom(-120,120);
  item['定位状态'] ='有效定位';
  item['纬度信息'] ='北纬';
  item['经度信息'] ='东经';
  item['经度'] =item.last_Longitude;
  item['纬度'] =item.last_Latitude;
  item['GPS速度(km/h)'] =getrandom(0,120);
  item['方向'] =`西偏北 76.0°`;
  item['动力系统就绪'] ='活跃亮灯';
  item['紧急下电请求'] ='正常';
  item['电池均衡激活'] =getrandom(0,1)===0?'有均衡':'无均衡';
  item['总电压(V)'] =getrandom(360,600);//总电压(V)	360~600
  item['电机控制器输入电压'] = item['总电压(V)'] - getrandom(10,20);//'=总电压-（10~20）getrandom(25,60);
  item['SOC(%)'] =getrandom(10,100);
  item['总电流(A)'] =getrandom(-120,120);
  item['电池绝缘电阻(KΩ)'] =getrandom(8000,10000);
  item['最高电压动力蓄电池包序号'] =getrandom(1,6);
  item['最高电压单体蓄电池序号'] =getrandom(1,100);
  item['电池单体最高电压值(V)'] = (getrandom(30,37)/10).toFixed(2);
  item['最低电压动力蓄电池包序号'] =getrandom(1,6);
  item['最低电压单体蓄电池序号'] =getrandom(1,100);
  item['电池单体最低电压值(V)'] =(getrandom(30,37)/10).toFixed(2);
  item['最高温度动力蓄电池包序号'] =getrandom(1,6);
  item['最高温度探针序号'] =getrandom(1,20);
  item['最高温度值(℃)'] =getrandom(25,45);
  item['最低温度动力蓄电池包序号'] =getrandom(1,6);
  item['最低温度探针序号'] =getrandom(1,20);
  item['最低温度值(℃)'] =getrandom(25,item['最高温度值(℃)']);
  item['剩余能量(KW*h)'] =getrandom(50,300);
  item['最高电压电池总数'] =getrandom(1,20);
  item['最低电压电池总数'] =getrandom(1,20);
  item['最高温度探针总数'] =getrandom(1,10);
  item['最低温度探针总数'] =getrandom(1,10);
  item['单体蓄电池总数'] =getrandom(300,600);
  item['动力蓄电池包总数(单体)'] =getrandom(30,50);
  item['温度探针总数'] =getrandom(60,120);
  item['动力蓄电池包总数(动力)'] =6;

  item['angle'] = getrandom(0,360);
  return {...item};
}

map(jsondataexport,(item,index)=>{
  item = gettest_item(item,index);
});

const tydata = [
  {
    "deviceid": "1707200001",
    "GPSStatus": "A",
    "Longitude": "121.777376",
    "Latitude": "31.107271",
    "Speed": "0",
    "Course": "0",
    "DataTime": "2017/9/21 13:33:59",
    "TP1": "255",
    "TP2": "29",
    "TP3": "255",
    "TP4": "255",
    "TP5": "0"
},
{
    "deviceid": "1707200016",
    "GPSStatus": "A",
    "Longitude": "121.777424",
    "Latitude": "31.107333",
    "Speed": "0",
    "Course": "0",
    "DataTime": "2017/9/21 12:08:09",
    "TP1": "255",
    "TP2": "29",
    "TP3": "255",
    "TP4": "255",
    "TP5": "0"
},
{
    "deviceid": "1707200020",
    "GPSStatus": "A",
    "Longitude": "121.572675",
    "Latitude": "31.222501",
    "Speed": "26",
    "Course": "342",
    "DataTime": "2017/9/29 17:01:11",
    "TP1": "25",
    "TP2": "23",
    "TP3": "27",
    "TP4": "27",
    "TP5": "0"
}];

let jsondata = [];
map(tydata,(item,index)=>{
  let item2 = {};
  item2.groupid = groups[getrandom(0,groups.length-1)]._id;

  item2.imagetype = '0';
  item2.DeviceId = item.deviceid;
  item2.LastHistoryTrack = {
    Latitude:parseFloat(item.Latitude),
    Longitude:parseFloat(item.Longitude),
    GPSStatus:item.GPSStatus,
    Speed: item.Speed,
    Course: item.Course,
  };
  item2.TPData = {
    "DataTime": item.DataTime,
    "TP1":item.TP1,
    "TP2":item.TP2,
    "TP3":item.TP3,
    "TP4":item.TP4,
    "TP5":item.TP5,
  }
  item2 = gettest_item(item2,index);
  jsondata.push(item2);
});

jsondata = jsondataexport;
export {jsondata};
