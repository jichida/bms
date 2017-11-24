import React, { Component } from 'react';
import { Field, reduxForm, Form, formValueSelector  } from 'redux-form';
import { connect } from 'react-redux';
import {changepwd_request} from '../../actions';
import NavBar from '../tools/nav.js';
import { withRouter } from 'react-router-dom';
import { set_weui } from '../../actions';
import './login.css';
import {
    required,
    phone,
    InputValidation,
    length4,
    passwordA,
    passwordB,
    minLength6
} from "../tools/formvalidation-material-ui"
import Loginbg from "../../img/1.png";

export class PageForm extends Component {
    render(){
        const { handleSubmit,onClickchange,pristine,submitting } = this.props;

        return (
            <Form
                className="changepwdForm"
                onSubmit={handleSubmit(onClickchange)}
                >
                <div className="li" >
                    <span>当前密码</span>
                    <Field
                        name="password"
                        id="password"
                        placeholder="请输入原始密码"
                        type="password"
                        component={ InputValidation }
                        validate={[ required ]}
                    />
                </div>
                <div className="li">
                    <span>新的密码</span>
                    <Field
                        name="passwordA"
                        id="passwordA"
                        placeholder="请输入您的新密码"
                        type="password"
                        component={ InputValidation }
                        validate={[ required, passwordA, minLength6 ]}
                    />
                </div>
                <div className="li">
                    <span>确认密码</span>
                    <Field
                        name="passwordB"
                        id="passwordB"
                        placeholder="请重复输入您的新密码"
                        type="password"
                        component={ InputValidation }
                        validate={[ required, passwordB, minLength6 ]}
                    />
                </div>

                <br/>
                <br/>

                <div className="submitBtn">
                    <span
                        className="btn Default"
                        disabled={pristine || submitting}
                        onClick={handleSubmit(onClickchange)}
                        >
                        确定
                    </span>


                </div>
            </Form>
        )
    }
}

PageForm = reduxForm({
    form: 'changepwdPageForm'
})(PageForm);

PageForm = withRouter(PageForm);

export class Page extends Component {
    componentWillReceiveProps (nextProps) {

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

    onClickchange = (values)=>{
        let payload = {
            password:values.password,
            passwordA:values.passwordA,
        };

        console.log("修改密码::::"+JSON.stringify(payload));

        this.props.dispatch(changepwd_request(payload));
        // this.props.history.push("./");
        //调用修改密码后台接口


    }
    render(){
        return (
            <div className="changepwdPage AppPage"
                style={{
                    backgroundSize: "100% 100%",
                    height : `${window.innerHeight}px`
                }}>
                <div className="navhead">
                    <a onClick={()=>{this.props.history.goBack()}} className="back"></a>
                    <span className="title" style={{paddingRight : "30px"}}>修改密码</span>
                </div>

                <div className="content">
                    <PageForm onClickchange={this.onClickchange}/>
                </div>
            </div>
        )
    }
}

const data = ({userlogin}) => { return userlogin; }
Page = connect(data)(Page);

export default Page;
