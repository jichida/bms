import React, { Component } from 'react';
import { Field, reduxForm, Form, formValueSelector  } from 'redux-form';
import { connect } from 'react-redux';
import {login_request} from '../../actions';
// import NavBar from '../tools/nav.js';
import { withRouter } from 'react-router-dom';
import { set_weui } from '../../actions';
import './login.css';
// import {
//     required,
//     // phone,
//     InputValidation,
//     // length4
// } from "../tools/formvalidation-material-ui"


import Loginlogo from "./loginlogo.png";
import Login1 from "./login1.png";
import Login2 from "./login2.png";
import Login3 from "./login3.png";


const required = value => value ? undefined : '必填项';
//input表单验证
const InputValidation = (props) => {
	const {onError,input, placeholder, type, meta: { touched, error, warning }} = props;
	let err1 = (touched && error);
	let err2 = (touched && warning);
	let style = "formvalidation form_input";
	style = err1||err2?"formvalidation form_input warning":"formvalidation form_input";
	return (
	  	<div className={style}>
		    <input {...input} placeholder={placeholder} type={type}/>
		    {	touched &&
		    	((error &&
		    		<span
		    			className="warningtext"
		    			onClick={()=>{onError(error)}}
		    			>!</span>
		    		)
		    		|| (warning &&
		    			<span
			    			className="warningtext"
			    			onClick={()=>{onError(warning)}}
			    			>!</span>
		    		))
		    }
	  	</div>
	);
}

export class PageForm extends Component {
    render(){
        const { handleSubmit,onClickLogin,pristine,submitting } = this.props;

        return (
            <Form
                className="loginForm"
                onSubmit={handleSubmit(onClickLogin)}
                >
                <div className="logo">
                    <span className="logoimg"><img src={Loginlogo} alt=""/></span>
                </div>
                <div className="li" >
                    <img src={Login1} className="loginicon"  alt=""/>
                    <Field
                        name="phonenumber"
                        id="phonenumber"
                        placeholder="请输入账号"
                        type="text"
                        component={ InputValidation }
                        validate={[ required ]}
                    />
                </div>
                <div className="li">
                    <img src={Login2} className="loginicon"  alt=""/>
                    <Field
                        name="password"
                        id="password"
                        placeholder="请输入密码"
                        type="password"
                        component={ InputValidation }
                        validate={[ required ]}
                    />
                </div>

                <br/>
                <br/>

                <div className="submitBtn">
                    <img
                        className="btn Default"
                        disabled={pristine || submitting}
                        onClick={handleSubmit(onClickLogin)}
                        src={Login3}
                         alt=""/>
                </div>
            </Form>
        )
    }
}

PageForm = reduxForm({
    form: 'LoginPageForm'
})(PageForm);

const inputconnect = formValueSelector('LoginPageForm');
PageForm = connect(
    state => {
        const phonenumber = inputconnect(state, 'phonenumber');
        return {
            phonenumber
        }
    }
)(PageForm)
PageForm = withRouter(PageForm);

export class Page extends Component {
    componentWillReceiveProps (nextProps) {
        console.log(nextProps);
        if(nextProps.loginsuccess && !this.props.loginsuccess){
            console.log("------->" + JSON.stringify(this.props.location));
            //search:?next=/devicelist
            var fdStart = this.props.location.search.indexOf("?next=");
            if(fdStart === 0){
                const redirectRoute = this.props.location.search.substring(6);
                this.props.history.replace(redirectRoute);
            }
            else{
                this.props.history.replace('/');
            }
            return;
        }
    }
    onClickReturn =()=>{
        this.props.history.goBack();
    }

    componentWillUnmount(){
        this.props.dispatch(set_weui({
            loading : {
                show : false
            },
        }));
    }

    onClickLogin = (values)=>{
        let payload = {
            username:values.phonenumber,
            password:values.password,
        };

        this.props.dispatch(login_request(payload));
        // this.props.history.push("./");
    }
    render(){
        return (
            <div className="loginPage AppPage"
                style={{
                    backgroundSize: "100% 100%",
                    height : `${window.innerHeight}px`
                }}>

                <div className="content">
                    <PageForm onClickLogin={this.onClickLogin}/>
                </div>
            </div>
        )
    }
}

const data = ({userlogin}) => { return userlogin; }
Page = connect(data)(Page);

export default Page;
