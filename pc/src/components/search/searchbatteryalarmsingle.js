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
import DatePicker from 'material-ui/DatePicker';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';


class TreeSearchBatteryAlarmSingle extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            type : 1,
        };
    }
    handleChange = (event, index, value) => this.setState({value});

    onClickQuery=()=>{
      let query = {
        queryalarm:{
          level:this.state.type
        }
      };
      console.log(`query:${JSON.stringify(query)}`);
      if(!!this.props.onClickQuery){
        this.props.onClickQuery({query});
      }
    }
    render(){
        return (
            <div className="warningPage">
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
