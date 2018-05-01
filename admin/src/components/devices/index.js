import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { NumberInput,
  required,
  NumberField,
  Create,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  ListButton,
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
  CreateButton,
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
import {CreateActions,EditActions} from '../controls/createeditactions';
import ImportExcelButton from './importexcelbtn';
import config from '../../env/config';
import {getwarningleveltext} from '../../util/getdeviceitemstatus';
const deviceDefaultValue = {created_at:moment().format('YYYY-MM-DD HH:mm:ss'),updated_at:moment().format('YYYY-MM-DD HH:mm:ss')};

const AlarmLevel = ({record,source}) => {
  return(
    <span>
      {getwarningleveltext(record[source])}
    </span>
  )
}

const DeviceCreate = (props) => (
  <Create title="创建设备"  {...props} actions={<CreateActions />}>
    <SimpleForm defaultValue={deviceDefaultValue}>
      <TextInput label="设备" source="DeviceId" validate={required} />
      <TextInput label="车工号" source="Ext.车工号"  />
      <TextInput label="VIN" source="Ext.VIN"  />
      <TextInput label="类型" source="Ext.类型"  />
      <TextInput label="容量" source="Ext.容量"  />
      <TextInput label="串联数" source="Ext.串联数"  />
      <TextInput label="并联数" source="Ext.并联数"  />
      <TextInput label="电芯类型" source="Ext.电芯类型" />
      <TextInput label="CATL项目名称" source="Ext.CATL项目名称"  />
      <TextInput label="电池系统流水号" source="Ext.电池系统流水号"  />
      <TextInput label="BMU硬件版本" source="Ext.BMU硬件版本"  />
      <TextInput label="CSC硬件版本" source="Ext.CSC硬件版本"  />
      <TextInput label="BMU软件版本" source="Ext.BMU软件版本"  />
      <TextInput label="CSC软件版本" source="ExtCSC软件版本"  />
      <TextInput label="电池入库日期" source="Ext.电池入库日期"  />
      <TextInput label="电池出货日期" source="Ext.电池出货日期"  />
      <TextInput label="车辆生产厂" source="Ext.车辆生产厂"  />
      <TextInput label="车辆型号" source="Ext.车辆型号"  />
      <TextInput label="装车日期" source="Ext.装车日期"  />
      <TextInput label="整车出厂日期" source="Ext.整车出厂日期"  />
      <TextInput label="省份" source="Ext.省份"  />
      <TextInput label="地区" source="Ext.地区"  />
      <TextInput label="里程" source="Ext.里程"  />
      <TextInput label="客户名称" source="Ext.客户名称"  />
      <TextInput label="客户联系地址" source="Ext.客户联系地址"  />
      <TextInput label="客户联系人" source="Ext.客户联系人"  />
      <TextInput label="客户联系电话" source="Ext.客户联系电话"  />
      <TextInput label="客户移动电话" source="Ext.客户移动电话"  />
      <TextInput label="用途" source="Ext.用途"  />
      <TextInput label="购买日期" source="Ext.购买日期"  />
      <TextInput label="新车上牌日期" source="Ext.新车上牌日期"  />
      <TextInput label="车牌号" source="Ext.车牌号"  />
      <TextInput label="售后外服姓名" source="Ext.售后外服姓名"  />
    </SimpleForm>
  </Create>
);

const choices = [
  {_id:'A',status:'定位'},
  {_id:'V',status:'不定位'},
];

const DeviceEdit = (props) => {
  return (<Edit title="设备信息" {...props}  actions={<EditActions />}>
      <TabbedForm>
        <FormTab label="扩展信息">
          <TextInput label="RDB编号" source="Ext.RDB编号"  />
          <TextInput label="车工号" source="Ext.车工号"  />
          <TextInput label="VIN" source="Ext.VIN"  />
          <TextInput label="类型" source="Ext.类型"  />
          <TextInput label="容量" source="Ext.容量"  />
          <TextInput label="串联数" source="Ext.串联数"  />
          <TextInput label="并联数" source="Ext.并联数"  />
          <TextInput label="电芯类型" source="Ext.电芯类型" />
          <TextInput label="CATL项目名称" source="Ext.CATL项目名称"  />
          <TextInput label="电池系统流水号" source="Ext.电池系统流水号"  />
          <TextInput label="BMU硬件版本" source="Ext.BMU硬件版本"  />
          <TextInput label="CSC硬件版本" source="Ext.CSC硬件版本"  />
          <TextInput label="BMU软件版本" source="Ext.BMU软件版本"  />
          <TextInput label="CSC软件版本" source="ExtCSC软件版本"  />
          <TextInput label="电池入库日期" source="Ext.电池入库日期"  />
          <TextInput label="电池出货日期" source="Ext.电池出货日期"  />
          <TextInput label="车辆生产厂" source="Ext.车辆生产厂"  />
          <TextInput label="车辆型号" source="Ext.车辆型号"  />
          <TextInput label="装车日期" source="Ext.装车日期"  />
          <TextInput label="整车出厂日期" source="Ext.整车出厂日期"  />
          <TextInput label="省份" source="Ext.省份"  />
          <TextInput label="地区" source="Ext.地区"  />
          <TextInput label="里程" source="Ext.里程"  />
          <TextInput label="客户名称" source="Ext.客户名称"  />
          <TextInput label="客户联系地址" source="Ext.客户联系地址"  />
          <TextInput label="客户联系人" source="Ext.客户联系人"  />
          <TextInput label="客户联系电话" source="Ext.客户联系电话"  />
          <TextInput label="客户移动电话" source="Ext.客户移动电话"  />
          <TextInput label="用途" source="Ext.用途"  />
          <TextInput label="购买日期" source="Ext.购买日期"  />
          <TextInput label="新车上牌日期" source="Ext.新车上牌日期"  />
          <TextInput label="车牌号" source="Ext.车牌号"  />
          <TextInput label="售后外服姓名" source="Ext.售后外服姓名"  />
        </FormTab>
        <FormTab label="设备基本信息">
          <TextField label="设备ID" source="DeviceId"  validate={required} />
          <TextField label="创建时间" source="created_at"  />
          <TextField label="插入数据库时间" source="updated_at"  />
          <TextField label="最后报警时间" source="last_alarmtime"  />
          <TextField label="最后报警等级" source="last_warninglevel"  />
          <TextField label="最后报警信息" source="last_alarmtxtstat"  />
          <TextField label="最后定位时间" source="last_GPSTime"  />
          <TextField label="最后定位经度" source="last_Longitude"  />
          <TextField label="最后定位纬度" source="last_Latitude"  />
        </FormTab>
        <FormTab label="基本信息">
          <TextField label="数据包序号" source="LastRealtimeAlarm.SN" />
          <TextField label="采集时间" source="LastRealtimeAlarm.DataTime" />
          <TextField label="Gateway接受到数据时间" source="LastRealtimeAlarm.MessageTime" />
          <TextField label="ALARM" source="LastRealtimeAlarm.ALARM" />
          <TextField label="ALARM_H" source="LastRealtimeAlarm.ALARM_H" />
          <TextField label="ALARM_L" source="LastRealtimeAlarm.ALARM_L" />
          <TextField label="报警信息" source="LastRealtimeAlarm.ALARM_Text" />
          <TextField label="辅助诊断代码" source="LastRealtimeAlarm.Diagnostic_Text" />
          <TextField label="生命信号" source="LastRealtimeAlarm.ALIV_ST_SW_HVS" />
          <TextField label="报警等级" source="warninglevel" />
        </FormTab>
        <FormTab label="设备信息">
          <TextField label="KeyOn信号电压" source="LastRealtimeAlarm.KeyOnVoltage" />
          <TextField label="BMU供电电压" source="LastRealtimeAlarm.PowerVoltage" />
          <TextField label="交流充电供电电压" source="LastRealtimeAlarm.ChargeACVoltage" />
          <TextField label="直流充电供电电压" source="LastRealtimeAlarm.ChargeDCVoltage" />
          <TextField label="CC2检测电压" source="LastRealtimeAlarm.CC2Voltage" />
          <TextField label="本次充电容量" source="LastRealtimeAlarm.ChargedCapacity" />
          <TextField label="总充放电循环次数" source="LastRealtimeAlarm.TotalWorkCycle" />
          <TextField label="BMU采的CSC功耗电流" source="LastRealtimeAlarm.CSC_Power_Current" />
          <TextField label="单体最大SOC" source="LastRealtimeAlarm.BAT_MAX_SOC_HVS" />
          <TextField label="单体最小SOC" source="LastRealtimeAlarm.BAT_MIN_SOC_HVS" />
          <TextField label="系统权重SOC" source="LastRealtimeAlarm.BAT_WEI_SOC_HVS" />
          <TextField label="充电需求电流" source="LastRealtimeAlarm.BAT_Chg_AmperReq" />
          <TextField label="BPM24V,Uout电压采样" source="LastRealtimeAlarm.BPM_24V_Uout" />
          <TextField label="CC2检测电压2" source="LastRealtimeAlarm.CC2Voltage_2" />
          <TextField label="允许放电电流" source="LastRealtimeAlarm.BAT_Allow_Discharge_I" />
          <TextField label="允许充电电流" source="LastRealtimeAlarm.BAT_Allow_charge_I" />
          <TextField label="正极绝缘阻抗" source="LastRealtimeAlarm.BAT_ISO_R_Pos" />
          <TextField label="负极绝缘阻抗" source="LastRealtimeAlarm.BAT_ISO_R_Neg" />
        </FormTab>
        <FormTab label="设备状态">
          <TextField label="箱体测量电压（外侧）（正值为正向电压，负值为反向电压）" source="LastRealtimeAlarm.BAT_U_Out_HVS" />
          <TextField label="箱体累计电压" source="LastRealtimeAlarm.BAT_U_TOT_HVS" />
          <TextField label="箱体电流" source="LastRealtimeAlarm.BAT_I_HVS" />
          <TextField label="真实SOC" source="LastRealtimeAlarm.BAT_SOC_HVS" />
          <TextField label="SOH" source="LastRealtimeAlarm.BAT_SOH_HVS" />
          <TextField label="最高单体电压" source="LastRealtimeAlarm.BAT_Ucell_Max" />
          <TextField label="最低单体电压" source="LastRealtimeAlarm.BAT_Ucell_Min" />
          <TextField label="平均单体电压" source="LastRealtimeAlarm.BAT_Ucell_Avg" />
          <TextField label="最高单体电压所在CSC号" source="LastRealtimeAlarm.BAT_Ucell_Max_CSC" />
          <TextField label="最高单体电压所在电芯位置" source="LastRealtimeAlarm.BAT_Ucell_Max_CELL" />
          <TextField label="最低单体电压所在CSC号" source="LastRealtimeAlarm.BAT_Ucell_Min_CSC" />
          <TextField label="最低单体电压所在电芯位置" source="LastRealtimeAlarm.BAT_Ucell_Min_CELL" />
          <TextField label="最高单体温度" source="LastRealtimeAlarm.BAT_T_Max" />
          <TextField label="最低单体温度" source="LastRealtimeAlarm.BAT_T_Min" />
          <TextField label="平均单体温度" source="LastRealtimeAlarm.BAT_T_Avg" />
          <TextField label="最高单体温度所在CSC号" source="LastRealtimeAlarm.BAT_T_Max_CSC" />
          <TextField label="最低单体温度所在CSC号" source="LastRealtimeAlarm.BAT_T_Min_CSC" />
          <TextField label="显示用SOC" source="LastRealtimeAlarm.BAT_User_SOC_HVS" />
          <TextField label="继电器内侧电压（正值为正向电压，负值为反向电压）" source="LastRealtimeAlarm.BAT_U_HVS" />
          <SelectField label="空调继电器状态" source="LastRealtimeAlarm.ST_AC_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="附件继电器状态" source="LastRealtimeAlarm.ST_Aux_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="主负继电器状态" source="LastRealtimeAlarm.ST_Main_Neg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="预充电继电器状态" source="LastRealtimeAlarm.ST_Pre_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="主正继电器状态" source="LastRealtimeAlarm.ST_Main_Pos_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="充电继电器状态" source="LastRealtimeAlarm.ST_Chg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="风扇继电器状态" source="LastRealtimeAlarm.ST_Fan_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="加热继电器状态" source="LastRealtimeAlarm.ST_Heater_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <TextField label="加热2继电器状态" source="LastRealtimeAlarm.ST_NegHeater_SW_HVS" />
          <TextField label="无线充电继电器状态" source="LastRealtimeAlarm.ST_WirelessChg_SW" />
          <TextField label="双枪充电继电器2" source="LastRealtimeAlarm.ST_SpearChg_SW_2" />
          <TextField label="集电网充电继电器" source="LastRealtimeAlarm.ST_PowerGridChg_SW" />
        </FormTab>
        <FormTab label="历史轨迹">
          <TextField label="设备状态" source="LastHistoryTrack.DeviceStatus" />
          <TextField label="主板温度，单位：摄氏度" source="LastHistoryTrack.ADC1" />
          <TextField label="接受数据时间" source="LastHistoryTrack.MessageTime"  />
          <TextField label="Position数据包序号" source="LastHistoryTrack.SN" />
          <SelectField label="GPS定位" source="LastHistoryTrack.GPSStatus" choices={choices} optionValue="_id" optionText="status" />
          <TextField label="定位的UTC时间" source="LastHistoryTrack.GPSTime"  />
          <TextField label="经度" source="LastHistoryTrack.Longitude" />
          <TextField label="纬度" source="LastHistoryTrack.Latitude" />
          <TextField label="速度" source="LastHistoryTrack.Speed" />
          <TextField label="航向" source="LastHistoryTrack.Course" />
          <TextField label="蜂窝Location Area Code" source="LastHistoryTrack.LAC" />
          <TextField label="蜂窝Cell Id" source="LastHistoryTrack.CellId" />
          <TextField label="海拔,单位：米" source="LastHistoryTrack.Altitude" />
          <TextField label="所在省" source="LastHistoryTrack.Provice" />
          <TextField label="所在市" source="LastHistoryTrack.City" />
          <TextField label="所在区县" source="LastHistoryTrack.Area" />
        </FormTab>
      </TabbedForm>
    </Edit>
    );
};

const DeviceShowActions = ({basePath,data,refresh}) => (
  <CardActions>
    <ListButton basePath={basePath} />
    <EditButton basePath={basePath} record={data} />
    <FlatButton primary label="Refresh" onClick={refresh} icon={<NavigationRefresh />} />
  </CardActions>
);

const DeviceFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索设备" source="DeviceId" />
  </Filter>
)

const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};

const DeviceActions = ({ resource, filters, displayedFilters, filterValues, basePath, showFilter, refresh }) => (
    <CardActions style={cardActionStyle}>
        {filters && React.cloneElement(filters, { resource, showFilter, displayedFilters, filterValues, context: 'button' }) }
        <CreateButton basePath={basePath} />
        <FlatButton primary label="刷新" onClick={refresh} icon={<NavigationRefresh />} />
        <ImportExcelButton resource={resource}/>
    </CardActions>
);



const DeviceList = (props) => (
  <List title="设备管理" filters={<DeviceFilter />} sort={{field:'last_GPSTime',order:'DESC'}} {...props}
  actions={<DeviceActions />} perPage={config.listperpage}>
  {permissions =>
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="设备ID" source="DeviceId" />
      <TextField label="PackNo" source="PackNo_BMU" />
      <AlarmLevel label="报警等级" source="warninglevel" />
      <TextField label="报警信息" source="alarmtxtstat" />
      <TextField label="最后数据时间" source="LastRealtimeAlarm.DataTime" />
      <TextField label="最后定位时间" source="last_GPSTime" />
      <TextField label="更新时间" source="UpdateTime"   />
      {permissions==='admin'?<EditButton />:null}
    </Datagrid>
  }
  </List>
);

export {DeviceCreate,DeviceList,DeviceEdit}
