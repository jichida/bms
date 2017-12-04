/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';
import Seltime from './seltime.js';
import { Input,Select, AutoComplete,Button } from 'antd';

import moment from 'moment';
moment.locale('zh-cn');

const InputGroup = Input.Group;
const Option = Select.Option;

class TreeSearchBattery extends React.Component {
    constructor(props) {
        super(props);
        let warninglevel = props.warninglevel || "-1";
        this.state = {
            alarmlevel: warninglevel,
            startDate:moment(moment().format('YYYY-MM-DD 00:00:00')),
            endDate:moment(moment().format('YYYY-MM-DD 23:59:59')),
          };
    }

    onChangeSelDate(startDate,endDate){
      this.setState({
        startDate,
        endDate
      });
    }

    onChange_alarmlevel(alarmlevel){
      this.setState({alarmlevel});
    }

    onClickExport=()=>{
      if(!!this.props.onClickExport){
        this.props.onClickExport();
      }
    }
    onClickQuery=()=>{
      let query = {
        querydevice:{},
        queryalarm:{}
      };


      query.queryalarm['startDate'] = this.state.startDate.format('YYYY-MM-DD HH:mm:ss');
      query.queryalarm['endDate'] = this.state.endDate.format('YYYY-MM-DD HH:mm:ss');
      if(this.state.alarmlevel !== '-1'){
        query.queryalarm['warninglevel'] = parseInt(this.state.alarmlevel);
      }

      console.log(`【searchreport】查询条件:${JSON.stringify(query)}`);
      if(!!this.props.onClickQuery){
        this.props.onClickQuery({query});
      }
    }
    render(){
        return (
            <div className="searchreport" style={{textAlign: "center"}}>
                <div className="i">

                    <Seltime  startDate = {this.state.startDate}
                      endDate = {this.state.endDate}
                     onChangeSelDate={this.onChangeSelDate.bind(this)}/>

                    <Select defaultValue={this.state.alarmlevel} onChange={this.onChange_alarmlevel.bind(this)}>
                        <Option value={"-1"}>选择警告级别</Option>
                        <Option value={"0"} >严重报警</Option>
                        <Option value={"1"} >紧急报警</Option>
                        <Option value={"2"} >一般报警</Option>
                    </Select>
                </div>
                <div className="b">
                    <Button type="primary" icon="search" onClick={this.onClickQuery}>查询</Button>
                    <Button icon="download" onClick={this.onClickExport}>导出结果</Button>
                </div>
            </div>

        );
    }
}

export default connect()(TreeSearchBattery);