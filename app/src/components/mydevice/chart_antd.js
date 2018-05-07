import React from 'react';
import { Chart, Geom, Axis, Tooltip, } from "bizcharts";
import Wendu from '../../img/28.png';

export class Chart2 extends React.Component {
    render() {
        const {data,unit} = this.props;
        const scale = {
          'sales': {
            type: 'time', // 指定数据类型
            //alias: string, // 数据字段的别名
            formatter: () => {}, // 格式化文本内容
            range: [0,1], // 输出数据的范围，默认[0, 1]，格式为 [min, max]，min 和 max 均为 0 至 1 范围的数据。
            tickCount: data.length, // 设置坐标轴上刻度点的个数
            //ticks: array, // 用于指定坐标轴上刻度点的文本信息，当用户设置了 ticks 就会按照 ticks 的个数和文本来显示
            //sync: boolean // 当 chart 存在不同数据源的 view 时，用于统一相同数据属性的值域范围
          }
        };
        let sizemod = data.length/8;
        sizemod = parseInt(sizemod,10);
        if(sizemod === 0){
          sizemod = 1;
        }
        return (
          <Chart height={260} data={data} scale={scale} padding={[20, 40, 40, 60]} forceFit>
              <Axis name="time" label={{
                  formatter: (text, item, index) => {
                    if(index%sizemod===0){
                      return `${text}`;
                    }
                  }
              }} />
              <Axis name="value" line={{stroke: '#EEEEEE'}}  label={{
                  formatter: val => {
                    return `${val}${unit}`;
                  }
              }} />
              <Tooltip crosshairs={{type : "y"}}/>
              <Geom type="line" position="time*value" size={2} />
              <Geom type='point' position="time*value" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1}} />
          </Chart>
        )
    }
}

export class Chart3 extends React.Component {
    render() {
        const data = this.props.data;
        let showdata = data;
        if(parseInt(data,10)>80){showdata = 80}
        if(parseInt(data,10)<0){showdata = 0}
        return (
            <div className="wenduchart">
                <img src={Wendu} alt=""/>
                <div className="dataline"><span style={{height: `${showdata}px`}}></span></div>
                <div className="data"><span>{data}℃</span></div>
            </div>
        )
    }
}
//
// export class Chart4 extends React.Component {
//
//     render() {
//         const data = this.props.data;
//         const cols={
//             'value': {
//                 tickCount: 10,
//             },
//             'time': { range: [ 0 , 1 ] }
//         };
//         return (
//             <Chart height={300} data={data} scale={cols} padding={[20, 40, 40, 60]} forceFit>
//                 <Axis name="time" label={{
//                     formatter: val => {
//                     return val.substr(5, val.length);
//                     }
//                 }} />
//                 <Axis name="value" />
//                 <Tooltip crosshairs={{type:'line'}}/>
//                 <Geom type="area" position="time*value" />
//                 <Geom type="line" position="time*value" size={2} />
//             </Chart>
//         )
//     }
// }
