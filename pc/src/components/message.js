/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import _ from 'lodash';
// import {ui_selcurdevice} from '../actions';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import Deraultimg from "../img/1.png";
import "../css/antd.css";
import "../css/message.css";


import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import TreeSearchBattery from './search/searchbattery';
import {
  ui_selcurdevice,
  searchbatteryalarm_request
} from '../actions';

class MessageAllDevice extends React.Component {

    constructor(props) {
        super(props);
    }
    onClickQuery(query){
      this.props.dispatch(searchbatteryalarm_request(query));
    }
    onClickDevice(deviceitem){
      this.props.dispatch(ui_selcurdevice({DeviceId:deviceitem.DeviceId,deviceitem}))
    }
    render(){
        const {devices,alarms,searchresult_alaram} = this.props;
        return (
            <div className="warningPage">


                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.push("./")}}></i>
                    <div className="title">新消息</div>
                </div>

                <TreeSearchBattery onClickQuery={this.onClickQuery.bind(this)}/>

                <Table>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        >
                      <TableRow>
                        <TableHeaderColumn>图标及设备号</TableHeaderColumn>
                        <TableHeaderColumn>告警时间</TableHeaderColumn>
                        <TableHeaderColumn>告警信息</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                      {
                        _.map(searchresult_alaram,(alarmid,key)=>{
                          const alarm =alarms[alarmid];
                          if(!!alarm){
                            const deviceinfo = devices[alarm.DeviceId];
                            return (
                              <TableRow key={key}>
                              <TableRowColumn><Avatar src={Deraultimg} /><span>{alarm.DeviceId}</span></TableRowColumn>
                              <TableRowColumn>{alarm.DataTime}</TableRowColumn>
                              <TableRowColumn>{alarm.Alarm}</TableRowColumn>
                              <TableRowColumn>
                                <RaisedButton label="查看设备" primary={true} fullWidth={true}
                               onTouchTap={this.onClickDevice.bind(this,deviceinfo)} />
                             </TableRowColumn>
                              </TableRow>)
                          }
                        })
                      }
                    </TableBody>
                  </Table>
            </div>

        );
    }
}


const mapStateToProps = (
  {
    device:
    {
      devices
    },
    searchresult:
    {
      searchresult_alaram,
      alarms
    }
  }) => {

  return {devices,alarms,searchresult_alaram};
}
export default connect(mapStateToProps)(MessageAllDevice);
