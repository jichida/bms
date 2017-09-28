/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './index.css';
import {List, ListItem} from 'material-ui/List';
import Rightlnk from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import Divider from 'material-ui/Divider';

class Page extends React.Component {
    
    render() {
        const {showmenu,showhistoryplay,showdistcluster,showhugepoints,p} = this.props;
        const pushurl = (name)=>{
            this.props.history.push(name);
        }
        return (
            <div className="settingPage AppPage" style={{height : `${window.innerHeight}px`,overflow: "hidden",paddingBottom:"0"}}>
                <div className="navhead">
                    <a className="back" onClick={()=>{this.props.history.goBack()}}></a>
                    <span className="title" style={{paddingRight : "30px"}}>设置</span>
                </div>
                <br/>
                <List style={{background: "#FFF",padding: "0"}}>
                    <Divider />
                    <ListItem primaryText="帐号绑定设置" rightIcon={<Rightlnk />} onClick={()=>{this.props.history.push("/settinguser")}} />
                    <Divider style={{marginLeft:"15px"}}/>
                    <ListItem primaryText="消息隐私设置" rightIcon={<Rightlnk />} onClick={()=>{this.props.history.push("/settingmessage")}} />
                    <Divider />
                </List>
            </div>
        );
    }
}
export default connect()(Page);
