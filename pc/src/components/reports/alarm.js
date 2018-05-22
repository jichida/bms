/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';

import "../../css/message.css";
import AntdTable from "../controls/antdtable.js";
import { Tooltip } from 'antd';
// import {bridge_alarminfo} from '../../sagas/datapiple/bridgedb';
import moment from 'moment';

import TreeSearchreport from '../search/searchreport_alarm';
import {download_excel} from '../../actions';
import {
  callthen,uireport_searchalarm_request,uireport_searchalarm_result
} from '../../sagas/pagination';

let g_querysaved;
let resizetimecontent = null;

class TableAlarm extends React.Component {

    constructor(props) {
        super(props);
        let queryalarm = {};
        queryalarm['CurDay'] = moment().format('YYYY-MM-DD');
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
            });
        },10)
    }

    onClickExport(query){
      const payload = {
          type:'report_alarm',
          query
      };
      //console.log(`导出excel:${JSON.stringify(payload)}`);
      this.props.dispatch(download_excel(payload));
    }

    onClickQuery(query){
      //console.log(`查询报警信息:${JSON.stringify(query)}`);
      this.setState({query});
      window.setTimeout(()=>{
        //console.log(this.refs);
        this.refs.antdtablealarm.getWrappedInstance().onRefresh();
          // this.refs.alarmdatalist.getWrappedInstance().onRefresh();
      },0);
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
        let warninglevel = this.props.match.params.warninglevel;
        if(warninglevel === 'all'){
          warninglevel = "-1";
        }

        const viewrow = (DeviceId)=>{
            g_querysaved = this.state.query;
            this.props.history.push(`/reports/alarmdetail/${DeviceId}`);
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
                if(index === 0){
                  return <Tooltip title={`${text}`}><span onClick={
                    ()=>{viewrow(text)}
                  }>{text}</span> </Tooltip>;
                }
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


        // let columns_action ={
        //     title: "操作",
        //     width:`100px`,
        //     fixed: 'right',
        //     dataIndex: '',
        //     key: 'x',
        //     render: (text, row, index) => {
        //         return (<a onClick={()=>{viewrow(row)}}>查看</a>);
        //     }
        // }
        // columns.push(columns_action);
        return (
            <div className="warningPage" style={{height : this.state.innerHeight+"px"}}>

                <div className="appbar">
                    <div className="title">报警信息统计</div>
                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.replace("/")}}></i>

                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport
                      onClickQuery={this.onClickQuery.bind(this)}
                      query={this.state.query}
                      onClickExport={this.onClickExport.bind(this)}
                      />
                </div>
                <div className="tablelist" >
                    <AntdTable
                      tableprops={{
                        scroll:{x: `${columnx+500}px`},
                        bordered:true,
                      }}
                      listtypeid = 'antdtablealarm'
                      usecache = {!!g_querysaved}
                      ref='antdtablealarm'
                      onItemConvert={this.onItemConvert.bind(this)}
                      columns={columns}
                      pagenumber={30}
                      query={this.state.query}
                      sort={{DataTime: -1}}
                      queryfun={(payload)=>{
                        return callthen(uireport_searchalarm_request,uireport_searchalarm_result,payload);
                      }}
                    />
                </div>
            </div>

        );
    }
}

export default connect()(TableAlarm);
