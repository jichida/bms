/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import map from 'lodash.map';
import { Button, Modal, Icon, message } from 'antd';
import { ui_alarm_selcurdevice,createworkorder_request } from '../../actions';
import moment from 'moment';
moment.locale('zh-cn');

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          showmodal : false,
          selworderid : '',
        }
    }
    componentWillMount () {
    }
    showworderlist=(showmodal)=>{
        this.setState({ showmodal });
    }
    selworderdone=()=>{
        if(this.state.selworderid===''){
            message.warning('您还没有制定派单人员！');
        }else{
            console.log(`开始派发工单给${this.state.selworderid}`);
            const {g_devicesdb,alarms,workusers} = this.props;
            let alarmid = this.props.match.params.alarmid;
            let curalarm =  alarms[alarmid];
            let cloneitem = {};
            cloneitem.createtime = moment().format('YYYY-MM-DD HH:mm:ss');
            cloneitem['assignto'] = this.state.selworderid;
            cloneitem['车牌'] = '';
            cloneitem['项目'] = '';
            cloneitem['故障类型'] = '';
            cloneitem['车辆ID'] = curalarm['车辆ID'];
            cloneitem['故障描述'] = curalarm['故障描述'];
            // cloneitem['部位'] = test_workorder_part_text[getrandom(0,test_workorder_part_text.length-1)];
            cloneitem['责任人'] = workusers[this.state.selworderid].name;
            cloneitem['故障地点'] =curalarm['告警位置'];
            cloneitem.isdone = false;
            cloneitem.pics = [];
            this.props.dispatch(createworkorder_request(cloneitem));
            this.showworderlist(false);
        }
    }
    selworderfn=(selworderid)=>{
        this.setState({ selworderid });
    }
    render() {
        const {g_devicesdb,alarms,workusers} = this.props;
        let alarmid = this.props.match.params.alarmid;
        let curalarm =  alarms[alarmid];
        let deviceid = curalarm['车辆ID'];

        const datadevice = {
            "基本信息" :[ {
                    name:'告警等级',
                    value: `${curalarm['告警等级']}`,
                },
                {
                    name:'车辆ID',
                    value: `${curalarm['车辆ID']}`,
                },
                {
                  name:'告警时间',
                  value: `${curalarm['告警时间']}`,
                },
                {
                  name:'报警信息',
                  value: `${curalarm['报警信息']}`,
                },
            ],
            // "位置信息" : [
            //     {
            //       name:'告警位置',
            //       value: `${curalarm['告警位置']}`,
            //     },
            //
            // ],
        };
        return (

            <div className="warningPage devicePage deviceinfoPage workorderinfoPage alarminfoPage" style={{height : window.innerHeight+"px"}}>

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>
                    <div className="title">告警详情</div>
                    <div className="devicebtnlist">
                        <Button
                            type="primary"
                            icon="environment"
                            onClick={()=>{this.props.dispatch(ui_alarm_selcurdevice(deviceid));}}
                            >定位车辆</Button>

                    </div>
                </div>
                <div
                    className="lists deviceinfolist"
                    style={{overflowY: "scroll"}}
                    >
                    {
                      map(datadevice,(item,index)=>{

                        return (
                            <div key={index}>
                                <div className="tit">{index}</div>
                                {
                                    map(item,(i,k)=>{
                                        return (<div key={k} className="li"><div><div className="name">{`${i.name}`}</div><div className="text">{`${i.value}`}</div></div></div>)
                                    })
                                }
                            </div>
                        );
                      })
                    }

                </div>
                <Modal
                    title="派发工单"
                    wrapClassName="vertical-center-modal"
                    visible={this.state.showmodal}
                    onOk={this.selworderdone}
                    onCancel={() => {this.showworderlist(false)}}
                    className="showworderlist"
                    >
                    {
                        map(workusers, (worder, index)=>{
                            return (
                                <p
                                    onClick={()=>{this.selworderfn(worder._id)}}
                                    key={worder._id}
                                    >
                                    <span>{worder.name}</span>
                                    { this.state.selworderid ===worder._id ?
                                        <Icon type="check-circle" style={{color: "#4DB361"}} />
                                        :<Icon type="check-circle" style={{color: "#EEEEEE"}} />}</p>);
                        })
                    }
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = ({device,searchresult,workorder}) => {
    const {g_devicesdb} = device;
    const {alarms} = searchresult;
    const {workusers} = workorder;
    return {g_devicesdb,alarms,workusers};
}

export default connect(mapStateToProps)(Page);
