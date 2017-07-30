/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import { connect } from 'react-redux';
import "onsenui/css/onsenui.min.css";
import "onsenui/css-components-src/src/onsen-css-components.css";
import ons from 'onsenui';
import {SpeedDial,Fab,Toolbar,Icon,SpeedDialItem,Page} from 'react-onsenui';
import _  from "lodash";
import {ui_showmenu} from '../actions';

class Menu extends React.Component {
  onClickMenu(menuitemstring){
    this.props.dispatch(ui_showmenu(menuitemstring));
  }
  renderFixed() {
    const menuData = {
        power : {name : "电池包", icon : "fa fa-microchip", click : this.onClickMenu.bind(this,'powersearch')},
        history : {name : "历史告警", icon : "fa fa-history", click : this.onClickMenu.bind(this,'warningbox')},
        address : {name : "地理位置", icon : "fa fa-globe", click : this.onClickMenu.bind(this,'addressbox')}
    }
    return (
      <SpeedDial position='bottom right'>
        <Fab className="menuMain" >
            <i className="fa fa-bars" aria-hidden="true"></i>
        </Fab>
        {_.map(menuData, (menu, index)=>{
            return (
                <SpeedDialItem
                    key={index}
                    onClick={menu.click}
                    className="menuitem"
                    style={{
                        marginRight : "-6px",
                        width: "50px",
                        height: "50px",
                        lineHeight: "50px",
                        borderRadius: "60px",
                        background: "#4283cc",
                        textAlign:"center",
                    }}
                    >
                    <i className={menu.icon} aria-hidden="true" style={{fontSize:"20px"}}></i>
                </SpeedDialItem>
            )
        })}
      </SpeedDial>
    );
  }

  menuclick(name) {
    //ons.notification.confirm(`Do you want to share on "${name}"?`);

  }

  render() {
    return (
        <Page renderFixed={this.renderFixed.bind(this)}>
            Some content
        </Page>
    );
  }
};


export default connect()(Menu);
