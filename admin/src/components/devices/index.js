import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { NumberInput,
  NumberField,
  Create,
  Edit,
  Show,
  SimpleForm,
  DisabledInput,
  TextInput,
  List,
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
import {TimePickerInput} from '../controls/timepicker.js';

const deviceDefaultValue = {created_at:new Date(),updated_at:new Date()};

const DeviceCreate = (props) => (
  <Create title="创建设备"  {...props}>
    <SimpleForm defaultValue={deviceDefaultValue}>
      <TextInput label="设备" source="DeviceId" validate={required} />
      <ReferenceInput label="设备分组" source="groupid" reference="devicegroup">
        <SelectInput optionText="name" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

const choices = [
  {_id:'A',status:'定位'},
  {_id:'V',status:'不定位'},
];

const DeviceEdit = (props) => {
  return (<Edit title="设备信息" {...props}>
      <TabbedForm>
        <FormTab label="设备基本信息">
          <TextInput label="设备ID" source="DeviceId"  validate={required} />
          <DateField label="创建时间" source="created_at" showTime />
          <DateField label="插入数据库时间" source="updated_at" showTime />
          <ReferenceInput label="设备分组" source="groupid" reference="devicegroup">
            <SelectInput optionText="name" />
          </ReferenceInput>
        </FormTab>
        <FormTab label="最近实时报警-基本信息">
          <NumberField label="数据包序号" source="LastRealtimeAlarm.SN" />
          <DateField label="采集时间" source="LastRealtimeAlarm.DataTime" />
          <DateField label="Gateway接受到数据时间" source="LastRealtimeAlarm.MessageTime" />
          <TextField label="ALARM" source="LastRealtimeAlarm.ALARM" />
          <NumberField label="ALARM_H" source="LastRealtimeAlarm.ALARM_H" />
          <NumberField label="ALARM_L" source="LastRealtimeAlarm.ALARM_L" />
          <TextField label="报警信息" source="LastRealtimeAlarm.ALARM_Text" />
          <TextField label="辅助诊断代码" source="LastRealtimeAlarm.Diagnostic_Text" />
          <NumberField label="生命信号" source="LastRealtimeAlarm.ALIV_ST_SW_HVS" />
        </FormTab>
        <FormTab label="最近实时报警-设备信息">
          <NumberField label="KeyOn信号电压" source="LastRealtimeAlarm.KeyOnVoltage" />
          <NumberField label="BMU供电电压" source="LastRealtimeAlarm.PowerVoltage" />
          <NumberField label="交流充电供电电压" source="LastRealtimeAlarm.ChargeACVoltage" />
          <NumberField label="直流充电供电电压" source="LastRealtimeAlarm.ChargeDCVoltage" />
          <NumberField label="CC2检测电压" source="LastRealtimeAlarm.CC2Voltage" />
          <NumberField label="本次充电容量" source="LastRealtimeAlarm.ChargedCapacity" />
          <NumberField label="总充放电循环次数" source="LastRealtimeAlarm.TotalWorkCycle" />
          <NumberField label="BMU采的CSC功耗电流" source="LastRealtimeAlarm.CSC_Power_Current" />
          <NumberField label="单体最大SOC" source="LastRealtimeAlarm.BAT_MAX_SOC_HVS" />
          <NumberField label="单体最小SOC" source="LastRealtimeAlarm.BAT_MIN_SOC_HVS" />
          <NumberField label="系统权重SOC" source="LastRealtimeAlarm.BAT_WEI_SOC_HVS" />
          <NumberField label="充电需求电流" source="LastRealtimeAlarm.BAT_Chg_AmperReq" />
          <NumberField label="BPM24V,Uout电压采样" source="LastRealtimeAlarm.BPM_24V_Uout" />
          <NumberField label="CC2检测电压2" source="LastRealtimeAlarm.CC2Voltage_2" />
          <NumberField label="允许放电电流" source="LastRealtimeAlarm.BAT_Allow_Discharge_I" />
          <NumberField label="允许充电电流" source="LastRealtimeAlarm.BAT_Allow_charge_I" />
          <NumberField label="正极绝缘阻抗" source="LastRealtimeAlarm.BAT_ISO_R_Pos" />
          <NumberField label="负极绝缘阻抗" source="LastRealtimeAlarm.BAT_ISO_R_Neg" />
        </FormTab>
        <FormTab label="最近实时报警-设备状态">
          <NumberField label="箱体测量电压（外侧）（正值为正向电压，负值为反向电压）" source="LastRealtimeAlarm.BAT_U_Out_HVS" />
          <NumberField label="箱体累计电压" source="LastRealtimeAlarm.BAT_U_TOT_HVS" />
          <NumberField label="箱体电流" source="LastRealtimeAlarm.BAT_I_HVS" />
          <NumberField label="真实SOC" source="LastRealtimeAlarm.BAT_SOC_HVS" />
          <NumberField label="SOH" source="LastRealtimeAlarm.BAT_SOH_HVS" />
          <NumberField label="最高单体电压" source="LastRealtimeAlarm.BAT_Ucell_Max" />
          <NumberField label="最低单体电压" source="LastRealtimeAlarm.BAT_Ucell_Min" />
          <NumberField label="平均单体电压" source="LastRealtimeAlarm.BAT_Ucell_Avg" />
          <NumberField label="最高单体电压所在CSC号" source="LastRealtimeAlarm.BAT_Ucell_Max_CSC" />
          <NumberField label="最高单体电压所在电芯位置" source="LastRealtimeAlarm.BAT_Ucell_Max_CELL" />
          <NumberField label="最低单体电压所在CSC号" source="LastRealtimeAlarm.BAT_Ucell_Min_CSC" />
          <NumberField label="最低单体电压所在电芯位置" source="LastRealtimeAlarm.BAT_Ucell_Min_CELL" />
          <NumberField label="最高单体温度" source="LastRealtimeAlarm.BAT_T_Max" />
          <NumberField label="最低单体温度" source="LastRealtimeAlarm.BAT_T_Min" />
          <NumberField label="平均单体温度" source="LastRealtimeAlarm.BAT_T_Avg" />
          <NumberField label="最高单体温度所在CSC号" source="LastRealtimeAlarm.BAT_T_Max_CSC" />
          <NumberField label="最低单体温度所在CSC号" source="LastRealtimeAlarm.BAT_T_Min_CSC" />
          <NumberField label="显示用SOC" source="LastRealtimeAlarm.BAT_User_SOC_HVS" />
          <NumberField label="继电器内侧电压（正值为正向电压，负值为反向电压）" source="LastRealtimeAlarm.BAT_U_HVS" />
          <SelectField label="空调继电器状态" source="LastRealtimeAlarm.ST_AC_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="附件继电器状态" source="LastRealtimeAlarm.ST_Aux_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="主负继电器状态" source="LastRealtimeAlarm.ST_Main_Neg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="预充电继电器状态" source="LastRealtimeAlarm.ST_Pre_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="主正继电器状态" source="LastRealtimeAlarm.ST_Main_Pos_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="充电继电器状态" source="LastRealtimeAlarm.ST_Chg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="风扇继电器状态" source="LastRealtimeAlarm.ST_Fan_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="加热继电器状态" source="LastRealtimeAlarm.ST_Heater_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <NumberField label="加热2继电器状态" source="LastRealtimeAlarm.ST_NegHeater_SW_HVS" />
          <NumberField label="无线充电继电器状态" source="LastRealtimeAlarm.ST_WirelessChg_SW" />
          <NumberField label="双枪充电继电器2" source="LastRealtimeAlarm.ST_SpearChg_SW_2" />
          <NumberField label="集电网充电继电器" source="LastRealtimeAlarm.ST_PowerGridChg_SW" />
        </FormTab>
        <FormTab label="最近历史轨迹">
          <TextField label="设备状态" source="LastHistoryTrack.DeviceStatus" />
          <NumberField label="主板温度，单位：摄氏度" source="LastHistoryTrack.ADC1" />
          <DateField label="接受数据时间" source="LastHistoryTrack.MessageTime" showTime />
          <NumberField label="Position数据包序号" source="LastHistoryTrack.SN" />
          <SelectField label="GPS定位" source="LastHistoryTrack.GPSStatus" choices={choices} optionValue="_id" optionText="status" />
          <DateField label="定位的UTC时间" source="LastHistoryTrack.GPSTime" showTime />
          <NumberField label="经度" source="LastHistoryTrack.Longitude" />
          <NumberField label="纬度" source="LastHistoryTrack.Latitude" />
          <NumberField label="速度" source="LastHistoryTrack.Speed" />
          <NumberField label="航向" source="LastHistoryTrack.Course" />
          <NumberField label="蜂窝Location Area Code" source="LastHistoryTrack.LAC" />
          <NumberField label="蜂窝Cell Id" source="LastHistoryTrack.CellId" />
          <NumberField label="海拔,单位：米" source="LastHistoryTrack.Altitude" />
          <TextField label="所在省" source="LastHistoryTrack.Province" />
          <TextField label="所在市" source="LastHistoryTrack.City" />
          <TextField label="所在区县" source="LastHistoryTrack.County" />
        </FormTab>
      </TabbedForm>
    </Edit>
    );
};

const DeviceShow = (props) => {
  return (<Show title="设备信息" {...props}>
      <TabbedForm>
        <FormTab label="设备基本信息">
          <TextField label="设备ID" source="DeviceId"  validate={required} />
          <DateField label="创建时间" source="created_at" showTime />
          <DateField label="插入数据库时间" source="updated_at" showTime />
          <ReferenceField label="设备分组" source="groupid" reference="devicegroup">
            <SelectField optionText="name" />
          </ReferenceField>
        </FormTab>
        <FormTab label="最近实时报警-基本信息">
          <NumberField label="数据包序号" source="LastRealtimeAlarm.SN" />
          <DateField label="采集时间" source="LastRealtimeAlarm.DataTime" />
          <DateField label="Gateway接受到数据时间" source="LastRealtimeAlarm.MessageTime" />
          <TextField label="ALARM" source="LastRealtimeAlarm.ALARM" />
          <NumberField label="ALARM_H" source="LastRealtimeAlarm.ALARM_H" />
          <NumberField label="ALARM_L" source="LastRealtimeAlarm.ALARM_L" />
          <TextField label="报警信息" source="LastRealtimeAlarm.ALARM_Text" />
          <TextField label="辅助诊断代码" source="LastRealtimeAlarm.Diagnostic_Text" />
          <NumberField label="生命信号" source="LastRealtimeAlarm.ALIV_ST_SW_HVS" />
        </FormTab>
        <FormTab label="最近实时报警-设备信息">
          <NumberField label="KeyOn信号电压" source="LastRealtimeAlarm.KeyOnVoltage" />
          <NumberField label="BMU供电电压" source="LastRealtimeAlarm.PowerVoltage" />
          <NumberField label="交流充电供电电压" source="LastRealtimeAlarm.ChargeACVoltage" />
          <NumberField label="直流充电供电电压" source="LastRealtimeAlarm.ChargeDCVoltage" />
          <NumberField label="CC2检测电压" source="LastRealtimeAlarm.CC2Voltage" />
          <NumberField label="本次充电容量" source="LastRealtimeAlarm.ChargedCapacity" />
          <NumberField label="总充放电循环次数" source="LastRealtimeAlarm.TotalWorkCycle" />
          <NumberField label="BMU采的CSC功耗电流" source="LastRealtimeAlarm.CSC_Power_Current" />
          <NumberField label="单体最大SOC" source="LastRealtimeAlarm.BAT_MAX_SOC_HVS" />
          <NumberField label="单体最小SOC" source="LastRealtimeAlarm.BAT_MIN_SOC_HVS" />
          <NumberField label="系统权重SOC" source="LastRealtimeAlarm.BAT_WEI_SOC_HVS" />
          <NumberField label="充电需求电流" source="LastRealtimeAlarm.BAT_Chg_AmperReq" />
          <NumberField label="BPM24V,Uout电压采样" source="LastRealtimeAlarm.BPM_24V_Uout" />
          <NumberField label="CC2检测电压2" source="LastRealtimeAlarm.CC2Voltage_2" />
          <NumberField label="允许放电电流" source="LastRealtimeAlarm.BAT_Allow_Discharge_I" />
          <NumberField label="允许充电电流" source="LastRealtimeAlarm.BAT_Allow_charge_I" />
          <NumberField label="正极绝缘阻抗" source="LastRealtimeAlarm.BAT_ISO_R_Pos" />
          <NumberField label="负极绝缘阻抗" source="LastRealtimeAlarm.BAT_ISO_R_Neg" />
        </FormTab>
        <FormTab label="最近实时报警-设备状态">
          <NumberField label="箱体测量电压（外侧）（正值为正向电压，负值为反向电压）" source="LastRealtimeAlarm.BAT_U_Out_HVS" />
          <NumberField label="箱体累计电压" source="LastRealtimeAlarm.BAT_U_TOT_HVS" />
          <NumberField label="箱体电流" source="LastRealtimeAlarm.BAT_I_HVS" />
          <NumberField label="真实SOC" source="LastRealtimeAlarm.BAT_SOC_HVS" />
          <NumberField label="SOH" source="LastRealtimeAlarm.BAT_SOH_HVS" />
          <NumberField label="最高单体电压" source="LastRealtimeAlarm.BAT_Ucell_Max" />
          <NumberField label="最低单体电压" source="LastRealtimeAlarm.BAT_Ucell_Min" />
          <NumberField label="平均单体电压" source="LastRealtimeAlarm.BAT_Ucell_Avg" />
          <NumberField label="最高单体电压所在CSC号" source="LastRealtimeAlarm.BAT_Ucell_Max_CSC" />
          <NumberField label="最高单体电压所在电芯位置" source="LastRealtimeAlarm.BAT_Ucell_Max_CELL" />
          <NumberField label="最低单体电压所在CSC号" source="LastRealtimeAlarm.BAT_Ucell_Min_CSC" />
          <NumberField label="最低单体电压所在电芯位置" source="LastRealtimeAlarm.BAT_Ucell_Min_CELL" />
          <NumberField label="最高单体温度" source="LastRealtimeAlarm.BAT_T_Max" />
          <NumberField label="最低单体温度" source="LastRealtimeAlarm.BAT_T_Min" />
          <NumberField label="平均单体温度" source="LastRealtimeAlarm.BAT_T_Avg" />
          <NumberField label="最高单体温度所在CSC号" source="LastRealtimeAlarm.BAT_T_Max_CSC" />
          <NumberField label="最低单体温度所在CSC号" source="LastRealtimeAlarm.BAT_T_Min_CSC" />
          <NumberField label="显示用SOC" source="LastRealtimeAlarm.BAT_User_SOC_HVS" />
          <NumberField label="继电器内侧电压（正值为正向电压，负值为反向电压）" source="LastRealtimeAlarm.BAT_U_HVS" />
          <SelectField label="空调继电器状态" source="LastRealtimeAlarm.ST_AC_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="附件继电器状态" source="LastRealtimeAlarm.ST_Aux_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="主负继电器状态" source="LastRealtimeAlarm.ST_Main_Neg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="预充电继电器状态" source="LastRealtimeAlarm.ST_Pre_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="主正继电器状态" source="LastRealtimeAlarm.ST_Main_Pos_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="充电继电器状态" source="LastRealtimeAlarm.ST_Chg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="风扇继电器状态" source="LastRealtimeAlarm.ST_Fan_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <SelectField label="加热继电器状态" source="LastRealtimeAlarm.ST_Heater_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
          <NumberField label="加热2继电器状态" source="LastRealtimeAlarm.ST_NegHeater_SW_HVS" />
          <NumberField label="无线充电继电器状态" source="LastRealtimeAlarm.ST_WirelessChg_SW" />
          <NumberField label="双枪充电继电器2" source="LastRealtimeAlarm.ST_SpearChg_SW_2" />
          <NumberField label="集电网充电继电器" source="LastRealtimeAlarm.ST_PowerGridChg_SW" />
        </FormTab>
        <FormTab label="最近历史轨迹">
          <TextField label="设备状态" source="LastHistoryTrack.DeviceStatus" />
          <NumberField label="主板温度，单位：摄氏度" source="LastHistoryTrack.ADC1" />
          <DateField label="接受数据时间" source="LastHistoryTrack.MessageTime" showTime />
          <NumberField label="Position数据包序号" source="LastHistoryTrack.SN" />
          <SelectField label="GPS定位" source="LastHistoryTrack.GPSStatus" choices={choices} optionValue="_id" optionText="status" />
          <DateField label="定位的UTC时间" source="LastHistoryTrack.GPSTime" showTime />
          <NumberField label="经度" source="LastHistoryTrack.Longitude" />
          <NumberField label="纬度" source="LastHistoryTrack.Latitude" />
          <NumberField label="速度" source="LastHistoryTrack.Speed" />
          <NumberField label="航向" source="LastHistoryTrack.Course" />
          <NumberField label="蜂窝Location Area Code" source="LastHistoryTrack.LAC" />
          <NumberField label="蜂窝Cell Id" source="LastHistoryTrack.CellId" />
          <NumberField label="海拔,单位：米" source="LastHistoryTrack.Altitude" />
          <TextField label="所在省" source="LastHistoryTrack.Province" />
          <TextField label="所在市" source="LastHistoryTrack.City" />
          <TextField label="所在区县" source="LastHistoryTrack.County" />
        </FormTab>
      </TabbedForm>
    </Show>
    );
};


const DeviceFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索设备" source="DeviceId_q" />
  </Filter>
)

const DeviceList = (props) => (
  <List title="设备列表" filters={<DeviceFilter />} sort={{field:'updated_at',order:'DESC'}} {...props}>
    <Datagrid>
      <TextField label="设备ID" source="DeviceId" />
      <DateField label="创建时间" source="created_at" showTime />
      <DateField label="更新时间" source="updated_at" showTime />
      <ReferenceField label="设备分组" source="groupid" reference="devicegroup">
        <TextField source="name" />
      </ReferenceField>
      <ShowButton/>
    </Datagrid>
  </List>
);

export {DeviceCreate,DeviceList,DeviceEdit,DeviceShow}