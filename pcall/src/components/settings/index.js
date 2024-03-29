/**
 * Created by jiaowenhui on 2017/7/28.
    设置
 */
import React from 'react';
import {connect} from 'react-redux';
// import map from 'lodash.map';
import "../../css/message.css";
import  Select  from "antd/lib/select";
import {savealarmsettings_request} from '../../actions';
import ReactSelect from "../controls/reactselect";
const Option = Select.Option;


let resizetimecontent = null;

class Setting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            innerHeight: window.innerHeight,
            warninglevel : props.warninglevel,
            devicelist : props.subscriberdeviceids
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
            warninglevel: v
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

    clickSend = ()=>{
      const payload = {
        warninglevel : this.state.warninglevel,
        subscriberdeviceids:this.state.devicelist
      };
      this.props.dispatch(savealarmsettings_request(payload))
    }

    render(){

        // const { subscriberdeviceids } = this.props;

        return (
            <div className="settingPage" style={{height : this.state.innerHeight+"px"}}>

                <div className="appbar">

                    <div className="title" style={{color: "#FFF", flexGrow:"1"}}>系统设置</div>
                    <i className="fa fa-times-circle-o back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>

                </div>

                <div className="settingform">
                    <div className="title">消息提示设置</div>
                    <div className="formlist">
                        <div>
                            <div className="p">选择报警等级</div>
                            <div className="p">
                                <Select
                                    value={this.state.warninglevel}
                                    style={{ width: 120 }}
                                    onChange={this.handleChange_warninglev}
                                    >
                                    <Option value={""}>请选择</Option>
                                    <Option value={"高"}>三级</Option>
                                    <Option value={"中"}>二级</Option>
                                    <Option value={"低"}>一级</Option>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <div className="p">选择报警车辆</div>
                            <div className="p">
                                <ReactSelect
                                  onChange={this.handleChange_devicelist}
                                  value={this.state.devicelist}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="button" onClick={()=>{this.clickSend();}}><a className="btnclick">确定</a></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({userlogin:{ alarmsettings }}) => {
    // console.log(g_devicesdb);
    // g_devicesdb.length = 10;
    return { ...alarmsettings };
}
export default connect(mapStateToProps)(Setting);
