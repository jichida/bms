import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { NumberInput,Create, Edit, SimpleForm, DisabledInput, TextInput,  Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters } from 'admin-on-rest/lib/mui';


import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import {TimePickerInput} from '../controls/timepicker.js';

const DeviceGroupTitle = ({record}) => {
  return <span>设备分组</span>
};

const DeviceGroupCreate = (props) => (
  <Create title="创建设备组" {...props}>
    <SimpleForm>
      <TextInput label="分组名称" source="name" validate={required} />
      <TextInput label="备注" source="memo" />
      <TextInput label="联系人" source="contact" />
    </SimpleForm>
  </Create>
);

const DeviceGroupList = (props) => (
  <List title={<DeviceGroupTitle />} {...props}>
    <Datagrid>
      <TextField source="id" />
      <TextField label="分组名称" source="name" />
      <TextField label="备注" source="memo" />
      <TextField label="联系人" source="contact" />
      <EditButton />
    </Datagrid>
  </List>
);

const DeviceGroupShow = (props) => (
  <Show title={<DeviceGroupTitle />} {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField label="分组名称" source="name" />
      <TextField label="备注" source="memo" />
      <TextField label="联系人" source="contact" />
    </SimpleShowLayout>
  </Show>
);

const DeviceGroupEdit = (props) => {
  return (<Edit title="编辑设备组" {...props}>
    <SimpleForm>
      <TextInput label="分组名称" source="name" validate={required} />
      <TextInput label="备注" source="memo" />
      <TextInput label="联系人" source="contact" />
    </SimpleForm>
  </Edit>
  );
};

export {DeviceGroupCreate,DeviceGroupList,DeviceGroupEdit,DeviceGroupShow};