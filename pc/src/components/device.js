/**
 * Created by jiaowenhui on 2017/7/28.
    设备详情
 */
import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

class Page extends React.Component {



    render(){  

        const data = {
            "设备名称" : "123XG设备",
            "最高单体温度" : "80",
            "最低单体温度" : "0",
            "最高单体电压" : "100V",
            "最低单体电压" : "30V",
            "真实SOC" : "SOC",
            "箱体电流" : "20A",
        }

        return (
            <div className="warningPage devicePage">
                <div className="tit">设备详情</div>
                <div className="lists">
                    {_.map(data, (d, key)=>{
                        return (
                            <div className="li">
                                <div className="name">{key}</div><div className="text">{d}</div>
                            </div>
                        )
                    })}
                    
                </div>
            </div>
        );
    }
}

export default connect()(Page);
