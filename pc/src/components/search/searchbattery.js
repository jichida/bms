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
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
/* <MenuItem value={''} primaryText="请选择" />
<MenuItem value={'RdbNo'} primaryText="RDB编号" />
<MenuItem value={'PackNo'} primaryText="BMU PACK号" />
<MenuItem value={'PnNo'} primaryText="设备PN料号" /> */
const selitem_devicefields = [
  {
    value:'',
    text:'请选择'
  },
  {
    value:'RdbNo',
    text:'RDB编号'
  },
  {
    value:'PackNo',
    text:'BMU PACK号"'
  },
  {
    value:'PnNo',
    text:'设备PN料号'
  },
];
/* <MenuItem value={''} primaryText="请选择" />
<MenuItem value={'ALARM_H'} primaryText="警告代码" />
<MenuItem value={'ALARM_L'} primaryText="故障代码" /> */
const selitem_alarmfields = [
  {
    value:'',
    text:'请选择'
  },
  {
    value:'ALARM_H',
    text:'警告代码'
  },
  {
    value:'ALARM_L',
    text:'故障代码'
  },
];

class TreeSearchBattery extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            groupname:  '',
            devicefield : '',
            alarmfield : '',
            searchtxtfordevice:'',
            searchtxtforalarm:''
        };
    }
    handleChangeSearchtxtfordevice(e,v){
      this.setState({searchtxtfordevice:v});
    }
    handleChangeSearchtxtforalaram(e,v){
      this.setState({searchtxtforalarm:v});
    }

    handleChangeGroupname = (e,key)=>{
        console.log(key);
        const {groupidlist} = this.props;
        if(key === 0){
          this.setState({groupname: ''});
        }
        else{
          let groupid = groupidlist[key-1];
          this.setState({groupname:groupid});
        }
    }
    handleChangeDevicefield = (e,key)=>{
        console.log(key);
        this.setState({devicefield: selitem_devicefields[key].value});
    }
    handleChangeAlarmfiled = (e,key)=>{
        console.log(key);
        this.setState({alarmfield: selitem_alarmfields[key].value});
    }

    onClickQuery=()=>{
      let query = {
        querydevice:{},
        queryalarm:{}
      };
      if(this.state.groupname !== ''){
        query.querydevice =
              {
                ...query.querydevice,
                groupid:this.state.groupname
              };
      }
      if(this.state.devicefield !== '' && this.state.searchtxtfordevice !== ''){
        query.querydevice[this.state.devicefield] = this.state.searchtxtfordevice;
      }
      if(this.state.alarmfield !== '' && this.state.searchtxtforalarm !== ''){
        query.queryalarm[this.state.alarmfield] = this.state.searchtxtforalarm;
      }
      console.log(`query:${JSON.stringify(query)}`);
      if(!!this.props.onClickQuery){
        this.props.onClickQuery({query});
      }
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

        let hintTextAlarm = '';
        let ishiddenalarm = false;
        if(this.state.alarmfield === ''){
          ishiddenalarm = true;
        }
        else if(this.state.alarmfield === 'ALARM_H'){
          hintTextAlarm = '警告代码';
        }
        else if(this.state.alarmfield === 'ALARM_L'){
          hintTextAlarm = '故障代码';
        }


        const {groups,groupidlist} = this.props;


        return (
            <div className="warningPage">
                <div className="searchli">
                    <div>
                        <SelectField
                            onChange={this.handleChangeGroupname}
                            style={{minWidth:"100px", width: "33%"}}
                            value = {this.state.groupname}
                            >
                            <MenuItem key={'-1'} value={''} primaryText="选择分组名称" />
                            {
                              _.map(groupidlist,(groupid)=>{
                                let group= groups[groupid];
                                return (<MenuItem key={groupid} value={groupid} primaryText={group.name} />)
                              })
                            }
                        </SelectField>
                    </div>
                    <div>
                        <SelectField
                            onChange={this.handleChangeDevicefield}
                            style={{minWidth:"100px", width: "33%"}}
                            value = {this.state.devicefield}
                            >
                              {
                                _.map(selitem_devicefields,(field,key)=>{
                                  return (<MenuItem key={key} value={field.value} primaryText={field.text} />)
                                })
                              }
                        </SelectField>
                        {
                          !ishiddenbattery &&
                          (<TextField
                              onChange={this.handleChangeSearchtxtfordevice.bind(this)}
                              value={this.state.searchtxtfordevice}
                              hintText={hintTextBattery}
                              style ={{width : "30%", marginTop: "-10px", minWidth:"100px"}}
                          />)
                        }

                    </div>
                    <div>
                        <SelectField
                            onChange={this.handleChangeAlarmfiled}
                            style={{minWidth:"100px", width: "33%"}}
                            value = {this.state.alarmfield}
                            >
                              {
                                _.map(selitem_alarmfields,(field,key)=>{
                                  return (<MenuItem key={key} value={field.value} primaryText={field.text} />)
                                })
                              }
                        </SelectField>
                        {
                          !ishiddenalarm &&
                          <TextField
                              onChange={this.handleChangeSearchtxtforalaram.bind(this)}
                              value={this.state.searchtxtforalarm}
                              hintText={hintTextAlarm}
                              style ={{width : "30%", marginTop: "-10px", minWidth:"100px"}}
                          />
                        }

                    </div>
                </div>
                <div className="searchbtn">
                  <RaisedButton label="查询" primary={true} fullWidth={true} onTouchTap={this.onClickQuery} buttonStyle={{background:"#2085b5"}}/>
                </div>
            </div>

        );
    }
}

const mapStateToProps = ({device:{groups,groupidlist}}) => {
  return {groups,groupidlist};
}
export default connect(mapStateToProps)(TreeSearchBattery);
