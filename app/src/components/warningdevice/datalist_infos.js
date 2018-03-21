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
import {
  callthen,uireport_searchdevice_request,uireport_searchdevice_result
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
//       key:"5a1bfa2186ce24f6ce631d4a"
// 报警信息:"F[225] 6次|"
// 报警时间:"2018-01-07 21:08:59"
// 报警等级:""
// 车辆ID:"1727201118"
// _id:"5a1bfa2186ce24f6ce631d4a"
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
                onClick={this.rowClick.bind(this,item["车辆ID"])}
                >
                { !!item.warningtext && <span className="warningtdtitle"><b className={`warningtype_${item.warninglevel}`}>{warningtext[item.warninglevel]}</b></span> }
                <span>车辆: <br/>{item["车辆ID"]}</span>
                <span className="time">{item["报警时间"]}</span>
            </div>
        );
    }
    render() {
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
              return callthen(uireport_searchdevice_request,uireport_searchdevice_result,payload);
            }}
            listheight={window.innerHeight-58-66}
            query={this.props.query}
            sort={{warninglevel: -1}}
        />
      </div>);
    }
}


export default connect(null, null, null, { withRef: true })(Page);
