/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import map from 'lodash.map';
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
import TreeSearchreport from './search/searchdevicemessage';
import {
  ui_selcurdevice_request,
  searchbatteryalarmsingle_request
} from '../actions';

class MessageAllDevice extends React.Component {

    constructor(props) {
        super(props);
    }
    onClickQuery(query){
      const id = this.props.match.params.id;
      let payload = query || {};
      payload.query.DeviceId = id;
      console.log(`onClickQuery==>${JSON.stringify(payload)}`);

      this.props.dispatch(searchbatteryalarmsingle_request(payload));
    }

    render(){
        let {g_devicesdb,alarms,alaram_data,columns} = this.props;
        const id = this.props.match.params.id;
        let delrow = (row)=>{
            console.log(row);
            this.props.history.push(`/alarminfo/${row._id}`);
        }
        let columns_action ={
            title: "操作",
            dataIndex: '',
            key: 'x',
            render: (text, row, index) => {
                return (<a onClick={()=>{delrow(row)}}>查看</a>);
            }
        }
        columns.push(columns_action);
        return (
            <div className="warningPage" style={{height : window.innerHeight+"px"}}>

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>
                    <div className="title">车辆{id}的历史消息</div>
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


const mapStateToProps = ({device:{g_devicesdb},searchresult:{searchresult_alaramsingle,alarms}}) => {
    const column_data = {
      "车辆ID" : "",
      "告警时间" : "",
      "告警等级" : "",
      "告警位置" : "江苏常州武进区",
      "报警信息" : "绝缘故障",
    };
    const alaram_data = [];
    map(searchresult_alaramsingle,(aid)=>{
      alaram_data.push(alarms[aid]);
    });

    let columns = map(column_data, (data, index)=>{
      let column_item = {
          title: index,
          dataIndex: index,
          key: index,
          render: (text, row, index) => {
              return <span>{text}</span>;
          },
          sorter:(a,b)=>{
            return a[data] > b[data] ? 1:-1;
          }
      };
      return column_item;
    })


    return {g_devicesdb,alarms,searchresult_alaramsingle, alaram_data, columns};
}
export default connect(mapStateToProps)(MessageAllDevice);
