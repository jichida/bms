/**
 * Created by jiaowenhui on 2017/7/28.
    设置
 */
import React from 'react';
import {connect} from 'react-redux';
import map from 'lodash.map';
import "../css/message.css";
import AntdTable from "./controls/antdtable.js";
// import {bridge_alarminfo} from '../../sagas/datapiple/bridgedb';
import moment from 'moment';
import TreeSearchreport from './search/searchreport_alarm';
import {download_excel} from '../actions';
import { Select } from "antd";
import ReactSelect from "./controls/reactselect";
const Option = Select.Option;

let resizetimecontent = null;

class Setting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            innerHeight: window.innerHeight,
            warninglev : 0,
            devicelist : []
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    handleChange_warninglev=(v)=>{
        console.log(v);
        this.setState({
            warninglev: v
        })
    }

    handleChange_devicelist=(v)=>{
        console.log(v);
        this.setState({
            devicelist: v
        })
    }

    onWindowResize=()=> {
        window.clearTimeout(resizetimecontent);
        resizetimecontent = window.setTimeout(()=>{
            this.setState({
                innerHeight: window.innerHeight,
            });
        },10)
    }

    render(){
        
        const { g_devicesdb } = this.props;

        return (
            <div className="settingPage" style={{height : this.state.innerHeight+"px"}}>

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>
                    <div className="title" style={{color: "#FFF"}}>报警信息统计</div>
                </div>

                <div className="settingform">
                    <div className="title">消息提示设置</div>
                    <div className="formlist">
                        <div>
                            <div className="p">选择报警等级</div>
                            <div className="p">
                                <Select 
                                    defaultValue={"高"} 
                                    style={{ width: 120 }} 
                                    onChange={this.handleChange_warninglev}
                                    >
                                    <Option value={"高"}>高</Option>
                                    <Option value={"中"}>中</Option>
                                    <Option value={"低"}>低</Option>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <div className="p">选择报警车辆</div>
                            <div className="p">
                                <Select
                                    mode="multiple"
                                    size={'default'}
                                    placeholder="选择报警车辆ID"
                                    onChange={this.handleChange_devicelist}
                                    style={{ width: 200 }}
                                >
                                    {
                                        map(g_devicesdb, (v, k)=>{
                                            return (<Option key={k}>{k}</Option>);
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>
                    <div className="button"><a className="btnclick">确定</a></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({device:{ g_devicesdb }}) => {
    // console.log(g_devicesdb);
    g_devicesdb.length = 10;
    return { g_devicesdb };
}
export default connect(mapStateToProps)(Setting);
