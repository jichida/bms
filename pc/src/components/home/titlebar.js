import React from 'react';
import AppBar from 'material-ui/AppBar';
import Logo from "../../img/logo.png";
import {
    ui_showmenu,
} from '../../actions';

const TitleBar = (props)=>{
  const {menuevent,titleNavClick,dispatch} = props;
  return  (<div className="headcontent">
        <AppBar
            title={
                <div className="titlenav">
                    <span onClick={titleNavClick.bind(this, 0)}>监控平台</span>
                </div>
            }
            onLeftIconButtonTouchTap={menuevent}
            style={{
                backgroundColor: "#FFF",
                paddingLeft:"0",
                height : "64px",
                paddingRight:"0",
            }}
            iconStyleLeft={{
                marginTop: "0",
                marginLeft: "0"
            }}
            iconElementLeft={<div className="logo" onClick={()=>{dispatch(ui_showmenu("addressbox"))}}>
              <img src={Logo} alt=""/></div>}
            className="appbar"
        />
    </div>);
}

export default TitleBar;
