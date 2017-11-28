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
import {
  callthen,ui_searchalarm_request,ui_searchalarm_result
} from '../../sagas/pagination';
import InfinitePage from '../controls/listview';



class Page extends React.Component {
    componentWillMount() {
      // this.props.dispatch(ui_resetsearch({}));
    }
    rowClick(id){
        this.props.onClickRow(id);
    }
    updateContent = (item)=> {
        let warningtext = {
            "高":"1",
            "中":"2",
            "低":"3"
        };
        console.log(item);
        return  (
            <div
                key={item._id}
                className={`warningtypelist warningtype_${warningtext[item.warninglevel]}`}
                onClick={this.rowClick.bind(this,item._id)}
                >
                { !!item.warningtext && <span className="warningtdtitle"><b className={`warningtype_${item.warninglevel}`}>{warningtext[item.warninglevel]}</b></span> }
                <span>车辆: <br/>{item["DeviceId"]}</span>
                <span className="time">{item["DataTime"]}</span>
            </div>
        );
    }
    render() {
        // let {g_devicesdb,alarms,searchresult_alaram,alaram_data} = this.props;
        // const columns = map
        // const {seltype} = this.props;

        // let dataalarm = [];
        // dataalarm = filter(alaram_data,(item) => {
        //   if(seltype === 0){
        //     return !item.isreaded;
        //   }
        //   if(seltype === 1){
        //     return item.isreaded;
        //   }
        //   return true;
        // });
        // const columns = [
        //   {
        //     title: '报警时间',
        //     dataIndex: '报警时间',
        //     key: '报警时间',
        //     render: (text, record, index) => {
        //         let warningtext = ["高","中","低"];
        //         return (<span className="warningtdtitle"><b className={`warningtype_${record.warninglevel}`}>{warningtext[record.warninglevel]}</b><span>{text}</span></span>)
        //     },
        //     sorter: (a, b) => {
        //       console.log(`sort:${JSON.stringify(a)},${JSON.stringify(b)}`)
        //       return a['报警时间'] > b['报警时间']?1:-1;
        //     }
        // }, {
        //     title: '车辆ID',
        //     dataIndex: '车辆ID',
        //     key: 'deviceid',
        //     sorter: (a, b) => {
        //       console.log(`sort:${JSON.stringify(a)},${JSON.stringify(b)}`)
        //       return a['车辆ID'] > b['车辆ID']?1:-1;
        //     }
        // }, {
        //     title: '故障信息',
        //     dataIndex: '报警信息',
        //     key: '报警信息',
        // }];
        // alaram_data = sortBy(alaram_data,[(item)=>{
        //   return item.isreaded;
        // },
        // (item)=>{
        //   return item.warninglevel;
        // }]);
        console.log(`search alarm:${JSON.stringify(this.props.query)}`);
        return (
        <div style={{height : `${window.innerHeight-58-66}px`, overflow:"hidden"}}>
        <InfinitePage
            usecache={this.props.usecachealarm}
            listtypeid='listalarm'
            ref='alarmlist'
            pagenumber={20}
            updateContent={this.updateContent}
            queryfun={(payload)=>{
              return callthen(ui_searchalarm_request,ui_searchalarm_result,payload);
            }}
            listheight={window.innerHeight-58-66}
            query={this.props.query}
            sort={{warninglevel: -1}}
        />
      </div>);
        // return (
        //     <Table
        //         columns={columns}
        //         dataSource={alaram_data}
        //         pagination={false}
        //         style={{flexGrow: 1}}
        //         rowClassName={(v)=>{return v.isreaded?"isreaded":""}}
        //         onRowClick={this.rowClick.bind(this)}
        //         scroll={{ y: this.props.tableheight }}
        //         />
        // );
    }
}



// const mapStateToProps = ({device:{g_devicesdb},searchresult:{searchresult_alaram,alarms}}) => {
//     const column_data = {
//       "车辆ID" : "",
//       "报警时间" : "",
//       "报警等级" : "",
//       "报警信息" : "绝缘故障",
//     };
//     const alaram_data = [];
//     map(searchresult_alaram,(aid)=>{
//       let alarminfo = alarms[aid];
//       alaram_data.push(bridge_alarminfo(alarminfo));
//     });

//     let columns = map(column_data, (data, index)=>{
//         return {
//             title: index,
//             dataIndex: index,
//             key: index,
//             render: (text, row, index) => {
//                 return <span>{text}</span>;
//             }
//         }
//     })

//     return {g_devicesdb,alarms,searchresult_alaram, alaram_data, columns};
// }
// Page = withRouter(Page);
export default connect(null, null, null, { withRef: true })(Page);
