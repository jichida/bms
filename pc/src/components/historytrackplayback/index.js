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
            <div className="historytrackplayback">


                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.push("./")}}></i>
                    <div className="title">设备编号：{DeviceId || ''}</div>
                    <div className="day">
                        <Day color={"#FFFFFF"} style={{width: "40px", height : "40px"}} />
                        <div>开始日期</div>
                    </div>
                    <div className="day">
                        <Time color={"#FFFFFF"} style={{width: "40px", height : "40px"}} />
                        <div>开始时间</div>
                    </div>
                    <div className="day">
                        <Day color={"#FFFFFF"} style={{width: "40px", height : "40px"}} />
                        <div>结束日期</div>
                    </div>
                    <div className="day">
                        <Time color={"#FFFFFF"} style={{width: "40px", height : "40px"}} />
                        <div>结束时间</div>
                    </div>
                    <div className="controlbtn">
                        <span>开始</span>
                        <span>结束</span>
                    </div>
                </div>

                <AppBar
                    title={<span className="title">轨迹回放</span>}
                    iconElementLeft={<div><i className="fa fa-angle-left back" aria-hidden="true" onTouchTap={this.props.back}></i></div>}
                    iconElementRight={
                        <IconButton onTouchTap={this.props.back}>
                            <NavigationClose color={grey900}/>
                        </IconButton>
                    }
                    style={{
                        backgroundColor: "#FFF",
                        paddingLeft:"10px",
                        paddingRight:"0",
                    }}
                    className="appbar"
                    iconStyleLeft={{
                        marginTop: "15px"
                    }}
                    iconStyleRight={{
                        marginRight: "20px"
                    }}
                    />
                <div className="set">
                    <div>设备编号：{DeviceId || ''}</div>
                    <div className="formlist">
                        <div>
                            <DatePicker hintText="开始日期" style={formstyle} />
                            <TimePicker hintText="开始时间" style={formstyle} />
                        </div>
                        <div>
                            <DatePicker hintText="结束日期" style={formstyle} />
                            <TimePicker hintText="结束时间" style={formstyle} />
                        </div>
                    </div>
                    <div className="btnlist">
                        <RaisedButton onTouchTap={this.onClickStart.bind(this)} label="开始" primary={true} style={{marginRight:"10px"}} />
                        <RaisedButton onTouchTap={this.onClickEnd.bind(this)} label="结束" secondary={true} style={{marginRight:"10px"}} />
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
