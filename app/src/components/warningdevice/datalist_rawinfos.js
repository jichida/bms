/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
// import Table from 'antd/lib/table';
// import Icon  from 'antd/lib/icon';
// import filter from 'lodash.filter';
// import sortBy from 'lodash.sortby';
// import map from 'lodash.map';
// import Searchimg from '../../img/13.png';
// import Footer from "../index/footer.js";
// import { withRouter } from 'react-router-dom';
import "../../css/antd.min.css";
// import {ui_resetsearch} from '../../actions';
// import {bridge_alarminfo} from '../../sagas/datapiple/bridgedb';
import { callthen,uireport_searchalarmdetail_request,uireport_searchalarmdetail_result } from '../../sagas/pagination';
import InfinitePage from '../controls/listview';
import moment from 'moment';


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

        console.log("itemitem");
        console.log(item);

        let level = 3;
        let  LevelDiv = (<i className="warninglevel warninglevel_3">低</i>);
        if(item["报警信息"] === '高'){
          level = 1;
          LevelDiv = (<i className="warninglevel warninglevel_1">高</i>);
        }
        else if(item["报警信息"] === '中'){
          level = 2;
          LevelDiv = (<i className="warninglevel warninglevel_2">中</i>);
        }
//
// key
// :
// "5a1bfa0f46a68b00019fd34e"
// 报警信息
// :
// "F[225]"
// 报警时间
// :
// "2017-11-17 22:04:47"
// 车辆ID
// :
// "1727202266"
        return  (
            <div
                key={item._id}
                className={`warningtypelist warningtype_${level} alarmrawinfos`}
                onClick={this.rowClick.bind(this,item.key)}
                >
                {/* { !!item.warningtext && <span className="warningtdtitle"><b className={`warningtype_${item.warninglevel}`}>{warningtext[item.warninglevel]}</b></span> } */}
                {LevelDiv}
                <span className="warningtext">{moment(item["报警时间"]).format("YYYY-MM-DD HH:mm:ss")}</span>
                <span className="time">{item["报警信息"]}</span>
            </div>
        );
    }
    render() {
        console.log(`search alarm:${JSON.stringify(this.props.query)}`);
        return (
        <div style={{height : `${window.innerHeight-76}px`, overflow:"hidden"}}>
        <div className="datalist_rawinfos_tt">
            <span>等级</span>
            <span className="c">采集时间</span>
            <span>信息</span>
        </div>
        <InfinitePage
            usecache={this.props.usecachealarm}
            listtypeid='listalarmraw'
            ref='alarmrawlist'
            pagenumber={20}
            updateContent={this.updateContent}
            queryfun={(payload)=>{
              return callthen(uireport_searchalarmdetail_request,uireport_searchalarmdetail_result,payload);
            }}
            listheight={this.props.tableheight}
            query={this.props.query}
            sort={{DataTime:-1}}
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
