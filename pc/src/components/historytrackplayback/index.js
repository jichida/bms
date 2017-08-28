/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Day from 'material-ui/svg-icons/action/date-range';
import Time from 'material-ui/svg-icons/device/access-time';
import IconButton from 'material-ui/IconButton';
import {grey900} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Map from './map';
import "./map.css";
import {
  mapplayback_start,
  mapplayback_end
} from '../../actions';
import Seltime from '../search/seltime.js';


class Page extends React.Component {
    onClickStart(){
      this.props.dispatch(mapplayback_start({isloop:false,speed:5000}));
    }
    onClickEnd(){
      this.props.dispatch(mapplayback_end({}));
    }
    render() {
        const {mapseldeviceid,g_devicesdb} = this.props;
        let DeviceId;
        let deviceitem = g_devicesdb[mapseldeviceid];
        if(!!deviceitem){
          DeviceId = deviceitem.DeviceId;
        }
        const formstyle={width:"10px",flexGrow:"1"};
        return (
            <div className="historytrackplayback" id="historytrackplayback">
                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.push("./")}}></i>
                    <div className="title">设备编号：{DeviceId || ''}</div>


                    <div className="anddday">
                        
                        <div className="seldayli">
                            <Day color={"#333"} style={{width: "26px", height : "26px"}} />
                            <div className="dayinfo">
                                <span>2017年8月23日</span>
                                <span><span>星期三</span><span>17:04</span></span>
                            </div>
                        </div>
                        <div className="seldayli">
                            <Day color={"#333"} style={{width: "26px", height : "26px"}} />
                            <div className="dayinfo">
                                <span>2017年8月23日</span>
                                <span><span>星期三</span><span>17:04</span></span>
                            </div>
                        </div>
                        <Seltime width="225"/>
                    </div>

                    
                    <div className="controlbtn">
                        <span>开始</span>
                        <span>结束</span>
                    </div>
                </div>

                <Map />
            </div>
        );
    }
}
const mapStateToProps = ({device:{mapseldeviceid,g_devicesdb}}) => {
  return {mapseldeviceid,g_devicesdb};
}
export default connect(mapStateToProps)(Page);
