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
import {ui_mycar_selcurdevice} from '../../actions';
import { withRouter } from 'react-router-dom';

class Page extends React.Component {

    rowClick = (record, index, event)=>{
        console.log(record.carid);
        this.props.history.push(`/deviceinfo/${record.DeviceId}`);
    }

    render() {
        const { groupid,g_devicesdb,curdeviceid} = this.props;
        let mydevices = [];
        _.map(g_devicesdb,(item)=>{
          if(item.groupid === groupid){
            mydevices.push(item);
          }
        });

        if(curdeviceid !== '' && !!curdeviceid){
          mydevices = [];
          mydevices.push(g_devicesdb[curdeviceid]);
        }
        const columns = [{
            title: '车牌',
            dataIndex: 'DeviceId',
            key: 'DeviceId',
            render: text => <p>{text}</p>
        }, {
            title: 'VIN',
            dataIndex: 'VIN',
            key: 'VIN',
        }, {
            title: '运营年限',
            dataIndex: '运营年限',
            key: '运营年限',
        }, {
            title: '总里程',
            dataIndex: '总里程',
            key: '总里程',
        },{
            title: '保有率',
            dataIndex: '容量保有率',
            key: '容量保有率',
        }, {
            title: '位置',
            dataIndex: '位置',
            key: '位置',
            render: (v) => <span>{v}</span>
        }];
        return (
            <Table
                columns={columns}
                dataSource={mydevices}
                pagination={false}
                style={{flexGrow: 1}}
                onRowClick={this.rowClick}
                scroll={{ y: this.props.tableheight }}
                />
        );
    }
}
Page = withRouter(Page);
const mapStateToProps = ({device}) => {
  const {g_devicesdb} = device;
  return {g_devicesdb};
}
export default connect(mapStateToProps)(Page);
