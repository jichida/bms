/**
 * Created by wangxiaoqing on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import {carmap_setmapinited} from '../actions';
import { Route,Redirect,Switch} from 'react-router-dom';


import Index from './index';

import "../css/common.css";

class AppRoot extends React.Component {
    componentWillMount() {
        const script = document.createElement("script");
        script.src = "http://webapi.amap.com/maps?v=1.3&key=788e08def03f95c670944fe2c78fa76f&callback=init&plugin=AMap.Geocoder,AMap.Driving";
        script.async = true;
        window.init = ()=>{
            // console.log(`地图下载成功啦！`);
            window.initamaploaded = true;
            this.props.dispatch(carmap_setmapinited(true));
        }
        document.body.appendChild(script);
    }
    componentWillUnmount() {
        this.props.dispatch(carmap_setmapinited(false));
        window.initamaploaded = false;
    }
    render() {
        return (
            <div className="AppContainer">
                <Switch>
                    <Route exact path="/" component={()=>(<Redirect to="/index"/>)}/>
                    <Route path="/index" component={Index}/>
                </Switch>
            </div>
        );
    }
}
export default connect()(AppRoot);
