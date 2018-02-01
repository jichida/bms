/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import {bridge_deviceinfo} from '../../sagas/datapiple/bridgedb';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from "bizcharts";
import DataSet from '@antv/data-set';
import { Swiper, Slide } from 'react-dynamic-swiper';
import 'react-dynamic-swiper/lib/styles.css';
import Wendu from '../../img/28.png';
import Config from '../../env/config';

const { Arc, Html, Line } = Guide;

let swiperOptions = {
    navigation: true,
    pagination: false,
    scrollBar: false
};


export class Chart1 extends React.Component {
    componentWillMount () {
        
    }
    render() {

        const { Html, Arc } = Guide;
        const data = [{ value: 5.6 }];
        const cols = {
            'value': {
                min: 0,
                max: 9,
                tickInterval: 1,
                nice: false
            }
        }
        Shape.registerShape('point', 'pointer', {
            drawShape(cfg, group) {
                let point = cfg.points[0]; // 获取第一个标记点
                point = this.parsePoint(point);
                const center = this.parsePoint({ // 获取极坐标系下画布中心点
                    x: 0,
                    y: 0
                });
                // 绘制指针
                group.addShape('line', {
                    attrs:  {
                        x1: center.x,
                        y1: center.y,
                        x2: point.x,
                        y2: point.y - 20,
                        stroke: cfg.color,
                        lineWidth: 5,
                        lineCap: 'round'
                    }
                });
                return group.addShape('circle', {
                    attrs: {
                        x: center.x,
                        y: center.y,
                        r: 12,
                        stroke: cfg.color,
                        lineWidth: 4.5,
                        fill: '#fff'
                    }
                });
            }
        });


        return (
            <Chart height={300} width={200} data={data} scale={cols} padding={[ -20, 0, 0, 0 ]} forceFit>
                <Coord type='polar' startAngle={-9 / 8 * Math.PI} endAngle={1 / 8 * Math.PI} radius={0.75} />
                <Axis 
                    name='value'
                    zIndex={2}
                    line={null}
                    label={{
                        offset: -16,
                        textStyle: {
                            fontSize: 18,
                            fill: 'rgba(0, 0, 0, 0.25)',
                            textAlign: 'center',
                            textBaseline: 'middle'
                        }
                    }}
                    subTickCount={4}
                    subTickLine={{
                        length: -8,
                        stroke: '#fff',
                        strokeOpacity: 1
                    }}
                    tickLine={{
                        length: -18,
                        stroke: '#fff',
                        strokeOpacity: 1
                    }}
                />
                <Axis name="1" visible ={false} />
                <Guide>
                    <Arc 
                        zIndex={0} 
                        start={[ 0, 0.965 ]} 
                        end={[ 9, 0.965 ]}
                        style={{ // 底灰色
                            stroke: '#000',
                            lineWidth: 18,
                            opacity: 0.09
                        }}
                        />
                    <Arc 
                        zIndex={1} 
                        start={[ 0, 0.965 ]} 
                        end={[ data[0].value, 0.965 ]}
                        style={{ // 底灰色
                            stroke: '#1890FF',
                            lineWidth: 18,
                        }}
                        />
                    <Html 
                        position={[ '50%', '95%' ]}
                        html={
                            () => {
                                return ('<div style="width: 300px;text-align: center;font-size: 12px!important;"><p style="font-size: 1.75em; color: rgba(0,0,0,0.43);margin: 0;">合格率</p><p style="font-size: 3em;color: rgba(0,0,0,0.85);margin: 0;">'+ data[0].value * 10+'%</p></div>')
                            }
                        } 
                        />
                </Guide>
                <Geom 
                    type="point" 
                    position="value*1" 
                    shape='pointer' 
                    color='#1890FF'
                    active={false}
                    style={{stroke: '#fff',lineWidth: 1}}
                />
            </Chart>
        )
    }
}

export class Chart2 extends React.Component {
    render() {
        const data = [
            { year: "1991", value: 3 },
            { year: "1992", value: 4 },
            { year: "1993", value: 3.5 },
            { year: "1994", value: 5 },
            { year: "1995", value: 4.9 },
            { year: "1996", value: 6 },
            { year: "1997", value: 7 },
            { year: "1998", value: 9 },
            { year: "1999", value: 13 }
        ];
        const cols = {
            'value': { min: 0 },
            'year': {range: [ 0 , 1] }
        };
        return (
            <Chart height={260} data={data} scale={cols} padding={[20, 40, 40, 40]} forceFit>
                <Axis name="year" line={{stroke: '#EEEEEE'}} />
                <Axis name="value" line={{stroke: '#EEEEEE'}} />
                <Tooltip crosshairs={{type : "y"}}/>
                <Geom type="line" position="year*value" size={2} />
                <Geom type='point' position="year*value" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1}} />
            </Chart>
        )
    }
}

export class Chart3 extends React.Component {
    render() {
        const data = 40;
        return (
            <div className="wenduchart">
                <img src={Wendu} />
                <div className="dataline"><span style={{height: `${data}px`}}></span></div>
            </div>
        )
    }
}

export class Chart4 extends React.Component {

    render() {
        const data = [
            { year: '1991', value: 15468 },
            { year: '1992', value: 16100 },
            { year: '1993', value: 15900 },
            { year: '1994', value: 17409 },
            { year: '1995', value: 17000 },
            { year: '1996', value: 31056 },
            { year: '1997', value: 31982 },
            { year: '1998', value: 32040 },
            { year: '1999', value: 33233 }
        ];
        const cols={
            value: {
                min: 10000
            },
            year: {
                range: [ 0 , 1 ]
            }
        };
        return (
            <Chart height={260} data={data} scale={cols} padding={[20, 40, 40, 60]} forceFit>
                <Axis name="year" />
                <Axis name="value" label={{
                    formatter: val => {
                    return (val / 10000).toFixed(1) + 'k';
                    }
                }} />
                <Tooltip crosshairs={{type:'line'}}/>
                <Geom type="area" position="year*value" />
                <Geom type="line" position="year*value" size={2} />
            </Chart>
        )
    }
}

