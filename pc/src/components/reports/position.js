/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';

import "../../css/message.css";
import AntdTable from "../controls/antdtable.js";

import {bridge_alarminfo} from '../../sagas/datapiple/bridgedb';
import moment from 'moment';

import TreeSearchreport from '../search/searchreport_position';
import {
  callthen,ui_searchalarm_request,ui_searchalarm_result
} from '../../sagas/pagination';
import get from 'lodash.get';

class TablePosition extends React.Component {

    constructor(props) {
        super(props);
        let queryalarm = {};
        queryalarm['DataTime'] = {
          $gte: moment(moment().format('YYYY-MM-DD 00:00:00')),
          $lte: moment(moment().format('YYYY-MM-DD 23:59:59')),
        };
        this.state = {
          query:queryalarm
        }
    }

    onClickExport(){
      const payload = {
              type:'report_position',
              query:this.state.query
      };
      console.log(`导出excel:${JSON.stringify(payload)}`);
      // this.props.dispatch(
    }

    onClickQuery(query){
      console.log(query);
      const startDate = get(query,'query.queryalarm.startDate','');
      const endDate = get(query,'query.queryalarm.endDate','');
      // 【searchreport】查询条件:{"querydevice":{},"queryalarm":{"startDate":"2017-11-18 10:51:10","endDate":"2017-11-25 10:51:10","warninglevel":0}}
      let queryalarm = {};
      queryalarm['DataTime'] = {
        $gte: startDate,
        $lte: endDate,
      };

      console.log(`查询报警信息:${JSON.stringify(queryalarm)}`);
      this.setState({query:queryalarm});
      window.setTimeout(()=>{
        console.log(this.refs);
        this.refs.antdtablealarm.getWrappedInstance().onRefresh();
      },0);
    }
    onItemConvert(item){
      return bridge_alarminfo(item);
    }
    render(){
        let column_data = {
          "设备编号" : "",
          "省" : "",
          "市" : "",
          "区" : "",
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


        return (
            <div className="warningPage" style={{height : window.innerHeight+"px"}}>

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.push("./")}}></i>
                    <div className="title">位置报表</div>
                </div>
                <div className="TreeSearchBattery">
                    <TreeSearchreport onClickQuery={this.onClickQuery.bind(this)} onClickExport={this.onClickExport.bind(this)}/>
                </div>
                <div className="tablelist">
                    <AntdTable
                      ref='antdtablealarm'
                      onItemConvert={this.onItemConvert.bind(this)}
                      columns={columns}
                      pagenumber={30}
                      query={this.state.query}
                      sort={{DataTime: -1}}
                      queryfun={(payload)=>{
                        return callthen(ui_searchalarm_request,ui_searchalarm_result,payload);
                      }}
                    />
                </div>
            </div>

        );
    }
}


export default connect()(TablePosition);
