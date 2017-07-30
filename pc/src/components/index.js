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
import Historytrackplayback from "./historytrackplayback/index.js";


class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showmenu : "",
            // powersearch: false,//电池包搜索
            // warningbox: false,//警告面板
            // addressbox: false,//地理位置
            // message: false,//新消息
            showhistoryplay : false
        };
    }
    componentWillMount() {
    }
    componentWillUnmount() {
    }
    //主菜单点击事件
    menuevent = () => this.setState({showmenu: ""});

    //显示电池包搜索
    showPowersearch =()=> this.setState({showmenu: "powersearch"});
    showWarningbox =()=> this.setState({showmenu: "warningbox"});
    showAddressbox =()=> this.setState({showmenu: "addressbox"});

    //现实历史轨迹点击时间
    showhistoryplay = () => this.setState({showhistoryplay: true});
    hidehistoryplay = () => this.setState({showhistoryplay: false});

    onTouchTap=()=>{
        console.log("onTouchTap");
    }
    render() {
        return (
            <div className="AppPage">
                <Drawer
                    open={this.state.showmenu==="powersearch"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    >
                    <Search />
                    <Tree />
                </Drawer>


                <Drawer
                    open={this.state.showmenu==="warningbox"}
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
                    open={this.state.showmenu==="addressbox"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    >
                    <Tree />
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
                            iconElementRight={<RaisedButton label="轨迹回放" onTouchTap={this.showhistoryplay} style={{marginRight:"30px"}} />}
                            iconStyleRight={{marginTop:"12px"}}
                        />
                    </div>
                    <AdminContent />
                    <Menu 
                        showtree={this.menuevent} 
                        showpowersearch={this.showPowersearch} 
                        showwarningbox={this.showWarningbox}
                        showaddressbox={this.showAddressbox}
                        />
                    <Drawer width={window.innerWidth} openSecondary={true} open={this.state.showhistoryplay} >
                        <Historytrackplayback back={this.hidehistoryplay}/>
                    </Drawer>

                </div>

            </div>
        );
    }
}

export default connect()(Page);
