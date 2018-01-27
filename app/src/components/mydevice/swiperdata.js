/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import {bridge_deviceinfo} from '../../sagas/datapiple/bridgedb';
import { Chart, Geom, Axis, Tooltip, Legend, Coord } from 'bizcharts';
import DataSet from '@antv/data-set';
import { Swiper, Slide } from 'react-dynamic-swiper';
import 'react-dynamic-swiper/lib/styles.css';;

let swiperOptions = {
    navigation: true,
    pagination: false,
    scrollBar: false
};

class Page extends React.Component {
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
            <Swiper
                swiperOptions={{
                    slidesPerView: 'auto',
                    initialSlide : 0,
                }}
                {...swiperOptions}
                style={{background:"#FFF"}}
                >
                <Slide className="Demo-swiper__slide">
                    <div 
                        className="bizcharts" 
                        style={{
                            marginLeft : "-35px",
                            height : "260px",
                        }}
                    >
                        <Chart height={300} data={data} scale={cols} forceFit>
                            <Axis name="year" />
                            <Axis name="value" />
                            <Tooltip crosshairs={{type : "y"}}/>
                            <Geom type="line" position="year*value" size={2} />
                            <Geom type='point' position="year*value" size={4} shape={'circle'} style={{ stroke: '#fff', lineWidth: 1}} />
                        </Chart>
                        <div>电流趋势图</div>
                    </div>
                </Slide>
            </Swiper>
        )
    }
}

export default connect()(Page);
