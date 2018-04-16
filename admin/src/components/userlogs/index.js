import React from 'react';
import { List, EmailField } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import {
  CreateButton,
  RichTextField,
  NumberInput,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  Show,
  SimpleShowLayout,
  ShowButton,
  DateInput,
  LongTextInput,
  ReferenceManyField,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  SelectInput,
  BooleanInput,
  BooleanField,
  ImageField,
  ReferenceField,
  ReferenceInput,
  Filter
} from 'admin-on-rest/lib/mui';
import config from '../../env/config';
import { Field,FieldArray } from 'redux-form';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';

const UserFilter = (props) => (
    <Filter {...props}>
       <ReferenceInput label="用户" source="creator" reference="user" addLabel={false}>
            <SelectInput optionText="username" />
       </ReferenceInput>
    </Filter>
);

const UserlogList = (props) => (
     <List title="用户日志管理" filters={<UserFilter />}  {...props} sort={{field:'created_at',order:'DESC'}} perPage={config.listperpage}>
        <Datagrid  bodyOptions={{ showRowHover: true }}>
          <ReferenceField label="用户" source="creator" reference="user" allowEmpty>
            <TextField source="username" />
          </ReferenceField>
          <TextField label="时间" source="created_at"  />
          <TextField label="信息" source="logtxt" />
        </Datagrid>
    </List>
);


export  {UserlogList};
