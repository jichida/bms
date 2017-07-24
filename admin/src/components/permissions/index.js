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

const PermissionCreate = ({record}) => (
  <Create {...props} >
    <SimpleForm>
      <DisabledInput label="权限ID" source="id" />
      <TextInput label="权限名称" source="name" />
      <TextInput label="memo" source="memo" />
    </SimpleForm>
  </Create>
);

const PermissionTitle = ({record}) => {
  return <span>用户权限</span>;
}

const PermissionList = (props) => (
  <Datagrid title="用户权限">
    <TextField label="权限ID" source="id" />
    <TextField label="权限名称" source="name" />
    <TextField label="memo" source="memo" />
    <EditButton />
  </Datagrid>
);

const PermissionEdit = (props) => {
  return (
    <Edit title={<PermissionTitle />} {...props} >
      <SimpleForm>
        <NumberInput label="权限ID" source="id" />
        <TextInput label="权限名称" source="name" />
        <TextInput label="memo" source="memo" />
      </SimpleForm>
    </Edit>
  );
};

export {PermissionCreate,PermissionList,PermissionEdit};