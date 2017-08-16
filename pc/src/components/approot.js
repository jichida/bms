/**
 * Created by wangxiaoqing on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import {map_setmapinited} from '../actions';
import { Route,Redirect,Switch} from 'react-router-dom';
import AdminContent from "./admincontent";
import Index from './index';
import Login from './login/login.js';
import MapPage from './admincontent';
import { carmapshow_createmap, carmapshow_destorymap} from '../actions';
import "../css/common.css";

function mapoption(Component,Maps) {
    let s = (props)=>{
        return (<Component {...props} map={Maps}/>)
    };
    return connect()(s);
}

class AppRoot extends React.Component {
    componentWillMount() {
        this.MapPageCo = <MapPage />;
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
                    <Route exact path="/" component={()=>(<Redirect to="/index"/>)}/>
                    <Route path="/index" component={mapoption(Index, this.MapPageCo)}/>
                    <Route path="/login" component={Login}/>
                </Switch>
            </div>
        );
    }
}
export default connect()(AppRoot);
