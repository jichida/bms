/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import _ from 'lodash';
import {ui_selcurdevice} from '../actions';
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

class TreeSearch extends React.Component {
    render(){
        const inputstyle = {width : "30%", marginTop: "-10px", minWidth:"100px"};
        return (
            <div className="warningPage">
                <div className="tit">电池包搜索</div>
                <div className="searchli">
                    <SelectField
                        value={0}
                        onChange={this.handleChange}
                        style={{minWidth:"100px", width: "33%"}}
                        >
                        <MenuItem value={0} primaryText="选择分组名称" />
                        <MenuItem value={1} primaryText="Every Night" />
                        <MenuItem value={2} primaryText="Weeknights" />
                        <MenuItem value={3} primaryText="Weekends" />
                        <MenuItem value={4} primaryText="Weekly" />
                    </SelectField>
                    <TextField
                        hintText="输入RDB编号"
                        style ={inputstyle}
                    />
                    <TextField
                        hintText="BMU PACK号"
                        style ={inputstyle}
                    />
                    <TextField
                        hintText="设备PN料号"
                        style ={inputstyle}
                    />
                    <TextField
                        hintText="警告代码"
                        style ={inputstyle}
                    />
                    <TextField
                        hintText="故障代码"
                        style ={inputstyle}
                    />
                </div>
                <div className="searchbtn"><RaisedButton label="查询" primary={true} /></div>

                <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderColumn>设备号</TableHeaderColumn>
                        <TableHeaderColumn>告警时间</TableHeaderColumn>
                        <TableHeaderColumn>告警等级</TableHeaderColumn>
                        <TableHeaderColumn>告警内容</TableHeaderColumn>
                        <TableHeaderColumn>操作</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableRowColumn>设备1</TableRowColumn>
                        <TableRowColumn>2017-09-09 12:20:34</TableRowColumn>
                        <TableRowColumn>严重</TableRowColumn>
                        <TableRowColumn>这里是警告内容</TableRowColumn>
                        <TableRowColumn><RaisedButton label="操作按钮" primary={true} fullWidth={true} /></TableRowColumn>
                      </TableRow>
                    </TableBody>
                  </Table>
            </div>
                  
        );
    }
}
export default connect()(TreeSearch);
