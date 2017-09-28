/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './index.css';
import { withRouter } from 'react-router-dom';
import {ui_sel_tabindex} from '../../actions';
import _ from 'lodash';
import Avatar from "../../img/2.png";
import Footer1 from "../../img/1.png";
import Footer2 from "../../img/2.png";
import Footer3 from "../../img/3.png";
import Footer4 from "../../img/4.png";
import Footer5 from "../../img/5.png";
import Footer6 from "../../img/6.png";
import Footer7 from "../../img/7.png";
import Footer8 from "../../img/8.png";
import Footer9 from "../../img/9.png";
import Footer10 from "../../img/10.png";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            innerWidth : window.innerWidth,
        };
    }
    pushurl = (name,tabindex)=>{
       this.props.dispatch(ui_sel_tabindex(tabindex));
       this.props.history.replace(name);
   }
    render() {
        const {count_unreadalarms,count_undoworkorders,tabindex} = this.props;

        return (
            <div className="footerPage">
                <ul>
                    <li onClick={this.pushurl.bind(this, "/",0)}>
                        <img src={tabindex===0?Footer1:Footer2} />
                        <span className={tabindex===0?"sel":""}>总览</span>
                    </li>
                    <li onClick={this.pushurl.bind(this, "/warningdevice",1)}>
                        <img src={tabindex===1?Footer3:Footer4} />
                        <span className={tabindex===1?"sel":""}>预警信息</span>
                        {count_unreadalarms > 0 && <span className="num">{count_unreadalarms}</span>}
                    </li>
                    <li onClick={this.pushurl.bind(this, "/mydevice",2)}>
                        <img src={tabindex===2?Footer5:Footer6} />
                        <span className={tabindex===2?"sel":""}>车辆信息</span>
                    </li>
                    <li onClick={this.pushurl.bind(this, "/workorder",3)}>
                        <img src={tabindex===3?Footer7:Footer8} />
                        <span className={tabindex===3?"sel":""}>工单处理</span>
                        {count_undoworkorders > 0 && <span className="num">{count_undoworkorders}</span>}
                    </li>
                    <li onClick={this.pushurl.bind(this, "/playback/0",4)}>
                        <img src={tabindex===4?Footer9:Footer10} />
                        <span className={tabindex===4?"sel":""}>轨迹监控</span></li>
                </ul>
            </div>
        );
    }
}
Page = withRouter(Page);
const mapStateToProps = ({app,workorder,searchresult}) => {
    const {tabindex} = app;
    let count_unreadalarms = 0;
    let count_undoworkorders = 0;
    const {curallworkorder,workorders} = workorder;
    _.map(curallworkorder,(id)=>{
      let item = workorders[id];
      //统计
      if(!item.isdone){
        count_undoworkorders++;
      }
    });
    const {curallalarm,alarms} = searchresult;
    _.map(curallalarm,(aid)=>{
      let item = alarms[aid];
      if(!item.isreaded){
        count_unreadalarms++;
      }
    });
    return {tabindex,count_undoworkorders,count_unreadalarms};
}
export default connect(mapStateToProps)(Page);
