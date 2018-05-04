
/**
 * Created by jiaowenhui on 2017/7/28.
    车辆详情
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';
import get from 'lodash.get';
import translate from 'redux-polyglot/translate';
import { bridge_deviceinfo } from '../../sagas/datapiple/bridgedb';
import { deviceinfoquerychart_request } from '../../actions';
import { Chart2, Chart3 } from "./swiperchart";
import moment from 'moment';
import { Tabs,Spin } from 'antd';
import './deviceinfo.css';

const TabPane = Tabs.TabPane;

class Page extends React.Component {

    componentWillMount() {
        this.props.dispatch(deviceinfoquerychart_request({
          query:
            {
              DeviceId:this.props.match.params.deviceid
            }
          }));
    }

    render(){
        const {g_devicesdb,mapdetailfields,mapdict,alarmchart} = this.props;
        let deviceid = this.props.match.params.deviceid;
        const alarmchartdata = alarmchart[deviceid];
        // const data_soc = get(alarmchartdata,'soc','');
        const props_tickv = get(alarmchartdata,'tickv',[]);
        const props_ticka = get(alarmchartdata,'ticka',[]);
        const props_ticks = get(alarmchartdata,'ticks',[]);
        const props_ticktime = get(alarmchartdata,'ticktime',[]);

        let data_tickv = [];
        let data_ticka = [];
        let data_ticks = [];
        let data_temperature = 0;
        map(props_ticktime,(v, i)=>{
            const moments = moment(v).format('HH:mm')//parseInt(moment(v).format('HH'),10);
            let vv = 0;
            if(!!props_tickv[i]){
              vv = parseFloat(props_tickv[i].toFixed(2));
            }

            let va = 0;
            if(!!props_ticka[i]){
              va = parseFloat(props_ticka[i].toFixed(2));
            }

            let vs = 0;
            if(!!props_ticks[i]){
               vs = parseFloat(props_ticks[i].toFixed(2));
            }

            let item = { time: moments, value: vv };
            let item2 = { time: moments, value: va };
            let item3 = { time: moments, value: vs };
            data_tickv.push(item);
            data_ticka.push(item2);
            data_ticks.push(item3);
        })
        // console.log(data_tickv);
        // console.log(data_ticka);
        data_temperature = get(alarmchartdata,'temperature',0);


        if(!!alarmchartdata){
            console.log(`图表数据:${JSON.stringify(alarmchartdata)}`);
        }
        let deviceitem = bridge_deviceinfo(g_devicesdb[deviceid]);
        let datadevice = [];
        map(mapdetailfields,(v)=>{
            let record = {};
            let kv = [];
            map(v.fieldslist,(fieldname)=>{
                if(!!mapdict[fieldname]){
                    kv.push({
                        name:mapdict[fieldname].showname,
                        value:get(deviceitem,mapdict[fieldname].name,''),
                        unit:get(mapdict[fieldname],'unit','')
                    });
                }
            });
            record = {
                groupname:v.groupname,
                kv:kv
            };

            datadevice.push(record);
        });
        const isloading = props_ticktime.length === 0 && this.props.isloading;
        let chartC;
        if(isloading){
          chartC = (<div className="deviceinfospin"><Spin size="large" tip="正在加载图表,请稍后..."/></div>);
        }
        else {
          chartC = (
            <div className="listsdevicechartlists">
                <div className="lli Chart1li"><div className="tt">SOC实时图</div><Chart2 data={data_ticks}  unit={'%'}/></div>
                <div className="lli Chart2li"><div className="tt">电压趋势图</div><Chart2 data={data_tickv} unit={'V'}/></div>
                <div className="lli Chart3li"><div className="tt">温度仪</div><Chart3 data={data_temperature} /></div>
                <div className="lli Chart4li"><div className="tt">电流趋势图</div><Chart2 data={data_ticka} unit={'A'}/></div>
            </div>
          );
        }
        return (

            <div className="warningPage devicePage deviceinfoPage">
                <div className="appbar">
                    <div className="title">车辆详情</div>
                    <div className="devicebtnlist">
                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>
                    </div>
                </div>

                <div className="deviceinfodetail">
                  <Tabs type="card">
                    <TabPane tab="基本信息" key="1">
                      <div  className="listsdeviceinfolist">
                          {
                            map(datadevice,(item,index)=>{
                              return (
                                  <div key={index} className="li">
                                  <div>
                                      <div className="tit">{item.groupname}</div>
                                      {
                                          map(item.kv,(i,k)=>{
                                              let value = i.value;
                                              if(i.unit !== ''){
                                                value = `${value}${i.unit}`;
                                              }
                                              return (<div key={k} >
                                                <span>{`${i.name}`}</span>
                                                <span>{`${value}`}</span></div>);
                                          })
                                      }
                                      </div>
                                  </div>
                              );
                            })
                          }
                      </div>
                    </TabPane>
                    <TabPane tab="图表信息" key="2">
                      {chartC}
                    </TabPane>
                  </Tabs>
                  </div>
            </div>
        );
    }
}


const mapStateToProps = ({device,app,deviceinfoquerychart}) => {
    const {  g_devicesdb } = device;
    const { mapdetailfields, mapdict } = app;
    const {alarmchart,isloading} = deviceinfoquerychart;

    return { g_devicesdb, mapdetailfields, mapdict,alarmchart,isloading };
}
const DeviceComponentWithPProps = translate('showdevice')(Page);
export default connect(mapStateToProps)(DeviceComponentWithPProps);
