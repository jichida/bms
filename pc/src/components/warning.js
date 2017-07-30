/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import DatePicker from 'material-ui/DatePicker';
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

class Page extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            type : 1,
        };
    }
    handleChange = (event, index, value) => this.setState({value});
    render(){
        
        return (
            <div className="warningPage">
                <div className="tit">历史警告</div>
                <SelectField 
                    value={this.state.type}
                    onChange={this.handleChange}
                    fullWidth={true}
                    className="seltype"
                    underlineDisabledStyle={{}}
                    >
                    <MenuItem value={1} primaryText="严重" />
                    <MenuItem value={2} primaryText="紧急" />
                    <MenuItem value={3} primaryText="一般" />
                </SelectField>
                <div className="warningsearch">

                    <DatePicker hintText="开始时间" className="seltime" />
                    <DatePicker hintText="结束时间" className="seltime" />
                </div>
                <div>
                    <RaisedButton label="查询" primary={true} style={{marginRight:"10px"}} fullWidth={true} />
                </div>
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
