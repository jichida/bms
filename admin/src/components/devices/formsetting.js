import React from 'react';
import { Field, reduxForm, Form  } from 'redux-form';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconSetBtn from 'material-ui/svg-icons/navigation/refresh';
import _ from 'lodash';

const optionsvalue = [
  {
    title:'1秒',
    value:1,
  },
  {
    title:'10秒',
    value:10,
  },
  {
    title:'20秒',
    value:20,
  },
  {
    title:'30秒',
    value:30,
  },
  {
    title:'1分钟',
    value:60
  },
  {
    title:'5分钟',
    value:300,
  },
  {
    title:'10分钟',
    value:600,
  },
  {
    title:'30分钟',
    value:1800,
  },
  {
    title:'1个小时',
    value:3600,
  },
  {
    title:'10个小时',
    value:36000,
  },
  {
    title:'24小时',
    value:86400,
  }
];
let options = [];
_.map(optionsvalue,(v,index)=>{
  options.push(
    <MenuItem value={v.value} primaryText={v.title}  key={`${index}`}/>
  );
});

const renderSel = (props)=>{
  const {input:{value,onChange},floatingLabelText} = props;
  console.log(`value--->${value}`);
  const onChangeSel = (event, index, value)=>{
    onChange(value);
  }

  return (<SelectField value={value} onChange={onChangeSel} floatingLabelText={floatingLabelText}>
     {options}
  </SelectField>);
}

class PageForm extends React.Component {
  render() {
    const { handleSubmit,onClickSubmit } = this.props;


    return (
      <Form
          onSubmit={handleSubmit(onClickSubmit)}
          >
          <div>
            <Field name="DataInterval" component={renderSel}  floatingLabelText="数据采样频率">
            </Field>
          </div>
          <div>
            <Field name="SendInterval" component={renderSel} floatingLabelText="数据回报频率">
            </Field>
          </div>
          <RaisedButton
           primary
           type="submit"
           label="确定"
           style={{marginTop: 12}}
         />
          </Form>);
        }
    }


    const RetForm = ({formname,formvalues,...rest})=> {
        const FormWrap = reduxForm({
            form: formname,
            initialValues: formvalues
        })(PageForm);

        return <FormWrap {...rest} />
    }
    export default RetForm;
