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
        const datav = this.props.data || 65;
        const { Html, Arc } = Guide;
        const data = [{ value: datav }];
        const cols = {
            'value': {
                min: 0,
                max: 220,
                tickInterval: 20,
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
                        end={[ 220, 0.965 ]}
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
                                return ('<div style="width: 300px;text-align: center;font-size: 12px!important;"><p style="font-size: 3em;color: rgba(0,0,0,0.85);margin: 0;">'+ data[0].value +'V</p></div>')
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
        const data = this.props.data;
        const cols = {
            'value': { 
                min: 500,
                tickCount: 10, 
            },
            'time': { range: [ 0.1 , 0.9] }
        };
        return (
            <Chart height={260} data={data} scale={cols} padding={[20, 40, 40, 60]} forceFit>
                <Axis name="time" label={{
                    formatter: val => {
                    return val.substr(5, val.length);
                    }
                }} />
                <Axis name="value" line={{stroke: '#EEEEEE'}} />
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
        if(parseInt(data)>80){showdata = 80}
        if(parseInt(data)<0){showdata = 0}
        return (
            <div className="wenduchart">
                <img src={Wendu} />
                <div className="dataline"><span style={{height: `${showdata}px`}}></span></div>
                <div className="data"><span>{data}℃</span></div>
            </div>
        )
    }
}

export class Chart4 extends React.Component {

    render() {
        const data = this.props.data;
        const cols={
            'value': { 
                min: 500,
                tickCount: 10, 
            },
            'time': { range: [ 0 , 1 ] }
        };
        return (
            <Chart height={260} data={data} scale={cols} padding={[20, 40, 40, 60]} forceFit>
                <Axis name="time" label={{
                    formatter: val => {
                    return val.substr(5, val.length);
                    }
                }} />
                <Axis name="value" />
                <Tooltip crosshairs={{type:'line'}}/>
                <Geom type="area" position="time*value" />
                <Geom type="line" position="time*value" size={2} />
            </Chart>
        )
    }
}

