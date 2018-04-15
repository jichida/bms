/**
 * Created by jiaowenhui on 2017/7/28.
    设置
 */
import React from 'react';
import {connect} from 'react-redux';
// import map from 'lodash.map';
import "../../css/message.css";
// import  Select  from "antd/lib/select";
import {savealarmsettings_request} from '../../actions';
import ReactSelect from "../controls/reactselect";

import lodashmap from 'lodash.map';

// const Option = Select.Option;
let resizetimecontent = null;

class Setting extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            innerHeight: window.innerHeight,
            warninglevels : props.alarmsettings.warninglevels,
            devicegroups : props.alarmsettings.devicegroups
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
            warninglevels: v
        })
    }

    handleChange_devicelist=(v)=>{
        console.log(v);
        this.setState({
            devicegroups: v
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
        warninglevels : this.state.warninglevels,
        devicegroups:this.state.devicegroups
      };
      this.props.dispatch(savealarmsettings_request(payload))
    }

    render(){

        // const { subscriberdeviceids } = this.props;
        const {groups} = this.props;
        let options = [];
        lodashmap(groups,(v)=>{
          options.push({
            value:v._id,
            label:v.name,
          });
        });

        let options_warninglevels = [];
        options_warninglevels.push({value:'高',label:'三级'});
        options_warninglevels.push({value:'中',label:'二级'});
        options_warninglevels.push({value:'低',label:'一级'});
        console.log(groups)
        return (
            <div className="settingPage AppPage"
                style={{height:`${this.state.innerHeight}px`,overflow:"hidden",paddingBottom:"0"}}
                >
                <div className="navhead">
                    <div className="back" onClick={()=>{this.props.history.goBack()}}></div>
                    <span className="title" style={{paddingRight : "30px"}}>报警信息推送设置</span>
                </div>

                <div className="settingform">
                    <div className="formlist">
                        <div>
                            <div className="p">选择报警等级</div>
                            <div className="p">
                              <ReactSelect
                                onChange={this.handleChange_warninglev}
                                value={this.state.warninglevels}
                                options={options_warninglevels}
                              />
                            </div>
                        </div>
                        <div className="selectform">
                            <div className="p">选择报警车辆</div>
                            <div className="p s">
                                <ReactSelect
                                  onChange={this.handleChange_devicelist}
                                  value={this.state.devicegroups}
                                  options={options}
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

const mapStateToProps = ({userlogin:{ alarmsettings },device:{ groups }}) => {
    // console.log(g_devicesdb);
    // g_devicesdb.length = 10;
    return { alarmsettings,groups };
}
export default connect(mapStateToProps)(Setting);
