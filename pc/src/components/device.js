/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import _ from 'lodash';
// import {ui_selcurdevice_request} from '../actions';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import Deraultimg from "../img/1.png";
import "../css/message.css";
import TableComponents from "./table.js";

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
  ui_selcurdevice_request,
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
      this.props.dispatch(ui_selcurdevice_request({DeviceId:deviceitem.DeviceId,deviceitem}))
    }
    render(){
        const {g_devicesdb,alarms,searchresult_alaram,alaram_data} = this.props;

        return (
            <div className="warningPage">

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.push("./")}}></i>
                    <div className="title">查询报表</div>
                    <TreeSearchBattery onClickQuery={this.onClickQuery.bind(this)}/>
                </div>
                <TableComponents data={alaram_data} />
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
                            const deviceinfo = g_devicesdb[alarm.DeviceId];
                            return (
                                <TableRow key={key}>
                                    <TableRowColumn><Avatar src={Deraultimg} /><span>{alarm.DeviceId}</span></TableRowColumn>
                                    <TableRowColumn>{alarm.DataTime}</TableRowColumn>
                                    <TableRowColumn>{alarm.Alarm}</TableRowColumn>
                                    <TableRowColumn>
                                        <RaisedButton
                                            label="查看设备" primary={true} fullWidth={true}
                                            onTouchTap={this.onClickDevice.bind(this,deviceinfo)}
                                            />
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


const mapStateToProps = ({device:{g_devicesdb},searchresult:{searchresult_alaram,alarms}}) => {
    const alaram_data = [];
    _.map(searchresult_alaram,(alarmid,key)=>{
        const alarm =alarms[alarmid];
        alaram_data.push(alarm)
    })
    return {g_devicesdb,alarms,searchresult_alaram, alaram_data};
}
export default connect(mapStateToProps)(MessageAllDevice);