/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';

// import Seltime from './seltimerange_antd.js';
import { Select,Button,DatePicker,Input } from 'antd';
import SelectDevice from '../historytrackplayback/selectdevice.js';
import get from 'lodash.get';
import map from 'lodash.map';

import moment from 'moment';



const Option = Select.Option;

class TreeSearchBattery extends React.Component {
    constructor(props) {
        super(props);

        let warninglevel = "-1";
        if(!!props.query.warninglevel){
          if(props.query.warninglevel === '高'){
            warninglevel = '0';
          }
          else if(props.query.warninglevel === '中'){
            warninglevel = '1';
          }
          else if(props.query.warninglevel === '低'){
            warninglevel = '2';
          }
        }
        let CurDay = moment(moment().format('YYYY-MM-DD'));
        if(!!props.query.CurDay){
          CurDay = moment(props.query.CurDay);
        }
        let DeviceId = get(props.query,'DeviceId','');
        this.state = {
            alarmlevel: warninglevel,
            errorcode:'',
            CurDay,
            DeviceId
        };
    }

    onChangeErrorCode (value) {
      this.setState({
        errorcode:value
      });
   }

    onSelDeviceid(DeviceId){
        this.setState({
            DeviceId
        });
    }
    onChangeSelDate(CurDay){
      this.setState({
        CurDay
      });
    }

    onChange_alarmlevel(alarmlevel){
      this.setState({alarmlevel});
    }

    onClickExport=()=>{
      if(!!this.props.onClickExport){
        this.props.onClickExport(this.getQueryObj());
      }
    }
    getQueryObj = ()=>{
      let query = {};
      query['CurDay'] = this.state.CurDay.format('YYYY-MM-DD');
      if(this.state.alarmlevel === '0'){
        query['warninglevel'] = '高';
      }
      else if(this.state.alarmlevel === '1'){
        query['warninglevel'] = '中';
      }
      else if(this.state.alarmlevel === '2'){
        query['warninglevel'] = '低';
      }
      else{
        query['warninglevel'] = {$in:['高','中','低']};
      }
      if(this.state.DeviceId !== ''){
        query['DeviceId'] = this.state.DeviceId;
      }
      if(this.state.errorcode !== ''){
        query['TROUBLE_CODE_LIST'] = parseInt(this.state.errorcode,10);
      }
      return query;
    }

    onClickQuery=()=>{
      if(!!this.props.onClickQuery){
        this.props.onClickQuery(this.getQueryObj());
      }
    }

    render(){
      const {g_devicesdb} = this.props;

      let deviceidlist = [];
      map(g_devicesdb,(item)=>{
          deviceidlist.push(item.DeviceId);
      });

        return (
            <div className="searchreport" style={{textAlign: "center"}}>
                <div className="i">
                    <DatePicker className="mydatapicker" value={this.state.CurDay} onChange={this.onChangeSelDate.bind(this)} style={{height: "40px", marginBottom: "0", paddingBottom: "0"}}/>
                    <Select className="Selectalarmlevel" defaultValue={this.state.alarmlevel} onChange={this.onChange_alarmlevel.bind(this)}>
                        <Option value={"-1"}>选择报警等级</Option>
                        <Option value={"0"} >三级</Option>
                        <Option value={"1"} >二级</Option>
                        <Option value={"2"} >一级</Option>
                    </Select>
                    <div className="selcar setsearchid">
                      <span className="t">车辆ID：</span>
                      <SelectDevice
                        placeholder={"请输入设备ID或PACK号"}
                        initdeviceid={this.state.DeviceId|| this.props.DeviceId}
                        onSelDeviceid={this.onSelDeviceid.bind(this)}
                        deviceidlist={deviceidlist}
                      />
                    </div>
                    <div>
                      <Input placeholder="输入故障码" size='large' value={this.state.errorcode} onChange={
                        (e)=>{this.onChangeErrorCode(e.target.value)}
                      }/>
                    </div>
                </div>
                <div className="b">
                    <Button type="primary" icon="search" onClick={this.onClickQuery}>查询</Button>
                    <Button icon="download" onClick={this.onClickExport}>导出结果</Button>
                </div>
            </div>

        );
    }
}
const mapStateToProps = ({device:{g_devicesdb}}) => {
  return {g_devicesdb};
}
export default connect(mapStateToProps)(TreeSearchBattery);
