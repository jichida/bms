/*
	表单验证
*/
import React from 'react'
import "./formvalidation.css"
import { connect } from 'react-redux';
import { set_weui } from '../../actions';
// import DatePicker from 'react-mobile-datepicker';
// import moment from 'moment';
import idCard from "idcard";
import TextField from 'material-ui/TextField';

//判断是否必填
export const required = value => value ? undefined : '必填项'
export const requiredImg = value => value ? undefined : '图片必须上传';

//最长输入长度
export const maxLength = max => value => value && value.length > max ? `超过字段最大长度${max}` : undefined;
export const maxLength7 = maxLength(7)
export const maxLength8 = maxLength(8)
export const maxLength9 = maxLength(9)
export const maxLength10 = maxLength(10)
export const maxLength11 = maxLength(11)
export const maxLength12 = maxLength(12)
export const maxLength13 = maxLength(13)
export const maxLength14 = maxLength(14)
export const maxLength15 = maxLength(15)
export const maxLength16 = maxLength(16)
export const maxLength17 = maxLength(17)
export const maxLength18 = maxLength(18)
export const maxLength19 = maxLength(19)
export const maxLength20 = maxLength(20)
//表单必须填入数字
export const number = value => value && isNaN(Number(value)) ? '必须输入数字' : undefined
//最短输入长度
export const minLength = min => value => value && value.length < min ? `少于最小输入长度${min}` : undefined;
export const minLength6 = minLength(6)
export const minLength7 = minLength(7)
export const minLength8 = minLength(8)
export const minLength9 = minLength(9)
export const minLength10 = minLength(10)
export const minLength11 = minLength(11)
export const minLength12 = minLength(12)
//固定长度
export const sureLength = length => value => value && value.length !== length ? `输入长度为${length}位` : undefined;
export const length4 = sureLength(4)
export const length5 = sureLength(5)
export const length6 = sureLength(6)
export const length7 = sureLength(7)
export const length8 = sureLength(8)

//年龄必须18岁以上
export const minValue = min => value => value && value < min ? `必须满${min}岁以上` : undefined
export const minValue18 = minValue(18);
//邮箱输入验证
export const email = value => value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) ? '邮箱格式不正确' : undefined
//手机号验证phone.match(/\D/g) || phone.length !== 11 || !phone.match(/^1/)
export const phone = value => value && (value.match(/\D/g)||value.length !== 11||!value.match(/^1/)) ? '手机号格式不正确' : undefined
//不能有空格
export const space = value => value && value.match(/\s/g) ? '不能有空格' : undefined
//判断是否被选中
export const ischecked = value => value? undefined: "您还没有同意该项"
//二次密码验证
let password = '';
export const passwordA = value => {password = value; return undefined};
export const passwordB = value => value && value !== password? "两次密码输入不一致":  undefined;
//身份证输入验证
export const isidcard = value => idCard.verify(value)? undefined : "请输入正确的身份证号码";
const inputData = (state) => { return state; };
const inputDispatchToProps = (dispatch) => {
  	return {
	    onError:(err)=>{
	      	let toast = {
			    show : true,
			    text : err,
			    type : "warning"
			}
			dispatch(set_weui({ toast }));
	    },
	}
};

//input表单验证
let InputValidation = (props) => {
	const {onError,input, placeholder, type, meta: { touched, error, warning }} = props;
	let err1 = (touched && error);
	let err2 = (touched && warning);
	let style = "formvalidation form_input";
	style = err1||err2?"formvalidation form_input warning":"formvalidation form_input";
	return (
	  	<div className={style}>
	  		<TextField
	  			hintText = {placeholder}
	  			inputStyle = {{width: "100%"}}
	  			underlineStyle = {{bottom: "0px"}}
	  			style={{width: "100%"}}
	  			{...input}
	  			type={type}
	  			/>
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

InputValidation = connect(inputData,inputDispatchToProps)(InputValidation);
export {InputValidation};
