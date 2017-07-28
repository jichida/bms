/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import _  from "lodash";
import AdminContent from "./admincontent";
import Menu from "./menu";

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
        return (
            <div className="AppPage">
                <Drawer 
                    open={this.state.open} 
                    containerStyle={{
                        top: "64px",
                        zIndex: 100,
                    }}
                    >
                </Drawer>
                <div className="content">
                    <div className="headcontent">
                        <AppBar
                            title={<span className="title">Title</span>}
                            onLeftIconButtonTouchTap={this.handleToggle}
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
                        />
                    </div>
                    <AdminContent />
                    <Menu />
                </div>

            </div>
        );
    }
}

export default connect()(Page);
