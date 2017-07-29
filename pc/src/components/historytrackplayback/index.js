/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import {grey900} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import Map from './map';
import "./map.css";

class Page extends React.Component {

    render() {
        return (
            <div className="historytrackplayback">
                <AppBar
                    title={<span className="title">轨迹回放</span>}
                    iconElementLeft={<div><i className="fa fa-angle-left back" aria-hidden="true" onTouchTap={this.props.back}></i></div>}
                    iconElementRight={
                        <IconButton onTouchTap={this.props.back}>
                            <NavigationClose color={grey900}/>
                        </IconButton>
                    }
                    style={{
                        backgroundColor: "#FFF",
                        paddingLeft:"10px",
                        paddingRight:"0",
                    }}
                    className="appbar"
                    iconStyleLeft={{
                        marginTop: "15px"
                    }}
                    iconStyleRight={{
                        marginRight: "20px"
                    }}
                    />
                <div className="set">
                    <div>设备编号：123456</div>
                    <div>
                        <DatePicker hintText="开始日期" />
                        <TimePicker hintText="开始时间" />
                        <DatePicker hintText="结束日期" />
                        <TimePicker hintText="结束时间" />
                    </div>
                    <div>
                        <RaisedButton label="开始" primary={true} style={{marginRight:"10px"}} />
                        <RaisedButton label="结束" secondary={true} style={{marginRight:"10px"}} />
                    </div>
                    <Map />
                </div>
            </div>
        );
    }
}

export default connect()(Page);
