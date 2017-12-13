import React from 'react';
import { connect } from 'react-redux';

class Prompt extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            curmessage : {}
        };
    }

    render(){
        return (
            <div className={this.props.promptdata.length>0 ? "prompt show": "prompt hide"}>
                <div className="head">
                    <span>严重警告</span>
                    <a>设置</a>
                </div>
                <div className="body">
                    <p><span>车辆ID:</span><span>1602010003</span></p>
                    <p><span>告警时间:</span><span>2017-10-28 13:31:09</span></p>
                    <p><span>报警信息:</span><span>绝缘故障</span></p>
                    <p><span>位置信息:</span><span>上海市普陀区桃浦镇上海应用技术学院普陀教学部上海信息技术学校</span></p>
                </div>
                <div className="btn">
                    <a href="#">快速定位</a>
                    <a href="#">查看详情</a>
                    <a href="#">(2/10)下一条</a>
                </div>
            </div>
        )
    }
}

const data = ({app:{promptdata}}) => {
    return { promptdata };
}
export default connect(data)(Prompt);