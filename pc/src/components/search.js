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

import {
  ui_selcurdevice,
  searchbattery_request
} from '../actions';


class TreeSearch extends React.Component {

    constructor(props) {
        super(props);
    }
    onClickDevice(deviceitem){
      this.props.dispatch(ui_selcurdevice({DeviceId:deviceitem.DeviceId,deviceitem}))
    }
    onClickQuery(query){
      console.log(`search:${JSON.stringify(query)}`);
      this.props.dispatch(searchbattery_request(query));
    }
    render(){
        const {devices,searchresult_battery} = this.props;
        return (
            <div className="warningcontentPage">
                <TreeSearchBattery onClickQuery={this.onClickQuery.bind(this)}/>
                
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
      searchresult_battery,
    }
  }) => {

  return {devices,searchresult_battery};
}


export default connect(mapStateToProps)(TreeSearch);
