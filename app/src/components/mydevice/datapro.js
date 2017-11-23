/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import Table from 'antd/lib/table';
import Icon  from 'antd/lib/icon';
import map from 'lodash.map';
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
        const {groupidlist,groups} = this.props;
        let data = [];
        map(groupidlist,(gid)=>{
            let item = groups[gid];
            item['devicenum'] = item.deviceids.length;
            item['key'] = gid;
            data.push(item);
        });


        const columns = [{
            title: '项目',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: "车辆数",
            dataIndex: 'devicenum',
            className: 'column-money',
            key: 'devicenum',
            render: text => <span style={{display:"block", textAlign: "right", paddingRight:"20px"}}>{text}</span>,
        }];
        return (
            <Table columns={columns} dataSource={data} pagination={false} style={{flexGrow: 1}} onRowClick={this.rowClick}  scroll={{ y: this.props.tableheight }}/>
        );
    }
}

Page = withRouter(Page);
const mapStateToProps = ({device}) => {
    const {groupidlist,groups} = device;
    return {groupidlist,groups};
}
export default connect(mapStateToProps)(Page);
