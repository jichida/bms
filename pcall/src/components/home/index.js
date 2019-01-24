/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
// import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

import AdminContent from "./admincontent";
import Menu from "./menu";
import Tree from "./tree";
import Warningtips from "./warningtips";
// import Prompt from "./prompt";

import {
    ui_showmenu,
    ui_showhistoryplay,
    ui_changemodeview
} from '../../actions';
import translate from 'redux-polyglot/translate';
import TitleBar from './titlebar';
import TitleBar4Full from './titlebar4full';
// let resizetime = null;
let resizetimecontent = null;
// this.props.dispatch(ui_showmenu(menuitemstring));

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            innerWidth : window.innerWidth,
            innerHeight : window.innerHeight,
            openaddress : false,
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize=()=> {
        window.clearTimeout(resizetimecontent);
        resizetimecontent = window.setTimeout(()=>{
            this.setState({
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight,
            });

        }, 10)
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

    }

    getdrawstyle=(width)=>{
        return ({
            drawopenstyle : {
                marginLeft: 0,
                order: -1,
                transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                zIndex: 100
            },
            drawclosestyle : {
                marginLeft: `-${width}`,
                order: -1,
                transition: 'margin 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
                zIndex: 100
            },
        })
    }

    titleNavClick =(v)=>{
        if(v===0){
          this.props.dispatch(ui_changemodeview('device'));
        }
        else{
          this.props.dispatch(ui_changemodeview('chargingpile'));
        }
    }

    render() {
        const {showmenu,modeview} = this.props;
        const treestyle = this.getdrawstyle("350px");
        const is4full = modeview !== 'device';
        return (
            <div className="AppPage" id="AppPage" style={{height : `${this.state.innerHeight}px`}}>
                <div className="content">

                    {
                      is4full?<TitleBar4Full titleNavClick={this.titleNavClick} menuevent={this.menuevent} dispatch={this.dispatch} />:
                      <TitleBar titleNavClick={this.titleNavClick} menuevent={this.menuevent} dispatch={this.dispatch} />
                    }

                    <div className="bodycontainer" style={{height: `${this.state.innerHeight-64}px`}}>

                        <Drawer
                            open={showmenu==="addressbox" || true}
                            containerStyle={{
                                top: "64px",
                                zIndex: 1000,
                                position: "inherit",
                                overflow: "visible"
                            }}
                            width={350}
                            style={showmenu==="addressbox"?treestyle.drawopenstyle:treestyle.drawclosestyle}
                            >
                            <Tree />
                            {
                                showmenu==="addressbox" &&
                                <span className="myclose left" onClick={this.menuevent}></span>
                            }
                            {
                                showmenu!=="addressbox" &&
                                <span className="myclose right" onClick={()=>{this.props.dispatch(ui_showmenu("addressbox"))}}></span>
                            }
                        </Drawer>

                        <div className="admincontainer">
                            <AdminContent />
                        </div>

                        {
                          !is4full &&   (<div className="warningtips">
                                <Warningtips/>
                            </div>)
                        }


                        <Menu lesswidth={showmenu==="addressbox"?350:100} />

                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({app:{showmenu,showhistoryplay,showdistcluster,showhugepoints,modeview}}) => {
    return {showmenu,showhistoryplay,showdistcluster,showhugepoints,modeview};
};

const DummyComponentWithPProps = translate('warningbox')(Page);
export default connect(mapStateToProps)(DummyComponentWithPProps);
