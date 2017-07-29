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
import Historytrackplayback from "./historytrackplayback/index.js";


class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showmenu: false,
            showhistoryplay : false
        };
    }
    componentWillMount() {
    }
    componentWillUnmount() {
    }
    //主菜单点击事件
    menuevent = () => this.setState({showmenu: !this.state.showmenu});
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
                    open={this.state.showmenu}
                    containerStyle={{
                        top: "64px",
                        zIndex: 100,
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
                    <Menu showtree={this.menuevent} />
                    <Drawer width={window.innerWidth} openSecondary={true} open={this.state.showhistoryplay} >
                        <Historytrackplayback back={this.hidehistoryplay}/>
                    </Drawer>

                </div>

            </div>
        );
    }
}

export default connect()(Page);
