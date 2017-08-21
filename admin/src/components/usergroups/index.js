import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { required,NumberInput,NumberField,Create, Edit, SimpleForm, DisabledInput, TextInput,  Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters, ReferenceInput,SelectInput  } from 'admin-on-rest/lib/mui';


import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

const UserGroupCreate = (props) => {
  return (
    <Create title="创建用户组" {...props} >
      <SimpleForm>
        <TextInput label="分组名称" source="name" validate={required} />
        <NumberInput label="权限值" source="permissionvalue" />
        <TextInput label="备注" source="memo" />
        <TextInput label="联系人" source="contact" />
        <ReferenceInput label="所在组织" source="organizationid" reference="organization" allowEmpty>
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </Create>
  );
};

const UserGroupEdit = (props) => {
  return (
    <Edit title="编辑用户组" {...props} >
      <SimpleForm>
        <TextInput label="分组名称" source="name" validate={required} />
        <NumberInput label="权限值" source="permissionvalue" />
        <TextInput label="备注" source="memo" />
        <TextInput label="联系人" source="contact" />
        <ReferenceInput label="所在组织" source="organizationid" reference="organization" allowEmpty>
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
};

const UserGroupList = (props) => (
  <List title="用户分组列表" {...props} >
    <Datagrid >
      <TextField label="分组名称" source="name" />
      <NumberField label="权限值" source="permissionvalue" />
      <TextField label="备注" source="memo" />
      <TextField label="联系人" source="contact" />
      <ReferenceField label="所在组织" source="organizationid" reference="organization" allowEmpty>
        <TextField source="name" />
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);


export {UserGroupCreate,UserGroupList,UserGroupEdit};
