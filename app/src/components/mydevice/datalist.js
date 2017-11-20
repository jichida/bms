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
import {ui_mycar_selcurdevice} from '../../actions';
import { withRouter } from 'react-router-dom';

class Page extends React.Component {

    rowClick = (record, index, event)=>{
        console.log(record.carid);
        this.props.history.push(`/deviceinfo/${record.DeviceId}`);
    }

    render() {
        const groupid = this.props.match.params.groupid;
        const {groups,g_devicesdb,curdeviceid} = this.props;
        let mydevices = [];

        if(!!g_devicesdb[curdeviceid]){
          let item = {...g_devicesdb[curdeviceid],key:curdeviceid};
          mydevices.push(item);
        }
        else{
          let groupitem = groups[groupid];
          map(groupitem.deviceids,(item)=>{
            mydevices.push({...item,key:item.DeviceId});
          });
        }


        const columns = [{
            title: '车牌',
            dataIndex: 'DeviceId',
            key: 'DeviceId',
            render: text => <p>{text}</p>
        },{
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
  const {g_devicesdb,groups,} = device;
  return {g_devicesdb,groups,};
}
export default connect(mapStateToProps)(Page);
