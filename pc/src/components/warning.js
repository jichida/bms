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
import {searchbatteryalarmsingle_request} from '../actions';
import _ from 'lodash';

class Page extends React.Component {
    constructor(props){
        super(props);
    }
    handleChange = (event, index, value) => this.setState({value});

    onClickQuery(query){
      const {curseldeviceid} = this.props;
      query.querydevice = query.querydevice || {};
      query.querydevice._id = curseldeviceid;
      this.props.dispatch(searchbatteryalarmsingle_request(query));
    }
    render(){
        const {devices,alarms,curseldeviceid,searchresult_alaramsingle} = this.props;
        return (
            <div className="warningPage">
                <div className="tit">设备：{curseldeviceid} 历史告警</div>
                <TreeSearchBatteryAlarmSingle onClickQuery={this.onClickQuery.bind(this)}/>
                <Table selectable={false}>
                    <TableHeader>
                      <TableRow>
                        <TableHeaderColumn>告警时间</TableHeaderColumn>
                        <TableHeaderColumn>告警内容</TableHeaderColumn>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        _.map(searchresult_alaramsingle,(alarmid,key)=>{
                          const alarm =alarms[alarmid];
                          if(!!alarm){
                            return (
                              <TableRow key={key}>
                              <TableRowColumn>{alarm.DataTime}</TableRowColumn>
                              <TableRowColumn>{alarm.Alarm}</TableRowColumn>
                              </TableRow>)
                          }

                        })
                      }

                    </TableBody>
                  </Table>
            </div>
        );
    }
}

const mapStateToProps = (
  {
    device:
    {
      devices
    },
    searchresult:
    {
      curseldeviceid,
      searchresult_alaramsingle,
      alarms
    }
  }) => {

  return {devices,alarms,curseldeviceid,searchresult_alaramsingle};
}


export default connect(mapStateToProps)(Page);
