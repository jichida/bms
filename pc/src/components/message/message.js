/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';
import get from 'lodash.get';
import AntdTable from "../controls/table.js";
import moment from 'moment';
import TreeSearchreport from '../search/search_message';

// import {
//   callthen,uireport_searchalarm_request,uireport_searchalarm_result
// } from '../../sagas/pagination';


import "../../css/message.css";


let g_querysaved;
class MessageAllDevice extends React.Component {

    constructor(props) {
        super(props);
        let warninglevel = props.match.params.warninglevel || "-1";
        let queryalarm = {};
        queryalarm['DataTime'] = {
          $gte: moment().format('YYYY-MM-DD 00:00:00'),
          $lte:moment().format('YYYY-MM-DD 23:59:59'),
        };
        if(warninglevel === '0'){
          queryalarm['warninglevel'] = '高';
        }
        else if(warninglevel === '1'){
          queryalarm['warninglevel'] = '中';
        }
        else if(warninglevel === '2'){
          queryalarm['warninglevel'] = '低';
        }
        else{
          queryalarm['warninglevel'] = {$in:['高','中','低']};
        }
        let DeviceId =  this.props.match.params.deviceid;
        if(DeviceId !== '0' && !!DeviceId){
          queryalarm['DeviceId'] = DeviceId;
        }

        this.state = {
          query: g_querysaved || queryalarm
        }
    }
    componentDidMount () {
      g_querysaved = null;
    }
    onClickQuery(query){
      //console.log(query);
      this.setState({query});
    }

    onItemConvert(item){
      const warninglevel = item['报警等级'];
      if(warninglevel === '高'){
        item['报警等级'] = '三级';
      }
      else if(warninglevel === '中'){
        item['报警等级'] = '二级';
      }
      else if(warninglevel === '低'){
        item['报警等级'] = '一级';
      }
      return item;
    }
    render(){
        const column_data = {
          "车辆ID" : "",
          "报警时间" : "",
          "报警等级" : "",
          "报警信息" : "绝缘故障",
        };
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
        });

        const {g_devicesdb} = this.props;
        const {warninglevel,DeviceId} = this.state.query;
        let data = [];
        map(g_devicesdb,(deviceitem)=>{
          let matcheddevice = false;
          let matchedwarninglevel = false;
          if(!!DeviceId){
            if(deviceitem.DeviceId === DeviceId){
              matcheddevice = true;
            }
          }
          else{
            matcheddevice = true;
          }

          if(!!warninglevel){
            if(typeof warninglevel === 'string'){
              if(warninglevel !== ''){
                if(warninglevel === get(deviceitem,'warninglevel')){
                  matchedwarninglevel = true;
                }
              }
            }
            else{
              matchedwarninglevel = get(deviceitem,'warninglevel','') !== '';//all
            }
          }

          if(matcheddevice && matchedwarninglevel){
            data.push({
              key:get(deviceitem,'DeviceId',''),
              "车辆ID" : get(deviceitem,'DeviceId',''),
              "报警时间" : get(deviceitem,'LastRealtimeAlarm.DataTime',''),
              "报警等级" : get(deviceitem,'warninglevel',''),
              "报警信息" : get(deviceitem,'alarmtxtstat',''),
            });
          }
        });
        // let viewrow = (row)=>{
        //     //console.log(row);
        //     g_querysaved = this.state.query;
        //     this.props.history.push(`/alarminfo/${row.key}`);
        // }

        // let columns_action ={
        //     title: "操作",
        //     dataIndex: '',
        //     key: 'x',
        //     render: (text, row, index) => {
        //         return (<a onClick={()=>{viewrow(row)}}>查看</a>);
        //     }
        // }
        // columns.push(columns_action);
        return (
            <div className="warningPage" style={{height : window.innerHeight+"px"}}>

                <div className="appbar">
                    <div className="title">报警车辆</div>
                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.push("./")}}></i>
                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport onClickQuery={this.onClickQuery.bind(this)} query={this.state.query}/>
                </div>
                <div className="tablelist">
                    <AntdTable
                      columns={columns}
                      data={data}
                    />
                </div>
            </div>

        );
    }
}

const mapStateToProps = ({device:{g_devicesdb}}) => {
  return {g_devicesdb};
}
export default connect(mapStateToProps)(MessageAllDevice);
