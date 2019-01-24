/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';

import "../../css/message.css";
import AntdTable from "../controls/antdtable.js";

import {download_excel,ui_alarm_selcurdevice} from '../../actions';
import moment from 'moment';

import TreeSearchreport from '../search/searchreport_position';
import {
  callthen,uireport_searchposition_request,uireport_searchposition_result
} from '../../sagas/pagination';
import get from 'lodash.get';
import { set_weui } from '../../actions';
let resizetimecontent = null;

class TablePosition extends React.Component {

    constructor(props) {
        super(props);
        let query = {};
        query['GPSTime'] = {
          $gte:  moment().format('YYYY-MM-DD 00:00:00'),
          $lte:  moment().format('YYYY-MM-DD 23:59:59'),
        };
        let DeviceId =  this.props.match.params.deviceid;
        if(DeviceId !== '0'){
          query.DeviceId = DeviceId;
        }

        this.state = {query, innerHeight: window.innerHeight};
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

    onClickExport(query){
      const payload = {
          type:'report_position',
          query
      };
      //console.log(`导出excel:${JSON.stringify(payload)}`);
      this.props.dispatch(download_excel(payload));
    }
    onClickLoc = (query)=>{
      let DeviceId = query.DeviceId;
      if(!DeviceId && !!query['$and']){
        DeviceId = query['$and'].DeviceId;
      }
      if(!!DeviceId){
        this.props.dispatch(ui_alarm_selcurdevice(DeviceId));
      }
      else{
        this.props.dispatch(set_weui({
          toast:{
          text:'设备ID必选',
          show: true,
          type:'warning'
        }}));
      }
    }
    onClickQuery(query){
      //console.log(query);
      this.setState({query,querydo:query});
      let hasDeviceId = !!query.DeviceId;
      if(!hasDeviceId && !!query['$and']){
        hasDeviceId = query['$and'].DeviceId;
      }
      if(hasDeviceId){
        window.setTimeout(()=>{
          //console.log(this.refs);
          this.refs.antdtableposition.getWrappedInstance().onRefresh();
        },0);
      }
      else{
        this.props.dispatch(set_weui({
          toast:{
          text:'设备ID必选',
          show: true,
          type:'warning'
        }}));
      }
    }

    onItemConvert(item){
      let itemnew = {...item};
      //DeviceId Latitude Longitude GPSTime
      itemnew['key'] = get(item,'_id','');
      itemnew['设备编号'] = get(item,'DeviceId','');
      itemnew['定位时间'] = get(item,'GPSTime','');
      itemnew['省'] = get(item,'Provice','');
      itemnew['市'] = get(item,'City','');
      itemnew['区'] = get(item,'Area','');
      return itemnew;
    }
    render(){
        const column_data = ['设备编号','定位时间','省','市','区'];

        let columns = map(column_data, (data, index)=>{
          let column_item = {
              title: data,
              dataIndex: data,
              key: index,
              render: (text, row, index) => {
                  return <span>{text}</span>;
              },
              sorter:(a,b)=>{
                return a[data] > b[data] ? 1:-1;
              }
          };
          return column_item;
        });
        // const viewinmap = (row)=>{
        //     console.log(row);//DeviceId
        //     // this.props.history.push(`/alarminfo/${row._id}`);
        //     this.props.dispatch(ui_alarm_selcurdevice(row.DeviceId));
        // }
        // let columns_action ={
        //     title: "操作",
        //     dataIndex: '',
        //     width:100,
        //     fixed: 'right',
        //     key: 'x',
        //     render: (text, row, index) => {
        //         return (<a onClick={()=>{viewinmap(row)}}>定位</a>);
        //     }
        // }
        // columns.push(columns_action);
        // const tableheight = `${this.state.innerHeight-129-60}px`;
        // console.log(tableheight );
        return (
            <div className="warningPage" style={{height : this.state.innerHeight+"px"}}>

                <div className="appbar">

                    <div className="title">位置报表</div>
                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.replace("/")}}></i>

                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport
                      query={this.state.query}
                      onClickQuery={this.onClickQuery.bind(this)}
                      onClickExport={this.onClickExport.bind(this)}
                      onClickLoc={this.onClickLoc.bind(this)}
                  />

                </div>
                <div className="tablelist">

                    <AntdTable
                      tableprops={{
                        bordered:true,
                      }}
                      listtypeid = 'antdtableposition'
                      ref='antdtableposition'
                      onItemConvert={this.onItemConvert.bind(this)}
                      columns={columns}
                      pagenumber={30}
                      query={this.state.querydo}
                      sort={{GPSTime: -1}}
                      queryfun={(payload)=>{
                        return callthen(uireport_searchposition_request,uireport_searchposition_result,payload);
                      }}
                    />


                </div>
            </div>

        );
    }
}


export default connect()(TablePosition);
