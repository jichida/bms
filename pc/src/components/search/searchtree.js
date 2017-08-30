/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import _ from 'lodash';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import { Input, Col, Select, InputNumber, DatePicker, AutoComplete, Cascader, Button } from 'antd';

const InputGroup = Input.Group;
const Option = Select.Option;
const selitem_devicefields = [
  {
    value:'RdbNo',
    text:'RDB编号'
  },
  {
    value:'PackNo',
    text:'BMU PACK号'
  },
  {
    value:'PnNo',
    text:'设备PN料号'
  },
];
const selitem_alarmfields = [
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

        this.setState({devicefield: selitem_devicefields[key].value});
    }
    handleChangeAlarmfiled = (e,key)=>{

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
            <div className="searchtree" style={{textAlign: "center"}}>
                    <Select defaultValue={this.state.groupname} style={{ width: 370 }}>
                        <Option value={''} >选择分组名称</Option>
                        {
                            _.map(groupidlist,(groupid)=>{
                                let group= groups[groupid];
                                return (<Option key={groupid} value={groupid} primaryText={group.name}>{group.name}</Option>)
                            })
                        }
                    </Select>

                    <InputGroup compact>
                        <Select defaultValue="选择编号类型" style={{ width: 120 }}>
                            {
                                _.map(selitem_devicefields,(field,key)=>{
                                    return (<Option key={key} value={field.value}>{field.text}</Option>)
                                })
                            }
                        </Select>
                        <AutoComplete
                            style={{ width: 250 }}
                            onChange={this.handleChangeSearchtxtforalaram.bind(this)}
                            placeholder="请输入编号"
                        />
                    </InputGroup>

                    <InputGroup compact>
                        <Select defaultValue="选择代码类型" style={{ width: 120 }}>
                            {
                                _.map(selitem_alarmfields,(field,key)=>{
                                  return (<Option key={key} value={field.value}>{field.text}</Option>)
                                })
                            }
                        </Select>
                        <AutoComplete
                            style={{ width: 250 }}
                            placeholder="请输入代码"
                            onChange={this.handleChangeSearchtxtforalaram.bind(this)}
                        />
                    </InputGroup>


                    <Select defaultValue={"选择警告级别"} style={{ width: 370 }}>
                        <Option value="0" >严重告警</Option>
                        <Option value="1" >紧急告警</Option>
                        <Option value="2" >一般告警</Option>
                    </Select>

                    <Select defaultValue={"是否在线"} style={{ width: 370 }}>
                        <Option value="0" >全部</Option>
                        <Option value="1" >在线</Option>
                        <Option value="2" >离线</Option>
                    </Select>

                    <Button type="primary" icon="search" onClick={this.onClickQuery} style={{width: "370px"}}>查询</Button>
            </div>

        );
    }
}
const mapStateToProps = ({device:{groups,groupidlist}}) => {
    return {groups,groupidlist};
}
export default connect(mapStateToProps)(TreeSearchBattery);
