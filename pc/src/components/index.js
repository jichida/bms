/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import _  from "lodash";
import AdminContent from "./admincontent";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }
    componentWillMount() {
    }
    componentWillUnmount() {
    }
    handleToggle = () => this.setState({open: !this.state.open})
    onTouchTap=()=>{
        console.log("onTouchTap");
    }
    render() {
        const menuiconstyle={
            color : "#FFF",
            fontSize : "22px"
        }
        //左侧菜单文字和icon
        const leftmenuobj={
            "home" : {url : "/", icon: "fa fa-home", text : "home" },
            "控制中心" : {url : "/", icon: "fa fa-tachometer", text : "控制中心" }
        }
        return (
            <div className="AppPage">
                <div className={this.state.open?"leftmenu open":"leftmenu"}>
                    <div className="logo">
                        <span className="logo1">logo</span>
                        <span className="logo2"></span>
                    </div>
                    <ul>
                        {_.map(leftmenuobj, (obj,index)=>{
                            return (
                                <li><a title={index} key={index}><i className={obj.icon} aria-hidden="true"></i><span>{obj.text}</span></a></li>
                            );
                        })}
                    </ul>
                </div>
                <div className="content">
                    <AppBar
                        title={<span className="title">Title</span>}
                        onLeftIconButtonTouchTap={this.handleToggle}
                        style={{backgroundColor: "#FFF"}}
                        iconElementLeft={<IconButton><NavigationMenu color="#333" /></IconButton>}
                        className="appbar"
                    />

                    <AdminContent />
                </div>

            </div>
        );
    }
}

export default connect()(Page);
