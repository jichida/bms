import get from 'lodash.get';
import store from '../env/store';
import {ui_showmenu} from '../actions';
import { push,goBack,go  } from 'react-router-redux';//https://github.com/reactjs/react-router-redux
import moment from 'moment';
import lodashmap from 'lodash.map';
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

const getCoureName = (course)=> {

    var name = "";
    if(typeof course === 'string'){
      course = parseFloat(course);
    }

    if ((course >= 0 && course < 22.5) || (course >= 337.5 && course < 360)) // 0
    {
        name = "正北";
    }
    else if (course >= 22.5 && course < 67.5) // 45
    {
        name = "东北";
    }
    else if (course >= 67.5 && course < 112.5) // 90
    {
        name = "正东";
    }
    else if (course >= 112.5 && course < 157.5) //135
    {
        name = "东南";
    }
    else if (course >= 157.5 && course < 202.5) //180
    {
        name = "正南";
    }
    else if (course >= 202.5 && course < 247.5) //225
    {
        name = "西南";
    }
    else if (course >= 247.5 && course < 292.5) //270
    {
        name = "正西";
    }
    else if (course >= 292.5 && course < 337.5) //315
    {
        name = "西北";
    }
    else {
        name = "未知.";
    }
    return name;
}

const gettyname = (tp)=>{
  if(typeof tp === 'string'){
    tp = parseFloat(tp);
  }
  tp = tp/10;
  tp = tp.toFixed(1);
  return `${tp}bar`;
};

window.clickfn_device =(DeviceId)=>{
  store.dispatch(push(`/deviceinfo/${DeviceId}`));
}
window.clickfn_chargingpile =(DeviceId)=>{
  store.dispatch(push(`/chargingpileinfo/${DeviceId}`));
}
const getpop_device =(deviceitem)=>{
  let DeviceId = get(deviceitem,'DeviceId','');
  let txtLatitude = get(deviceitem,'LastHistoryTrack.Latitude','');
  let txtLongitude = get(deviceitem,'LastHistoryTrack.Longitude','');
  let adcode = get(deviceitem,'adcode','');
  let province = get(deviceitem,'province','');
  let city = get(deviceitem,'city','');
  let district = get(deviceitem,'district','');
  let formattedAddress = get(deviceitem,'formattedAddress','');

  let zdl = get(deviceitem,'总电流(A)',0);
  let zdy = get(deviceitem,'总电压(V)',374);
  let soc = get(deviceitem,'SOC(%)',50);
  let cs = get(deviceitem,'车速(km/h)',60);
  let zlc = get(deviceitem,'里程(km)',100000);
  let jxzk = get(deviceitem,'电池绝缘电阻(KΩ)',9000);
  let zgwd = get(deviceitem,'最高温度值(℃)',30);
  let bjxx = get(deviceitem,'报警信息','无');

  const sd = get(deviceitem,'LastHistoryTrack.Speed','');
  const hx = get(deviceitem,'LastHistoryTrack.Course','');
  const cysj = get(deviceitem,'TPData.DataTime','');
  const TP1 = get(deviceitem,'TPData.TP1','');
  const TP2 = get(deviceitem,'TPData.TP2','');
  const TP3 = get(deviceitem,'TPData.TP3','');
  const TP4 = get(deviceitem,'TPData.TP4','');
  const TP5 = get(deviceitem,'TPData.TP5','');
  let lasttime = get(deviceitem,'updated_at','');
  try{
    lasttime = moment(lasttime).format('YYYY-MM-DD HH:mm:ss');
  }
  catch(e){

  }
  // return {
  //     infoBody: `<p>车辆编号:${DeviceId}</p>
  //     <p class='l'><span class='t'>速度</span><span class='color_warning'>${sd}km/h</span></p>
  //     <p class='l'><span class='t'>航向</span><span class='color_warning'>${getCoureName(hx)}</span></p>
  //     <p class='l'><span class='t'>采样时间</span><span class='color_warning'>${cysj}</span></p>
  //     <p class='l'><span class='t'>最后更新时间</span><span class='color_warning'>${lasttime}</span></p>
  //     <p class='l'><span class='t'>左前胎压</span><span class='color_warning'>${gettyname(TP1)}</span> </p>
  //     <p class='l'><span class='t'>右前胎压</span><span class='color_warning'>${gettyname(TP2)}</span></p>
  //     <p class='l'><span class='t'>右后胎压</span><span class='color_warning'>${gettyname(TP3)}</span></p>
  //     <p class='l'><span class='t'>左后胎压</span><span class='color_warning'>${gettyname(TP4)}</span></p>
  //     <p class='l'><span class='t'>胎压故障码</span><span class='color_warning'>${TP5}</span></p>
  //     <button onclick="clickfn_device(${DeviceId})">查看详情</button>`
  // };
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
  let DeviceId = get(deviceitem,'DeviceId','');
  let no = get(deviceitem,'充电桩编号','');
  let sccj = get(deviceitem,'生产厂家','');
  let cdms = get(deviceitem,'充电模式','');
  let dqzt = get(deviceitem,'当前状态','');
  let sysc = get(deviceitem,'开机时长（h）','');

  let dqdl = get(deviceitem,'当前电流（A）','');
  let jyzk = get(deviceitem,'绝缘阻抗','');
  let dqgl = get(deviceitem,'当前功率（kW）','');

  let adcode = get(deviceitem,'adcode','');
  let province = get(deviceitem,'province','');
  let city = get(deviceitem,'city','');
  let district = get(deviceitem,'district','');
  let formattedAddress = get(deviceitem,'formattedAddress','');

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
  let imagetype = get(deviceitem,'imagetype','0');
  if(typeof imagetype === 'string'){
    imagetype = parseInt(imagetype);
  }

  if(imagetype >= 4){
    return getpop_chargingpile(deviceitem);
  }

  return getpop_device(deviceitem);
}


export const getlistpopinfowindowstyle = (deviceitemlist)=>{
    let info = '<div class="getmapstylepage">';
    lodashmap(deviceitemlist,(deviceitem)=>{
        let DeviceId = get(deviceitem,'DeviceId','');
        let txtLatitude = get(deviceitem,'LastHistoryTrack.Latitude','');
        let txtLongitude = get(deviceitem,'LastHistoryTrack.Longitude','');
        let adcode = get(deviceitem,'adcode','');
        let province = get(deviceitem,'province','');
        let city = get(deviceitem,'city','');
        let district = get(deviceitem,'district','');
        let formattedAddress = get(deviceitem,'formattedAddress','');

        let zdl = get(deviceitem,'总电流(A)',0);
        let zdy = get(deviceitem,'总电压(V)',374);
        let soc = get(deviceitem,'SOC(%)',50);
        let cs = get(deviceitem,'车速(km/h)',60);
        let zlc = get(deviceitem,'里程(km)',100000);
        let jxzk = get(deviceitem,'电池绝缘电阻(KΩ)',9000);
        let zgwd = get(deviceitem,'最高温度值(℃)',30);
        let bjxx = get(deviceitem,'报警信息','无');
        info +=  `<p onclick="clickfn_device(${deviceitem.DeviceId})">
        <i class="t">车辆ID:${DeviceId}</i>
        <i>总电流${zdl}A,总电压${zdy}V,SOC${soc}%,车速${cs}km/h</i></p>`;
    });
    info += '</div>'
    return {
        infoBody: `${info}`
    };
}