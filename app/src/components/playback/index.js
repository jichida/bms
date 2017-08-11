/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import {grey900} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import NavBar from "../tools/nav.js";
import Map from './map';
import "./map.css";
import {mapplayback_start} from '../../actions';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';


class Page extends React.Component {
    onClickStart(){
      this.props.dispatch(mapplayback_start({isloop:false,speed:5000}));
    }
    render() {
        const {mapseldeviceid,devices} = this.props;
        let DeviceId;
        let deviceitem = devices[mapseldeviceid];
        if(!!deviceitem){
          DeviceId = deviceitem.DeviceId;
        }
        const formstyle={width:"100%",flexGrow:"1"};
        const textFieldStyle={width:"100%",flexGrow:"1"};
        return (
            <div className="playbackPage AppPage"
                style={{minHeight : `${window.innerHeight}px`}}
                >
                <NavBar title="轨迹回放" back={true} />
                <div className="set">
                    <div>设备编号：{DeviceId || '23423-24cdc-wef'}</div>
                    <div className="formlist">
                        <DatePicker hintText="开始时间" style={formstyle} textFieldStyle={textFieldStyle} />
                        <DatePicker hintText="结束时间" style={formstyle} textFieldStyle={textFieldStyle} />
                        <SelectField value={0} fullWidth={true}>
                            <MenuItem value={0} primaryText="播放速度" />
                            <MenuItem value={10} primaryText="10" />
                            <MenuItem value={20} primaryText="20" />
                            <MenuItem value={30} primaryText="30" />
                            <MenuItem value={40} primaryText="40" />
                            <MenuItem value={50} primaryText="50" />
                        </SelectField>
                    </div>
                    <div className="btnlist">
                        <RaisedButton onTouchTap={this.onClickStart.bind(this)} label="开始" primary={true} style={{marginRight:"10px"}} />
                        <RaisedButton label="结束" secondary={true} style={{marginRight:"10px"}} />
                    </div>
                </div>
                <Map height={window.innerHeight-310}/>
            </div>
        );
    }
}
const mapStateToProps = ({device:{mapseldeviceid,devices}}) => {
  return {mapseldeviceid,devices};
}
export default connect(mapStateToProps)(Page);
