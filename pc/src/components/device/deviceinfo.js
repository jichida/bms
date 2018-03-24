
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
import { Chart1, Chart2, Chart3, Chart4 } from "./swiperchart";

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
        const data_soc = get(alarmchartdata,'soc','');
        const props_tickv = get(alarmchartdata,'tickv',[]);
        const props_ticka = get(alarmchartdata,'ticka',[]);
        const props_ticktime = get(alarmchartdata,'ticktime',[]);

        let data_tickv = [];
        let data_ticka = [];
        let data_temperature = 0;
        map(props_ticktime,(v, i)=>{
            let item = { time: v, value: props_tickv[i] };
            let item2 = { time: v, value: props_ticka[i] };
            data_tickv.push(item);
            data_ticka.push(item2);
        })
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
            // console.log(datadevice);
        return (

            <div className="warningPage devicePage deviceinfoPage">
                <div className="appbar">

                    <div className="title">车辆详情</div>
                    <div className="devicebtnlist">
                      {/*   <Button type="primary" icon="play-circle-o" onClick={
                          ()=>
                          {
                            this.props.dispatch(ui_clickplayback(this.props.match.params.deviceid));
                          }

                        }>车辆轨迹监控</Button>
                        <Button type="primary" icon="area-chart" onClick={
                          ()=>
                          {
                            // this.props.dispatch(ui_clickplayback(mapseldeviceid));
                            const id = this.props.match.params.deviceid;
                            this.props.history.push(`/devicedata/${id}`);// ./devicedata.js
                          }

                        }>车辆历史数据</Button>
                        <Button type="primary" icon="clock-circle-o" onClick={()=>{
                          const id = this.props.match.params.deviceid;
                          this.props.dispatch(ui_btnclick_devicemessage({DeviceId:id}));
                          //this.props.history.push(`/devicemessage/${mapseldeviceid}`)
                        }}>历史警告</Button> */}
                      <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>
                    </div>
                </div>

                <div className="deviceinfoPage">
                <div className="lists deviceinfolist"
                    style={{
                        flexGrow: 0,
                    }}
                    >
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
                                        return (<div key={k} ><span>{`${i.name}`}</span><span>{`${value}`}</span></div>);
                                    })
                                }
                                </div>
                            </div>
                        );
                      })
                    }
                    {
                        // map(datadevice,(item,i)=>{
                        //     return (
                        //         <div className="li" key={i}>
                        //             <div>
                        //             <div className="name">{item.name}</div><div className="text">{item.value}</div>
                        //             </div>
                        //         </div>
                        //     )
                        // })
                    }
                </div>
                <div className="lists devicechartlists">
                    <div className="lli Chart1li"><div className="tt">SOC实时图</div><Chart1 data={data_soc} /></div>
                    <div className="lli Chart2li"><div className="tt">电压趋势图</div><Chart2 data={data_tickv} /></div>
                    <div className="lli Chart3li"><div className="tt">温度仪</div><Chart3 data={data_temperature} /></div>
                    <div className="lli Chart4li"><div className="tt">电流趋势图</div><Chart4 data={data_ticka}/></div>
                </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = ({device,app,deviceinfoquerychart}) => {
    const {  g_devicesdb } = device;
    const { mapdetailfields, mapdict } = app;
    const {alarmchart} = deviceinfoquerychart;

    return { g_devicesdb, mapdetailfields, mapdict,alarmchart };
}
const DeviceComponentWithPProps = translate('showdevice')(Page);
export default connect(mapStateToProps)(DeviceComponentWithPProps);
