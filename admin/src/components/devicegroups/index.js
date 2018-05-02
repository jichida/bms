import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';

import { required,NumberInput,Create, Edit, SimpleForm, DisabledInput, TextInput,Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters,ReferenceInput,SelectInput } from 'admin-on-rest/lib/mui';

 import { ReferenceArrayInput, SelectArrayInput } from 'admin-on-rest';


import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import _ from 'lodash';

import {CreateActions,EditActions} from '../controls/createeditactions';
import {getDeviceOptions} from './devicealloptions';
import {SelectDevices} from './selectdevices';


const DeviceGroupTitle = ({record}) => {
  return <span>设备分组管理</span>
};

const DeviceGroupCreate = (props) => (
  <Create title="创建设备组" {...props}  actions={<CreateActions />} >
    <SimpleForm>
      <TextInput label="分组名称" source="name" validate={required} />
      <TextInput label="备注" source="memo" />
      <TextInput label="联系人" source="contact" />
      <SelectDevices label="选择设备列表" source="deviceids" loadOptions={getDeviceOptions()}/>
    </SimpleForm>
  </Create>
);

const DeviceGroupEdit = (props) => {
  return (<Edit title="编辑设备组" actions={<EditActions />} {...props}>
    <SimpleForm>
      <TextInput label="分组名称" source="name" validate={required} />
      <TextInput label="备注" source="memo" />
      <TextInput label="联系人" source="contact" />
      <SelectDevices label="选择设备列表" source="deviceids" loadOptions={getDeviceOptions()}/>
    </SimpleForm>
  </Edit>
  );
};

const EditBtnif = (props)=>{
  const {record} = props;
  return _.get(record,'systemflag',0) === 0?<EditButton {...props}/>:null;
}

const rowStyle = (record, index) => ({
    backgroundColor: record.systemflag === 1 ? '#efe' : 'white',
});

const TextFieldGroupDeviceCount = (props)=>{
  const {record} = props;
  const deviceids = _.get(record,'deviceids',[]);
  const groupname = _.get(record,'name');
  if(groupname === '全部设备'){
    return (<span>所有设备</span>);
  }
  return (<span>{deviceids.length}</span>);
}
const DeviceGroupList = (props) => (
  <List title={<DeviceGroupTitle />} {...props}>
    {permissions =>
      <Datagrid  bodyOptions={{ showRowHover: true }} rowStyle={rowStyle}>
        <TextField label="分组名称" source="name" />
        <TextField label="备注" source="memo" />
        <TextField label="联系人" source="contact" />
        <TextField label="最后更新时间" source="updatetime" />
        <TextFieldGroupDeviceCount label="设备个数" source="deviceids" sortable={false}/>
        {permissions==='admin'?<EditBtnif />:null}
      </Datagrid>
    }
  </List>
);




export {DeviceGroupCreate,DeviceGroupList,DeviceGroupEdit};
