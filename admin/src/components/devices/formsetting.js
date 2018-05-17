import React from 'react';
import { Field, reduxForm, Form  } from 'redux-form';
import { connect } from 'react-redux';
import { NumberInput,
  required,
  NumberField,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  ListButton,
  Show,
  SimpleShowLayout,
  ShowButton,
  DateInput,
  LongTextInput,
  ReferenceManyField,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  CreateButton,
  BooleanInput,
  TabbedForm,
  FormTab,
  Filter,
  SelectInput,
  SelectField,
  ImageField,
  ReferenceInput,
  ReferenceField } from 'admin-on-rest/lib/mui';
  import FlatButton from 'material-ui/FlatButton';
  import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import IconSetBtn from 'material-ui/svg-icons/navigation/refresh';
import _ from 'lodash';

class PageForm extends React.Component {
  render() {
    const { handleSubmit,onClickSubmit } = this.props;
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
      options.push( <option value={`${v.value}`} key={`${index}`}>{v.title}</option>);
    });

    return (
      <Form
          onSubmit={handleSubmit(onClickSubmit)}
          >
          <div>
        <label>数据采样频率</label>
        <div>
          <Field name="DataInterval" component="select">
             {options}
          </Field>
        </div>
        </div>
        <label> 数据回报频率</label>
        <div>
          <Field name="SendInterval" component="select">
           {options}
          </Field>
        </div>
            <button >确定设置</button>
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
