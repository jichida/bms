/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import { Table, Icon } from 'antd';
import _ from 'lodash';
import Searchimg from '../../img/13.png';
import Footer from "../index/footer.js";
import { withRouter } from 'react-router-dom';
import "../../css/antd.min.css";


class Page extends React.Component {

    render() {
        let {workorder_datas} = this.props;
        const columns = [{
            title: '工号',
            dataIndex: '_id',
            key: '_id'
        }, {
            title: '状态',
            dataIndex: 'isdone',
            key: 'isdone',
            render: isdone => <span>{!isdone?"待处理":"已完成"}</span>,
        }, {
            title: '车牌',
            dataIndex: '车牌',
            key: '车牌',
        }, {
            title: '项目',
            dataIndex: '项目',
            key: '项目',
        },{
            title: '处理人',
            dataIndex: '联系人',
            key: '联系人',
        }, {
            title: '故障类型',
            dataIndex: '故障类型',
            key: '故障类型'
        }];

        workorder_datas = _.sortBy(workorder_datas,[(item)=>{
          return item.isdone;
        }]);
        return (
            <Table
                columns={columns}
                dataSource={workorder_datas}
                pagination={false}
                style={{flexGrow: 1,overflow: "scroll"}}
                rowClassName={(v)=>{return v.isdone?"isdone":""}}
                onRowClick={(item)=>{this.props.history.push(`/workorderinfo/${item._id}`)}}
                scroll={{ y: this.props.tableheight }}
                />
        );
    }
}

Page = withRouter(Page);
export default connect()(Page);
