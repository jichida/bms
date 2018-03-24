/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
// import AppBar from 'material-ui/AppBar';
// import RaisedButton from 'material-ui/RaisedButton';
// import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Day from 'material-ui/svg-icons/action/date-range';
// import Time from 'material-ui/svg-icons/device/access-time';
// import IconButton from 'material-ui/IconButton';
// import {grey900} from 'material-ui/styles/colors';
// import DatePicker from 'material-ui/DatePicker';
// import TimePicker from 'material-ui/TimePicker';
import Map from './map';
import "./map.css";
import Seltime from '../search/seltime.js';
import moment from 'moment';
import map from 'lodash.map';
import SelectDevice from './selectdevice.js';
import { Select } from 'antd';
import {
  mapplayback_start,
  mapplayback_end
} from '../../actions';

const Option = Select.Option;


let resizetimecontent = null;
//
// class Setspeed extends React.Component {
//     handleChange=(value)=>{
//       //console.log(value);
//     }
//     render() {
//       let speedoptions = [];
//       for(let i = 10 ;i <= 200 ; i+=10){
//         speedoptions.push(<Option key={i} value={i+''}>{i}公里／小时</Option>);
//       }
//       return (
//         <div className="Setspeed">
//           <span>播放速度: </span>
//           <Select labelInValue defaultValue={{ key: '50' }} style={{ width: 40 }} onChange={this.handleChange}>
//             {speedoptions}
//           </Select>
//         </div>
//       )
//     }
// }

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
          let deviceid =  this.props.match.params.deviceid;
          if(deviceid === '0'){
            deviceid = '';
          }
          this.state = {
            startDate:moment(moment().format('YYYY-MM-DD 00:00:00')),//moment().subtract(5, 'hours'),
            endDate:moment(),
            deviceid,
            speed: 60,
            innerHeight : window.innerHeight
          }
      }
      onSelDeviceid(deviceid){
          this.setState({
              deviceid
          });
      }
    onChangeSelDate(startDate,endDate){
      this.setState({
        startDate,
        endDate
      });
    }

    handleChange=(value)=>{
      this.setState({speed: parseInt(value.key,10)});
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize=()=> {
        window.clearTimeout(resizetimecontent);
        resizetimecontent = window.setTimeout(()=>{
            this.setState({
                innerHeight: window.innerHeight,
            });
        },10)
    }

    onClickStart(){
      const {deviceid,startDate,endDate} = this.state;

      const query = {
        DeviceId:deviceid
      };
      query.GPSTime = {
        $gte: startDate.format('YYYY-MM-DD HH:mm:ss'),
        $lte: endDate.format('YYYY-MM-DD HH:mm:ss'),
      }
      query.Latitude = {
        $ne:0
      };
      query.Longitude = {
        $ne:0
      };
      this.props.dispatch(mapplayback_start({isloop:false,speed:this.state.speed,query}));

    }
    onClickEnd(){
      this.props.dispatch(mapplayback_end({}));
    }
    render() {
        const {deviceid} = this.state;
        const {g_devicesdb} = this.props;
        let DeviceId;

        let deviceitem = g_devicesdb[deviceid];
        if(!!deviceitem){
          DeviceId = deviceitem.DeviceId;
        }
        let deviceidlist = [];
        map(g_devicesdb,(item)=>{
            deviceidlist.push(item.DeviceId);
        });
        // const formstyle={width:"10px",flexGrow:"1"};
        const startdate_moment = this.state.startDate;
        const enddate_moment = this.state.endDate;

        let speedoptions = [];
        for(let i = 10 ;i <= 200 ; i+=10){
          speedoptions.push(<Option key={i+''} value={i+''}>{i}公里／小时</Option>);
        }
        return (
            <div className="historytrackplayback" id="historytrackplayback" style={{height: this.state.innerHeight+"px"}} >
                <div className="appbar" style={{height: "72px"}}>

                    <div className="deviceinfo">

                        <span>车辆信息</span>
                    </div>
                    <div className="selcar">
                      <span className="t">车辆ID：</span>
                      <SelectDevice
                        placeholder={"请输入设备ID"}
                        initdeviceid={this.state.deviceid}
                        onSelDeviceid={this.onSelDeviceid.bind(this)}
                        deviceidlist={deviceidlist}
                      />
                    </div>


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

                        <div className="Setspeed">
                          <span>播放速度: </span>
                          <Select className="bfsd" labelInValue defaultValue={{ key: '60' }} style={{ width: 400 }} onChange={this.handleChange}>
                            {speedoptions}
                          </Select>
                        </div>
                    </div>


                    <div className="controlbtn">
                        <span onClick={this.onClickStart.bind(this)}>开始</span>
                        <span onClick={this.onClickEnd.bind(this)}>结束</span>
                    </div>

                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.goBack();}}></i>
                </div>

                <Map height={this.state.innerHeight-72} />
            </div>
        );
    }
}
const mapStateToProps = ({device:{g_devicesdb}}) => {
  return {g_devicesdb};
}
export default connect(mapStateToProps)(Page);
