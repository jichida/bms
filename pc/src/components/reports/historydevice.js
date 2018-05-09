/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';
import { Tooltip } from 'antd';
import "../../css/message.css";
import AntdTable from "../controls/antdtable.js";

import {download_excel,ui_alarm_selcurdevice} from '../../actions';
import moment from 'moment';

import TreeSearchreport from '../search/searchreport_device';
import {
  callthen,uireport_searchhistorydevice_request,uireport_searchhistorydevice_result
} from '../../sagas/pagination';
import get from 'lodash.get';
import { set_weui } from '../../actions';
let resizetimecontent = null;

class TablePosition extends React.Component {

    constructor(props) {
        super(props);
        let query = {};
        query['DataTime'] = {
          $gte:  moment().format('YYYY-MM-DD 00:00:00'),
          $lte:  moment().format('YYYY-MM-DD 23:59:59'),
        };
        let DeviceId =  this.props.match.params.deviceid;
        if(DeviceId !== '0'){
          query.DeviceId = DeviceId;
        }

        this.state = {query,
          innerHeight: window.innerHeight,
          clientHeight:window.clientHeight
        };
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
                clientHeight:window.clientHeight
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
      // hasDeviceId = true;
      if(hasDeviceId){
        window.setTimeout(()=>{
          //console.log(this.refs);
          this.refs.antdtabledevice.getWrappedInstance().onRefresh();
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
      let itemnew = {};
      itemnew[`key`] = get(item,'_id','');
      itemnew[`kafka偏移量`] = get(item,'recvoffset','');
      itemnew[`车辆ID`] = get(item,'DeviceId','');
      itemnew[`采集时间`] = get(item,'DataTime','');
      itemnew[`保存时间`] = get(item,'UpdateTime','');
      itemnew[`箱体测量电压(V)`] = get(item,'CHARGEACVOLTAGE','');
      itemnew[`箱体累加电压(V)`] = get(item,'BAT_U_TOT_HVS','');
      itemnew[`箱体电流(A)`] = get(item,'BAT_I_HVS','');
      itemnew[`真实SOC(%)`] = get(item,'BAT_SOC_HVS','');
      itemnew[`最高单体电压(V)`] = get(item,'BAT_UCELL_MAX','');
      itemnew[`最低单体电压(V)`] = get(item,'BAT_UCELL_MIN','');
      itemnew[`最高单体电压CSC号`] = get(item,'BAT_UCELL_MAX_CSC','');
      itemnew[`最高单体电芯位置`] = get(item,'BAT_UCELL_MAX_CELL','');
      itemnew[`最低单体电压CSC号`] = get(item,'BAT_UCELL_MIN_CSC','');
      itemnew[`最低单体电压电芯位置`] = get(item,'BAT_UCELL_MIN_CELL','');
      itemnew[`最高单体温度`] = get(item,'BAT_T_MAX','');
      itemnew[`最低单体温度`] = get(item,'BAT_T_MIN','');
      itemnew[`平均单体温度`] = get(item,'BAT_T_AVG','');
      itemnew[`最高温度CSC号`] = get(item,'BAT_T_MAX_CSC','');
      itemnew[`最低温度CSC号`] = get(item,'BAT_T_MIN_CSC','');
      itemnew[`显示用SOC`] = get(item,'BAT_USER_SOC_HVS','');
      itemnew[`平均单体电压`] = get(item,'BAT_UCELL_AVG','');
      itemnew[`报警信息`] = get(item,'alarmtxtstat','');

      return itemnew;
    }
    render(){
        const column_data = ['车辆ID','采集时间','保存时间','箱体测量电压(V)','箱体累加电压(V)',
          '箱体电流(A)','真实SOC(%)','最高单体电压(V)','最低单体电压(V)','最高单体电压CSC号',
          '最高单体电芯位置','最低单体电压CSC号','最低单体电压电芯位置','最高单体温度','最低单体温度',
          '平均单体温度','最高温度CSC号','最低温度CSC号','显示用SOC','平均单体电压',
          '报警信息'
        ];
        let columnx = 0;
        const column_width = [
          200,300,300,200,200,
          200,200,200,200,200,
          200,200,250,200,200,
          200,200,200,200,200,
          0
        ];

        let columns = map(column_data, (data, index)=>{
          let column_item = {
              title: data,
              dataIndex: data,
              key: index,
              render: (text, row, index) => {
                if(column_width[index] > 0){
                  return <Tooltip title={`${text}`}><span style={{width:`${column_width[index]}px`}}>{text}</span></Tooltip>;
                }
                return <Tooltip title={`${text}`}><span>{text}</span> </Tooltip>;
              },
              sorter:(a,b)=>{
                return a[data] > b[data] ? 1:-1;
              }
          };
          columnx += column_width[index];
          if(column_width[index] > 0){
            column_item = {...column_item,width:`${column_width[index]}px`};
          }
          return column_item;
        });

        // const viewinmap = (row)=>{
        //     console.log(row);//DeviceId
        //     // this.props.history.push(`/alarminfo/${row._id}`);
        //     this.props.dispatch(ui_alarm_selcurdevice(row[`车辆ID`]));
        // }
        // let columns_action ={
        //     title: "操作",
        //     width:`100px`,
        //     fixed: 'right',
        //     dataIndex: '',
        //     key: 'x',
        //     render: (text, row, index) => {
        //         return (<a onClick={()=>{viewinmap(row)}}>定位</a>);
        //     }
        // }
        // columnx += 300;
        // columns.push(columns_action);
        // const tableheight = `${this.state.innerHeight-129-60}px`;
        // console.log(tableheight );
        return (
            <div className="warningPage" style={{height : `${this.state.innerHeight}px`}}>

                <div className="appbar">

                    <div className="title">历史数据</div>
                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.replace("/")}}></i>

                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport
                      onClickQuery={this.onClickQuery.bind(this)}
                      onClickExport={this.onClickExport.bind(this)}
                      query={this.state.query}
                      onClickLoc={this.onClickLoc.bind(this)}
                    />
                </div>
                <div className="tablelist" >
                    <AntdTable
                      tableprops={{scroll:{x: `${columnx+500}px`, y: 30*41},
                      bordered:false,
                      }}

                      listtypeid = 'antdtabledevice'
                      ref='antdtabledevice'
                      onItemConvert={this.onItemConvert.bind(this)}
                      columns={columns}
                      pagenumber={30}
                      query={this.state.querydo}
                      sort={{'DataTime': -1}}
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
