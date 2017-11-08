import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { required,NumberInput,NumberField,Create, Edit, SimpleForm, DisabledInput, TextInput,  Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters,SelectInput,ChipField } from 'admin-on-rest/lib/mui';


import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

const PermissionCreate = (props) => (
  <Create title="新建权限" {...props} >
    <SimpleForm>
      <TextInput label="名称" source="name" validate={required} />
      <SelectInput  label="权限类型"  source="type" choices={[
          { id: 'data', name: '数据权限' },
          { id: 'operator', name: '操作权限' },
          { id: 'function', name: '功能权限' },
      ]} />
      <TextInput label="唯一字符串" source="keyname" validate={required} />
      <TextInput label="备注" source="memo" />
    </SimpleForm>
  </Create>
);

const PermissionTitle = ({record}) => {
  return <span>用户权限</span>;
}

const PermissionList = (props) => (
  <List title="用户权限列表" {...props}>
    <Datagrid>
      <NumberField label="ID" source="id" />
      <TextField label="名称" source="name" />
      <TextField label="唯一字符串" source="keyname" />
      <ChipField  label="权限类型" source="type" />
      <TextField label="备注" source="memo" />
      <EditButton />
    </Datagrid>
  </List>
);

const PermissionEdit = (props) => {
  return (
    <Edit title="编辑权限" {...props} >
      <SimpleForm>
        <DisabledInput label="ID" source="id" />
        <TextInput label="名称" source="name" validate={required} />
        <TextInput label="唯一字符串" source="keyname" validate={required} />
        <SelectInput  label="权限类型"  source="type" choices={[
            { id: 'data', name: '数据权限' },
            { id: 'operator', name: '操作权限' },
            { id: 'function', name: '功能权限' },
        ]} />
        <TextInput label="备注" source="memo" />
      </SimpleForm>
    </Edit>
  );
};

export {PermissionCreate,PermissionList,PermissionEdit};
