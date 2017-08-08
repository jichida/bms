/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import _ from 'lodash';
// import {ui_selcurdevice} from '../actions';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

class TreeSearchBattery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groupname:  '',
            devicefield : '',
            alaramfield : '',
        };
    }
    handleChangeGroupname = (e,key)=>{
        console.log(key);
        this.setState({groupname: key});
    }
    handleChangeDevicefield = (e,key)=>{
        console.log(key);
        this.setState({devicefield: key});
    }
    handleChangeAlaramfiled = (e,key)=>{
        console.log(key);
        this.setState({alaramfield: key});
    }
    render(){
        let hintTextBattery = '';
        let ishiddenbattery = false;
        if(this.state.devicefield === ''){
          ishiddenbattery = true;
        }
        else if(this.state.devicefield === 'RdbNo'){
          hintTextBattery = '输入RDB编号';
        }
        else if(this.state.devicefield === 'PackNo'){
          hintTextBattery = 'BMU PACK号';
        }
        else if(this.state.devicefield === 'PnNo'){
          hintTextBattery = '设备PN料号';
        }

        let hintTextAlaram = '';
        let ishiddenalaram = false;
        if(this.state.alaramfield === ''){
          ishiddenalaram = true;
        }
        else if(this.state.alaramfield === 'ALARM_H'){
          hintTextAlaram = '警告代码';
        }
        else if(this.state.alaramfield === 'ALARM_L'){
          hintTextAlaram = '故障代码';
        }

        return (
            <div className="warningPage">
                <div className="tit">电池包搜索</div>
                <div className="searchli">
                    <div>
                        <SelectField
                            value={0}
                            onChange={this.handleChange}
                            style={{minWidth:"100px", width: "33%"}}
                            value = {this.state.input1}
                            >
                            <MenuItem value={0} primaryText="选择分组名称" />
                            <MenuItem value={1} primaryText="Every Night" />
                            <MenuItem value={2} primaryText="Weeknights" />
                            <MenuItem value={3} primaryText="Weekends" />
                            <MenuItem value={4} primaryText="Weekly" />
                        </SelectField>
                    </div>
                    <div>
                        <SelectField
                            value={0}
                            onChange={this.handleChange2}
                            style={{minWidth:"100px", width: "33%"}}
                            value = {this.state.input2}
                            >
                            <MenuItem value={''} primaryText="请选择" />
                            <MenuItem value={'RdbNo'} primaryText="RDB编号" />
                            <MenuItem value={'PackNo'} primaryText="BMU PACK号" />
                            <MenuItem value={'PnNo'} primaryText="设备PN料号" />
                        </SelectField>
                        <TextField
                            hintText={hintText}
                            style ={{width : "30%", marginTop: "-10px", minWidth:"100px" ,display: ishiddenbattery?"none":"inline-block"}}
                        />
                    </div>
                    <div>
                        <SelectField
                            value={0}
                            onChange={this.handleChange3}
                            style={{minWidth:"100px", width: "33%"}}
                            value = {this.state.input3}
                            >
                            <MenuItem value={''} primaryText="请选择" />
                            <MenuItem value={'ALARM_H'} primaryText="警告代码" />
                            <MenuItem value={'ALARM_L'} primaryText="故障代码" />
                        </SelectField>
                        <TextField
                            hintText={hintTextAlaram}
                            style ={{width : "30%", marginTop: "-10px", minWidth:"100px" ,display: ishiddenalaram?"none":"inline-block"}}
                        />
                    </div>
                </div>
                <div className="searchbtn">
                  <RaisedButton label="查询" primary={true} fullWidth={true} />
                </div>
            </div>

        );
    }
}

// const mapStateToProps = ({device:{mapseldeviceid,devices}}) => {
//   return {mapseldeviceid,devices};
// }
export default connect()(TreeSearchBattery);
