/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Devicestar from "../../img/16.png";
import Moresetting from "../../img/17.png";
import Footer from "../index/footer.js";
import Datapro from "./datapro";
import MapPage from '../admincontent';
import {ui_mycar_showtype} from '../../actions';
import Searchimg from "../../img/22.png";
const innerHeight = window.innerHeight;
class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchonfocus : false
        };
    }
    onfocusinput=()=>{
        this.setState({searchonfocus : true});
    }
    onblurinput=()=>{
        this.setState({searchonfocus : false})
    }
    render() {
        const height =  window.innerHeight - 70 - 60 - 66.08;
        const mydevicecontentstyle = this.props.ui_mydeivce_showtype===0?{pointerEvents: "none",background : "none"}:{};
        let count_connected = 0;
        let count_running = 0;
        let count_error = 0;
        const {g_devicesdb} = this.props;
        _.map(g_devicesdb,(item)=>{
            if(item.isconnected){
              count_connected++;
            }
            if(item.isrunning){
              count_running++;
            }
            if(item.iserror){
              count_error++;
            }
        });
        return (
            <div className="mydevicePage AppPage"
                style={{
                    background: "none",
                    minHeight : `${window.innerHeight}px`,
                    pointerEvents: "none",
                }}>
                <div className="navhead">
                    <div className="title">
                        车辆信息
                    </div>
                </div>
                <div className="mydevicecontentlist">
                    <div className="devicenum"><span>联网车辆：{`${count_connected}`}辆</span>
                    <span className='c'>运行车辆：{`${count_running}`}辆</span>
                    <span>故障车辆：{`${count_error}`}辆</span></div>
                    <Datapro tableheight = {innerHeight-38-50-55-68} />
                </div>
                <Footer sel={2} />
            </div>
        );
    }
}
const data = ({app,device}) => {
  const {ui_mydeivce_showtype} = app;
  const {g_devicesdb} = device;
  return {ui_mydeivce_showtype,g_devicesdb};
}
export default connect(data)(Page);
