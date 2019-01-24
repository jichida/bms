import React from 'react';
import { connect } from 'react-redux';
import lodashmap from 'lodash.map';
import {getdevicestatus_isonline,getdevicestatus_alaramlevel} from '../../util/getdeviceitemstatus';
import './titlebar4full.css';
import Logo from './logo.jpg';

const TitleBar = (props)=>{
  const {count_online,count_offline,count_all} = props;
  return  (
    <div className="xjl_call">
      <h2 className="tit"><img src={Logo} alt=""/><span>宁德时代新能源远程监控系统</span></h2>
      <ul className="call_ul">
        <li>市场保有量：{`${count_online+count_offline}`}辆</li>
        <li>已联网：{`${count_online}`}辆</li>
        <li>未联网：{`${count_offline}`}辆</li>
        <li>故障车辆：{`${count_all}`}辆</li>
      </ul>
    </div>);
}

const mapStateToProps = ({app,searchresult:{curallalarm,alarms},device:{g_devicesdb},app:{SettingOfflineMinutes}}) => {
  const {modeview} = app;

   let count_online = 0;
   let count_offline = 0;

   let count_all = 0;
   let count_yellow = 0;
   let count_red = 0;
   let count_orange = 0;

   lodashmap(g_devicesdb,(deviceitem)=>{
     const isonline = getdevicestatus_isonline(deviceitem,SettingOfflineMinutes);
     const warninglevel = getdevicestatus_alaramlevel(deviceitem);
     if(isonline){
       count_online++;
     }
     else{
       count_offline++;
     }
     if(warninglevel === '高'){
       count_red++;
     }
     else if(warninglevel === '中'){
       count_orange++;
     }
     else if(warninglevel === '低'){
       count_yellow++;
     }
   });

   count_all = count_red + count_orange + count_yellow;

    // if(count_all>99){
    //     count_all = "99+";
    // }


   return {count_online,count_offline,count_all,count_yellow,count_red,count_orange,modeview};
 }

export default connect(mapStateToProps)(TitleBar);
