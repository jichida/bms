/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import User from "../img/1.png";
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
import Exit from "material-ui/svg-icons/action/exit-to-app";
import Avatar from "../img/2.jpg";

/**
 * The `maxHeight` property limits the height of the menu, above which it will be scrollable.
 */

const UserMenu = () => (
    <IconMenu
        iconButtonElement={
          <IconButton>
            <div className="topuser">
                <span>jwhklk</span>
                <img src={Avatar}  />
            </div>
          </IconButton>
        }
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        anchorOrigin ={{ vertical: 'bottom', horizontal: 'left'}}
        >
        <MenuItem primaryText="设置" leftIcon={<Settings />} />
        <MenuItem primaryText="退出登录" leftIcon={<Exit />} />
    </IconMenu>
);


class Page extends React.Component {
    onClickMenu(tiptype){
        this.props.dispatch(ui_showmenu('showmessage'));
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

        return (
            <div className="BadgeStyle">

                <Badge
                    badgeContent={"在线"}
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
                    <img src={User} style={{marginBottom: "-6px"}} />
                </Badge>
                <Badge
                    badgeContent={"(47788)"}
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
                    <i className="fa fa-bus"  aria-hidden="true"   style={iconstyle1} onClick={this.onClickMenu.bind(this,'high')} />
                </Badge>
                <Badge
                    badgeContent={"(47788)"}
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
                    <i className="fa fa-bus"  aria-hidden="true"   style={iconstyle2} onClick={this.onClickMenu.bind(this,'high')} />
                </Badge>
                <Badge
                    badgeContent={"(47788)"}
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
                    <i className="fa fa-bus"  aria-hidden="true"   style={iconstyle3} onClick={this.onClickMenu.bind(this,'high')} />
                </Badge>

                <Badge
                    badgeContent={4}
                    className="Badge"
                    secondary={true}
                    style={{
                        padding:"0",width:"36px",height:"36px",display: "flex",marginRight: "10px"}}
                    badgeStyle={{
                        top: "-4px", right: "-4px",
                        backgroundColor : "#FFF",
                        color : "#C00",
                        border : "2px solid #C00",
                        width : "18px",
                        height : "18px",
                        lineHeight : "18px"
                    }}
                    >
                    <i className="fa fa-envelope-o"  aria-hidden="true"   style={iconstyle1}  onClick={this.onClickMenu.bind(this,'low')} />
                </Badge>


                <UserMenu />

            </div>
        );
    }
}
export default connect()(Page);
