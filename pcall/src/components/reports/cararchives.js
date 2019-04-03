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

import TreeSearchreport from '../search/searchreport_cararchives';
import {
  callthen,uireport_searchcararchives_request,uireport_searchcararchives_result
} from '../../sagas/pagination';
import get from 'lodash.get';

let resizetimecontent = null;

class TablePosition extends React.Component {

    constructor(props) {
        super(props);
        let query = {};
        query['DataTime'] = {
          $gte:  moment().format('YYYY-MM-DD 00:00:00'),
          $lte:  moment().format('YYYY-MM-DD 23:59:59'),
        };
        const DeviceId =  this.props.match.params.deviceid;
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
          type:'report_cararchives',
          query
      };
      ////console.log(`导出excel:${JSON.stringify(payload)}`);
      this.props.dispatch(download_excel(payload));
    }

    onClickQuery(query){
      ////console.log(query);

      this.setState({query});
      window.setTimeout(()=>{
        ////console.log(this.refs);
        this.refs.antdtablecarchives.getWrappedInstance().onRefresh();
      },0);
    }


    onItemConvert(item){
      let itemnew = {};
      itemnew[`key`] = get(item,'_id','');
      itemnew[`RDB编号`] = get(item,'DeviceId','');
      itemnew[`项目`] = get(item,'catlprojectname','');
      itemnew[`系统Barcode`] = get(item,'batterysystemflownumber','');
      itemnew[`省份`] = get(item,'province','');
      itemnew[`地区`] = get(item,'area','');
      itemnew[`生产日期`] = get(item,'datebatterydelivery','');
      itemnew[`出厂日期`] = get(item,'datevehiclefactory','');
      itemnew[`标称容量`] = get(item,'capacity','');
      itemnew[`串联数`] = get(item,'serialnumber','');
      itemnew[`并联数`] = get(item,'parallelnumber','');
      itemnew[`客户名称`] = get(item,'customername','');
      itemnew[`开始使用年份`] = get(item,'usedyear','');
      itemnew[`客服packno`] = get(item,'packnocs','');
      return itemnew;
    }
    render(){

      const column_data = ['RDB编号','项目','系统Barcode','省份',
      '地区','生产日期','出厂日期','标称容量','串联数','并联数','客户名称'];

        let columns = map(column_data, (data, index)=>{
          let column_item = {
              title: data,
              dataIndex: data,
              key: index,
              render: (text, row, index) => {
                return <Tooltip title={`${text}`}><span>{text}</span> </Tooltip>;
              },
              sorter:(a,b)=>{
                return a[data] > b[data] ? 1:-1;
              }
          };
          return column_item;
        });
        const viewinmap = (row)=>{
            //console.log(row);//DeviceId
            // this.props.history.push(`/alarminfo/${row._id}`);
            this.props.dispatch(ui_alarm_selcurdevice(row[`RDB编号`]));
        }
        let columns_action ={
            title: "操作",
            dataIndex: '',
            width:100,
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

                    <div className="title">车辆档案查询</div>
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
                      listtypeid = 'antdtablecarchives'
                      ref='antdtablecarchives'
                      onItemConvert={this.onItemConvert.bind(this)}
                      columns={columns}
                      pagenumber={30}
                      query={this.state.query}
                      sort={{'DeviceId': 1}}
                      queryfun={(payload)=>{
                        return callthen(uireport_searchcararchives_request,uireport_searchcararchives_result,payload);
                      }}
                    />
                </div>
            </div>

        );
    }
}


export default connect()(TablePosition);
