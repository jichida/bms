/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';

import "../../css/message.css";
import AntdTable from "../controls/antdtable.js";

import {download_excel,ui_alarm_selcurdevice} from '../../actions';

import TreeSearchreport from '../search/searchreport_alarmdetail';

import {
  callthen,uireport_searchalarmdetail_request,uireport_searchalarmdetail_result
} from '../../sagas/pagination';
import map from 'lodash.map';
import moment from 'moment';
import { set_weui } from '../../actions';

let resizetimecontent = null;
let g_querysaved;

class TableAlarmDetail extends React.Component {

    constructor(props) {
        super(props);
        let queryalarm = {};
        queryalarm['DataTime'] = {
          $gte:  moment().format('YYYY-MM-DD 00:00:00'),
          $lte:  moment().format('YYYY-MM-DD 23:59:59'),
        };
        let warninglevel = "-1";
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
        let query = g_querysaved || queryalarm;
        const DeviceId =  this.props.match.params.deviceid;
        if(DeviceId !== '0'){
          query.DeviceId = DeviceId;
        }

        this.state = {
          query: query,
          innerHeight: window.innerHeight,
          clientHeight:window.clientHeight
        };
    }

    onClickExport(query){
       const payload = {
            type:'report_alarmdetail',
            query
       };
      //console.log(`导出excel:${JSON.stringify(payload)}`);
      this.props.dispatch(download_excel(payload));
    }
    // ReviceId,DataTime,SaveTime,BAT_U_Out_HVS,BAT_U_TOT_HVS,BAT_I_HVS,BAT_SOC_HVS,BAT_SOH_HVS,BAT_Ucell_Max,BAT_Ucell_Min,BAT_Ucell_Max_CSC,BAT_Ucell_Max_CELL,BAT_Ucell_Min_CSC,BAT_Ucell_Min_CELL,BAT_T_Max,BAT_T_Min,BAT_T_Avg,BAT_T_Max_CSC,BAT_T_Min_CSC,BAT_User_SOC_HVS,BAT_Ucell_Avg,ALARM,ALIV_ST_SW_HVS,ST_AC_SW_HVS,ST_Aux_SW_HVS,ST_Main_Neg_SW_HVS,ST_Pre_SW_HVS,ST_Main_Pos_SW_HVS,ST_Chg_SW_HVS,ST_Fan_SW_HVS,ST_Heater_SW_HVS,BAT_U_HVS,BAT_Allow_Discharge_I,BAT_Allow_Charge_I,BAT_ISO_R_Pos,BAT_ISO_R_Neg,KeyOnVoltage,PowerVoltage,ChargeACVoltage,ChargeDCVoltage,CC2Voltage,ChargedCapacity,TotalWorkCycle,CSC_Power_Current,BAT_MAX_SOC_HVS,BAT_MIN_SOC_HVS,BAT_WEI_SOC_HVS,BAT_Chg_AmperReq,BPM_24V_Uout,ST_NegHeater_SW_HVS,ST_WirelessChg_SW,ST_SpearChg_SW_2,ST_PowerGridChg_SW,CC2Voltage_2,DIAG_H,DIAG_L
    onClickQuery(query){
      //console.log(query);
      this.setState({query,querydo:query});
      let hasDeviceId = !!query.DeviceId;
      if(!hasDeviceId && !!query['$and']){
        if(query['$and'].length > 0){
          hasDeviceId = query['$and'][0].DeviceId;
        }
      }
      if(hasDeviceId){
        window.setTimeout(()=>{
          //console.log(this.refs);
          this.refs.antdtablealarmdetail.getWrappedInstance().onRefresh();
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

    componentDidMount() {
        g_querysaved = null;
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

    render(){
        let warninglevel = this.props.match.params.warninglevel;
        if(warninglevel === 'all'){
          warninglevel = "-1";
        }


        const column_data = ['车辆ID','报警时间','报警等级','报警信息'];
        let columnx = 0;
        const column_width = [200,300,100,0];

        let columns = map(column_data, (data, index)=>{
          let column_item = {
              title: data,
              dataIndex: data,
              key: index,
              render: (text, row, index2) => {
                if(column_width[index] > 0){
                  return <span style={{width:`${column_width[index]}px`}}>{text}</span>;
                }
                return <span>{text}</span>;
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
        const viewinmap = (row)=>{
            console.log(row);//DeviceId
            // this.props.history.push(`/alarminfo/${row._id}`);
            this.props.dispatch(ui_alarm_selcurdevice(row['车辆ID']));
        }
        let columns_action ={
            title: "操作",
            dataIndex: '',
            width:`100px`,
            fixed: 'right',
            key: 'x',
            render: (text, row, index) => {
                return (<a onClick={()=>{viewinmap(row)}}>定位</a>);
            }
        }
        columns.push(columns_action);
        return (
            <div className="warningPage" style={{height : this.state.innerHeight+"px"}}>

                <div className="appbar">

                    <div className="title">报警信息明细</div>
                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>

                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport
                      onClickQuery={this.onClickQuery.bind(this)}
                      mapdict={this.props.mapdict}
                      query={this.state.query}
                      onClickExport={this.onClickExport.bind(this)}
                    />
                </div>
                <div className="tablelist" >
                    <AntdTable
                      tableprops={{scroll:{x: `${columnx+500}px`, y: 30*22},
                        bordered:true,
                      }}
                      listtypeid = 'antdtablealarmdetail'
                      usecache = {!!g_querysaved}
                      ref='antdtablealarmdetail'
                      onItemConvert={this.onItemConvert.bind(this)}
                      columns={columns}
                      pagenumber={30}
                      query={this.state.querydo}
                      sort={{DataTime: -1}}
                      queryfun={(payload)=>{
                        return callthen(uireport_searchalarmdetail_request,uireport_searchalarmdetail_result,payload);
                      }}
                    />
                </div>
            </div>

        );
    }
}

const mapStateToProps = ({app:{mapdict}}) => {
    return {mapdict};
}
export default connect(mapStateToProps)(TableAlarmDetail);
