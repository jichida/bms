/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Devicestar from "../../img/16.png";
import Moresetting from "../../img/17.png";
import Footer from "../index/footer.js";
import Datalist from "./datalist";
import MapPage from '../admincontent';
import {ui_mycar_showtype} from '../../actions';
import Searchimg from "../../img/22.png";
import SelectDevice from '../mydevice/selectdevice.js';

const innerHeight = window.innerHeight;

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchonfocus : false,
            deviceid:''
        };
    }
    onfocusinput=()=>{
        this.setState({searchonfocus : true});
    }
    onblurinput=()=>{
        this.setState({searchonfocus : false})
    }
    onSelDeviceid(deviceid){
        this.setState({
          deviceid
        });
    }
    render() {
        let deviceidlist = [];
        const height =  innerHeight - 70 - 60 - 66.08;
        const mydevicecontentstyle = {pointerEvents: "none",background : "#FFF", flexGrow : "1"};
        let groupid = this.props.match.params.groupid;
        let count_connected = 0;
        let count_running = 0;
        let count_error = 0;
        const {g_devicesdb} = this.props;
        _.map(g_devicesdb,(item)=>{
          if(item.groupid === groupid){
            deviceidlist.push(item.DeviceId);
            if(item.isconnected){
              count_connected++;
            }
            if(item.isrunning){
              count_running++;
            }
            if(item.iserror){
              count_error++;
            }
          }
        });
        return (
            <div 
                className="mydevicePage AppPage customtable"
                style={{
                    background: "none",
                    minHeight : `${innerHeight}px`,
                    pointerEvents: "none",
                }}>
                <div className="navhead">
                    <a onClick={()=>{this.props.history.goBack()}} className="back"></a>
                    <div className="title" style={{paddingRight: "30px"}}>
                        项目信息
                    </div>
                </div>
                <div className="searchcontent headsearch">
                    <SelectDevice 
                        placeholder={"请输入设备ID"}
                        initdeviceid={this.state.deviceid}
                        onSelDeviceid={this.onSelDeviceid.bind(this)}
                        deviceidlist={deviceidlist}

                    />
                </div>
                <div className="mydevicecontent" style={mydevicecontentstyle}>
                    <div className="mydevicecontentlist">
                        <div className="devicenum"><span>联网车辆：{`${count_connected}`}辆</span>
                        <span className='c'>运行车辆：{`${count_running}`}辆</span>
                        <span>故障车辆：{`${count_error}`}辆</span></div>
                        <Datalist groupid={groupid} curdeviceid={this.state.deviceid} tableheight = {innerHeight-38-48-55-68} />
                    </div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = ({app,device}) => {
  const {ui_mydeivce_showtype} = app;
  const {groups,g_devicesdb} = device;
  return {ui_mydeivce_showtype,groups,g_devicesdb};
}

export default connect(mapStateToProps)(Page);
