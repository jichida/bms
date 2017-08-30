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
import moment from 'moment';


const fGetCurrentWeek=function(m){
        let sWeek=m.format('dddd');
        switch (sWeek){
            case 'Monday': sWeek='星期一';
                break;
            case 'Tuesday': sWeek='星期二';
                break;
            case 'Wednesday': sWeek='星期三';
                break;
            case 'Thursday': sWeek='星期四';
                break;
            case 'Friday': sWeek='星期五';
                break;
            case 'Saturday': sWeek='星期六';
                break;
            case 'Sunday': sWeek='星期日';
                break;
            default:
                break;
        }
        return sWeek;
    }

class Page extends React.Component {

      constructor(props) {
          super(props);
          this.state = {
            startDate:moment(),
            endDate:moment(),
          }
      }

    onChangeSelDate(startDate,endDate){
      this.setState({
        startDate,
        endDate
      });
    }

    onClickStart(){
      const {mapseldeviceid,g_devicesdb} = this.props;
      const {startDate,endDate} = this.state;
      this.props.dispatch(mapplayback_start({isloop:false,speed:5000,query:{DeviceId:mapseldeviceid,startDate,endDate}}));
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
        const startdate_moment = this.state.startDate;
        const enddate_moment = this.state.endDate;
        return (
            <div className="historytrackplayback" id="historytrackplayback">
                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.goBack();}}></i>
                    <div className="title">设备编号：{DeviceId || ''}</div>
                    <div className="anddday">
                        <div className="seldayli">
                            <Day color={"#333"} style={{width: "26px", height : "26px"}} />
                            <div className="dayinfo">
                                <span>{startdate_moment.format("YYYY年MM月DD日")}</span>
                                <span><span>{fGetCurrentWeek(startdate_moment)}</span><span>{startdate_moment.format("HH:mm")}</span></span>
                            </div>
                        </div>
                        <div className="seldayli">
                            <Day color={"#333"} style={{width: "26px", height : "26px"}} />
                            <div className="dayinfo">
                                <span>{enddate_moment.format("YYYY年MM月DD日")}</span>
                                <span><span>{fGetCurrentWeek(enddate_moment)}</span><span>{enddate_moment.format("HH:mm")}</span></span>
                            </div>
                        </div>
                        <Seltime width="225"
                          startDate = {this.state.startDate}
                          endDate = {this.state.endDate}
                         onChangeSelDate={this.onChangeSelDate.bind(this)}/>
                    </div>


                    <div className="controlbtn">
                        <span onClick={this.onClickStart.bind(this)}>开始</span>
                        <span onClick={this.onClickEnd.bind(this)}>结束</span>
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
