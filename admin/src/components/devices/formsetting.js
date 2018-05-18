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
import IconSetBtn from 'material-ui/svg-icons/navigation/refresh';
import { Input, Icon } from 'antd';

class PageForm extends React.Component {
  render() {
    const { handleSubmit,onClickSubmit } = this.props;
    return (
      <Form
          onSubmit={handleSubmit(onClickSubmit)}
          >
            <Field name="ServerIP" component={Input} placeholder="连接服务器IP或域名"/>
            {/* <TextInput label="连接服务器IP或域名" source="ServerIP" />
            <TextInput label="连接服务器端口" source="ServerPort"  />
            <TextInput label="更新服务器IP或域名" source="UpdateServerIP"  />
            <TextInput label="更新服务器端口" source="UpdateServerPort"  />
            <TextField label="SIM号码" source="SIMNumber"  />
            <TextField label="设备编号" source="DeviceSN"  />
            <TextField label="固件应用标识" source="ApplicationID"  />
            <TextField label="固件主版本号" source="MajorVersion_FW"  />
            <TextField label="固件小版本号" source="MinorVersion_FW"  />
            <TextField label="硬件主版本号" source="MajorVersion_HW"  />
            <TextField label="硬件小版本号" source="MinorVersion_HW"  />
            <TextField label="SIM卡CCID号" source="SIMCCID"  />
            <TextField label="通信模块IMEI号" source="GSM_SN"  />
            <TextInput label="位置数据采样间隔，单位:秒" source="PositionInterval"  />
            <TextInput label="BMS数据采样间隔，单位:秒" source="DataInterval"  />
            <TextInput label="数据发送间隔，单位:秒" source="SendInterval"  />
            <TextInput label="PN类型" source="PNType"  />
            <TextField label="RDB二维码" source="FullNumber_RDB"  />
            <TextField label="电池包PACK号" source="PackNo_BMU"  />
            <TextField label="电池包软件版本" source="Version_BMU"  />
            <TextField label="电池包VIN号" source="VIN_BMU"  />
            <TextField label="电池包硬件版本" source="HWVersion_BMU"  /> */} */}
            {/* <FlatButton primary label="设置" /> */}
            <button >ok</button>
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
