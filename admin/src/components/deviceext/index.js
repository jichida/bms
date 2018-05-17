import React from 'react';
import { connect } from 'react-redux';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { NumberInput,
  NumberField,
  Create,
  CreateButton,
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
  BooleanInput,
  TabbedForm,
  FormTab,
  Filter,
  SelectInput,
  SelectField,
  ImageField,
  ReferenceInput,
  ReferenceField } from 'admin-on-rest/lib/mui';

import { Field,FieldArray } from 'redux-form';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import config from '../../env/config';
import { refreshView } from 'admin-on-rest';
import {CreateActions,EditActions} from '../controls/createeditactions';
import ImportExcelButton from './importexcelbtn';

// RDB编号
// 车工号
// 类型
// 容量
// 串联数
// 并联数
// 电芯类型
// CATL项目名称
// 项目PN	电池系统流水号	BMU硬件版本	CSC硬件版本	BMU软件版本	CSC软件版本	电池入库日期
// 电池出货日期	车辆生产厂	车辆型号	装车日期
// 整车出厂日期	省份	地区	里程(暂无，保留)	客户名称	客户联系地址	客户联系人	客户联系电话
// 客户移动电话	用途	购买日期	新车上牌日期	车牌号	售后外服姓名
const DeviceExtCreate = (props) => {
  return (
    <Create title="创建设备"  {...props} actions={<CreateActions />}>
      <SimpleForm >
        <TextInput label="RDB编号" source="DeviceId" />
        <TextInput label="车工号" source="buscarvin"  />
        <TextInput label="类型" source="type" />
        <TextInput label="容量" source="capacity" />
        <TextInput label="串联数" source="serialnumber" />
        <TextInput label="并联数" source="parallelnumber"  />
        <TextInput label="电芯类型" source="typeelectriccore"  />
        <TextInput label="CATL项目名称" source="catlprojectname"  />
        <TextInput label="项目PN" source="projectpn"  />
        <TextInput label="电池系统流水号" source="batterysystemflownumber"  />
        <TextInput label="BMU硬件版本" source="BMUhardwareversion"  />
        <TextInput label="CSC硬件版本" source="CSChardwareversion"  />
        <TextInput label="BMU软件版本" source="BMUsoftwareversion"  />
        <TextInput label="CSC软件版本" source="CSCsoftwareversion"  />
        <TextInput label="电池入库日期" source="datebatterystorage"  />
        <TextInput label="电池出货日期" source="datebatterydelivery"  />
        <TextInput label="车辆生产厂" source="vehicleproductionplant"  />
        <TextInput label="车辆型号" source="vehiclemodel"  />
        <TextInput label="装车日期" source="dateloading"  />
        <TextInput label="整车出厂日期" source="datevehiclefactory"  />
        <TextInput label="省份" source="provice"  />
        <TextInput label="地区" source="area"  />
        <TextInput label="里程" source="mileage"  />
        <TextInput label="客户名称" source="customername"  />
        <TextInput label="客户联系地址" source="customercontactaddress"  />
        <TextInput label="客户联系人" source="customercontact"  />
        <TextInput label="客户联系电话" source="customercontactphone"  />
        <TextInput label="客户移动电话" source="customermobilephone"  />
        <TextInput label="用途" source="purpose"  />
        <TextInput label="购买日期" source="datepurchase"  />
        <TextInput label="新车上牌日期" source="datenewcar"  />
        <TextInput label="车牌号" source="licenseplatenumber"  />
        <TextInput label="售后外服姓名" source="nameaftersaleservice"  />
      </SimpleForm>
    </Create>
    );
};

const DeviceExtEdit = (props) => {
  return (<Edit title="客档信息" {...props}>
      <SimpleForm>
        <TextField label="RDB编号" source="DeviceId" />
        <TextField label="车工号" source="buscarvin"  />
        <TextField label="类型" source="type" />
        <TextField label="容量" source="capacity" />
        <TextField label="串联数" source="serialnumber" />
        <TextField label="并联数" source="parallelnumber"  />
        <TextField label="电芯类型" source="typeelectriccore"  />
        <TextField label="CATL项目名称" source="catlprojectname"  />
        <TextField label="项目PN" source="projectpn"  />
        <TextField label="电池系统流水号" source="batterysystemflownumber"  />
        <TextField label="BMU硬件版本" source="BMUhardwareversion"  />
        <TextField label="CSC硬件版本" source="CSChardwareversion"  />
        <TextField label="BMU软件版本" source="BMUsoftwareversion"  />
        <TextField label="CSC软件版本" source="CSCsoftwareversion"  />
        <TextField label="电池入库日期" source="datebatterystorage"  />
        <TextField label="电池出货日期" source="datebatterydelivery"  />
        <TextField label="车辆生产厂" source="vehicleproductionplant"  />
        <TextField label="车辆型号" source="vehiclemodel"  />
        <TextField label="装车日期" source="dateloading"  />
        <TextField label="整车出厂日期" source="datevehiclefactory"  />
        <TextField label="省份" source="provice"  />
        <TextField label="地区" source="area"  />
        <TextField label="里程" source="mileage"  />
        <TextField label="客户名称" source="customername"  />
        <TextField label="客户联系地址" source="customercontactaddress"  />
        <TextField label="客户联系人" source="customercontact"  />
        <TextField label="客户联系电话" source="customercontactphone"  />
        <TextField label="客户移动电话" source="customermobilephone"  />
        <TextField label="用途" source="purpose"  />
        <TextField label="购买日期" source="datepurchase"  />
        <TextField label="新车上牌日期" source="datenewcar"  />
        <TextField label="车牌号" source="licenseplatenumber"  />
        <TextField label="售后外服姓名" source="nameaftersaleservice"  />
      </SimpleForm>
    </Edit>
    );
};

const DeviceExtFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索设备" source="DeviceId" />
  </Filter>
)

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

let DeviceExtActions = (props) =>{
  console.log(props);
  const { resource, filters, displayedFilters, filterValues, basePath, showFilter, refresh,dispatch } = props;
  return (
    <CardActions style={cardActionStyle}>
        {filters && React.cloneElement(filters, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
        <CreateButton basePath={basePath} />
        <FlatButton primary label="刷新" onClick={()=>{
          dispatch(refreshView());
        }} icon={<NavigationRefresh />} />
        <ImportExcelButton resource={resource}/>
    </CardActions>
);
} 

DeviceExtActions = connect()(DeviceExtActions);


const DeviceExtList = (props) => (
  <List title="客档信息" sort={{field:'created_at',order:'DESC'}} {...props}
    actions={<DeviceExtActions />} perPage={config.listperpage}>
    {permissions =>
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="RDB编号" source="DeviceId" />
      <TextField label="车工号" source="buscarvin"  />
      <TextField label="类型" source="type" />
      <TextField label="容量" source="capacity" />
      <TextField label="新建时间" source="created_at"  />
      {permissions==='admin'?<EditButton />:null}
    </Datagrid>
      }
  </List>
);

export {DeviceExtCreate,DeviceExtEdit,DeviceExtList};
