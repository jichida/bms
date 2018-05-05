import React from 'react';
import {LineChart, Line, XAxis, YAxis} from 'recharts';


const Rechart = (props)=>{
  const {chartdata} = props;
  return (
    <LineChart width={window.innerWidth} height={300} data={chartdata}
        margin={{top: 20, right: 20, left: 20, bottom: 20}}>
     <XAxis dataKey="time"/>
     <YAxis/>
     <Line type="monotone" dataKey="value"  stroke="#82ca9d" isAnimationActive={false}/>
    </LineChart>
  );
}

export default Rechart;
