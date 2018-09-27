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
        <TextInput label="客服packno" source="packnocs"  />
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
        <TextInput label="省份" source="province"  />
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
        <TextInput label="开始使用年份" source="usedyear"  />
      </SimpleForm>
    </Create>
    );
};

const DeviceExtEdit = (props) => {
  return (<Edit title="客档信息" {...props}>
      <SimpleForm>
        <TextField label="RDB编号" source="DeviceId" />
        <TextField label="客服packno" source="packnocs"  />
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
        <SelectInput  label="省份" source="province" choices={[
          { id:'北京',name: '北京' },
          { id:'上海',name: '上海' },
          { id:'天津',name: '天津' },
          { id:'重庆',name: '重庆' },
          { id:'河北',name: '河北' },
          { id:'山西',name: '山西' },
          { id:'内蒙古',name: '内蒙古' },
          { id:'黑龙江',name: '黑龙江' },
          { id:'吉林',name: '吉林' },
          { id:'辽宁',name: '辽宁' },
          { id:'陕西',name: '陕西' },
          { id:'甘肃',name: '甘肃' },
          { id:'青海',name: '青海' },
          { id:'新疆',name: '新疆' },
          { id:'宁夏',name: '宁夏' },
          { id:'山东',name: '山东' },
          { id:'河南',name: '河南' },
          { id:'江苏',name: '江苏' },
          { id:'浙江',name: '浙江' },
          { id:'安徽',name: '安徽' },
          { id:'江西',name: '江西' },
          { id:'福建',name: '福建' },
          { id:'台湾',name: '台湾' },
          { id:'湖北',name: '湖北' },
          { id:'湖南',name: '湖南' },
          { id:'广东',name: '广东' },
          { id:'广西',name: '广西' },
          { id:'海南',name: '海南' },
          { id:'四川',name: '四川' },
          { id:'云南',name: '云南' },
          { id:'贵州',name: '贵州' },
          { id:'西藏',name: '西藏' },
          { id:'香港',name: '香港' },
          { id:'澳门',name: '澳门' },
        ]} />
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
        <TextInput label="开始使用年份" source="usedyear"  />
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
      <TextField label="类型" source="type"  />
      <TextField label="省份" source="province"  />
      <TextField label="CATL项目名称" source="catlprojectname"  />
      <TextField label="客服packno" source="packnocs"  />
      <TextField label="开始使用年份" source="usedyear"  />
      {permissions==='admin'?<EditButton />:null}
    </Datagrid>
      }
  </List>
);

export {DeviceExtCreate,DeviceExtEdit,DeviceExtList};
