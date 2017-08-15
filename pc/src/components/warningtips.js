/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import Badge from 'material-ui/Badge';
import IconButton from 'material-ui/IconButton';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import {
  ui_showmenu
} from '../actions';

class Page extends React.Component {
    onClickMenu(tiptype){
        this.props.dispatch(ui_showmenu('showmessage'));
    }

    render(){
        const iconstyle = {width:"30px",height:"30px",fontSize:"20px",textAlign:"center",display:"flex",alignItems: "center",justifyContent: "center"}
        return (
            <div className="BadgeStyle">
                <Badge
                    badgeContent={4}
                    className="Badge"
                    secondary={true}
                    style={{padding:"0",width:"36px",height:"36px",display: "flex"}}
                    badgeStyle={{top: "-4px", right: "-4px"}}
                    >
                    <i className="fa fa-car"  aria-hidden="true"   style={iconstyle} onClick={this.onClickMenu.bind(this,'high')} />
                </Badge>
                <Badge
                    badgeContent={4}
                    className="Badge"
                    secondary={true}
                    style={{padding:"0",width:"36px",height:"36px",display: "flex"}}
                    badgeStyle={{top: "-4px", right: "-4px"}}
                    >
                    <i className="fa fa-bell"  aria-hidden="true"   style={iconstyle}  onClick={this.onClickMenu.bind(this,'low')} />
                </Badge>
            </div>
        );
    }
}
export default connect()(Page);
