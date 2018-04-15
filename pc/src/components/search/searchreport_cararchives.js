/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';

import { Input } from 'antd';
import { Button } from 'antd';
import SelectDevice from '../historytrackplayback/selectdevice.js';
import get from 'lodash.get';
import map from 'lodash.map';

// import moment from 'moment';



class TreeSearchBattery extends React.Component {
    constructor(props) {
        super(props);

        let DeviceId = get(props.query,'DeviceId','');
        this.state = {
            DeviceId,
            ExtProject:'',
            ExtArea:'',
            ExtNo:''
        };
    }

    onSelDeviceid(DeviceId){
        this.setState({
            DeviceId
        });
    }
    onChange_ExtProject =(e)=>{
      this.setState({
          ExtProject:e.target.value
      });
    }
    onChange_ExtArea =(e)=>{
      this.setState({
          ExtArea:e.target.value
      });
    }
    onChange_ExtNo =(e)=>{
      this.setState({
          ExtNo:e.target.value
      });
    }

    onClickExport=()=>{
      if(!!this.props.onClickExport){
        this.props.onClickExport(this.getQueryObj());
      }
    }
    getQueryObj = ()=>{
      let query = {};
      if(this.state.DeviceId !== ''){
        query['DeviceId'] = this.state.DeviceId;
      }
      if(this.state.ExtProject !== ''){
        if(!query.Ext){
          query.Ext = {};
        }
        query['Ext']['项目'] = this.state.ExtProject;
      }
      if(this.state.ExtArea !== ''){
        if(!query.Ext){
          query.Ext = {};
        }
        query['Ext']['地区'] = this.state.ExtArea;
      }
      if(this.state.ExtNo !== ''){
        if(!query.Ext){
          query.Ext = {};
        }
        query['Ext']['车工号'] = this.state.ExtNo;
      }
      console.log(query);
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
            <div className="searchreport_cararchives" style={{textAlign: "center"}}>
            <div className="f">
              <Input placeholder="项目" onChange={this.onChange_ExtProject} value={this.state.ExtProject}/>
              <Input placeholder="地区" onChange={this.onChange_ExtArea} value={this.state.ExtArea}/>
              <Input placeholder="车工号" onChange={this.onChange_ExtNo} value={this.state.ExtNo}/>
              <div className="i">
                     <div className="selcar setsearchid">
                       <span className="t">车辆ID：</span>
                       <SelectDevice
                         placeholder={"请输入设备ID或PACK号"}
                         initdeviceid={this.state.DeviceId}
                         onSelDeviceid={this.onSelDeviceid.bind(this)}
                         deviceidlist={deviceidlist}
                       />
                     </div>
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
