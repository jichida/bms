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
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import "./style.css";

class DatatablePage extends React.Component {
    
    render() {
        return (
            <div className="datatablePage AppPage">
                <AppBar
                    title={<span className="title"><b style={{marginRight:"10px"}}>数据列表</b> 设备编号：123123-wr2-2r3r2</span>}
                    iconElementLeft={<div onClick={()=>{this.props.history.push("./")}}><i className="fa fa-angle-left back" aria-hidden="true"></i></div>}
                    iconElementRight={
                        <IconButton onTouchTap={()=>{this.props.history.push("./")}}>
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
