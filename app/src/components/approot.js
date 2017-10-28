/**
 * Created by wangxiaoqing on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import {map_setmapinited, carmapshow_destorymap, ui_setmapstyle} from '../actions';
import { Route,Redirect,Switch} from 'react-router-dom';


import Index from './index/';
import Login from './login/login';
import Overview from './overview/overview';
import Carlist from './mycars/carlist';
import Collection from './collection/collection';
import Playback from './playback';
import Warning from './warning/';
import Warningdevice from './warningdevice/data.js';
import Warningdevicelist from './warningdevice/data.js';
import Mydevice from './mydevice';
import Myproject from './mydevice/project';
import Selcart from './selcart';

import Systems from './system';
import Deviceinfo from './mydevice/deviceinfo';
import Workorder from './workorder';
import Workorderinfo from './workorder/info';
import Usercenter from './user';
import Setting from './index/setting';
import Settinguser from './index/settinguser';
import Settingmessage from './index/settingmessage';
import MapPage from './admincontent';
import Alaraminfo from './warningdevice/alarminfo';
import "../css/common.css";

class AppMap extends React.Component {
    componentWillMount() {
        this.props.dispatch(ui_setmapstyle({height : (window.innerHeight-98-66) + "px", top: "98px"}))
    }
    render (){
        return (
            <div className="commonmap" style={this.props.mapstyle}>
                <MapPage height={this.props.mapstyle.height}/>
            </div>
        )
    }
}
const mapstyledata = ({app: {mapstyle}}) => {
    return {mapstyle};
}
AppMap = connect(mapstyledata)(AppMap);

class AppRoot extends React.Component {

    componentWillMount() {
        const script = document.createElement("script");
        script.src = "http://webapi.amap.com/maps?v=1.4.1&key=788e08def03f95c670944fe2c78fa76f&callback=init&&plugin=AMap.Geocoder,AMap.Scale,AMap.OverView,AMap.ToolBar,AMap.Geocoder,AMap.Driving,AMap.MarkerClusterer";
        script.async = true;
        window.init = ()=>{
              const scriptui = document.createElement("script");
              scriptui.src = "http://webapi.amap.com/ui/1.0/main.js?v=1.0.10";
              scriptui.async = true;
              document.body.appendChild(scriptui);
              scriptui.onload = ()=>{
                 window.initamaploaded = true;
                this.props.dispatch(map_setmapinited(true));
              }
        }
        document.body.appendChild(script);
    }

    componentWillUnmount() {
        this.props.dispatch(map_setmapinited(false));
        window.initamaploaded = false;
    }

    render() {

        return (
            <div className="AppContainer">

                <Switch>
                    <Route exact path="/" component={()=>(<Redirect to="/index"/>)} />
                    <Route path="/index" component={Index} />
                    <Route path="/login" component={Login} />
                    <Route path="/overview" component={Overview} />
                    <Route path="/carlist" component={Carlist} />
                    <Route path="/collection" component={Collection} />
                    <Route path="/playback/:deviceid" component={Playback} />
                    <Route path="/warningdevice" component={Warningdevice} />
                    <Route path="/warningdevicelist" component={Warningdevicelist} />
                    <Route path="/warning" component={Warning} />
                    <Route path="/system" component={Systems} />
                    <Route path="/mydevice" component={Mydevice} />
                    <Route path="/project/:groupid" component={Myproject} />
                    <Route path="/deviceinfo/:deviceid" component={Deviceinfo} />
                    <Route path="/workorder" component={Workorder} />
                    <Route path="/workorderinfo/:workid" component={Workorderinfo} />
                    <Route path="/usercenter" component={Usercenter} />
                    <Route path="/setting" component={Setting} />
                    <Route path="/settinguser" component={Settinguser} />
                    <Route path="/settingmessage" component={Settingmessage} />
                    <Route path="/alarminfo/:alarmid" component={Alaraminfo} />
                    <Route path="/selcart" component={Selcart} />
                </Switch>
                <AppMap />
            </div>
        );
    }
}
export default connect()(AppRoot);
