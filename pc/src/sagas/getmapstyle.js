import get from 'lodash.get';
import store from '../env/store';
import {ui_showmenu} from '../actions';
import { push,goBack,go  } from 'react-router-redux';//https://github.com/reactjs/react-router-redux
import moment from 'moment';
import lodashmap from 'lodash.map';
import {bridge_deviceinfo_pop} from './datapiple/bridgedb';
//地图上点图标的样式【图标类型】


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

// const gettyname = (tp)=>{
//   if(typeof tp === 'string'){
//     tp = parseFloat(tp);
//   }
//   tp = tp/10;
//   tp = tp.toFixed(1);
//   return `${tp}bar`;
// };

window.clickfn_device =(DeviceId)=>{
  store.dispatch(push(`/deviceinfo/${DeviceId}`));
}
// window.clickfn_chargingpile =(DeviceId)=>{
//   store.dispatch(push(`/chargingpileinfo/${DeviceId}`));
// }
const getpop_device =({deviceitem,kvlist})=>{
  let DeviceId = get(deviceitem,'DeviceId','');
  let contentxt = '';
  lodashmap(kvlist,(v)=>{
    const fieldvalue = get(deviceitem,v.name,'');
    contentxt += `<p class='l'><span class='t'>${v.showname}</span><span class='color_warning'>${fieldvalue}${v.unit}</span></p>`;
  });

  return {
        infoBody: `<p>车辆编号:${DeviceId}</p>
        ${contentxt}
        <button onclick="clickfn_device(${DeviceId})">查看详情</button>`
    };
}
//充电桩
// const getpop_chargingpile =(deviceitem)=>{
//   let DeviceId = get(deviceitem,'DeviceId','');
//   let no = get(deviceitem,'充电桩编号','');
//   let sccj = get(deviceitem,'生产厂家','');
//   let cdms = get(deviceitem,'充电模式','');
//   let dqzt = get(deviceitem,'当前状态','');
//   let sysc = get(deviceitem,'开机时长（h）','');
//
//   let dqdl = get(deviceitem,'当前电流（A）','');
//   let jyzk = get(deviceitem,'绝缘阻抗','');
//   let dqgl = get(deviceitem,'当前功率（kW）','');
//
//   let adcode = get(deviceitem,'adcode','');
//   let province = get(deviceitem,'province','');
//   let city = get(deviceitem,'city','');
//   let district = get(deviceitem,'district','');
//   let formattedAddress = get(deviceitem,'formattedAddress','');
//
//   return {
//       infoBody: `<p>充电桩编号: ${no}</p>,
//       <p class='l'><span class='t'>当前状态:</span><span>${dqzt}</span></p>
//       <p class='l'><span class='t'>充电模式:</span><span class='color_warning'>${cdms}</span></p>
//       <p class='l'><span class='t'>当前电流:</span><span class='color_warning'>${dqdl}</span></p>
//       <p class='l'><span class='t'>当前功率:</span><span class='color_warning'>${dqgl}</span></p>
//       <p class='l'><span class='t'>绝缘阻抗:</span><span class='color_warning'>${jyzk}</span></p>
//       <p class='l'><span class='t'>充电桩位置:</span><span class='color_warning'>${formattedAddress}</span></p>
//       <p class='l'><span class='t'>当前报警状态:</span><span class='color_warning'>无</span></p>
//       <button onclick="clickfn_chargingpile('${DeviceId}')">查看详情</button>`
//   };
// }


export const getpopinfowindowstyle = (deviceitem)=>{
  // let imagetype = get(deviceitem,'imagetype','0');
  // if(typeof imagetype === 'string'){
  //   imagetype = parseInt(imagetype);
  // }
  //
  // if(imagetype >= 4){
  //   return getpop_chargingpile(deviceitem);
  // }
  let result = bridge_deviceinfo_pop(deviceitem);
  return getpop_device(result);
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
