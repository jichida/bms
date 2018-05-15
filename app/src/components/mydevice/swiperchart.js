/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
// import {bridge_deviceinfo} from '../../sagas/datapiple/bridgedb';
// import DataSet from '@antv/data-set';
import { Swiper, Slide } from 'react-dynamic-swiper';
import { Spin } from 'antd';
// import translate from 'redux-polyglot/translate';
import 'react-dynamic-swiper/lib/styles.css';

// import Config from '../../env/config';
import Sky from '../../img/1.jpg';
import map from 'lodash.map';
import get from 'lodash.get';
import moment from 'moment';
import { Chart2,Chart3 } from "./chart_antd";
import './swiperchart.css';
// import Chart2 from './chart_rechart';
// const { Arc, Html, Line } = Guide;

let swiperOptions = {
    navigation: true,
    pagination: false,
    scrollBar: false
};


class Page extends React.Component {
    render() {
        const {alarmchart} = this.props;
        let deviceid = this.props.deviceid;
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
          const vv = parseFloat(props_tickv[i].toFixed(2));
          const va = parseFloat(props_ticka[i].toFixed(2));
          const vs = parseFloat(props_ticks[i].toFixed(2));
          let item = { time: moments, value: vv };
          let item2 = { time: moments, value: va };
          let item3 = { time: moments, value: vs };
          data_tickv.push(item);
          data_ticka.push(item2);
          data_ticks.push(item3);
        })
        data_temperature = get(alarmchartdata,'temperature',0);
        const isloading = props_ticktime.length === 0 && this.props.isloading;
        let chartCz = [];
        if(isloading){
          chartCz.push(<div className="lli Chart3li deviceinfospin">
            <Spin size="small" tip="正在加载图表,请稍后..."/>
          </div>);
          chartCz.push(<div className="lli Chart3li deviceinfospin"><Spin size="small" tip="正在加载图表,请稍后..."/></div>);
          chartCz.push(<div className="lli Chart3li deviceinfospin"><Spin size="small" tip="正在加载图表,请稍后..."/></div>);
          chartCz.push(<div className="lli Chart3li deviceinfospin"><Spin size="small" tip="正在加载图表,请稍后..."/></div>);
        }
        else {

          // let data_ticks_labeltime = [];
          // let data_tickv_labeltime = [];
          // let data_ticks_labeltime = [];
          // let data_ticks_labeltime = [];
          const convert_addlabeltime = (data_ticks)=>{
            let dataret = [];
            for(let i = 0 ;i < data_ticks.length ; i++){
              dataret.push({
                time:data_ticks[i].time,
                timev:data_ticks[i].time,
                value:data_ticks[i].value,
              });
            }
            // let maptimevalue = {};
            // map(data_ticks,(v,k)=>{
            //   maptimevalue[v.time] = v.value;
            // });
            // if(props_ticktime.length > 0){
            //   //<----加10小时time时间---
            //   const momentmin = moment(props_ticktime[props_ticktime.length-1].ticktime).subtract(10,'hours');//.format('YYYY-MM-DD HH:mm:ss');
            //   const momentmax = moment();//.format('YYYY-MM-DD HH:mm:ss');
            //   for(let m = momentmin ;m < momentmax ;){
            //      const curv = m.format('HH:mm');
            //      let v = {};
            //      v.time = curv;
            //      if(!!maptimevalue[curv]){
            //        v.timev = curv;
            //        v.value = maptimevalue[curv];
            //      }
            //      dataret.push(v);
            //      m = m.add(1,'minutes');
            //   }
            // }
            return dataret;
          }

          const ret_data_ticks = convert_addlabeltime(data_ticks);
          const ret_data_tickv = convert_addlabeltime(data_tickv);
          const ret_data_ticka = convert_addlabeltime(data_ticka);

          chartCz.push(<div className="lli Chart1li"><div className="tt">SOC实时图</div><Chart2 chartdata={ret_data_ticks}  unit={'%'}/></div>);
          chartCz.push(<div className="lli Chart2li"><div className="tt">电压趋势图</div><Chart2 chartdata={ret_data_tickv} unit={'V'}/></div>);
          chartCz.push(<div className="lli Chart3li"><div className="tt">温度仪</div><Chart3 data={data_temperature} /></div>);
          chartCz.push(<div className="lli Chart4li"><div className="tt">电流趋势图</div><Chart2 chartdata={ret_data_ticka} unit={'A'}/></div>);
        }
        return (
            <Swiper
                swiperOptions={{
                    slidesPerView: 'auto',
                    initialSlide : 0,
                }}
                {...swiperOptions}
                style={{background: `url("${Sky}")`, backgroundSize: "150% 200%"}}
                className="lists devicechartlists"
                >
                <Slide className="Demo-swiper__slide ">
                  {chartCz[0]}
                </Slide>
                <Slide className="Demo-swiper__slide ">
                  {chartCz[1]}
                </Slide>
                <Slide className="Demo-swiper__slide ">
                  {chartCz[2]}
                </Slide>
                <Slide className="Demo-swiper__slide ">
                  {chartCz[3]}
                </Slide>
            </Swiper>
        )
    }
}
const mapStateToProps = ({deviceinfoquerychart}) => {
    const {alarmchart,isloading} = deviceinfoquerychart;
    return { alarmchart,isloading };
}
export default connect(mapStateToProps)(Page);
