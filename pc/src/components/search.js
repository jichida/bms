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
import TreeSearchBattery from './search/searchbattery';
import {searchbattery_request} from '../actions';

class TreeSearch extends React.Component {

    constructor(props) {
        super(props);
    }
    onClickQuery(query){
      this.props.searchbattery_request(query);
    }
    render(){
        return (
            <div className="warningPage">
                <TreeSearchBattery onClickQuery={this.onClickQuery.bind(this)}/>
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
