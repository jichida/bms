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
import Seltime from "./search/seltime.js";

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import TreeSearchreport from './search/searchreport';
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
        const {g_devicesdb,alarms,searchresult_alaram,alaram_data,columns} = this.props;

        return (
            <div className="warningPage" style={{height : window.innerHeight+"px"}}>

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.push("./")}}></i>
                    <div className="title">查询报表</div>
                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport onClickQuery={this.onClickQuery.bind(this)}/>
                </div>
                <div className="tablelist">
                    <TableComponents data={alaram_data} columns={columns}/>
                </div>
            </div>

        );
    }
}


const mapStateToProps = ({device:{g_devicesdb},searchresult:{searchresult_alaram,alarms}}) => {
    const alaram_data = [{
        key: 1,
        "设备ID" : "001",
        "PACK号码" : "pack001",
        "PDB编号" : "pdb001",
        "料号" : "liaohao001",
        "省市区" : "江苏常州武进区"
    },
    {
        key: 2,
        "设备ID" : "002",
        "PACK号码" : "pack002",
        "PDB编号" : "pdb002",
        "料号" : "liaohao002",
        "省市区" : "江苏常州武进区"
    },
    {
        key: 3,
        "设备ID" : "003",
        "PACK号码" : "pack003",
        "PDB编号" : "pdb003",
        "料号" : "liaohao003",
        "省市区" : "江苏常州武进区"
    }];

    let columns = _.map(alaram_data[0], (data, index)=>{
        return {
            title: index,
            dataIndex: index,
            key: index,
            render: (text, row, index) => {
                return <span>{text}</span>;
            }
        }
    })
    let delrow = (row)=>{
        console.log(row);
    }
    let columns_action ={
        title: "操作",
        dataIndex: '',
        key: 'x',
        render: (text, row, index) => {
            return (<a onClick={()=>{delrow(row)}}>删除</a>);
        }
    }
    columns.push(columns_action);

    return {g_devicesdb,alarms,searchresult_alaram, alaram_data, columns};
}
export default connect(mapStateToProps)(MessageAllDevice);