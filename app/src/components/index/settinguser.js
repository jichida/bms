/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './index.css';
// import {List, ListItem} from 'material-ui/List';
// import Rightlnk from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
// import Divider from 'material-ui/Divider';
import Avatar from '../../img/19.png';

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
                    <span className="title" style={{paddingRight : "30px"}}>帐号绑定设置</span>
                </div>
                <br/>
                <div className="settinguserinfo">
                    <img src={Avatar} alt=""/>
                    <div className="username">
                        <span>用户名</span>
                        <span>ID</span>
                    </div>
                </div>
            </div>
        );
    }
}
export default connect()(Page);
