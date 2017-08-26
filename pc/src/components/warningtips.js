/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import CarOnline from "../img/1.png";
import CarOutline from "../img/3.png";
import { ui_showmenu } from '../actions';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import FontIcon from 'material-ui/FontIcon';
import IconMenu from 'material-ui/IconMenu';
import MapsPlace from 'material-ui/svg-icons/maps/place';
import Settings from "material-ui/svg-icons/action/settings";
import Car from "material-ui/svg-icons/maps/directions-car";

import Exit from "material-ui/svg-icons/action/exit-to-app";
import Avatar from "../img/2.jpg";
import RaisedButton from 'material-ui/RaisedButton';
import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import withRouter from 'react-router-dom/withRouter';
import { Icon } from "antd";

import {
  ui_btnclick_deviceonline,
  ui_btnclick_deviceoffline,
  ui_btnclick_alaramall,
  ui_btnclick_alaramred,
  ui_btnclick_alaramorange,
  ui_btnclick_alaramyellow,

  ui_menuclick_settings,
  ui_menuclick_logout
}from '../actions';
/**
 * The `maxHeight` property limits the height of the menu, above which it will be scrollable.
 */

// const UserMenu = () => (
//     <IconMenu
//         iconButtonElement={
//           <IconButton>
//             <div className="topuser">
//                 <span>jwhklk</span>
//                 <img src={Avatar}  />
//             </div>
//           </IconButton>
//         }
//         targetOrigin={{horizontal: 'left', vertical: 'top'}}
//         anchorOrigin ={{ vertical: 'bottom', horizontal: 'left'}}
//         >
//         <MenuItem primaryText="设置" leftIcon={<Settings />} />
//         <MenuItem primaryText="退出登录" leftIcon={<Exit />} />
//     </IconMenu>
// );

class UserMenu extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };
  }

  handleTouchTap = (event) => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };
// this.props.history.push("/device")
  render() {
    const {username} = this.props;
    return (
      <div>
        <div className="topuser" onClick={this.handleTouchTap}>
            <span>{username}</span>
            <img src={Avatar}  />
        </div>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
          animation={PopoverAnimationVertical}
        >
          <Menu>
            <MenuItem primaryText="电池包" leftIcon={<Car />} onClick={()=>{
                this.handleRequestClose();
                this.props.history.push("/device");
            }}/>
            <MenuItem primaryText="设置" leftIcon={<Settings />} onClick={()=>{
                this.handleRequestClose();
                this.props.dispatch(ui_menuclick_settings({}));
            }}/>
            <MenuItem primaryText="退出登录" leftIcon={<Exit />} onClick={()=>{
                this.handleRequestClose();
                this.props.dispatch(ui_menuclick_logout({}));
            }}/>
          </Menu>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = ({userlogin}) => {
   const {username} = userlogin;
   return {username};
}
UserMenu = withRouter(UserMenu);
UserMenu = connect(mapStateToProps)(UserMenu);

class Page extends React.Component {
    onClickMenu(tiptype){
        if(tiptype === 'online'){
            this.props.dispatch(ui_btnclick_deviceonline({}));
        }
        else if(tiptype === 'offline'){
            this.props.dispatch(ui_btnclick_deviceonline({}));
        }
        else if(tiptype === 'all'){
            this.props.dispatch(ui_btnclick_alaramall({}));
        }
        else if(tiptype === 'red'){
            this.props.dispatch(ui_btnclick_alaramred({}));
        }
        else if(tiptype === 'orange'){
            this.props.dispatch(ui_btnclick_alaramorange({}));
        }
        else if(tiptype === 'yellow'){
            this.props.dispatch(ui_btnclick_alaramyellow({}));
        }
        //this.props.dispatch(ui_showmenu('showmessage'));
    }

    render(){

        const iconstyle1 = {
            width:"auto",
            height:"30px",
            fontSize:"28px",
            textAlign:"center",
            display:"flex",
            alignItems: "center",
            justifyContent: "center",
            color : "#d21d24",
            marginBottom :"-6px"
        }
        const iconstyle2 = {...iconstyle1};
        iconstyle2.color = "#ed942f";

        const iconstyle3 = {...iconstyle1};
        iconstyle3.color = "#f6d06b";

        const iconstyle4 = {...iconstyle1};
        iconstyle4.color = "#5cbeaa";
        iconstyle4.fontSize = "30px";

        const {count_online,count_offline,count_all,count_yellow,count_red,count_orange} = this.props;

        return (
            <div className="BadgeStyle">

                <Badge
                    badgeContent={count_online}
                    className="Badge"
                    secondary={true}
                    style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                    badgeStyle={{
                        top : "auto",
                        bottom: "-4px",
                        right: "-4px",
                        backgroundColor: "none",
                        color : "#111",
                        position: "relative",
                        bottom: "-8px",
                        fontSize: "18px",
                        width : "auto",
                        color : "#5cbeaa"
                    }}
                    >
                    <img src={CarOnline} style={{marginBottom: "-6px"}} onClick={this.onClickMenu.bind(this,'online')} />
                </Badge>
                <Badge
                    badgeContent={count_offline}
                    className="Badge"
                    secondary={true}
                    style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                    badgeStyle={{
                        top : "auto",
                        bottom: "-4px",
                        right: "-4px",
                        backgroundColor: "none",
                        color : "#111",
                        position: "relative",
                        bottom: "-8px",
                        fontSize: "18px",
                        width : "auto",
                        color : "#999"
                    }}
                    >
                    <img src={CarOutline} style={{marginBottom: "-6px"}}  onClick={this.onClickMenu.bind(this,'offline')} />
                </Badge>
                <Badge
                    badgeContent={`(${count_red})`}
                    className="Badge"
                    secondary={true}
                    style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                    badgeStyle={{
                        top : "auto",
                        bottom: "-4px",
                        right: "-4px",
                        backgroundColor: "none",
                        color : "#111",
                        position: "relative",
                        bottom: "-8px",
                        fontSize: "18px",
                        width : "auto",
                        color : "#d21d24"
                    }}
                    >
                    <i className="fa fa-bus"  aria-hidden="true"   style={iconstyle1} onClick={this.onClickMenu.bind(this,'red')} />
                </Badge>
                <Badge
                    badgeContent={`(${count_orange})`}
                    className="Badge"
                    secondary={true}
                    style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                    badgeStyle={{
                        top : "auto",
                        bottom: "-4px",
                        right: "-4px",
                        backgroundColor: "none",
                        color : "#111",
                        position: "relative",
                        bottom: "-8px",
                        fontSize: "18px",
                        width : "auto",
                        color : "#ed942f"
                    }}
                    >
                    <i className="fa fa-bus"  aria-hidden="true"   style={iconstyle2} onClick={this.onClickMenu.bind(this,'orange')} />
                </Badge>
                <Badge
                    badgeContent={`(${count_yellow})`}
                    className="Badge"
                    secondary={true}
                    style={{padding:"0",width:"auto",height:"36px",display: "flex", marginRight : "15px"}}
                    badgeStyle={{
                        top : "auto",
                        bottom: "-4px",
                        right: "-4px",
                        backgroundColor: "none",
                        color : "#111",
                        position: "relative",
                        bottom: "-8px",
                        fontSize: "18px",
                        width : "auto",
                        color : "#f6d06b"
                    }}
                    >
                    <i className="fa fa-bus"  aria-hidden="true"   style={iconstyle3} onClick={this.onClickMenu.bind(this,'yellow')} />
                </Badge>

                <Badge
                    badgeContent={`${count_all}`}
                    className="Badge"
                    secondary={true}
                    style={{
                        padding:"0",width:"36px",height:"36px",display: "flex",marginRight: "10px"}}
                    badgeStyle={{
                        top: "-4px", right: "-4px",
                        backgroundColor : "#FFF",
                        color : "#C00",
                        border : "2px solid #C00",
                        width : "28px",
                        height : "28px",
                        lineHeight : "28px",
                        fontSize : "11px"
                    }}
                    >
                    <i className="fa fa-envelope-o"  aria-hidden="true"   style={iconstyle1}  onClick={this.onClickMenu.bind(this,'all')}  />
                </Badge>


                <UserMenu />

            </div>
        );
    }
}


//this.onClickMenu.bind(this,'low')
Page = withRouter(Page);
const mapStateToPropsTip = ({device}) => {
   const {g_devicesdb} = device;
   let count_online = 6000;
   let count_offline = 70;
   let count_all = 450;
   let count_yellow = 40;
   let count_red = 20;
   let count_orange = 33;

    if(count_all>99){
        count_all = "99+";
    }


   return {count_online,count_offline,count_all,count_yellow,count_red,count_orange};
 }
export default connect(mapStateToPropsTip)(Page);
