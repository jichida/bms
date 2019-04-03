/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {getalarmfieldallfields} from '../../sagas/datapiple/bridgedb';
// import Seltime from './seltimerange_antd.js';
import { Select,  Button } from 'antd';
import MultiSelect from 'react-select';
import { Input } from 'antd';
import SelectDevice from '../historytrackplayback/selectdevice.js';
import get from 'lodash.get';
import map from 'lodash.map';

import moment from 'moment';


const Option = Select.Option;

class SearchMessage extends React.Component {
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
        let startDate = moment(moment().format('YYYY-MM-DD 00:00:00'));
        let endDate = moment(moment().format('YYYY-MM-DD 23:59:59'));
        if(!!props.query.DataTime){
          startDate = moment(props.query.DataTime['$gte']);
          endDate = moment(props.query.DataTime['$lte']);
        }
        let DeviceId = get(props.query,'DeviceId','');

        this.state = {
            alarmlevel: warninglevel,
            errorcode:'',
            startDate,
            endDate,
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
    onChangeSelDate(startDate,endDate){
      this.setState({
        startDate,
        endDate
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
    onChange_alarmlevel(alarmlevel){
      this.setState({alarmlevel});
    }

    onClickExport=()=>{
      if(!!this.props.onClickExport){
        this.props.onClickExport();
      }
    }

    getQueryObj = ()=>{
      let query = {};
      query['DataTime'] = {
        $gte: this.state.startDate.format('YYYY-MM-DD HH:mm:ss'),
        $lte: this.state.endDate.format('YYYY-MM-DD HH:mm:ss'),
      };
      if(this.state.DeviceId !== ''){
        query['DeviceId'] = this.state.DeviceId;
      }
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

      if(this.state.errorcode !== ''){
        query['errorcode'] = this.state.errorcode;
      }
      if(this.state.columndata_extra.length > 0){
        query[`columndata_extra`] = this.state.columndata_extra;
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
                    <Select className="Selectalarmlevel" defaultValue={this.state.alarmlevel} onChange={this.onChange_alarmlevel.bind(this)}>
                        <Option value={"-1"}>选择报警等级</Option>
                        <Option value={"0"} >三级</Option>
                        <Option value={"1"} >二级</Option>
                        <Option value={"2"} >一级</Option>
                    </Select>

                    <div className="selcar">
                      <span className="t">车辆ID：</span>
                      <SelectDevice
                        placeholder={"请输入设备ID或PACK号"}
                        initdeviceid={this.state.DeviceId}
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
                    <Button icon="download" onClick={this.onClickExport} style={{display:"none"}}>导出结果</Button>
                </div>
            </div>

        );
    }
}
const mapStateToProps = ({device:{g_devicesdb}}) => {
  return {g_devicesdb};
}
export default connect(mapStateToProps)(SearchMessage);
