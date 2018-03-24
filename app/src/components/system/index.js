/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './system.css';
import NavBar from "../tools/nav.js";
// import Avatars from "../../img/2.png";
// import Avatar from 'material-ui/Avatar';
// import DatePicker from 'material-ui/DatePicker';
// import SelectField from 'material-ui/SelectField';
// import MenuItem from 'material-ui/MenuItem';
// import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';

// import {
//     carmapshow_createmap,
//     carmapshow_destorymap,
// } from '../../actions';
// const divmapid = 'mapmain';
class Page extends React.Component {

    render() {
        // const {mapseldeviceid,devices} = this.props;
        // let DeviceId;
        // const formstyle={width:"100%",flexGrow:"1"};
        // const textFieldStyle={width:"100%",flexGrow:"1"};
        return (
            <div className="systemPage AppPage"
                style={{
                    minHeight : `${window.innerHeight}px`,
                }}
                >
                <NavBar back={true} title="系统设置" />
                <div className="content">
                    <div className="li" >
                        <span>系统配置项</span>
                        <TextField hintText="Full width"
                            fullWidth={true}
                            underlineShow={false}
                            hintStyle={{right:"0"}}
                            inputStyle={{textAlign:"right"}}
                            />
                    </div>
                    <div className="li" >
                        <span>系统配置项</span>
                        <TextField hintText="Full width"
                            fullWidth={true}
                            underlineShow={false}
                            hintStyle={{right:"0"}}
                            inputStyle={{textAlign:"right"}}
                            />
                    </div>
                    <div className="li" >
                        <Toggle label="系统配置项" className="litoggle" />
                    </div>



                    <div className="submitBtn">
                        <span className="btn Primary" > 保存 </span>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Page);
