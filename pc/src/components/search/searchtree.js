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
import TreeSelectBygroup from "../trees/treeselect_bygroup.js";
import TreeselectByloc from "../trees/treeselect_byloc.js";
import moment from 'moment';

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
    text:'车辆PN料号'
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
          notype:  '',
          notypevalue : '',
          alarmtype : '',
          alarmtypevalue:'',
          alarmlevel:'-1',
          groupid:'0',
          adcode:10000,
          onlinestatus:'all'
        };
    }
    onSelTreeNode_Group(groupid){
      this.setState({groupid});
    }
    onSelTreeNode_Loc(adcode){
      this.setState({adcode});
    }
    onChange_onlinestatus(onlinestatus){
        this.setState({onlinestatus});
    }
    onChange_alarmlevel(alarmlevel){
      this.setState({alarmlevel});
    }
    onChange_notype(notype){
      this.setState({notype});
    }
    onChange_alarmtype(alarmtype){
      this.setState({alarmtype});
    }
    handleChange_notypevalue(notypevalue){
        this.setState({notypevalue});
    }
    handleChange_alarmtypevalue(alarmtypevalue){
        this.setState({alarmtypevalue});
    }

    onClickQuery=()=>{
      let query = {
        querydevice:{},
        queryalarm:{}
      };

      if(this.state.groupid !== '0'){
        query['groupid'] = this.state.groupid;
      }
      if(this.state.adcode !== 10000){
        query['adcode'] = this.state.adcode;
      }
      if(this.state.notype!== '' && this.state.notypevalue!=''){
        query.querydevice[this.state.notype] = this.state.notypevalue;
      }
      if(this.state.alarmtype!== '' && this.state.alarmtypevalue!=''){
        query.querydevice[this.state.alarmtype] = this.state.alarmtypevalue;
      }

      if(this.state.alarmlevel !== '-1'){
        query.queryalarm['warninglevel'] = parseInt(this.state.alarmlevel);
      }

      if(this.state.onlinestatus !== 'all'){
        query.querydevice['onlinestatus'] = this.state.onlinestatus;
      }
      console.log(`【searchreport】查询条件:${JSON.stringify(query)}`);
      if(!!this.props.onClickQuery){
        this.props.onClickQuery({query});
      }
    }
    render(){
        return (
            <div className="searchtree" style={{textAlign: "center"}}>
                    <br/>
                    <TreeSelectBygroup placeholder={"请选择分组"} width={370} onSelTreeNode={this.onSelTreeNode_Group.bind(this)}/>
                    <TreeselectByloc placeholder={"请选择地区"} width={370} onSelTreeNode={this.onSelTreeNode_Loc.bind(this)}/>

                    <InputGroup compact>
                        <Select defaultValue="选择编号类型" style={{ width: 120 }} onChange={this.onChange_notype.bind(this)}>
                            {
                                _.map(selitem_devicefields,(field,key)=>{
                                    return (<Option key={key} value={field.value}>{field.text}</Option>)
                                })
                            }
                        </Select>
                        <AutoComplete
                            style={{ width: 250 }}
                            onChange={this.handleChange_notypevalue.bind(this)}
                            placeholder="请输入编号"
                        />
                    </InputGroup>

                    <InputGroup compact>
                        <Select defaultValue="选择代码类型" style={{ width: 120 }}  onChange={this.onChange_alarmtype.bind(this)}>
                            {
                                _.map(selitem_alarmfields,(field,key)=>{
                                  return (<Option key={key} value={field.value}>{field.text}</Option>)
                                })
                            }
                        </Select>
                        <AutoComplete
                            style={{ width: 250 }}
                            placeholder="请输入代码"
                            onChange={this.handleChange_alarmtypevalue.bind(this)}
                        />
                    </InputGroup>

                    <Select defaultValue={'-1'}  style={{ width: 370 }} onChange={this.onChange_alarmlevel.bind(this)}>
                        <Option value={'-1'} >选择警告级别</Option>
                        <Option value={'0'} >严重告警</Option>
                        <Option value={'1'} >紧急告警</Option>
                        <Option value={'2'} >一般告警</Option>
                    </Select>

                    <Select defaultValue={"是否在线"} style={{ width: 370 }}  onChange={this.onChange_onlinestatus.bind(this)}>
                        <Option value="all" >全部</Option>
                        <Option value="online" >在线</Option>
                        <Option value="offline" >离线</Option>
                    </Select>

                    <Button type="primary" icon="search"  onClick={this.onClickQuery} style={{width: "370px"}}>查询</Button>
            </div>

        );
    }
}

export default connect()(TreeSearchBattery);
