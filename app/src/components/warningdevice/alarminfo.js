/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import map from 'lodash.map';
import get from 'lodash.get';
// import Devicestar from "../../img/16.png";
// import Moresetting from "../../img/17.png";
// import Searchimg from '../../img/13.png';
// import Footer from "../index/footer.js";
// import {ui_sel_tabindex} from '../../actions';
import Button  from 'antd/lib/button';
import {
    ui_index_addcollection,
    ui_index_unaddcollection,
    ui_alarm_selcurdevice,
    // setalarmreaded_request
} from '../../actions';
// import {bridge_alarminfo} from '../../sagas/datapiple/bridgedb';


class Page extends React.Component {
    // constructor(props) {
    //     super(props);
    // }
    componentWillMount () {
        // this.props.dispatch(setalarmreaded_request(this.props.match.params.alarmid));
    }
    onClickAlarmtxt =(DeviceId)=>{
      this.props.history.push(`/alarmrawinfos/${DeviceId}`);
    }
    render() {
        const {carcollections,g_devicesdb} = this.props;
        let DeviceId = this.props.match.params.deviceid;
        let curdeviceinfo =  g_devicesdb[DeviceId];
        // curalarm = bridge_alarminfo(curalarm);
        let deviceid = DeviceId;

        let isincollections = false;
        map(carcollections,(id)=>{
            if(id === deviceid){
                isincollections = true;
            }
        });
        const datadevice = {
            "基本信息" :[{
                    name:'报警等级',
                    value: `${curdeviceinfo['warninglevel']}`,
                },
                {
                    name:'车辆ID',
                    value: `${DeviceId}`,
                },
                {
                    name:'报警时间',
                    value: `${get(curdeviceinfo,'LastRealtimeAlarm.DataTime','')}`,
                },
                {
                    name:'报警信息',
                    value: `${get(curdeviceinfo,'alarmtxtstat','')}`,
                },
            ],
            // "位置信息":[
            //     {
            //         name:'报警位置',
            //         value: `${curalarm['报警位置']}`,
            //     },
            // ],
        };
        return (
            <div className="mydevicePage AppPage"
                style={{
                    backgroundSize: "100% 100%",
                    height : `${window.innerHeight}px`
                }}>
                <div className="navhead">
                    <div onClick={()=>{this.props.history.goBack()}} className="back"></div>
                    <span className="title" style={{paddingRight : "30px"}}>报警详情</span>
                    <div className="moresetting"></div>
                </div>
                <div className="deviceinfocontent">
                    {
                      map(datadevice,(item,index)=>{

                        return (
                            <div key={index}>
                                <div className="tit">{index}</div>
                                {
                                    map(item,(i,k)=>{
                                        return (<div key={k} className="li" onClick={
                                          ()=>{
                                            if(i.name === '报警信息'){
                                              this.onClickAlarmtxt(deviceid);
                                            }
                                          }
                                        }><span style={{flexShrink:0,marginRight:"10px"}}>{`${i.name}`}</span><span>{`${i.value}`}</span></div>);
                                    })
                                }
                            </div>
                        );
                      })
                    }


                </div>
                <div className="mydevicebtn">
                        {!isincollections &&
                        <Button type="primary" icon="star" onClick={()=>{
                            this.props.dispatch(ui_index_addcollection(deviceid));
                          }
                        }>收藏车辆</Button>}
                        {isincollections &&
                        <Button type="primary" icon="star" onClick={()=>{
                            this.props.dispatch(ui_index_unaddcollection(deviceid));
                          }
                        }>取消收藏</Button>}
                        <Button icon="play-circle-o" style={{background : "#5cbeaa", color: "#FFF"}}
                           onClick={
                             ()=>{
                               console.log("定位车辆");
                               this.props.dispatch(ui_alarm_selcurdevice(deviceid));
                             }
                         }>定位车辆</Button>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = ({device}) => {
    const {carcollections,g_devicesdb} = device;
    return {carcollections,g_devicesdb};
}

export default connect(mapStateToProps)(Page);
