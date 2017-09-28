/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import _ from 'lodash';
// import {ui_selcurdevice_request} from '../actions';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Seltime from './seltime.js';
import { Input, Col, Select, InputNumber, DatePicker, AutoComplete, Cascader, Button } from 'antd';
import moment from 'moment';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

const Option = Select.Option;
class TreeSearchBatteryAlarmSingle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          alarmlevel:'-1',
          startDate:moment().subtract(3600*12, 'seconds'),
          endDate:moment(),
        };
    }
    onChangeSelDate(startDate,endDate){
      this.setState({
        startDate,
        endDate
      });
    }

    onChange_alarmlevel(alarmlevel){
      this.setState({alarmlevel});
    }
    onClickQuery=()=>{
      let query = {
        queryalarm:{
        }
      };
      query.queryalarm['startDate'] = this.state.startDate.format('YYYY-MM-DD HH:mm:ss');
      query.queryalarm['endDate'] = this.state.endDate.format('YYYY-MM-DD HH:mm:ss');
      if(this.state.alarmlevel !== '-1'){
        query['warninglevel'] = parseInt(this.state.alarmlevel);
      }
      console.log(`【searchbatteryalaramsingle】查询条件:${JSON.stringify(query)}`);
      if(!!this.props.onClickQuery){
        this.props.onClickQuery({query});
      }
    }
    render(){
        return (
            <div className="warningPage">
              <Select defaultValue={'-1'}   onChange={this.onChange_alarmlevel.bind(this)}>
                  <Option value={'-1'} >选择警告级别</Option>
                  <Option value={'0'} >严重告警</Option>
                  <Option value={'1'} >紧急告警</Option>
                  <Option value={'2'} >一般告警</Option>
              </Select>
              <div className="warningsearch">
                <Seltime  startDate = {this.state.startDate}
                  endDate = {this.state.endDate}
                 onChangeSelDate={this.onChangeSelDate.bind(this)}/>
              </div>
              <div>
                  <RaisedButton label="查询" primary={true} style={{marginRight:"10px"}} fullWidth={true} onTouchTap={this.onClickQuery}/>
              </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
  return {};
}
export default connect(mapStateToProps)(TreeSearchBatteryAlarmSingle);
