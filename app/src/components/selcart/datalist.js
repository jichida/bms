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
        this.props.onClickSel(record.DeviceId);
    }

    render() {
        let {battery_data} = this.props;

        const columns = [ {
            title: '车辆ID',
            dataIndex: 'DeviceId',
            key: 'DeviceId',
            sorter: (a, b) => {
              console.log(`sort:${JSON.stringify(a)},${JSON.stringify(b)}`)
              return a['DeviceId'] > b['DeviceId']?1:-1;
            }
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
                dataSource={battery_data}
                pagination={false}
                style={{flexGrow: 1}}
                onRowClick={this.rowClick.bind(this)}
                scroll={{ y: this.props.tableheight }}
                />
        );
    }
}



const mapStateToProps = ({device:{g_devicesdb},searchresult:{searchresult_battery}}) => {
    const column_data = {
        "DeviceId" : "FSD-WE-234",
    };

    //模拟数据
    const battery_data = [];
    map(searchresult_battery,(curdeviceid)=>{
      battery_data.push({
          "DeviceId" : `${curdeviceid}`,
      });
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

    return {battery_data, columns};
}
Page = withRouter(Page);
export default connect(mapStateToProps)(Page);
