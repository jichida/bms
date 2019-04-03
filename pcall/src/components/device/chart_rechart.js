import React from 'react';
import {LineChart, Line, XAxis, YAxis,Tooltip} from 'recharts';
//
// const CustomTooltip = (props)=>{
//
//   const { active } = props;
//
//   if (active) {
//     const { payload, label } = props;
//     //console.log(`payload:${JSON.stringify(payload)},label:${label}`)
//     return (
//       <div className="custom-tooltip">
//         <p className="label">{`时间:${label}`}</p>
//         <p className="label">{`值:${payload[0].value}`}</p>
//       </div>
//     );
//   }
//
//   return null;
// }

const Rechart = (props)=>{
  const {chartdata,unit} = props;
  return (
    <LineChart width={window.innerWidth} height={300} data={chartdata}
        margin={{top: 20, right: 20, left: 20, bottom: 20}}>
     <XAxis dataKey="time"/>
     <YAxis/>
     {/* <Tooltip  content={<CustomTooltip/>}/> formatter={(value, name, props) => {
       name='值';
       //console.log(`name:${name},value:${value}`)
       return `${value}`;
     }}*/}
     <Tooltip
       formatter={(value, name, props) => {
         return `${value}${unit}`;
       }}
       labelFormatter={
       (label)=>{
         //console.log(`labelFormatter--->props:${JSON.stringify(props)}`)
         return `时间 : ${label}`;
       }
     } />

     <Line type="monotone" dataKey="值"  stroke="#82ca9d" isAnimationActive={false}/>
    </LineChart>
  );
}

export default Rechart;
