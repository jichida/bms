import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { required,NumberInput,Create, Edit, SimpleForm, DisabledInput, TextInput,  Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters, ReferenceInput,SelectInput } from 'admin-on-rest/lib/mui';


import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import ResestPassword from './resetpassword';

const UserListTitle = ({ record }) => {
  return <span>显示 用户</span>;
};
const userDefaultValue = {created_at:new Date()};

const UserCreate = (props) => (
  <Create title="新建用户" {...props}>
    <SimpleForm defaultValue={userDefaultValue}>
      <TextInput label="用户名" source="username" validate={required} />
      <TextInput label="密码" source="password" validate={required} />
      <ReferenceInput label="用户组" source="groupid" reference="usergroup" allowEmpty>
        <SelectInput optionText="name" />
      </ReferenceInput>
      <ReferenceInput label="所在组织" source="organizationid" reference="organization" allowEmpty>
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);


const UserEdit = (props) => {
  return (
    <Edit title="编辑用户信息" {...props} >
      <SimpleForm>
        <TextField source="id" />
        <TextField label="用户名" source="username" validate={required} />
        <ReferenceInput label="用户组" source="groupid" reference="usergroup" allowEmpty>
          <SelectInput optionText="name" />
        </ReferenceInput>
        <ReferenceInput label="所在组织" source="organizationid" reference="organization" allowEmpty>
          <SelectInput optionText="name" />
        </ReferenceInput>
      </SimpleForm>
    </Edit>
  );
};

const UserFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索用户" source="username_q" />
  </Filter>
);

const UserList = (props) => (
  <List title="用户列表" filters={<UserFilter />} {...props} sort={{ field: 'created_at', order: 'DESC'}} >
    <Datagrid>
        <TextField label="用户名" source="username" />
        <DateField label="注册时间" source="created_at" showTime />
        <DateField label="上次登陆时间" source="updated_at" showTime />
        <ReferenceField label="用户组" source="groupid" reference="usergroup" allowEmpty>
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField label="所在组织" source="organizationid" reference="organization" allowEmpty>
          <TextField source="name" />
        </ReferenceField>
        <ResestPassword />
        <EditButton />
    </Datagrid>
  </List>
);

export {UserCreate,UserList,UserEdit};
