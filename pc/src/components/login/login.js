import React, { Component } from 'react';
import { Field, reduxForm, Form, formValueSelector  } from 'redux-form';
import { connect } from 'react-redux';
import { loginsendauth_request,login_request } from '../../actions';
import { withRouter } from 'react-router-dom';
import { set_weui } from '../../actions';
import '../../css/login.css';
import RaisedButton from 'material-ui/RaisedButton';

import {
    required,
    phone,
    InputValidation,
    length4
    } from "../tools/formvalidation"

export class PageForm extends Component {
    render(){
        const { handleSubmit,onClickLogin,pristine,submitting } = this.props;

        return (
            <Form
                className="loginForm formStyle1"
                onSubmit={handleSubmit(onClickLogin)}
                >

                <div className="li" >
                    <span className="icon">
                        <img src="newimg/25.png" alt='' />
                    </span>
                    <Field
                        name="phonenumber"
                        id="phonenumber"
                        placeholder="请输入您的账号"
                        type="text"
                        component={ InputValidation }
                        validate={[ required, phone ]}
                    />
                </div>
                <div className="li">
                    <span className="icon">
                        <img src="newimg/26.png" alt='' />
                    </span>
                    <Field
                        name="password"
                        id="password"
                        placeholder="请输入密码"
                        type="password"
                        component={ InputValidation }
                        validate={[ required ]}
                    />

                </div>

                <div className="submitBtn">
                    <RaisedButton label="登录" fullWidth={true} primary={true} disabled={pristine || submitting} onClick={handleSubmit(onClickLogin)} />
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
                this.props.history.goBack();
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
    }
    render(){
        return (
            <div className="loginPage AppPage">
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
