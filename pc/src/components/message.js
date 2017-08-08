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
import Avatar from 'material-ui/Avatar';
import Deraultimg from "../img/1.png";

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import TreeSearchBattery from './search/searchbattery';

class TreeSearch extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        return (
            <div className="warningPage">
                <div className="tit">新消息</div>
                <TreeSearchBattery />

                <Table>
                    <TableHeader
                        displaySelectAll={false}
                        adjustForCheckbox={false}
                        >
                      <TableRow>
                        <TableHeaderColumn>图标及设备号</TableHeaderColumn>
                        <TableHeaderColumn>告警信息</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                      <TableRow>
                        <TableRowColumn><Avatar src={Deraultimg} /><span>1234</span></TableRowColumn>
                        <TableRowColumn>这里是警告内容</TableRowColumn>
                      </TableRow>
                    </TableBody>
                  </Table>
            </div>

        );
    }
}
export default connect()(TreeSearch);
