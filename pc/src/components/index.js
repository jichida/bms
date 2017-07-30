/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import _  from "lodash";
import AdminContent from "./admincontent";
import Menu from "./menu";
import Tree from "./tree";
import Search from "./search";
import Warning from "./warning";
import Message from "./message";
import Device from "./device";
import {
  ui_showmenu,
  ui_showhistoryplay,
} from '../actions';

import Historytrackplayback from "./historytrackplayback/index.js";


class Page extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
    }
    componentWillUnmount() {
    }
    //主菜单点击事件
    menuevent = () => this.props.dispatch(ui_showmenu(""));

    //显示电池包搜索
    showPowersearch =()=> this.props.dispatch(ui_showmenu("powersearch"));
    showWarningbox =()=> this.props.dispatch(ui_showmenu("warningbox"));
    showAddressbox =()=> this.props.dispatch(ui_showmenu("addressbox"));
    showMessage =()=> this.props.dispatch(ui_showmenu("showmessage"));
    showDeviceInfo =()=> this.props.dispatch(ui_showmenu("showdevice"));


    //现实历史轨迹点击时间
    showhistoryplay = () => this.props.dispatch(ui_showhistoryplay(true));
    hidehistoryplay = () => this.props.dispatch(ui_showhistoryplay(false));

    onTouchTap=()=>{
        console.log("onTouchTap");
    }
    render() {
        const {showmenu,showhistoryplay} = this.props;
        return (
            <div className="AppPage">
                <Drawer
                    open={showmenu==="powersearch"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    >
                    <Search />
                    <Tree />
                </Drawer>


                <Drawer
                    open={showmenu==="warningbox"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    width={Math.floor(window.innerWidth/2)}
                    >
                    <Warning />
                    <Tree />
                </Drawer>

                <Drawer
                    open={showmenu==="addressbox"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    >
                    <Tree />
                </Drawer>

                <Drawer
                    open={showmenu==="showmessage"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    >
                    <Message />
                    <Tree />
                </Drawer>

                <Drawer
                    open={showmenu==="showdevice"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    >
                    <Device />
                </Drawer>


                <div className="content">
                    <div className="headcontent">
                        <AppBar
                            title={<span className="title">Title</span>}
                            onLeftIconButtonTouchTap={this.menuevent}
                            style={{
                                backgroundColor: "#FFF",
                                paddingLeft:"0",
                                paddingRight:"0",
                            }}
                            iconStyleLeft={{
                                marginTop: "0",
                                marginLeft: "0"
                            }}
                            iconElementLeft={<div className="logo">logo</div>}
                            className="appbar"
                            iconElementRight={<RaisedButton label="最新消息" onTouchTap={this.showMessage} style={{marginRight:"30px"}} />}
                            iconStyleRight={{marginTop:"12px"}}
                        />
                    </div>
                    <AdminContent />
                    <Menu />
                    <Drawer width={window.innerWidth} openSecondary={true} open={showhistoryplay} >
                        <Historytrackplayback back={this.hidehistoryplay}/>
                    </Drawer>

                </div>

            </div>
        );
    }
}

const mapStateToProps = ({app:{showmenu,showhistoryplay}}) => {
  return {showmenu,showhistoryplay};
};
export default connect(mapStateToProps)(Page);
