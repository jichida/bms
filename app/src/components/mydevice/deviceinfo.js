/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Devicestar from "../../img/16.png";
import Moresetting from "../../img/17.png";
import Searchimg from '../../img/13.png';
import Footer from "../index/footer.js";
import {ui_sel_tabindex} from '../../actions';
import Button  from 'antd/lib/button';
import {
    ui_index_addcollection,
    ui_index_unaddcollection
} from '../../actions';

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showtype : 0
        };
    }

    render() {
        const {carcollections,g_devicesdb} = this.props;
        let deviceid = this.props.match.params.deviceid;
        let isincollections = false;
        _.map(carcollections,(id)=>{
            if(id === deviceid){
                isincollections = true;
            }
        });
        const deviceitem = g_devicesdb[deviceid];
        const datadevice = {

            "基本信息" :[ {
                    name:'采集时间',
                    value:_.get(deviceitem,'采集时间'),
                },
                {
                    name:'车速(km/h)',
                    value: _.get(deviceitem,'车速(km/h)'),
                },
                {
                  name:'驱动有效',
                  value: _.get(deviceitem,'驱动有效'),
                },
                {
                  name:'制动有效',
                  value: _.get(deviceitem,'制动有效'),
                },
                {
                  name:'里程(km)',
                  value: _.get(deviceitem,'里程(km)'),
                },
                {
                  name:'空调温度(℃)',
                  value: _.get(deviceitem,'空调温度(℃)'),
                },
                {
                  name:'档位',
                  value:_.get(deviceitem,'档位'),
                },
                {
                  name:'加速踏板行程值(%)',
                  value:_.get(deviceitem,'加速踏板行程值(%)'),
                },
                {
                  name:'制动踏板行程值(%)',
                  value:_.get(deviceitem,'制动踏板行程值(%)'),
                },
                {
                  name:'充放电状态',
                  value: _.get(deviceitem,'充放电状态'),
                },
                {
                  name:'驱动电机控制器温度(℃)',
                  value:  _.get(deviceitem,'驱动电机控制器温度(℃)'),
                },
                {
                  name:'驱动电机转速(r/min)',
                  value:  _.get(deviceitem,'驱动电机转速(r/min)'),
                },
                {
                  name:'驱动电机温度(℃)',
                  value:_.get(deviceitem,'驱动电机温度(℃)'),
                },
                {
                  name:'电机控制器输入电压',
                  value: _.get(deviceitem,'电机控制器输入电压'),
                },
                {
                  name:'电机控制器直流母线电流',
                  value: _.get(deviceitem,'电机控制器直流母线电流'),
                },
              ],
              "GPS信息" : [
                {
                  name:'定位状态',
                  value: _.get(deviceitem,'定位状态'),
                },
                {
                  name:'纬度信息',
                  value: _.get(deviceitem,'纬度信息'),
                },
                {
                  name:'经度信息',
                  value:_.get(deviceitem,'经度信息'),
                },
                {
                  name:'经度',
                  value: _.get(deviceitem,'经度'),
                },
                {
                  name:'纬度',
                  value: _.get(deviceitem,'纬度'),
                },
                {
                  name:'GPS速度(km/h)',
                  value: _.get(deviceitem,'GPS速度(km/h)'),
                },
                {
                  name:'方向',
                  value: _.get(deviceitem,'方向'),
                },
            ],
            "车辆状态" : [
                {
                  name:'动力系统就绪',
                  value:  _.get(deviceitem,'动力系统就绪'),
                },
                {
                  name:'紧急下电请求',
                  value:  _.get(deviceitem,'紧急下电请求'),
                },
                {
                  name:'电池均衡激活',
                  value:  _.get(deviceitem,'电池均衡激活'),
                }
          ],

          "电池类信息" : [

              {
                  name:'总电压(V)',
                  value: _.get(deviceitem,'总电压(V)'),
              },
              {
                  name:'SOC(%)',
                  value: _.get(deviceitem,'SOC(%)'),
              },
              {
                  name:'总电流(A)',
                  value: _.get(deviceitem,'总电流(A)'),
              },
              {
                  name:'电池绝缘电阻(KΩ)',
                  value:_.get(deviceitem,'电池绝缘电阻(KΩ)'),
              },
              {
                  name:'最高电压动力蓄电池包序号',
                  value: _.get(deviceitem,'最高电压动力蓄电池包序号'),
              },
              {
                  name:'最高电压单体蓄电池序号',
                  value: _.get(deviceitem,'最高电压单体蓄电池序号'),
              },
              {
                  name:'电池单体最高电压值(V)',
                  value: _.get(deviceitem,'电池单体最高电压值(V)'),
              },
              {
                  name:'最低电压动力蓄电池包序号',
                  value: _.get(deviceitem,'最低电压动力蓄电池包序号'),
              },
              {
                  name:'最低电压单体蓄电池序号',
                  value: _.get(deviceitem,'最低电压单体蓄电池序号'),
              },


              {
                  name:'电池单体最低电压值(V)',
                  value: _.get(deviceitem,'电池单体最低电压值(V)'),
              },
              {
                  name:'最高温度动力蓄电池包序号',
                  value:_.get(deviceitem,'最高温度动力蓄电池包序号'),
              },
              {
                  name:'最高温度探针序号',
                  value:_.get(deviceitem,'最高温度探针序号'),
              },
              {
                  name:'最高温度值(℃)',
                  value: _.get(deviceitem,'最高温度值(℃)'),
              },
              {
                  name:'最低温度动力蓄电池包序号',
                  value: _.get(deviceitem,'最低温度动力蓄电池包序号'),
              },
              {
                  name:'最低温度探针序号',
                  value: _.get(deviceitem,'最低温度探针序号'),
              },


              {
                  name:'最低温度值(℃)',
                  value:_.get(deviceitem,'最低温度值(℃)'),
              },
              {
                  name:'剩余能量(KW*h)',
                  value: _.get(deviceitem,'剩余能量(KW*h)'),
              },
              {
                  name:'最高电压电池总数',
                  value:_.get(deviceitem,'最高电压电池总数'),
              },
              {
                  name:'最低电压电池总数',
                  value: _.get(deviceitem,'最低电压电池总数'),
              },
              {
                  name:'最高温度探针总数',
                  value:_.get(deviceitem,'最高温度探针总数'),
              },
              {
                  name:'最低温度探针总数',
                  value: _.get(deviceitem,'最低温度探针总数'),
              },
              {
                  name:'单体蓄电池总数',
                  value: _.get(deviceitem,'最低电压单体蓄电池序号'),
              },
              {
                  name:'动力蓄电池包总数(单体)',
                  value: _.get(deviceitem,'动力蓄电池包总数(单体)'),
              },
              {
                  name:'温度探针总数',
                  value: _.get(deviceitem,'温度探针总数'),
              },
              {
                  name:'动力蓄电池包总数(动力)',
                  value: _.get(deviceitem,'动力蓄电池包总数(动力)'),
              },
            ]
        };
        return (
            <div className="mydevicePage AppPage"
                style={{
                    backgroundSize: "100% 100%",
                    height : `${window.innerHeight}px`
                }}>
                <div className="navhead">
                    <a onClick={()=>{this.props.history.goBack()}} className="back"></a>
                    <span className="title" style={{paddingRight : "30px"}}>车辆详情</span>
                    <a className="moresetting"></a>
                </div>
                <div className="deviceinfocontent">
                    {
                      _.map(datadevice,(item,index)=>{

                        return (
                            <div key={index}>
                                <div className="tit">{index}</div>
                                {
                                    _.map(item,(i,k)=>{
                                        return (<div key={k} className="li"><span>{`${i.name}`}</span><span>{`${i.value}`}</span></div>);
                                    })
                                }
                            </div>
                        );
                      })
                    }


                </div>
                <div className="mydevicebtn">
                        {!isincollections &&
                        <Button type="primary" icon="star" onClick={()=>{
                            this.props.dispatch(ui_index_addcollection(deviceid));
                          }
                        }>收藏车辆</Button>}
                        {isincollections &&
                        <Button type="primary" icon="star" onClick={()=>{
                            this.props.dispatch(ui_index_unaddcollection(deviceid));
                          }
                        }>取消收藏</Button>}
                        <Button icon="play-circle-o" style={{background : "#5cbeaa", color: "#FFF"}}
                           onClick={
                             ()=>{
                               console.log("轨迹回放");
                               this.props.dispatch(ui_sel_tabindex(4));
                               this.props.history.replace(`/playback/${deviceid}`);
                             }
                         }>轨迹回放</Button>
                    </div>
            </div>
        );
    }
}

const mapStateToProps = ({device}) => {
    const {carcollections,g_devicesdb} = device;
    return {carcollections,g_devicesdb};
}

export default connect(mapStateToProps)(Page);
