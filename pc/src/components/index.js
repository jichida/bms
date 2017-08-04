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
import Toggle from 'material-ui/Toggle';
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
  ui_showdistcluster,
  ui_showhugepoints
} from '../actions';
import translate from 'redux-polyglot/translate';
import Historytrackplayback from "./historytrackplayback/index.js";
let resizetime = null;

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            innerWidth : window.innerWidth,
        };
    }
    componentWillMount() {
        window.onresize = ()=>{
            window.clearTimeout(resizetime);
            resizetime = window.setTimeout(()=>{
                this.setState({innerWidth: window.innerWidth});
            }, 10)
        }
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
        const {showmenu,showhistoryplay,showdistcluster,showhugepoints,p} = this.props;
        return (
            <div className="AppPage">
                <Drawer
                    open={showmenu==="powersearch"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    width={Math.floor(this.state.innerWidth/2)}
                    >
                    <Search />
                    <span className="myclose" onClick={this.menuevent}></span>
                </Drawer>


                <Drawer
                    open={showmenu==="warningbox"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    width={Math.floor(this.state.innerWidth/2)}
                    >
                    <Warning />
                    <span className="myclose" onClick={this.menuevent}></span>
                </Drawer>

                <Drawer
                    open={showmenu==="addressbox"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    >
                    <Tree />
                    <span className="myclose white" onClick={this.menuevent}></span>
                </Drawer>

                <Drawer
                    open={showmenu==="showmessage"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    >
                    <Message />
                    <span className="myclose" onClick={this.menuevent}></span>
                </Drawer>

                <Drawer
                    open={showmenu==="showdevice"}
                    containerStyle={{
                        top: "64px",
                        zIndex: 1000,
                    }}
                    >
                    <Device />
                    <span className="myclose" onClick={this.menuevent}></span>
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
                            iconElementRight={<RaisedButton label={p.tc('title')} onTouchTap={this.showMessage} style={{marginRight:"30px"}} />}
                            iconStyleRight={{marginTop:"12px"}}
                        />
                    </div>
                    <AdminContent />
                    <Menu />
                    <Drawer width={this.state.innerWidth} openSecondary={true} open={showhistoryplay} >
                        <Historytrackplayback back={this.hidehistoryplay}/>
                    </Drawer>
                    <div className="toggledistcluster">
                        <Toggle
                            label="显示区域"
                            defaultToggled={showdistcluster}
                            onToggle={
                                (e,isshow)=>{
                                    this.props.dispatch(ui_showdistcluster(isshow));
                                }
                            }
                        />
                    </div>
                    <div className="togglehugepoints">
                        <Toggle
                            label="显示海量点"
                            defaultToggled={showhugepoints}
                            onToggle={
                                (e,isshow)=>{
                                    this.props.dispatch(ui_showhugepoints(isshow));
                                }
                            }
                        />
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = ({app:{showmenu,showhistoryplay,showdistcluster,showhugepoints}}) => {
  return {showmenu,showhistoryplay,showdistcluster,showhugepoints};
};

const DummyComponentWithPProps = translate('warningbox')(Page);
export default connect(mapStateToProps)(DummyComponentWithPProps);
