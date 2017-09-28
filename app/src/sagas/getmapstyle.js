import _ from 'lodash';
import store from '../env/store';
import {ui_showmenu} from '../actions';
import { push,goBack,go  } from 'react-router-redux';//https://github.com/reactjs/react-router-redux

//地图上点图标的样式【图标类型】
export const getgroupStyleMap = ()=>{
  let groupsz = [
    {
      name:'0',
      image:`${process.env.PUBLIC_URL}/images/bike.png`,
      width: 16,
      //高度
      height: 16,
      //定位点为中心
      offset: ['-50%', '0%'],
      fillStyle: null,
    },
    {
      name:'1',
      image:`${process.env.PUBLIC_URL}/images/people.png`,
      width: 16,
      //高度
      height: 16,
      //定位点为中心
      offset: ['-50%', '0%'],
      fillStyle: null,
    },
    {
      name:'2',
      image:`${process.env.PUBLIC_URL}/images/truck.png`,
      width: 16,
      //高度
      height: 16,
      //定位点为中心
      offset: ['-50%', '0%'],
      fillStyle: null,
    },
    {
      name:'3',
      image:`${process.env.PUBLIC_URL}/images/taxi.png`,
      width: 16,
      //高度
      height: 16,
      //定位点为中心
      offset: ['-50%', '0%'],
      fillStyle: null,
    },
    {
      name:'4',
      image:`${process.env.PUBLIC_URL}/images/pow2.png`,
      width: 32,
      //高度
      height: 32,
      //定位点为中心
      offset: ['-50%', '0%'],
      fillStyle: null,
    },
    {
      name:'5',
      image:`${process.env.PUBLIC_URL}/images/pow1.png`,
      width: 32,
      //高度
      height: 32,
      //定位点为中心
      offset: ['-50%', '0%'],
      fillStyle: null,
    },
    {
      name:'6',
      image:`${process.env.PUBLIC_URL}/images/pow3.png`,
      width: 32,
      //高度
      height: 32,
      //定位点为中心
      offset: ['-50%', '0%'],
      fillStyle: null,
    },
  ];
  return groupsz;
}

//弹出窗口样式
// adcode
// :
// "150782"
// city
// :
// "呼伦贝尔市"
// district
// :
// "牙克石市"
// formattedAddress
// :
//设备
window.clickfn_device =(DeviceId)=>{
  store.dispatch(push(`/deviceinfo/${DeviceId}`));
}
window.clickfn_chargingpile =(DeviceId)=>{
  store.dispatch(push(`/chargingpileinfo/${DeviceId}`));
}
const getpop_device =(deviceitem)=>{
  let DeviceId = _.get(deviceitem,'DeviceId','');
  let txtLatitude = _.get(deviceitem,'LastHistoryTrack.Latitude','');
  let txtLongitude = _.get(deviceitem,'LastHistoryTrack.Longitude','');
  let adcode = _.get(deviceitem,'adcode','');
  let province = _.get(deviceitem,'province','');
  let city = _.get(deviceitem,'city','');
  let district = _.get(deviceitem,'district','');
  let formattedAddress = _.get(deviceitem,'formattedAddress','');

  let zdl = _.get(deviceitem,'总电流(A)',0);
  let zdy = _.get(deviceitem,'总电压(V)',374);
  let soc = _.get(deviceitem,'SOC(%)',50);
  let cs = _.get(deviceitem,'车速(km/h)',60);
  let zlc = _.get(deviceitem,'里程(km)',100000);
  let jxzk = _.get(deviceitem,'电池绝缘电阻(KΩ)',9000);
  let zgwd = _.get(deviceitem,'最高温度值(℃)',30);
  let bjxx = _.get(deviceitem,'报警信息','无');
  return {
      infoBody: `<p>车辆编号:${DeviceId}</p>
      <p class='l'><span class='t'>总电流</span><span class='color_warning'>${zdl}A</span></p>
      <p class='l'><span class='t'>总电压</span><span class='color_warning'>${zdy}V</span></p>
      <p class='l'><span class='t'>SOC</span><span class='color_warning'>${soc}%</span></p>
      <p class='l'><span class='t'>车速</span><span class='color_warning'>${cs}km/h</span> </p>
      <p class='l'><span class='t'>总里程</span><span class='color_warning'>${zlc}km</span></p>
      <p class='l'><span class='t'>绝缘阻抗</span><span class='color_warning'>${jxzk}KΩ</span></p>
      <p class='l'><span class='t'>电池最高温度</span><span class='color_warning'>${zgwd}℃</span></p>
      <p class='l'><span class='t'>车辆当前位置</span><span class='color_warning'>${province}${city}${district}</span></p>
      <p class='l'><span class='t'>当前报警信息</span><span class='color_warning'>${bjxx}</span></p>
      <button onclick="clickfn_device(${DeviceId})">查看详情</button>`
  };
}
//充电桩
const getpop_chargingpile =(deviceitem)=>{
  let DeviceId = _.get(deviceitem,'DeviceId','');
  let no = _.get(deviceitem,'充电桩编号','');
  let sccj = _.get(deviceitem,'生产厂家','');
  let cdms = _.get(deviceitem,'充电模式','');
  let dqzt = _.get(deviceitem,'当前状态','');
  let sysc = _.get(deviceitem,'开机时长（h）','');

  let dqdl = _.get(deviceitem,'当前电流（A）','');
  let jyzk = _.get(deviceitem,'绝缘阻抗','');
  let dqgl = _.get(deviceitem,'当前功率（kW）','');

  let adcode = _.get(deviceitem,'adcode','');
  let province = _.get(deviceitem,'province','');
  let city = _.get(deviceitem,'city','');
  let district = _.get(deviceitem,'district','');
  let formattedAddress = _.get(deviceitem,'formattedAddress','');

  return {
      infoBody: `<p>充电桩编号: ${no}</p>,
      <p class='l'><span class='t'>当前状态:</span><span>${dqzt}</span></p>
      <p class='l'><span class='t'>充电模式:</span><span class='color_warning'>${cdms}</span></p>
      <p class='l'><span class='t'>当前电流:</span><span class='color_warning'>${dqdl}</span></p>
      <p class='l'><span class='t'>当前功率:</span><span class='color_warning'>${dqgl}</span></p>
      <p class='l'><span class='t'>绝缘阻抗:</span><span class='color_warning'>${jyzk}</span></p>
      <p class='l'><span class='t'>充电桩位置:</span><span class='color_warning'>${formattedAddress}</span></p>
      <p class='l'><span class='t'>当前报警状态:</span><span class='color_warning'>无</span></p>
      <button onclick="clickfn_chargingpile('${DeviceId}')">查看详情</button>`
  };
}


export const getpopinfowindowstyle = (deviceitem)=>{
  let imagetype = _.get(deviceitem,'imagetype','0');
  if(typeof imagetype === 'string'){
    imagetype = parseInt(imagetype);
  }

  if(imagetype >= 4){
    return getpop_chargingpile(deviceitem);
  }

  return getpop_device(deviceitem);
}
