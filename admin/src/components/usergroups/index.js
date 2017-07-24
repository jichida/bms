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

const UserGroupTitle = ({record}) => {
  return <span>用户分组</span>;
}

const UserGroupCreate = (props) => (
  <Create title={<UserGroupTitle />} {...props}>
    <SimpleForm>
      <DisabledInput label="分组ID" resource="groupid" />
      <TextInput label="分组名称" resource="name" />
      <NumberInput label="分组value" resource="permissionvalue" />
      <TextInput label="memo" source="memo" />
      <TextInput label="contact" source="contact" />
    </SimpleForm>
  </Create>
);

const UserGroupList = (props) => (
  <Datagrid title="用户分组">
    <TextField label="分组ID" source="groupid" />
    <TextField label="分组名称" source="name" />
    <TextField label="权限value" source="permissionvalue" />
    <TextField label="memo" source="memo" />
    <TextField label="contact" source="contact" />
    <EditButton />
  </Datagrid>
);

const UserGroupEdit = (props) => {
  return (
    <Edit title={<UserGroupTitle />} {...props} >
      <SimpleForm>
        <DisabledInput label="分组ID" source="groupid" />
        <TextInput label="用户组" source="name" />
        <NumberInput label="权限" source="permissionvalue" />
        <TextInput label="memo" source="memo" />
        <TextInput label="contact" source="contact" />
      </SimpleForm>
    </Edit>
  );
};

export {UserGroupList,UserGroupEdit};