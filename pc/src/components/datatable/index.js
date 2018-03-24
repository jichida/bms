/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
// import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
// import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Day from 'material-ui/svg-icons/action/date-range';
import Time from 'material-ui/svg-icons/device/access-time';

// import IconButton from 'material-ui/IconButton';
// import {grey900} from 'material-ui/styles/colors';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import "./style.css";

class DatatablePage extends React.Component {
    render() {
        return (
            <div className="datatablePage AppPage">

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.push("./")}}></i>
                    <div className="title">车辆编号8888888</div>
                    <div className="day">
                        <Day color={"#FFFFFF"} style={{width: "40px", height : "40px"}} />
                        <div>开始日期</div>
                    </div>
                    <div className="day">
                        <Time color={"#FFFFFF"} style={{width: "40px", height : "40px"}} />
                        <div>开始时间</div>
                    </div>
                    <div className="day">
                        <Day color={"#FFFFFF"} style={{width: "40px", height : "40px"}} />
                        <div>结束日期</div>
                    </div>
                    <div className="day">
                        <Time color={"#FFFFFF"} style={{width: "40px", height : "40px"}} />
                        <div>结束时间</div>
                    </div>
                    <div className="controlbtn">
                        <span>开始</span>
                        <span>结束</span>
                    </div>
                </div>

                <div className="SearchBar">
                    <div className="formlist">
                            <DatePicker hintText="开始日期"  />
                            <TimePicker hintText="开始时间"  />
                            <DatePicker hintText="结束日期"  />
                            <TimePicker hintText="结束时间"  />
                            <SelectField
                                value={0}
                                onChange={()=>{}}
                                maxHeight={200}
                                >
                                <MenuItem value={0} primaryText={"选择地理位置"} />
                                <MenuItem value={1} primaryText={"江苏"} />
                            </SelectField>
                            <SelectField
                                value={0}
                                onChange={()=>{}}
                                maxHeight={200}
                                >
                                <MenuItem value={0} primaryText={"自定义分组"} />
                                <MenuItem value={1} primaryText={"江苏"} />
                            </SelectField>
                            <SelectField
                                value={0}
                                onChange={()=>{}}
                                maxHeight={200}
                                >
                                <MenuItem value={0} primaryText={"编号"} />
                                <MenuItem value={1} primaryText={"PACK"} />
                                <MenuItem value={2} primaryText={"RDB"} />
                            </SelectField>
                            <RaisedButton onTouchTap={()=>{}} label="查询" primary={true} />
                    </div>
                </div>
                <div className="list">

                </div>
            </div>
        );
    }
}
export default connect()(DatatablePage);
