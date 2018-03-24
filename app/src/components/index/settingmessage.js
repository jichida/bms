/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './index.css';
// import {List, ListItem} from 'material-ui/List';
// import Rightlnk from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
// import Divider from 'material-ui/Divider';
// import Avatar from '../../img/19.png';
import Toggle from 'material-ui/Toggle';

class Page extends React.Component {

    render() {
        // const {showmenu,showhistoryplay,showdistcluster,showhugepoints,p} = this.props;
        // const pushurl = (name)=>{
        //     this.props.history.push(name);
        // }
        return (
            <div className="settingPage AppPage" style={{height : `${window.innerHeight}px`,overflow: "hidden",paddingBottom:"0"}}>
                <div className="navhead">
                    <div className="back" onClick={()=>{this.props.history.goBack()}}></div>
                    <span className="title" style={{paddingRight : "30px"}}>消息隐私设置</span>
                </div>
                <br/>
                <div className="settingmessage">
                    <div className="title">消息设置</div>
                    <div className="li">
                        <Toggle label="报警信息推送提醒" style={{padding: "15px", background: "#FFF",borderBottom: "1px solid #EEE"}}/>
                        <Toggle label="工单处理推送提醒" style={{padding: "15px", background: "#FFF"}}/>
                    </div>
                    <div className="title">隐私设置</div>
                    <div className="li selli">
                        <span>谁可以看到我的个人信息</span>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect()(Page);
