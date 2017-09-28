/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import Avatar from "../../img/2.png";
import Userlnk from "../../img/11.png";
import Setting from "../../img/12.png";
import Footer from "../index/footer.js";
import Collectiondevice from "../collectiondevice";
import Datalist from "./datalist";
import map from 'lodash.map';
import minBy from 'lodash.minby';
import moment from 'moment';
import {
  getallworkorder_request,
  queryworkorder_request
} from '../../actions';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            innerWidth : window.innerWidth,
            selstatus : 0,
        };
    }

    componentWillMount() {
      // this.props.dispatch(getallworkorder_request({}));
    }

    onClickQuery(query){
        this.props.dispatch(queryworkorder_request(query));
    }


    indexnavclick=(v)=>{
        console.log(v);
        this.setState({selstatus : v});
    }

    render() {
        const {curallworkorder,workorders} = this.props;
        const {selstatus} = this.state;

        let workorder_datas = [];
        let count_done = 0;
        let count_undo = 0;
        map(curallworkorder,(id)=>{
          let item = workorders[id];
          if(selstatus === 0 && !item.isdone){
            workorder_datas.push(item);
          }
          else if(selstatus === 1 && item.isdone){
            workorder_datas.push(item);
          }
          else if(selstatus === 2){
            workorder_datas.push(item);
          }

          //统计
          if(item.isdone){
            count_done++;
          }
          else{
            count_undo++;
          }
        });

        let count_all = count_done + count_undo;

        const colorred = {color: "#C00"};

        let leastdays = 1;
        let earlytimeo = minBy(workorder_datas,(o)=>{
          return o.createtime;
        });
        if(!!earlytimeo){
          try{
            let days = moment().diff(moment(earlytimeo.createtime),'days');
            leastdays = days+1;
          }
          catch(e){
            console.log(e);
          }
        }
        return (
            <div className="indexPage AppPage"
                style={{
                    backgroundSize: "100% 100%",
                    height : `${window.innerHeight}px`
                }}>
                <div className="navhead">
                    <span className="title">工单处理</span>
                </div>
                <div className="workorderlist">
                    <div className="contenttit">过去<span style={colorred}>{`${leastdays}`}</span>天内工共发生<span style={colorred}>
                      {`${count_all}`} </span>
                    起故障,已处理<span style={colorred}> {`${count_done}`} </span>
                    起,未处理 <span style={colorred}>{`${count_undo}`} </span>起</div>
                    <div className="workordernav">
                        <span className={selstatus===0?"sel":""} onClick={this.indexnavclick.bind(this,0)}>待处理</span>
                        <span className={selstatus===1?"sel":""} onClick={this.indexnavclick.bind(this,1)}>已完成</span>
                        <span className={selstatus===2?"sel":""} onClick={this.indexnavclick.bind(this,2)}>所有工单</span>
                    </div>
                    <Datalist workorder_datas={workorder_datas} tableheight={window.innerHeight-(55+38+40+50+66)}/>
                </div>
                <Footer />
            </div>
        );
    }
}
const mapStateToProps = ({workorder}) => {
  const {curallworkorder,workorders} = workorder;
  return {curallworkorder,workorders};
}
export default connect(mapStateToProps)(Page);
