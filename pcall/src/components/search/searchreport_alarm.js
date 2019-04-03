/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';

import {getalarmfieldallfields} from '../../sagas/datapiple/bridgedb';
import MultiSelect from 'react-select';
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
            DeviceId,
            selectedvalue: [],
            columndata_extra:[]
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

    onSelectChange (value) {
      let sz = value.split(',');
      ////console.log(`${JSON.stringify(sz)}`);
      this.setState({ selectedvalue:sz });
      this.setListColumnFields(sz);
   }

   setListColumnFields =(values)=>{
     const {mapdict} = this.props;
     let columndata_extra = [];
     map(values,(fname,i)=>{
       if(!!mapdict[fname]){
         columndata_extra.push({
           key:fname,
           title:mapdict[fname].showname || fname,
           dataIndex:i
         });
       }
       else{
         ////console.log(values);
       }

     });
     this.setState({columndata_extra});
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
      let query1 = {};
      query1['CurDay'] = this.state.CurDay.format('YYYY-MM-DD');
      if(this.state.alarmlevel === '0'){
        query1['warninglevel'] = '高';
      }
      else if(this.state.alarmlevel === '1'){
        query1['warninglevel'] = '中';
      }
      else if(this.state.alarmlevel === '2'){
        query1['warninglevel'] = '低';
      }
      else{
        query1['warninglevel'] = {$in:['高','中','低']};
      }
      if(this.state.DeviceId !== ''){
        query1['DeviceId'] = this.state.DeviceId;
      }
      if(this.state.errorcode !== ''){
        query1['TROUBLE_CODE_LIST'] = {
          $elemMatch:{
            $eq:parseInt(this.state.errorcode,10)
          }
        }
      }

      //新建timekey
      // const timekeysz = gettimekey(this.state.startDate.format('YYYY-MM-DD HH:mm:ss'),this.state.endDate.format('YYYY-MM-DD HH:mm:ss'));
      // if(timekeysz.length === 1){
      //   query1['TimeKey'] = timekeysz[0];
      // }
      // else if(timekeysz.length > 1){
      //   query1['TimeKey'] = { $in:timekeysz};
      // }
      //====
      let query = {};
      if(this.state.columndata_extra.length > 0){
        let query2 = {
          '$or':[]
        };
        map(this.state.columndata_extra,(v)=>{
          let queryfield = {};
          queryfield[v.key] = {$exists:true};
          query2[`$or`].push(queryfield);
        });

        query[`$and`] = [
          query1,
          query2
        ]
      }
      else{
        query = query1;
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
                      <Input placeholder="输入故障码" size='large' value={this.state.errorcode} type="number"
                        onChange={
                        (e)=>{this.onChangeErrorCode(e.target.value)}
                      }/>
                    </div>
                    <MultiSelect
                        closeOnSelect={true}
                        multi
                        onChange={this.onSelectChange.bind(this)}
                        options={getalarmfieldallfields(this.props.mapdict)}
                        placeholder="选择报警字段"
                        simpleValue
                        value={this.state.selectedvalue}
                      />

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
