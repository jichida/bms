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


//编号类型数据
const bianhaolistdata = [{"name":"编号类型1", "value":"B1"},{"name":"编号类型2", "value":"B2"},{"name":"编号类型3", "value":"B3"}];
const daimalistdata = [{"name":"代码类型1", "value":"D1"},{"name":"代码类型2", "value":"D2"},{"name":"代码类型3", "value":"D3"}];
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
                        name="bianhaotype"
                        id="bianhaotype"
                        Option={ bianhaolistdata }
                        component={ SelectValidation }
                        validate={[ required ]}
                    />
                    <Field
                        name="bianhao"
                        id="bianhao"
                        placeholder="请输入编号"
                        type="text"
                        component={ InputValidation }
                        validate={[ required ]}
                    />
                </div>

                <div className="li">
                    <Field
                        name="daimatype"
                        id="daimatype"
                        Option={ daimalistdata }
                        component={ SelectValidation }
                        validate={[ required ]}
                    />
                    <Field
                        name="daima"
                        id="daima"
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
        bianhaotype: "B1",
        daimatype: "D1",
        online: false
    }
})(Fillerform);

const inputconnect = formValueSelector('LoginPageForm');
Fillerform = connect(
    state => {
        const bianhaotype = inputconnect(state, 'bianhaotype');
        return {
            bianhaotype
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
    }
    onBack = ()=>{
      const deviceid =  this.props.match.params.deviceid;
      const prevuri = this.props.match.params.prevuri;
      this.props.history.replace(`/${prevuri}/${deviceid}`)
    }
    render() {
        const {mapseldeviceid,devices} = this.props;
        let DeviceId;
        const formstyle={width:"100%",flexGrow:"1"};
        const textFieldStyle={width:"100%",flexGrow:"1"};
        return (
            <div className="selcartPage AppPage"
                style={{height : `${window.innerHeight}px`,overflow: "hidden",paddingBottom:"0"}}
                >
                <div className="navhead">
                    <a className="back" onClick={()=>{this.onBack();}}></a>
                    <span className="title" style={{paddingRight : "30px"}}>选择汽车</span>
                    <div className="filler" onClick={()=>{this.setState({fillerisOpen : !this.state.fillerisOpen})}}><img src={Fillerimg} /></div>
                </div>
                { this.state.fillerisOpen &&
                    <div className="selcartfiller">
                        <Fillerform onsubmit={this.fillersubmit} />
                        <div className="bg" onClick={()=>{this.setState({fillerisOpen : !this.state.fillerisOpen})}}></div>
                    </div>
                }
                <div className="searchtools"><input placeholder="输入设备ID" /></div>
                <div className="list">
                    <Datalist tableheight={window.innerHeight-55}/>
                </div>
            </div>
        );
    }
}

export default connect()(Page);
