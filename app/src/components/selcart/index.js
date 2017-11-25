/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './style.css';
import Datalist from "./datalist";
import Fillerimg from '../../img/25.png';
import { Field, reduxForm, Form, formValueSelector  } from 'redux-form';
import { required,phone,InputValidation,length4,SelectValidation,InputHiddenValidation,ToggleInput } from "../tools/formvalidation-material-ui"
import {searchbattery_request,searchbattery_result} from '../../actions';
import SelectDevice from './selectdevice.js';
import map from 'lodash.map';
//编号类型数据
const selitem_devicefields = [
  {
    value:'RdbNo',
    name:'RDB编号'
  },
  {
    value:'PackNo',
    name:'BMU PACK号'
  },
  {
    value:'PnNo',
    name:'车辆PN料号'
  },
];
const selitem_alarmfields = [
  {
    value:'ALARM_H',
    name:'警告代码'
  },
  {
    value:'ALARM_L',
    name:'故障代码'
  },
];

//告警等级
let warningtype = 0;

class Fillerform extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            warningtypes : warningtype
        }
    }
    render(){
        const { handleSubmit,onsubmit,pristine,submitting,reset } = this.props;
        return (
            <Form
                className="fillerform"
                onSubmit={handleSubmit(onsubmit)}
                >
                <div className="li" >

                    <Field
                        name="notype"
                        id="notype"
                        Option={ selitem_devicefields }
                        component={ SelectValidation }
                        validate={[ required ]}
                    />
                    <Field
                        name="notypevalue"
                        id="notypevalue"
                        placeholder="请输入编号"
                        type="text"
                        component={ InputValidation }
                        validate={[ required ]}
                    />
                </div>

                <div className="li">
                    <Field
                        name="alarmtype"
                        id="alarmtype"
                        Option={ selitem_alarmfields }
                        component={ SelectValidation }
                        validate={[ required ]}
                    />
                    <Field
                        name="alarmtypevalue"
                        id="alarmtypevalue"
                        placeholder="请输入代码"
                        type="text"
                        component={ InputValidation }
                        validate={[ required ]}
                    />
                </div>

                <div className="li warninglist">
                    <div className="t">告警级别</div>
                    <div className="l">
                        <span className={this.state.warningtypes===1?"sel":""} onClick={()=>{this.setState({warningtypes: 1});warningtype=1}}>一般告警</span>
                        <span className={this.state.warningtypes===2?"sel":""} onClick={()=>{this.setState({warningtypes: 2});warningtype=2}}>紧急告警</span>
                        <span className={this.state.warningtypes===3?"sel":""} onClick={()=>{this.setState({warningtypes: 3});warningtype=3}}>严重告警</span>
                    </div>
                </div>

                <div className="li">
                    <Field
                        name="online"
                        id="online"
                        label="是否在线"
                        component={ ToggleInput }
                        style={{height: "40px",paddingRight: "15px"}}
                        labelStyle={{lineHeight:"40px",marginLeft: "23px",fontSize: "14px"}}
                        rippleStyle={{marginTop: "10px"}}
                    />
                </div>

                <div className="submitbtn">
                    <span
                        className="btn Default"
                        disabled={pristine || submitting}
                        onClick={()=>{reset();this.setState({warningtypes: 0});warningtype=0;}}
                        >
                        重置表单
                    </span>
                    <span
                        className="btn Default"
                        disabled={pristine || submitting}
                        onClick={handleSubmit(onsubmit)}
                        >
                        确定
                    </span>
                </div>

            </Form>

        )
    }
}

Fillerform = reduxForm({
    form: 'FillerForm',
    initialValues:{
        notype: "RdbNo",
        alarmtype: "ALARM_H",
        online: false
    }
})(Fillerform);

const inputconnect = formValueSelector('FillerForm');
Fillerform = connect(
    state => {
        const notype = inputconnect(state, 'notype');
        return {
            notype
        }
    }
)(Fillerform)


class Page extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fillerisOpen: false,
        };
    }

    fillersubmit =(values)=>{
        console.log(values);
        this.setState({fillerisOpen:false});
        this.props.dispatch(searchbattery_request(values));
    }
    onBack = ()=>{
      const deviceid =  this.props.match.params.deviceid;
      const prevuri = this.props.match.params.prevuri;
      this.props.history.replace(`/${prevuri}/${deviceid}`);
      this.props.dispatch(searchbattery_result({list:[]}));
    }

    onClickSel(seldeviceid){
      const prevuri = this.props.match.params.prevuri;
      this.props.history.replace(`/${prevuri}/${seldeviceid}`);
      this.props.dispatch(searchbattery_result({list:[]}));
    }

    render() {
        const {mapseldeviceid,devices, g_devicesdb} = this.props;
        let DeviceId;
        const formstyle={width:"100%",flexGrow:"1"};
        const textFieldStyle={width:"100%",flexGrow:"1"};

        let deviceidlist = [];
        map(g_devicesdb,(item)=>{
            deviceidlist.push(item.DeviceId);
        });

        return (
            <div className="selcartPage AppPage"
                style={{height : `${window.innerHeight}px`,overflow: "hidden",paddingBottom:"0"}}
                >
                <div className="navhead">
                    <a className="back" onClick={()=>{this.onBack();}}></a>
                    <span className="title" style={{paddingRight : "30px"}}>选择汽车</span>
                    <div className="filler" onClick={()=>{this.setState({fillerisOpen : !this.state.fillerisOpen})}}  style={{display:"none"}}><img src={Fillerimg} /></div>
                </div>
                <SelectDevice deviceidlist={deviceidlist} />
                { this.state.fillerisOpen &&
                    <div className="selcartfiller" style={{display:"none"}}>
                        <Fillerform onsubmit={this.fillersubmit} />
                        <div className="bg" onClick={()=>{this.setState({fillerisOpen : !this.state.fillerisOpen})}}></div>
                    </div>
                }

                <div className="list"  style={{display:"none"}}>
                    <Datalist tableheight={window.innerHeight-55} onClickSel={this.onClickSel.bind(this)}/>
                </div>
            </div>
        );
    }
}


const mapStateToProps = ({device:{g_devicesdb}}) => {
  return {g_devicesdb};
}
export default connect(mapStateToProps)(Page);
