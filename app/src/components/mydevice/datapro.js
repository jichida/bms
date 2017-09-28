/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import Table from 'antd/lib/table';
import Icon  from 'antd/lib/icon';
import _ from 'lodash';
import Searchimg from '../../img/13.png';
import Footer from "../index/footer.js";
import "../../css/antd.min.css";
import {jsondata_bms_mypro} from '../../test/bmsdata.js';
import {ui_mycar_selcurdevice} from '../../actions';
import { withRouter } from 'react-router-dom';

class Page extends React.Component {

    rowClick = (record, index, event)=>{
        this.props.history.push(`/project/${record._id}`);
    }
    render() {
        const {groupidlist,groups,g_devicesdb} = this.props;
        let data = [];
        _.map(groupidlist,(gid)=>{
          let item = groups[gid];
          let devicenum = 0;
          _.map(g_devicesdb,(device)=>{
            if(device.groupid === gid){
              devicenum++;
            }
          });
          item['devicenum'] = devicenum;
          data.push(groups[gid]);
        });


        const columns = [{
            title: '项目',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '车辆数',
            dataIndex: 'devicenum',
            key: 'devicenum',
        }, {
            title: '电池厂商',
            dataIndex: '电池厂商',
            key: '电池厂商',
        }, {
            title: '电机厂商',
            dataIndex: '电机厂商',
            key: '电机厂商',
        },{
            title: '电控厂商',
            dataIndex: '电控厂商',
            key: '电控厂商',
        }];
        return (
            <Table columns={columns} dataSource={data} pagination={false} style={{flexGrow: 1}} onRowClick={this.rowClick}  scroll={{ y: this.props.tableheight }}/>
        );
    }
}

Page = withRouter(Page);
const mapStateToProps = ({device}) => {
    const {groupidlist,groups,g_devicesdb} = device;
    return {groupidlist,groups,g_devicesdb};
}
export default connect(mapStateToProps)(Page);
