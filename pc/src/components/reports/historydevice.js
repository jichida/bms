/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';

import "../../css/message.css";
import AntdTable from "../controls/antdtable.js";

import {download_excel} from '../../actions';
import moment from 'moment';

import TreeSearchreport from '../search/searchreport_device';
import {
  callthen,uireport_searchhistorydevice_request,uireport_searchhistorydevice_result
} from '../../sagas/pagination';
import get from 'lodash.get';

let resizetimecontent = null;

class TablePosition extends React.Component {

    constructor(props) {
        super(props);
        let query = {};
        query['UpdateTime'] = {
          $gte: moment(moment().format('YYYY-MM-DD 00:00:00')),
          $lte: moment(moment().format('YYYY-MM-DD 23:59:59')),
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
          type:'report_historydevice',
          query
      };
      //console.log(`导出excel:${JSON.stringify(payload)}`);
      this.props.dispatch(download_excel(payload));
    }

    onClickQuery(query){
      //console.log(query);

      this.setState({query});
      window.setTimeout(()=>{
        //console.log(this.refs);
        this.refs.antdtabledevice.getWrappedInstance().onRefresh();
      },0);
    }


    onItemConvert(item){
      let itemnew = {...item};
      //DeviceId Latitude Longitude GPSTime
      itemnew['key'] = get(item,'_id','');
      itemnew[`采集时间`] = get(item,'DeviceId','');
      itemnew[`保存时间`] = get(item,'DeviceId','');
      itemnew[`箱体测量电压(V)`] = get(item,'DeviceId','');
      itemnew[`箱体累加电压(V)`] = get(item,'DeviceId','');
      itemnew[`箱体电流(A)`] = get(item,'DeviceId','');
      itemnew[`真实SOC(%)`] = get(item,'DeviceId','');
      itemnew[`最高单体电压(V)`] = get(item,'DeviceId','');
      itemnew[`最低单体电压(V)`] = get(item,'DeviceId','');
      itemnew[`最高单体电压CSC号`] = get(item,'DeviceId','');
      itemnew[`最高单体电芯位置`] = get(item,'DeviceId','');
      itemnew[`最低单体电压CSC号`] = get(item,'DeviceId','');
      itemnew[`最低单体电压电芯位置`] = get(item,'DeviceId','');
      itemnew[`最高单体温度`] = get(item,'DeviceId','');
      itemnew[`最低单体温度`] = get(item,'DeviceId','');
      itemnew[`平均单体温度`] = get(item,'DeviceId','');
      itemnew[`最高温度CSC号`] = get(item,'DeviceId','');
      itemnew[`最低温度CSC号`] = get(item,'DeviceId','');
      itemnew[`显示用SOC`] = get(item,'DeviceId','');
      itemnew[`平均单体电压`] = get(item,'DeviceId','');
      itemnew[`报警状态`] = get(item,'DeviceId','');
      return itemnew;
    }
    render(){
        let column_data = [
          '采集时间',
          '保存时间',
          '箱体测量电压(V)',
          '箱体累加电压(V)',
          '箱体电流(A)',
          '真实SOC(%)',
          '最高单体电压(V)',
          '最低单体电压(V)',
          '最高单体电压CSC号',
          '最高单体电芯位置',
          '最低单体电压CSC号',
          '最低单体电压电芯位置',
          '最高单体温度',
          '最低单体温度',
          '平均单体温度',
          '最高温度CSC号',
          '最低温度CSC号',
          '显示用SOC',
          '平均单体电压',
          '报警状态',
        ];
        let columns = map(column_data, (data, index)=>{
          let column_item = {
              title: data,
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


        return (
            <div className="warningPage" style={{height : this.state.innerHeight+"px"}}>

                <div className="appbar">

                    <div className="title">设备报表</div>
                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.replace("/")}}></i>

                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport
                      onClickQuery={this.onClickQuery.bind(this)}
                      onClickExport={this.onClickExport.bind(this)}
                      query={this.state.query}
                    />
                </div>
                <div className="tablelist">
                    <AntdTable
                      ref='antdtabledevice'
                      onItemConvert={this.onItemConvert.bind(this)}
                      columns={columns}
                      pagenumber={30}
                      query={this.state.query}
                      sort={{'LastRealtimeAlarm.DataTime': -1}}
                      queryfun={(payload)=>{
                        return callthen(uireport_searchhistorydevice_request,uireport_searchhistorydevice_result,payload);
                      }}
                    />
                </div>
            </div>

        );
    }
}


export default connect()(TablePosition);
