/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';

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
import TreeSearchBatteryAlarmSingle from './search/searchbatteryalarmsingle';
class Page extends React.Component {
    constructor(props){
        super(props);

    }
    handleChange = (event, index, value) => this.setState({value});
    render(){

        return (
            <div className="warningPage">
                <div className="tit">设备：23234 历史警告</div>
                <TreeSearchBatteryAlarmSingle />
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

export default connect()(Page);
