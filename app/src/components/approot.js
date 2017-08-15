/**
 * Created by wangxiaoqing on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import {map_setmapinited} from '../actions';
import { Route,Redirect,Switch} from 'react-router-dom';


import Index from './index/';
import Login from './login/login';
import Overview from './overview/overview';
import Carlist from './mycars/carlist';
import Collection from './collection/collection';
import Playback from './playback';
import Warning from './warning/';
import Systems from './system';

import "../css/common.css";

class AppRoot extends React.Component {
    componentWillMount() {
        const scriptui = document.createElement("script");
        scriptui.src = "http://webapi.amap.com/ui/1.0/main.js?v=1.0.10";
        scriptui.async = false;
        document.body.appendChild(scriptui);
        const script = document.createElement("script");
        script.src = "http://webapi.amap.com/maps?v=1.3&key=788e08def03f95c670944fe2c78fa76f&callback=init&&plugin=AMap.Geocoder,AMap.Scale,AMap.OverView,AMap.ToolBar";
        script.async = true;
        window.init = ()=>{
            // console.log(`地图下载成功啦！`);
            window.initamaploaded = true;
            this.props.dispatch(map_setmapinited(true));
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
                    <Route path="/playback" component={Playback} />
                    <Route path="/warning" component={Warning} />
                    <Route path="/system" component={Systems} />
                </Switch>
            </div>
        );
    }
}
export default connect()(AppRoot);
