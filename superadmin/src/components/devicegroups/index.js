import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { required,NumberInput,Create, Edit, SimpleForm, DisabledInput, TextInput,Show,SimpleShowLayout,ShowButton,
   DateInput, LongTextInput, ReferenceManyField, Datagrid, TextField, DateField, EditButton,BooleanInput,ReferenceField,
 Filter,Filters,ReferenceInput,SelectInput } from 'admin-on-rest/lib/mui';


import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

const DeviceGroupTitle = ({record}) => {
  return <span>设备分组</span>
};

const DeviceGroupCreate = (props) => (
  <Create title="创建设备组" {...props}>
    <SimpleForm>
      <TextInput label="分组名称" source="name" validate={required} />
      <TextInput label="备注" source="memo" />
      <TextInput label="联系人" source="contact" />
      <ReferenceInput label="所在组织" source="organizationid" reference="organization" allowEmpty>
        <SelectInput optionText="name" />
      </ReferenceInput>
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
      <ReferenceField label="所在组织" source="organizationid" reference="organization" allowEmpty>
        <TextField source="name" />
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);


const DeviceGroupEdit = (props) => {
  return (<Edit title="编辑设备组" {...props}>
    <SimpleForm>
      <TextInput label="分组名称" source="name" validate={required} />
      <TextInput label="备注" source="memo" />
      <TextInput label="联系人" source="contact" />
      <ReferenceInput label="所在组织" source="organizationid" reference="organization" allowEmpty>
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
  );
};

export {DeviceGroupCreate,DeviceGroupList,DeviceGroupEdit};
