import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { required,NumberInput,NumberField,Create, Edit, SimpleForm, DisabledInput, TextInput,  Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters } from 'admin-on-rest/lib/mui';


import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

const UserGroupCreate = (props) => (
  <Create title="创建用户组" {...props} >
    <SimpleForm>
      <TextInput label="分组名称" resource="name" validate={required} />
      <NumberInput label="权限值" resource="permissionvalue" />
      <TextInput label="备注" source="memo" />
      <TextInput label="联系人" source="contact" />
    </SimpleForm>
  </Create>
);

const UserGroupList = (props) => (
  <List title="用户分组列表" {...props} >
    <Datagrid >
      <TextField label="分组名称" source="name" />
      <NumberField label="权限值" source="permissionvalue" />
      <TextField label="备注" source="memo" />
      <TextField label="联系人" source="contact" />
      <EditButton />
    </Datagrid>
  </List>
);

const UserGroupShow = (props) => (
  <Show title="用户分组" {...props} >
    <SimpleShowLayout>
      <TextField label="分组名称" source="name" />
      <NumberField label="权限值" source="permissionvalue" />
      <TextField label="备注" source="memo" />
      <TextField label="联系人" source="contact" />
    </SimpleShowLayout>
  </Show>
);

const UserGroupEdit = (props) => {
  return (
    <Edit title="编辑用户组" {...props} >
      <SimpleForm>
        <TextInput label="用户组" source="name" validate={required} />
        <NumberInput label="权限" source="permissionvalue" />
        <TextInput label="备注" source="memo" />
        <TextInput label="联系人" source="contact" />
      </SimpleForm>
    </Edit>
  );
};

export {UserGroupCreate,UserGroupList,UserGroupEdit,UserGroupShow};