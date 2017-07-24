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

import {TimePickerInput} from '../controls/timepicker.js';

const UserListTitle = ({ record }) => {
  return <span>显示 用户</span>;
};

const UserListShow = (props) => (
  <Show title={<UserListTitle />} {...props} >
      <SimpleShowLayout>
         <TextField source="id" />
         <TextField label="用户名" source="username" />
         <DateField label="注册时间" source="created_at" showtime />
         <DateField label="上次登陆时间" source="updated_at" showtime />
         <ReferenceField label="用户分组" source="groupid" reference="usergroup" >
           <TextField source="name" />
        </ReferenceField>
      </SimpleShowLayout>
  </Show>
);

const UserListEdit = (props) => {
  return (
    <Edit title={<UserListEdit />} {...props} >
      <SimpleForm>
        <TextField source="id" />
        <TextField label="用户名" source="username" />
        <DateField label="注册时间" source="created_at" showtime />
        <DateField label="上次登陆时间" source="updated_at" showtime />
      </SimpleForm>
    </Edit>
  );
};

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索用户" source="username_q" />
  </Filter>
);

const UserListList = (props) => (
  <List title="用户列表" Filters={<UserFilter />} {...props} sort={{ field: 'created_at', order: 'DESC'}} >
    <Datagrid>
       <TextField source="id" />
        <TextField label="用户名" source="username" />
        <DateField label="注册时间" source="created_at" showtime />
        <DateField label="上次登陆时间" source="updated_at" showtime />
        <EditButton />
    </Datagrid>
  </List>
);

export {UserListList,UserListEdit};
