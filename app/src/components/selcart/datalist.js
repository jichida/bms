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
// import {ui_resetsearch} from '../../actions';

class Page extends React.Component {

    

    componentWillMount() {
        // this.props.dispatch(ui_resetsearch({}));
    }
    rowClick(record, index, event){
        console.log(record.DeviceId);
    }

    render() {
        let {g_devicesdb,alarms,searchresult_alaram,alaram_data} = this.props;
        // const columns = map
        // let dataalarm = [];
        // dataalarm = filter(alaram_data,(item) => {
        //   return true;
        // });
        const columns = [ {
            title: '车辆ID',
            dataIndex: 'DeviceId',
            key: 'DeviceId',
            sorter: (a, b) => {
              console.log(`sort:${JSON.stringify(a)},${JSON.stringify(b)}`)
              return a['DeviceId'] > b['DeviceId']?1:-1;
            }
        },{
            title: <span style={{display:"block", textAlign: "right"}}>所在位置</span>,
            dataIndex: '告警位置',
            key: '告警位置',
            render: (v) => <span style={{display:"block", textAlign: "right"}}>{v}</span>
        }];
        // alaram_data = sortBy(alaram_data,[(item)=>{
        //   return item.isreaded;
        // },
        // (item)=>{
        //   return item.warninglevel;
        // }]);
        return (
            <Table
                columns={columns}
                dataSource={alaram_data}
                pagination={false}
                style={{flexGrow: 1}}
                onRowClick={this.rowClick.bind(this)}
                scroll={{ y: this.props.tableheight }}
                />
        );
    }
}



const mapStateToProps = ({device:{g_devicesdb},searchresult:{searchresult_alaram,alarms}}) => {
    const column_data = {
        "DeviceId" : "FSD-WE-234",
        "告警位置" : "江苏常州武进区",
    };

    //模拟数据
    const alaram_data = [{
        "DeviceId" : "FSD-WE-234",
        "告警位置" : "江苏常州武进区",
    },{
        "DeviceId" : "FSD-WE-235",
        "告警位置" : "江苏常州武进区",
    }]
    // const alaram_data = [];
    // map(searchresult_alaram,(aid)=>{
    //     alaram_data.push(alarms[aid]);
    // });

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
