/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import Table from 'antd/lib/table';
import Icon  from 'antd/lib/icon';
import filter from 'lodash.filter';
import sortBy from 'lodash.sortby';
import map from 'lodash.map';
import Searchimg from '../../img/13.png';
import Footer from "../index/footer.js";
import { withRouter } from 'react-router-dom';
import "../../css/antd.min.css";
import {ui_resetsearch} from '../../actions';
import {bridge_alarminfo} from '../../sagas/datapiple/bridgedb';


class Page extends React.Component {
    componentWillMount() {
      // this.props.dispatch(ui_resetsearch({}));
    }
    rowClick(record, index, event){
        // console.log(record.DeviceId);
        let alaramid = record[`key`];
        this.props.history.push(`/alarminfo/${alaramid}`)
    }

    render() {
        let {g_devicesdb,alarms,searchresult_alaram,alaram_data} = this.props;
        // const columns = map
        const {seltype} = this.props;

        let dataalarm = [];
        dataalarm = filter(alaram_data,(item) => {
          if(seltype === 0){
            return !item.isreaded;
          }
          if(seltype === 1){
            return item.isreaded;
          }
          return true;
        });
        const columns = [
          {
            title: '报警时间',
            dataIndex: '报警时间',
            key: '报警时间',
            render: (text, record, index) => {
                let warningtext = ["高","中","低"];
                return (<span className="warningtdtitle"><b className={`warningtype_${record.warninglevel}`}>{warningtext[record.warninglevel]}</b><span>{text}</span></span>)
            },
            sorter: (a, b) => {
              console.log(`sort:${JSON.stringify(a)},${JSON.stringify(b)}`)
              return a['报警时间'] > b['报警时间']?1:-1;
            }
        }, {
            title: '车辆ID',
            dataIndex: '车辆ID',
            key: 'deviceid',
            sorter: (a, b) => {
              console.log(`sort:${JSON.stringify(a)},${JSON.stringify(b)}`)
              return a['车辆ID'] > b['车辆ID']?1:-1;
            }
        }, {
            title: '故障信息',
            dataIndex: '报警信息',
            key: '报警信息',
        }];
        alaram_data = sortBy(alaram_data,[(item)=>{
          return item.isreaded;
        },
        (item)=>{
          return item.warninglevel;
        }]);
        return (
            <Table
                columns={columns}
                dataSource={alaram_data}
                pagination={false}
                style={{flexGrow: 1}}
                rowClassName={(v)=>{return v.isreaded?"isreaded":""}}
                onRowClick={this.rowClick.bind(this)}
                scroll={{ y: this.props.tableheight }}
                />
        );
    }
}



const mapStateToProps = ({device:{g_devicesdb},searchresult:{searchresult_alaram,alarms}}) => {
    const column_data = {
      "车辆ID" : "",
      "报警时间" : "",
      "报警等级" : "",
      "报警信息" : "绝缘故障",
    };
    const alaram_data = [];
    map(searchresult_alaram,(aid)=>{
      let alarminfo = alarms[aid];
      alaram_data.push(bridge_alarminfo(alarminfo));
    });

    let columns = map(column_data, (data, index)=>{
        return {
            title: index,
            dataIndex: index,
            key: index,
            render: (text, row, index) => {
                return <span>{text}</span>;
            }
        }
    })

    return {g_devicesdb,alarms,searchresult_alaram, alaram_data, columns};
}
Page = withRouter(Page);
export default connect(mapStateToProps)(Page);
