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
import Updataimg from "../../img/18.png";
import Button  from 'antd/lib/button';
import _ from 'lodash';
import PicturesWall  from '../controls/pictureswall.js';
import {ui_selworkorder,setworkorderdone_request} from '../../actions';
import TextField from 'material-ui/TextField';

class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            innerWidth : window.innerWidth,
            selstatus : 0,
            selworkorder : 0,
            fileobj : '',
            pics:[],
            feedbacktxt:''
        };
    }

    componentWillMount(){
      const {workorders} = this.props;
      let data = workorders[this.props.match.params.workid];
      if(!!data){
        this.setState({
          pics:data.pics || []
        });
      }
    }

    onWorkorderdone(){
      this.props.dispatch(setworkorderdone_request({
        query:{_id:this.props.match.params.workid},
        data:{
          pics:this.state.pics,
          feedbacktxt:this.state.feedbacktxt,
          isdone:true,
        }
      }));
    }

    pointdevice =(id)=>{
        console.log(id);
        //定位设备
        this.props.dispatch(ui_selworkorder(id));
    }
    onChangePics(picsurl){
      this.setState({
        pics:picsurl || []
      });
    }
    render() {
        const {workorders} = this.props;
        const {pics} = this.state;
        let data = workorders[this.props.match.params.workid];
        const colorred = {color: "#C00"};
        let title = data.isdone?`已处理工单:${data._id}`:`待处理工单:${data._id}`
        return (
            <div className="indexPage AppPage"
                style={{
                    backgroundSize: "100% 100%",
                    minHeight : `${window.innerHeight}px`
                }}>
                <div className="navhead">
                    <a className="back" onClick={()=>{this.props.history.goBack()}}></a>
                    <span className="title" style={{paddingLeft : "34px"}}>{title}</span>
                    <a onClick={this.pointdevice.bind(this, data.DeviceId)} style={{color : "#FFF", fontSize: "16px"}}>定位设备</a>
                </div>
                <div className="workerorderinfo">
                    <ul>
                        <li><span>车牌：{data['车牌']} </span><span>派单时间：{data['派单时间']}</span></li>
                        <li><span>项目：{data['项目']}</span><span>故障类型：{data['故障类型']}</span></li>
                        <li><span>电池厂商：{data['电池厂商']}</span></li>
                        <li><span className="full">工单来源：{data['工单来源']}</span></li>
                        <li><span>电机厂商：{data['电机厂商']}</span><span>单号：{data['单号']}</span></li>
                        <li><span>联系人：{data['联系人']}</span><span>联系方式：{data['联系方式']}</span></li>
                        <li><span className="full">当前位置：{data['当前位置']}</span></li>
                        <li><span className="full">故障描述：{data['故障描述']}</span></li>
                        <li><span className="full">备注：{data['备注']}</span></li>
                    </ul>
                    <div className="tit">维修反馈</div>
                    <div className="infoimg">
                        {
                            data.isdone? <span className="isdonetext">{data.feedbacktxt}</span>:
                            <TextField
                                hintText="请输入反馈内容"
                                hintStyle={{top: 0}}
                                textareaStyle={{marginTop: "0"}}
                                multiLine={true}
                                rows={2}
                                rowsMax={2}
                                fullWidth={true}
                                onChange={(e,v)=>{
                                  this.setState({feedbacktxt:v});
                                }}
                            />
                        }

                        <PicturesWall value={pics} onChange={this.onChangePics.bind(this)} isdone={data.isdone} candel={false} />
                    </div>

                    {!data.isdone ? <Button type="primary" onClick={this.onWorkorderdone.bind(this)}>确认并提交审单员</Button>:null}
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({workorder}) => {
  const {workorders} = workorder;
  return {workorders};
}
export default connect(mapStateToProps)(Page);
