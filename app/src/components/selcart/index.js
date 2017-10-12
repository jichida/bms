/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './style.css';
import Datalist from "./datalist";
import Fillerimg from '../../img/25.png';

class Page extends React.Component {
    render() {
        const {mapseldeviceid,devices} = this.props;
        let DeviceId;
        const formstyle={width:"100%",flexGrow:"1"};
        const textFieldStyle={width:"100%",flexGrow:"1"};
        return (
            <div className="selcartPage AppPage"
                style={{height : `${window.innerHeight}px`,overflow: "hidden",paddingBottom:"0"}}
                >
                <div className="navhead">
                    <a className="back" onClick={()=>{this.props.history.goBack()}}></a>
                    <span className="title" style={{paddingRight : "30px"}}>选择汽车</span>
                    <div className="filler"><img src={Fillerimg} /></div>
                </div>
                <div className="selcartfiller">

                </div>
                <div className="searchtools"><input placeholder="输入设备ID" /></div>
                <div className="list">
                    
                </div>
            </div>
        );
    }
}

export default connect()(Page);
