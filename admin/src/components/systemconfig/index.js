import React from 'react';
import {
    Datagrid,
    DateField,
    Create,
    EditButton,
    Filter,
    FormTab,
    List,
    NumberInput,
    ReferenceInput,
    ReferenceManyField,
    RichTextField,
    SelectInput,
    TabbedForm,
    TextField,
    TextInput,
    SimpleShowLayout,
    SelectArrayInput,
    ChipField,
    Edit as EditPage,
    Show as ShowPage,
    SimpleForm,
} from 'admin-on-rest/lib/mui';

import Chip from 'material-ui/Chip';

import ShowPageOne from '../singledocumentpage/index.js';
import {CfSelectArrayInputDetail,CfSelectArrayInput} from './cf.js';

const SystemconfigTitle = ({ record }) => <span>系统设置</span>;


const SystemconfigCreateTitle = ({ record }) => {
   return <span>新建 系统配置</span>;
};
 const SystemconfigCreate = (props) => (
       <Create {...props} title={<SystemconfigCreateTitle />} >
       <SimpleForm>
          <CfSelectArrayInput label="选择弹框的字段列表" source="mappopfields"/>
          <CfSelectArrayInput label="选择聚合点弹框的字段列表" source="mappopclusterfields"/>
          <CfSelectArrayInputDetail label="编辑车辆详情显示字段列表" source="mapdetailfields"/>
       </SimpleForm>
       </Create>
);

 const SystemconfigEdit = (props) => (
    <EditPage {...props} title={<SystemconfigTitle />}>
        <SimpleForm>
          <CfSelectArrayInput label="选择弹框的字段列表" source="mappopfields"/>
          <CfSelectArrayInput label="选择聚合点弹框的字段列表" source="mappopclusterfields"/>
          <CfSelectArrayInputDetail label="编辑车辆详情显示字段列表" source="mapdetailfields"/>
        </SimpleForm>
    </EditPage>
);

export const SystemconfigList = props => (
    <ShowPageOne Create={SystemconfigCreate} Edit={SystemconfigEdit} {...props}/>
);
