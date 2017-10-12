/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import {grey900} from 'material-ui/styles/colors';

import NavBar from "../tools/nav.js";

import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Searchimg from '../../img/13.png';
import Searchimg2 from '../../img/15.png';
import Seltime from "../tools/seltime.js";
import DatePicker  from 'antd/lib/date-picker';
import Button  from 'antd/lib/button';
import Avatar from '../../img/19.png';
import {List, ListItem} from 'material-ui/List';
import Settingicon from '../../img/20.png';
import Users from '../../img/21.png';
import Rightlnk from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

const { RangePicker } = DatePicker;

class Page extends React.Component {

    render() {

        return (
            <div className="usercenterPage AppPage"
                style={{height : `${window.innerHeight}px`,overflow: "hidden",paddingBottom:"0"}}
                >
                <div className="navhead">
                    <a className="back" onClick={()=>{this.props.history.goBack()}}></a>
                    <span className="title" style={{paddingRight : "30px"}}>帐号</span>
                </div>
                <div className="content">
                    <div className="head">
                        <img src={Avatar} />
                        <div className="username">
                            <span>用户名</span>
                            <span>ID:88888888888</span>
                        </div>
                        <span className="changepwd">修改密码</span>
                    </div>
                    <List style={{background: "#FFF",padding:"0"}}>
                        <ListItem
                            primaryText="设置"
                            leftIcon={<img src={Settingicon} />}
                            rightIcon={<Rightlnk />}
                            style={{marginBottom: "1px"}}
                            onClick={()=>{this.props.history.push("/setting")}}
                            />
                            <div style={{height:"1px",width : "100%", background:"#EEE"}}></div>
                        <ListItem
                            primaryText="关于"
                            leftIcon={<img src={Users} />}
                            rightIcon={<Rightlnk />}
                            style={{background : "#FFF"}}
                            onClick={()=>{}}
                            />
                    </List>
                    <div className="loginout">退出登录</div>
                </div>


            </div>
        );
    }
}
export default connect()(Page);
